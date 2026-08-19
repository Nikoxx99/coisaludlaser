import { createHash } from "node:crypto";
import { after } from "next/server";

import { callTuOdonto } from "@/lib/tuodonto-api";

export const dynamic = "force-dynamic";

const allowedContentTypes = new Set(["image/png", "image/webp"]);
const maxFaviconBytes = 512 * 1024;
const successTtlMs = 30_000;
const initialFallbackTtlMs = 5_000;
const maxFallbackTtlMs = 5 * 60_000;
const maxStaleMs = 5 * 60_000;
const maxInFlightAgeMs = 3_000;

type FaviconResult =
  | {
      kind: "success";
      bytes: Uint8Array<ArrayBuffer>;
      contentType: string;
      etag: string;
    }
  | { kind: "fallback"; reason: string };

let cached: {
  result: FaviconResult;
  expiresAt: number;
  staleUntil: number;
  loadSequence: number;
} | null = null;
let inFlight: Promise<FaviconResult> | null = null;
let inFlightStartedAt = 0;
let inFlightSequence = 0;
let newestLoadSequence = 0;
let consecutiveFailures = 0;

function fallback() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: "/favicon-fallback.ico",
      "Cache-Control": "no-store",
    },
  });
}

function hasExpectedSignature(contentType: string, bytes: Uint8Array) {
  if (contentType === "image/png") {
    const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    const iend = [0x49, 0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82];
    return (
      bytes.byteLength >= signature.length + iend.length &&
      signature.every((value, index) => bytes[index] === value) &&
      iend.every(
        (value, index) => bytes[bytes.byteLength - iend.length + index] === value
      )
    );
  }

  return (
    contentType === "image/webp" &&
    bytes.byteLength >= 12 &&
    String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" &&
    String.fromCharCode(...bytes.slice(8, 12)) === "WEBP" &&
    bytes.byteLength ===
      ((bytes[4] ?? 0) |
        ((bytes[5] ?? 0) << 8) |
        ((bytes[6] ?? 0) << 16) |
        ((bytes[7] ?? 0) << 24)) +
        8
  );
}

async function readBoundedBody(
  body: ReadableStream<Uint8Array>,
  maxBytes: number
): Promise<Uint8Array<ArrayBuffer> | null> {
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel().catch(() => undefined);
        return null;
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return bytes;
}

async function loadFavicon(): Promise<FaviconResult> {
  try {
    const upstream = await callTuOdonto("/api/site/v1/favicon", {
      signal: AbortSignal.timeout(2_000),
    });
    if (!upstream.ok || !upstream.body) {
      await upstream.body?.cancel().catch(() => undefined);
      return { kind: "fallback", reason: `upstream-${upstream.status}` };
    }

    const contentType = (upstream.headers.get("content-type") || "")
      .split(";", 1)[0]
      .trim()
      .toLowerCase();
    const rawLength = upstream.headers.get("content-length");
    const normalizedLength = rawLength?.trim() ?? null;
    const declaredLength =
      normalizedLength === null
        ? 0
        : /^\d+$/.test(normalizedLength)
          ? Number(normalizedLength)
          : -1;
    const contentEncoding = (upstream.headers.get("content-encoding") || "")
      .trim()
      .toLowerCase();
    const lengthIsAuthoritative =
      contentEncoding === "" || contentEncoding === "identity";
    if (
      declaredLength < 0 ||
      !allowedContentTypes.has(contentType) ||
      declaredLength > maxFaviconBytes
    ) {
      await upstream.body.cancel().catch(() => undefined);
      return { kind: "fallback", reason: "metadata-rejected" };
    }

    const bytes = await readBoundedBody(upstream.body, maxFaviconBytes);
    if (
      !bytes ||
      (lengthIsAuthoritative &&
        declaredLength > 0 &&
        bytes.byteLength !== declaredLength) ||
      !hasExpectedSignature(contentType, bytes)
    ) {
      return { kind: "fallback", reason: "body-rejected" };
    }

    const etag = `"${createHash("sha256").update(bytes).digest("base64url")}"`;
    return { kind: "success", bytes, contentType, etag };
  } catch (error) {
    return {
      kind: "fallback",
      reason:
        error instanceof DOMException && error.name === "TimeoutError"
          ? "timeout"
          : "request-failed",
    };
  }
}

function startLoad() {
  const now = Date.now();
  if (inFlight && now - inFlightStartedAt <= maxInFlightAgeMs) return inFlight;

  const loadSequence = ++newestLoadSequence;
  const load = loadFavicon()
    .then((result) => {
      if (loadSequence < newestLoadSequence) {
        if (
          result.kind === "success" &&
          (cached?.result.kind !== "success" ||
            loadSequence > cached.loadSequence)
        ) {
          const completedAt = Date.now();
          consecutiveFailures = 0;
          cached = {
            result,
            expiresAt: completedAt + successTtlMs,
            staleUntil: completedAt + maxStaleMs,
            loadSequence,
          };
        }
        const completedAt = Date.now();
        const cachedIsUsable =
          cached &&
          (cached.result.kind === "success"
            ? cached.staleUntil > completedAt
            : cached.expiresAt > completedAt);
        return cachedIsUsable && cached ? cached.result : result;
      }
      const completedAt = Date.now();
      if (result.kind === "success") {
        consecutiveFailures = 0;
      } else {
        consecutiveFailures += 1;
      }
      const fallbackTtl = Math.min(
        initialFallbackTtlMs * 3 ** Math.max(0, consecutiveFailures - 1),
        maxFallbackTtlMs
      );

      if (result.kind === "fallback") {
        console.warn("TuOdonto favicon unavailable", {
          reason: result.reason,
          retryInMs: fallbackTtl,
          consecutiveFailures,
        });
      }

      if (
        result.kind === "fallback" &&
        cached?.result.kind === "success" &&
        cached.staleUntil > completedAt
      ) {
        cached.expiresAt = Math.min(
          completedAt + fallbackTtl,
          cached.staleUntil
        );
        return cached.result;
      }

      cached = {
        result,
        expiresAt:
          completedAt + (result.kind === "success" ? successTtlMs : fallbackTtl),
        staleUntil:
          completedAt + (result.kind === "success" ? maxStaleMs : fallbackTtl),
        loadSequence,
      };
      return result;
    })
    .finally(() => {
      if (inFlightSequence === loadSequence) {
        inFlight = null;
        inFlightStartedAt = 0;
        inFlightSequence = 0;
      }
    });

  inFlight = load;
  inFlightStartedAt = now;
  inFlightSequence = loadSequence;
  return load;
}

async function getCachedFavicon() {
  const now = Date.now();
  if (cached && cached.expiresAt > now) return cached.result;

  if (cached?.result.kind === "success" && cached.staleUntil > now) {
    after(async () => {
      await startLoad();
    });
    return cached.result;
  }

  return startLoad();
}

function etagMatches(ifNoneMatch: string | null, etag: string) {
  if (!ifNoneMatch) return false;
  const normalize = (value: string) => value.trim().replace(/^W\//, "");
  return ifNoneMatch
    .split(",")
    .some((candidate) => candidate.trim() === "*" || normalize(candidate) === etag);
}

export async function GET(request: Request) {
  const result = await getCachedFavicon();
  if (result.kind === "fallback") return fallback();

  if (etagMatches(request.headers.get("if-none-match"), result.etag)) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: result.etag,
        "Cache-Control": "no-cache, must-revalidate",
      },
    });
  }

  return new Response(result.bytes, {
    headers: {
      "Content-Type": result.contentType,
      "Content-Disposition": 'inline; filename="favicon"',
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Security-Policy": "default-src 'none'; sandbox",
      "X-Content-Type-Options": "nosniff",
      ETag: result.etag,
    },
  });
}

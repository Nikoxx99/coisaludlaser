import "server-only";

const apiUrl = () =>
  (process.env.TUODONTO_API_URL?.trim() || "http://localhost:3000").replace(
    /\/$/,
    ""
  );

export function getTuOdontoAdminUrl() {
  return `${apiUrl()}/admin`;
}

function apiKey() {
  const value = process.env.TUODONTO_SITE_API_KEY?.trim();
  if (!value) throw new Error("TUODONTO_SITE_API_KEY no está configurada.");
  return value;
}

export async function callTuOdonto(
  path: string,
  init: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${apiKey()}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(`${apiUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
    signal: init.signal ?? AbortSignal.timeout(15_000),
  });
}

export async function proxyTuOdonto(request: Request, path: string) {
  try {
    const hasBody = request.method !== "GET" && request.method !== "HEAD";
    const declaredLength = Number(request.headers.get("content-length") || "0");
    if (hasBody && declaredLength > 65_536) {
      return Response.json(
        { ok: false, message: "La solicitud es demasiado grande." },
        { status: 413 }
      );
    }
    const body = hasBody ? await request.text() : undefined;
    if (body && Buffer.byteLength(body, "utf8") > 65_536) {
      return Response.json(
        { ok: false, message: "La solicitud es demasiado grande." },
        { status: 413 }
      );
    }
    const upstream = await callTuOdonto(path, {
      method: request.method,
      body,
      headers: body
        ? {
            "Content-Type":
              request.headers.get("content-type") || "application/json",
          }
        : undefined,
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TuOdonto upstream failed", error);
    return Response.json(
      {
        ok: false,
        message:
          "No pudimos conectar con la agenda. Escríbenos por WhatsApp.",
      },
      { status: 502 }
    );
  }
}

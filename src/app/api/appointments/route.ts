import { colombianMobileError, normalizeColombianMobile } from "@/lib/colombian-mobile";
import { proxyTuOdonto } from "@/lib/tuodonto-api";

const maxBodyBytes = 65_536;

function parseFields(text: string): Record<string, unknown> | null {
  try {
    const value: unknown = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  const tooLarge = Response.json({ ok: false, message: "La solicitud es demasiado grande." }, { status: 413 });
  if (Number(request.headers.get("content-length") || "0") > maxBodyBytes) return tooLarge;
  const text = await request.text();
  if (Buffer.byteLength(text, "utf8") > maxBodyBytes) return tooLarge;

  const fields = parseFields(text);
  if (!fields) {
    return Response.json({ ok: false, message: "Revisa los datos de la cita." }, { status: 400 });
  }
  const phone = typeof fields.phone === "string" ? normalizeColombianMobile(fields.phone) : null;
  if (!phone) {
    return Response.json(
      { ok: false, message: colombianMobileError, errors: { phone: [colombianMobileError] } },
      { status: 400 }
    );
  }
  return proxyTuOdonto(
    new Request(request.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...fields, phone }),
    }),
    "/api/site/v1/appointments"
  );
}

import { proxyTuOdonto } from "@/lib/tuodonto-api";

export async function GET(request: Request) {
  const url = new URL(request.url);
  return proxyTuOdonto(request, `/api/site/v1/availability${url.search}`);
}

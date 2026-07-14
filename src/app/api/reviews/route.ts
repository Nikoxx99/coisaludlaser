import { proxyTuOdonto } from "@/lib/tuodonto-api";

export async function POST(request: Request) {
  return proxyTuOdonto(request, "/api/site/v1/reviews");
}

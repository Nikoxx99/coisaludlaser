export function GET() {
  return new Response(null, {
    status: 307,
    headers: {
      Location: "/api/favicon",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

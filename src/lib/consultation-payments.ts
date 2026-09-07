// Tarifas y enlace facilitados por Angie el 7 de septiembre de 2026.
// Solo complementan las modalidades que publique la API; no crean servicios.
export const WOMPI_CONSULTATION_URL = "https://checkout.wompi.co/l/VPOS_ygdgE4";

const rates: Record<string, { regular: number; online: number }> = {
  "valoracion-presencial": { regular: 70000, online: 50000 },
  "consulta-virtual": { regular: 50000, online: 35000 },
};

export function consultationRate(slug: string) {
  return rates[slug] ?? null;
}

export function formatCOP(amount: number) {
  return `$${new Intl.NumberFormat("es-CO", { maximumFractionDigits: 0 }).format(amount)}`;
}

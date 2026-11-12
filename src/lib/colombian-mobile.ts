export const colombianMobileError =
  "Escribe un celular colombiano de 10 dígitos que empiece por 3, por ejemplo 300 123 4567.";

export function normalizeColombianMobile(input: string): string | null {
  const digits = input.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("57") ? digits.slice(2) : digits;
  return /^3\d{9}$/.test(local) ? local : null;
}

/**
 * Normaliza los valores de redes guardados en configuracion: el admin puede
 * pegar la URL completa o solo el usuario (@usuario / usuario). Un valor vacio
 * devuelve null y el boton correspondiente no se muestra.
 */

function clean(value: string | undefined | null) {
  const trimmed = (value ?? "").trim();
  return trimmed.length > 0 ? trimmed : null;
}

function handleOrUrl(value: string | undefined | null, base: string) {
  const input = clean(value);
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  return `${base}${input.replace(/^@/, "")}`;
}

export function instagramUrl(value: string | undefined | null) {
  return handleOrUrl(value, "https://www.instagram.com/");
}

export function tiktokUrl(value: string | undefined | null) {
  const input = clean(value);
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  return `https://www.tiktok.com/@${input.replace(/^@/, "")}`;
}

export function facebookUrl(value: string | undefined | null) {
  return handleOrUrl(value, "https://www.facebook.com/");
}

export function doctoraliaUrl(value: string | undefined | null) {
  const input = clean(value);
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  return `https://www.doctoralia.co/${input}`;
}

export function googleBusinessUrl(value: string | undefined | null) {
  const input = clean(value);
  if (!input) return null;
  if (/^https?:\/\//i.test(input)) return input;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(input)}`;
}

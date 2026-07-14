import type { AvailabilitySlot } from "./types";

/**
 * Convierte las franjas semanales de disponibilidad en lineas legibles de
 * horario de atencion ("Lunes a viernes · 8:00 a. m. - 12:00 p. m. y
 * 2:00 - 6:00 p. m."). Los dias consecutivos con el mismo horario se agrupan.
 */

const WEEKDAY_LABELS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miercoles",
  "Jueves",
  "Viernes",
  "Sabado",
];

// Orden de lectura: lunes primero, domingo al final.
const WEEKDAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

export type BusinessHoursLine = {
  days: string;
  hours: string;
};

function formatTime(value: string) {
  const [rawHour = "0", minute = "00"] = value.split(":");
  const hour = Number(rawHour);
  const suffix = hour < 12 ? "a. m." : "p. m.";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${suffix}`;
}

function formatRange(range: string) {
  const [start, end] = range.split("-");
  return `${formatTime(start)} - ${formatTime(end)}`;
}

export function formatWeeklyHours(slots: AvailabilitySlot[]): BusinessHoursLine[] {
  // Solo franjas semanales genericas: las de fecha puntual o de un servicio
  // especifico no representan el horario general de la clinica.
  const weekly = slots.filter(
    (slot) => slot.active && !slot.date && !slot.serviceSlug
  );

  const byDay = new Map<number, Set<string>>();
  for (const slot of weekly) {
    const ranges = byDay.get(slot.weekday) ?? new Set<string>();
    ranges.add(`${slot.startTime}-${slot.endTime}`);
    byDay.set(slot.weekday, ranges);
  }

  const signature = (weekday: number) =>
    Array.from(byDay.get(weekday) ?? [])
      .sort()
      .join(",");

  const lines: BusinessHoursLine[] = [];
  let index = 0;

  while (index < WEEKDAY_ORDER.length) {
    const weekday = WEEKDAY_ORDER[index];
    const daySignature = signature(weekday);

    if (!daySignature) {
      index += 1;
      continue;
    }

    let end = index;
    while (
      end + 1 < WEEKDAY_ORDER.length &&
      signature(WEEKDAY_ORDER[end + 1]) === daySignature
    ) {
      end += 1;
    }

    const firstLabel = WEEKDAY_LABELS[WEEKDAY_ORDER[index]];
    const lastLabel = WEEKDAY_LABELS[WEEKDAY_ORDER[end]];
    const days =
      index === end
        ? firstLabel
        : `${firstLabel} a ${lastLabel.toLowerCase()}`;
    const hours = daySignature.split(",").map(formatRange).join(" y ");

    lines.push({ days, hours });
    index = end + 1;
  }

  return lines;
}

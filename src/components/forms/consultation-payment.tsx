import { CreditCard, ArrowUpRight } from "lucide-react";
import { consultationRate, formatCOP, WOMPI_CONSULTATION_URL } from "@/lib/consultation-payments";

export function ConsultationPayment({ slug, registered = false, scheduled = false }: { slug: string; registered?: boolean; scheduled?: boolean }) {
  const rate = consultationRate(slug);
  if (!rate) return null;

  return (
    <section aria-label="Valor de tu consulta" className="mt-5 rounded-[1.5rem] border border-[var(--tuodonto-line)] bg-[var(--tuodonto-pearl)] p-5">
      <p className="tuodonto-eyebrow flex items-center gap-2"><CreditCard className="size-4" aria-hidden="true" />{registered ? "Siguiente paso · Pago en línea" : "Tu consulta, con tarifa web"}</p>
      <p className="mt-3 text-3xl font-semibold text-[var(--tuodonto-brown)]">{formatCOP(rate.online)} <span className="text-sm font-normal">COP</span></p>
      <p className="mt-1 text-sm text-[var(--tuodonto-taupe)]">Pagando en línea · Tarifa habitual {formatCOP(rate.regular)} COP</p>
      <p className="mt-3 text-sm leading-6 text-[var(--tuodonto-taupe)]">{registered ? `En Wompi ingresa ${formatCOP(rate.online)} COP. Conserva el comprobante y el código de tu cita para que el equipo pueda verificar tu pago.` : "Primero registra tu cita. Después podrás pagar en el portal seguro de Wompi."}</p>
      {registered && <>
        {!scheduled && <p className="mt-3 text-sm leading-6">Tu solicitud aún no tiene horario confirmado. Coordínalo con el equipo antes de pagar.</p>}
        <a href={WOMPI_CONSULTATION_URL} target="_blank" rel="noopener noreferrer" className="tuodonto-focus mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-full tuodonto-gold-fill px-6 text-sm font-semibold">Pagar en Wompi <ArrowUpRight className="size-4" aria-hidden="true" /></a>
        <p className="mt-3 text-xs leading-5 text-[var(--tuodonto-taupe)]">Se abre en otra pestaña. Abrir el portal no confirma el pago. Si ya pagaste, conserva tu comprobante y evita realizar un segundo pago.</p>
      </>}
    </section>
  );
}

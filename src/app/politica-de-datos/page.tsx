import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Mail, ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Política de tratamiento de datos personales",
  description: "Conoce cómo se utilizan tus datos, cuáles son tus derechos y cómo contactar al Consultorio Odontológico Dra. Angie Lezama y Óptica COISalud.",
};

const sections = [
  { id: "responsable", title: "Quién trata tus datos", paragraphs: [
    "Esta política aplica al Consultorio Odontológico Dra. Angie Lezama y Óptica COISalud, en Calle 8 # 4-71, Barrio El Carmen, Mariquita, Tolima, Colombia. Abarca los datos de pacientes, usuarios, representantes, colaboradores y proveedores, recibidos por el sitio web, formularios, comunicaciones y atención presencial.",
    "El consultorio y la óptica son responsables del tratamiento que realizan para sus respectivos servicios. Puedes dirigir tus solicitudes de protección de datos al equipo administrativo mediante los canales indicados al final de esta página.",
  ] },
  { id: "finalidades", title: "Qué datos usamos y para qué", paragraphs: [
    "Podemos recibir datos de identificación y contacto, información de citas, pagos y facturación, y los datos necesarios para la relación laboral o comercial. En la atención en salud también se recogen antecedentes, historias clínicas, exámenes y fotografías clínicas pertinentes.",
    "Usamos esta información para gestionar solicitudes y citas, prestar y dar seguimiento a los servicios de salud, elaborar y custodiar historias clínicas, comunicarnos sobre la atención, verificar pagos, facturar, desarrollar procesos administrativos y atender obligaciones legales. La información solicitada debe ser adecuada y necesaria para cada finalidad.",
    "El envío de promociones o publicidad requiere una autorización específica. La autorización para agendar una cita no incluye publicidad. No se venderán los datos personales ni se utilizarán para finalidades incompatibles con las informadas.",
  ] },
  { id: "autorizacion", title: "Tu autorización y los datos sensibles", paragraphs: [
    "Cuando corresponda, solicitaremos una autorización previa, expresa e informada y conservaremos evidencia de ella. Los casos en que la ley permite tratar información sin autorización no eliminan los deberes de confidencialidad y protección.",
    "Los datos de salud son sensibles. No estás obligado a autorizar su tratamiento, salvo las excepciones legales aplicables; antes de solicitarlos te explicaremos su finalidad y el carácter facultativo de responder. La información clínicamente necesaria se solicitará por los canales de atención correspondientes. Evita escribir diagnósticos, resultados o antecedentes en el formulario general de citas.",
    "Las fotografías clínicas forman parte de la atención y requieren las garantías aplicables a los datos de salud. Publicar fotografías, videos o testimonios identificables en redes sociales, publicidad o materiales educativos requiere una autorización separada que indique su uso. Rechazar este uso no condiciona la atención.",
  ] },
  { id: "menores", title: "Protección de niños, niñas y adolescentes", paragraphs: [
    "El tratamiento de datos de menores debe respetar su interés superior y sus derechos fundamentales. Cuando proceda, se solicitará la autorización de su representante legal y se escuchará al menor de acuerdo con su madurez y capacidad de comprensión. Solo se recogerá la información necesaria para la atención y las obligaciones correspondientes.",
  ] },
  { id: "proveedores", title: "Agenda digital y pagos", paragraphs: [
    "El sitio utiliza TuOdonto para gestionar solicitudes y disponibilidad. Los proveedores tecnológicos que actúen por cuenta del responsable deberán limitar el acceso y el uso a las finalidades autorizadas, bajo obligaciones de confidencialidad y seguridad. Las transmisiones o transferencias nacionales o internacionales deberán cumplir las condiciones legales aplicables, incluidos los contratos o autorizaciones que correspondan.",
    "Si decides pagar, abrirás el portal de Wompi, donde ingresarás los datos del medio de pago bajo sus condiciones y política de privacidad. El formulario de citas no solicita números de tarjeta ni códigos de seguridad. El comprobante y los datos necesarios para verificar el pago podrán utilizarse para la gestión de tu cita y la facturación.",
    "La información clínica está sujeta a reserva. Su acceso se limita a las personas autorizadas y a los casos permitidos por la ley, incluidas las solicitudes de autoridades competentes.",
  ] },
  { id: "derechos", title: "Tus derechos sobre la información", paragraphs: [
    "Puedes conocer, actualizar y rectificar tus datos; acceder gratuitamente a ellos; pedir prueba de la autorización, cuando sea exigible; y conocer cómo se han utilizado. También puedes solicitar la revocatoria de la autorización o la supresión cuando sean procedentes y presentar quejas ante la Superintendencia de Industria y Comercio, después de agotar el trámite de consulta o reclamo ante el responsable.",
    "La revocatoria o supresión no procede respecto de información que deba conservarse por un deber legal o contractual. Puedes retirar la autorización para publicidad sin afectar el tratamiento necesario para la atención o las obligaciones legales.",
  ] },
  { id: "solicitudes", title: "Cómo presentar una consulta o reclamo", paragraphs: [
    "Escribe a cualquiera de los correos de contacto con el asunto «Protección de datos personales». Indica tu nombre, un medio para responder, la solicitud y los hechos que la sustentan. Adjunta los documentos pertinentes cuando sean necesarios. Si actúas por otra persona, acredita tu representación. Para proteger la información, podrá solicitarse la acreditación de identidad por un canal apropiado.",
    "Las consultas se atienden en máximo 10 días hábiles desde su recepción. Si no es posible responder en ese plazo, se informarán el motivo y la nueva fecha, sin superar 5 días hábiles adicionales.",
    "Los reclamos se resuelven en máximo 15 días hábiles desde el día siguiente a su recepción. Una ampliación justificada se comunicará antes del vencimiento y no podrá superar 8 días hábiles adicionales. Si el reclamo está incompleto, se pedirá subsanarlo dentro de los 5 días siguientes a su recepción; transcurridos 2 meses desde el requerimiento sin respuesta, se entenderá desistido.",
    "Si quien recibe el reclamo no es competente, lo trasladará en máximo 2 días hábiles e informará al interesado. Una vez recibido el reclamo completo, se incorporará la leyenda «reclamo en trámite» y su motivo en la base correspondiente en máximo 2 días hábiles, hasta su resolución.",
  ] },
  { id: "conservacion", title: "Conservación y seguridad", paragraphs: [
    "Los datos se conservarán durante el tiempo necesario para las finalidades informadas y las obligaciones legales o contractuales. Finalizada esa necesidad, corresponderá su eliminación segura o anonimización, salvo que exista una obligación de conservación.",
    "La historia clínica tiene reglas especiales: la Resolución 839 de 2017 dispone, como regla general, una conservación mínima de 15 años desde la última atención, sin perjuicio de términos especiales o superiores aplicables. Solicitar la eliminación de datos no permite desconocer esta obligación.",
    "El tratamiento debe contar con medidas técnicas, humanas y administrativas apropiadas para prevenir accesos no autorizados, alteración, pérdida o usos indebidos, y con deberes de reserva para quienes acceden a la información. Los incidentes deberán atenderse y reportarse a las autoridades cuando la normativa lo exija.",
  ] },
  { id: "vigencia", title: "Vigencia y cambios", paragraphs: [
    "Versión del 7 de septiembre de 2026, aplicable desde su publicación en este sitio. Las bases de datos se mantendrán mientras subsistan las finalidades y los plazos de conservación indicados. Los cambios sustanciales se comunicarán oportunamente antes de su aplicación y se solicitará una nueva autorización cuando el cambio de finalidad lo requiera.",
    "Esta política desarrolla la Ley 1581 de 2012 y el Decreto 1074 de 2015, junto con las normas aplicables a la reserva y custodia de la historia clínica.",
  ] },
];

export default function DataPolicyPage() {
  return (
    <main className="tuodonto-page-shell min-h-screen bg-[var(--tuodonto-ivory)] px-5 py-8 text-[var(--tuodonto-ink)] sm:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <nav aria-label="Navegación de la política" className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--tuodonto-line)] pb-6 text-sm">
          <Link href="/" className="tuodonto-focus font-semibold">COISalud Láser</Link>
          <Link href="/citas" className="tuodonto-focus inline-flex items-center gap-2">Agenda tu cita <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </nav>
        <header className="max-w-3xl py-12 md:py-20">
          <ShieldCheck className="mb-6 size-10 text-[var(--tuodonto-gold)]" aria-hidden="true" />
          <p className="tuodonto-eyebrow">Privacidad y cuidado</p>
          <h1 className="tuodonto-display mt-4 text-4xl leading-tight text-[var(--tuodonto-brown)] sm:text-6xl">Política de tratamiento de datos personales</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--tuodonto-taupe)]">Cuidar de ti también significa respetar tu información. Aquí puedes conocer para qué usamos tus datos, cómo ejercer tus derechos y dónde contactarnos.</p>
          <p className="mt-5 text-sm text-[var(--tuodonto-taupe)]">Consultorio Odontológico Dra. Angie Lezama y Óptica COISalud · Versión del 7 de septiembre de 2026</p>
        </header>
        <div className="grid items-start gap-12 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
          <nav aria-label="Contenido de la política" className="rounded-3xl border border-[var(--tuodonto-line)] bg-white/60 p-6 lg:sticky lg:top-8">
            <p className="tuodonto-eyebrow mb-4">En esta página</p>
            <ol className="space-y-3 text-sm leading-6">{sections.map((section, index) => <li key={section.id}><a className="tuodonto-focus hover:underline" href={`#${section.id}`}><span className="mr-2 text-[var(--tuodonto-gold-deep)]">{String(index + 1).padStart(2, "0")}</span>{section.title}</a></li>)}</ol>
            <a href="#contacto-datos" className="tuodonto-focus mt-6 block border-t border-[var(--tuodonto-line)] pt-4 font-semibold">Contactar al equipo</a>
          </nav>
          <div className="min-w-0">
            {sections.map((section, index) => <section id={section.id} key={section.id} className="scroll-mt-8 border-t border-[var(--tuodonto-line)] pb-10 pt-6">
              <p className="tuodonto-eyebrow">{String(index + 1).padStart(2, "0")}</p>
              <h2 className="tuodonto-display mb-5 mt-2 text-3xl text-[var(--tuodonto-brown)]">{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph} className="mt-4 text-base leading-8 text-[var(--tuodonto-taupe)]">{paragraph}</p>)}
            </section>)}
            <section id="contacto-datos" className="scroll-mt-8 rounded-3xl bg-white/70 p-6 sm:p-9">
              <Mail className="size-7 text-[var(--tuodonto-gold)]" aria-hidden="true" />
              <h2 className="tuodonto-display mt-4 text-3xl">Estamos para escucharte</h2>
              <p className="mt-3 leading-7">Equipo administrativo · Consultas y reclamos sobre datos personales</p>
              <div className="mt-5 space-y-3 text-sm leading-6">
                <a className="tuodonto-focus block break-all underline" href="mailto:auxiliarcoisalud@gmail.com">auxiliarcoisalud@gmail.com</a>
                <a className="tuodonto-focus block break-all underline" href="mailto:odontologiacoisalud@gmail.com">odontologiacoisalud@gmail.com</a>
                <a className="tuodonto-focus block underline" href="https://wa.me/573214155710">Teléfono / WhatsApp: 321 415 5710</a>
                <p>Calle 8 # 4-71, Barrio El Carmen · Mariquita, Tolima</p>
                <p>Lunes a viernes, de 8:00 a. m. a 12:00 m. y de 2:00 p. m. a 6:00 p. m.</p>
              </div>
            </section>
            <footer className="py-10 text-sm leading-7 text-[var(--tuodonto-taupe)]">
              <p>Normas de referencia</p>
              <ul className="mt-2 space-y-2 underline underline-offset-4">
                <li><a href="https://www.funcionpublica.gov.co/eva/gestornormativo/norma.php?i=49981">Ley 1581 de 2012</a></li>
                <li><a href="https://www.cancilleria.gov.co/sites/default/files/Normograma/docs/decreto_1074_2015_pr025.htm">Decreto 1074 de 2015 · Protección de datos personales</a></li>
                <li><a href="https://www.minsalud.gov.co/sites/rid/Lists/BibliotecaDigital/RIDE/DE/DIJ/resolucion-839-de-2017.pdf">Resolución 839 de 2017 · Historias clínicas</a></li>
              </ul>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}

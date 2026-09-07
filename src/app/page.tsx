import { LandingEditorial } from "@/components/landing/landing-editorial";
import type {
  EditorialLandingData,
  EditorialNavItem,
} from "@/components/landing/types";
import {
  getBrandImages,
  getNavigationSettings,
  getServices,
  getSiteSettings,
} from "@/lib/repository";
import { getOptimizedEditorialAsset } from "@/lib/editorial-assets";
import { getTuOdontoAdminUrl } from "@/lib/tuodonto-api";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, services, brandImages, navigation] =
    await Promise.all([
      getSiteSettings(),
      getServices(),
      getBrandImages(),
      getNavigationSettings(),
    ]);

  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hola, equipo de ${settings.brandName}. Quisiera información para agendar mi cita.`
  )}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${settings.address} ${settings.city}`.trim()
  )}`;

  const nav: EditorialNavItem[] = [
    { label: "Inicio", href: "/" },
    navigation.public.nosotros && { label: "Conoce al equipo", href: "/nosotros" },
    navigation.public.servicios && { label: "Nuestros servicios", href: "/servicios" },
    navigation.public.citas && { label: "Agenda tu cita", href: "/citas" },
    navigation.public.tienda && { label: "Tienda", href: "/tienda" },
    navigation.public.valora && { label: "Cuéntanos cómo te fue", href: "/valora" },
    navigation.public.contacto && { label: "Contacto", href: "/contacto" },
  ].filter((item): item is EditorialNavItem => Boolean(item));

  // Solo servicios reales del tenant: con catalogo vacio la lista se oculta.
  const treatments = navigation.public.servicios
    ? services.slice(0, 4).map((service) => ({
        name: service.name,
        href: `/servicios?servicio=${service.slug}`,
      }))
    : [];

  const image = (key: string) => ({
    src: getOptimizedEditorialAsset(brandImages[key]?.src ?? ""),
    alt: brandImages[key]?.alt ?? "",
    fit: brandImages[key]?.fit === "fill" ? ("fill" as const) : ("cover" as const),
  });

  // Voz editorial de COISalud según docs/guia-comunicacion-angie-lezama.md.
  // Servicios, imágenes, contacto y visibilidad de reservas siguen viniendo de la API.
  const data: EditorialLandingData = {
    brand: {
      name: settings.brandName,
      logoUrl: settings.logoUrl || null,
      address: settings.address,
      city: settings.city,
      phone: settings.phone,
      whatsappHref,
      mapsHref,
      adminHref: getTuOdontoAdminUrl(),
    },
    nav,
    hero: {
      word: "Más allá por\ntu sonrisa",
      taglineTop: "Te doy la bienvenida a nuestro consultorio virtual.",
      taglineBottom: "Cuéntame qué te preocupa de tu sonrisa.",
      ctaLabel: "Agenda tu cita",
      ctaHref: navigation.public.citas ? "/citas" : null,
      rail: ["Bienvenida", "Tu sonrisa", "En confianza", "Tus dudas", "Tu cita"].map((label, index) => ({
        num: String(index + 1).padStart(2, "0"),
        label,
      })),
      quote: "",
      quoteAuthor: "",
    },
    panels: {
      headers: ["Bienvenida", "Nuestros servicios", "Niños y pacientes nerviosos", "Tecnología para tu cuidado", "Ven al consultorio"],
      labels: ["Bienvenida", "Tu sonrisa", "En confianza", "Tus dudas", "Tu cita"],
    },
    precision: {
      title: "Soy la Dra. Angie Lezama.",
      accent: "Qué gusto tenerte aquí.",
      doctorLabel: "Dra. Angie Lezama",
      ctaLabel: "Agenda tu cita",
    },
    sonrisa: {
      word: "CONTIGO",
      kicker: "Hablemos de",
      kickerAccent: "tu sonrisa.",
      treatments,
      exploreLabel: "Conoce nuestros servicios",
      exploreHref: navigation.public.servicios ? "/servicios" : null,
    },
    tecnologia: {
      title: "Tecnología",
      accent: "que cuida.",
      subTop: "Láser odontológico y anestesia computarizada:",
      subBottom: "dos pilares de mi atención para cuidar tu comodidad.",
      questions: [
        {
          title: "Láser odontológico",
          answer: "Utiliza energía de luz concentrada para trabajar con precisión en procedimientos seleccionados. Según el tratamiento, puede ayudar a reducir las molestias y la intervención sobre los tejidos. En tu valoración te explico cuándo es adecuado para ti.",
        },
        {
          title: "Anestesia computarizada",
          answer: "Un equipo regula la velocidad y la presión con que se aplica el anestésico local. Esa administración gradual y controlada ayuda a que la aplicación sea más cómoda. Así cuidamos este paso del tratamiento, especialmente si te genera nervios.",
        },
      ],
      badge: "Precisión y comodidad",
    },
    contacto: {
      title: "Demos el primer paso por tu sonrisa.",
      ctaLabel: "Agenda tu cita",
      ctaHref: navigation.public.citas ? "/citas" : null,
      word: "NOS VEMOS",
      directions: "Cómo llegar al consultorio",
      footerTag: "Vamos más allá por tu sonrisa.",
    },
    images: {
      portrait: image("editorialPortrait"),
      portraitPhoto: image("editorialPortraitPhoto"),
      teamPhoto: image("editorialTeamPhoto"),
      laserCutout: image("editorialLaserCutout"),
      laserPhoto: image("editorialLaserPhoto"),
      aligner: image("editorialAlignerCutout"),
      clinic: image("editorialClinic"),
      clinicRibbon: image("editorialClinicRibbon"),
      facade: image("editorialFacade"),
    },
  };

  return <LandingEditorial data={data} />;
}

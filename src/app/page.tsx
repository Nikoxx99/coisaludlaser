import { LandingEditorial } from "@/components/landing/landing-editorial";
import type {
  EditorialLandingData,
  EditorialNavItem,
} from "@/components/landing/types";
import {
  getBrandImages,
  getLandingCopy,
  getNavigationSettings,
  getServices,
  getSiteSettings,
} from "@/lib/repository";
import { getOptimizedEditorialAsset } from "@/lib/editorial-assets";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [settings, landing, services, brandImages, navigation] =
    await Promise.all([
      getSiteSettings(),
      getLandingCopy(),
      getServices(),
      getBrandImages(),
      getNavigationSettings(),
    ]);

  const editorial = landing.editorial;
  const whatsappHref = `https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(
    `Hola ${settings.brandName}, quiero agendar una valoración.`
  )}`;
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${settings.address} ${settings.city}`.trim()
  )}`;

  const nav: EditorialNavItem[] = [
    { label: "Inicio", href: "/" },
    navigation.public.nosotros && { label: "Nosotros", href: "/nosotros" },
    navigation.public.servicios && { label: "Servicios", href: "/servicios" },
    navigation.public.citas && { label: "Citas", href: "/citas" },
    navigation.public.tienda && { label: "Tienda", href: "/tienda" },
    navigation.public.valora && { label: "Valora", href: "/valora" },
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

  const data: EditorialLandingData = {
    brand: {
      name: settings.brandName,
      logoUrl: settings.logoUrl || null,
      address: settings.address,
      city: settings.city,
      phone: settings.phone,
      whatsappHref,
      mapsHref,
    },
    nav,
    hero: {
      word: editorial.heroWord,
      taglineTop: editorial.heroTaglineTop,
      taglineBottom: editorial.heroTaglineBottom,
      ctaLabel: landing.hero.primaryCta,
      ctaHref: navigation.public.citas ? "/citas" : null,
      rail: editorial.railLabels.map((label, index) => ({
        num: String(index + 1).padStart(2, "0"),
        label,
      })),
      quote: editorial.heroQuote,
      quoteAuthor: editorial.heroQuoteAuthor,
    },
    panels: {
      headers: editorial.panelHeaders,
      labels: editorial.panelLabels,
    },
    precision: {
      title: landing.hero.title,
      // sin punto final: el componente aplica el remate tipografico
      accent: landing.hero.accent.replace(/[.\s]+$/, ""),
      doctorLabel: settings.brandName,
      ctaLabel: landing.hero.primaryCta,
    },
    sonrisa: {
      word: editorial.sonrisaWord,
      kicker: editorial.sonrisaKicker,
      kickerAccent: editorial.sonrisaKickerAccent,
      treatments,
      exploreLabel: landing.services.allCta,
      exploreHref: navigation.public.servicios ? "/servicios" : null,
    },
    tecnologia: {
      title: editorial.tecnologiaTitle,
      accent: editorial.tecnologiaAccent,
      subTop: editorial.tecnologiaSubTop,
      subBottom: editorial.tecnologiaSubBottom,
      bullets: editorial.tecnologiaBullets,
      badge: editorial.tecnologiaBadge,
    },
    contacto: {
      title: landing.finalCta.title,
      ctaLabel: landing.finalCta.primaryCta,
      ctaHref: navigation.public.citas ? "/citas" : null,
      word: editorial.contactoWord,
      directions: editorial.contactoDirections,
      footerTag: editorial.footerTag,
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

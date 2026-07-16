export type EditorialImage = {
  src: string;
  alt: string;
  /** object-fit configurado por el admin para este slot. */
  fit: "cover" | "fill";
};

export type EditorialNavItem = {
  label: string;
  href: string;
};

// Datos serializables que el Server Component resuelve por tenant (copy del
// admin + imagenes de marca + servicios) y entrega al arbol cliente de GSAP.
export type EditorialLandingData = {
  brand: {
    name: string;
    logoUrl: string | null;
    address: string;
    city: string;
    phone: string;
    whatsappHref: string;
    mapsHref: string;
    adminHref: string;
  };
  nav: EditorialNavItem[];
  hero: {
    word: string;
    taglineTop: string;
    taglineBottom: string;
    ctaLabel: string;
    ctaHref: string | null;
    rail: { num: string; label: string }[];
    quote: string;
    quoteAuthor: string;
  };
  panels: {
    headers: string[];
    labels: string[];
  };
  precision: {
    title: string;
    accent: string;
    doctorLabel: string;
    ctaLabel: string;
  };
  sonrisa: {
    word: string;
    kicker: string;
    kickerAccent: string;
    treatments: { name: string; href: string }[];
    exploreLabel: string;
    exploreHref: string | null;
  };
  tecnologia: {
    title: string;
    accent: string;
    subTop: string;
    subBottom: string;
    bullets: string[];
    badge: string;
  };
  contacto: {
    title: string;
    ctaLabel: string;
    ctaHref: string | null;
    word: string;
    directions: string;
    footerTag: string;
  };
  images: {
    portrait: EditorialImage;
    portraitPhoto: EditorialImage;
    teamPhoto: EditorialImage;
    laserCutout: EditorialImage;
    laserPhoto: EditorialImage;
    aligner: EditorialImage;
    clinic: EditorialImage;
    clinicRibbon: EditorialImage;
    facade: EditorialImage;
  };
};

export type Service = {
  id: string;
  slug: string;
  name: string;
  categorySlug: string;
  summary: string;
  description: string;
  durationMin: number;
  priceFrom?: number;
  imageUrl?: string;
  teamMemberId?: string;
  teamMemberIds?: string[];
  specialist?: TeamMember;
  specialists?: TeamMember[];
  active?: boolean;
  featured?: boolean;
  publicBookingEnabled?: boolean;
};

export type ServiceCategory = {
  id: string;
  slug: string;
  name: string;
  description: string;
  active: boolean;
};

export type AvailabilitySlot = {
  id: string;
  date?: string;
  weekday: number;
  startTime: string;
  endTime: string;
  serviceSlug?: string;
  teamMemberId?: string;
  capacity: number;
  active: boolean;
};

export type TeamMember = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  email?: string;
  phone?: string;
  active: boolean;
  avatarUrl?: string;
};

export type Specialty = {
  id: string;
  name: string;
  active: boolean;
  sortOrder: number;
};

export type ProductCategory = {
  id: string;
  slug: string;
  name: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  active: boolean;
  featured?: boolean;
  categorySlug: string;
};

export type Customer = {
  id: string;
  name: string;
  email?: string;
  phone: string;
  document?: string;
  city: string;
  discoverySource?: string;
};

export type AppointmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED";

export type AppointmentPaymentStatus = "UNPAID" | "PAID";

export type AppointmentPaymentMethod = "WOMPI" | "CASH";

export type Appointment = {
  id: string;
  /** Nulos cuando la cita es una solicitud web pendiente de agendar. */
  startsAt: string | null;
  endsAt: string | null;
  status: AppointmentStatus;
  reason: string;
  notes?: string;
  amount?: number;
  paymentStatus?: AppointmentPaymentStatus;
  paymentMethod?: AppointmentPaymentMethod;
  paymentReference?: string;
  /** La cita fue eliminada en Google y espera decisión del administrador. */
  googleDeletedAt?: string;
  customer: Customer;
  teamMember?: TeamMember;
};

export type OrderStatus =
  | "DRAFT"
  | "PENDING_PAYMENT"
  | "PAID"
  | "PREPARING"
  | "SHIPPED"
  | "COMPLETED"
  | "CANCELLED";

export type OrderItem = {
  id: string;
  product: Product;
  quantity: number;
  unitPrice: number;
};

export type Order = {
  id: string;
  code: string;
  status: OrderStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryMethod: string;
  paymentProvider: "wompi";
  paymentReference?: string;
  customer: Customer;
  items: OrderItem[];
  createdAt: string;
};

export type ConversationChannel = "WHATSAPP" | "INSTAGRAM" | "EMAIL" | "WEB";

export type Message = {
  id: string;
  body: string;
  direction: "inbound" | "outbound";
  createdAt: string;
};

export type Conversation = {
  id: string;
  contact: string;
  channel: ConversationChannel;
  subject: string;
  status: "open" | "pending" | "closed";
  tags: string[];
  messages: Message[];
  updatedAt: string;
};

export type SiteSettings = {
  brandName: string;
  legalName: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  tiktok: string;
  facebook: string;
  doctoralia: string;
  googleBusiness: string;
  email: string;
  address: string;
  city: string;
  heroHeadline: string;
  heroSubcopy: string;
  logoUrl: string;
};

/**
 * Visibilidad de secciones, editable en Configuracion -> Sidebar.
 * `public` controla el menu del sitio publico (y las rutas/bloques asociados);
 * `admin` controla los items del sidebar del panel. Inicio, Dashboard y
 * Configuracion no se pueden ocultar para evitar dejar el sitio sin entrada.
 */
export type NavigationSettings = {
  public: {
    nosotros: boolean;
    servicios: boolean;
    tienda: boolean;
    citas: boolean;
    contacto: boolean;
    valora: boolean;
  };
  admin: {
    citas: boolean;
    servicios: boolean;
    pedidos: boolean;
    reportes: boolean;
    inbox: boolean;
    equipo: boolean;
    tienda: boolean;
    resenas: boolean;
  };
};

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED";

export type Review = {
  id: string;
  name: string;
  rating: number;
  comment: string;
  serviceSlug?: string;
  status: ReviewStatus;
  source: string;
  createdAt: string;
};

export type BrandImageFit = "cover" | "fill";

export type BrandImage = {
  src: string;
  alt: string;
  fit: BrandImageFit;
  width?: number;
  height?: number;
  originalName?: string;
  updatedAt?: string;
};

export type BrandImages = Record<string, BrandImage>;

export type EmailSettings = {
  /** Activa el envío de notificaciones de cita al correo destino. */
  enabled: boolean;
  /** Nombre visible del remitente. */
  fromName: string;
  /** Remitente: debe ser un dominio verificado en Resend (la API key va en .env). */
  fromEmail: string;
  /** Correo que recibe las solicitudes de cita. */
  toEmail: string;
};

export type PaymentSettings = {
  wompiEnabled: boolean;
  wompiEnvironment: "sandbox" | "production";
  wompiPublicKey: string;
  wompiPrivateKey: string;
  wompiIntegritySecret: string;
  wompiEventsSecret: string;
  cashEnabled: boolean;
};

export type LandingCopy = {
  hero: {
    eyebrow: string;
    title: string;
    accent: string;
    copy: string;
    primaryCta: string;
    secondaryCta: string;
    strap: string;
  };
  appointment: {
    eyebrow: string;
    title: string;
    cta: string;
  };
  clinic: {
    eyebrow: string;
    copy: string;
    /** Enlace del video de la clínica (YouTube, Vimeo o MP4). Vacío oculta el modal. */
    videoUrl: string;
  };
  shopTeaser: {
    eyebrow: string;
    title: string;
    copy: string;
  };
  method: {
    eyebrow: string;
    title: string;
    copy: string;
    steps: string[];
  };
  services: {
    eyebrow: string;
    title: string;
    allCta: string;
  };
  store: {
    previewEyebrow: string;
    title: string;
    copy: string;
    bullets: string[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: {
    eyebrow: string;
    title: string;
  };
  /** Copy de la landing editorial (hero SONRÍE + paneles horizontales). */
  editorial: {
    heroWord: string;
    heroTaglineTop: string;
    heroTaglineBottom: string;
    railLabels: string[];
    panelHeaders: string[];
    panelLabels: string[];
    sonrisaWord: string;
    sonrisaKicker: string;
    sonrisaKickerAccent: string;
    tecnologiaTitle: string;
    tecnologiaAccent: string;
    tecnologiaSubTop: string;
    tecnologiaSubBottom: string;
    tecnologiaBullets: string[];
    tecnologiaBadge: string;
    contactoWord: string;
    contactoDirections: string;
    footerTag: string;
    heroQuote: string;
    heroQuoteAuthor: string;
  };
};

export type ReportMetric = {
  label: string;
  value: number;
  delta: number;
};

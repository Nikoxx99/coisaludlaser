import "server-only";

import { cache } from "react";

import type {
  AvailabilitySlot,
  BrandImages,
  LandingCopy,
  NavigationSettings,
  Product,
  ProductCategory,
  Review,
  Service,
  ServiceCategory,
  SiteSettings,
  TeamMember,
} from "./types";
import { callTuOdonto } from "./tuodonto-api";

type SiteContent = {
  settings: SiteSettings;
  landing: LandingCopy;
  brandImages: BrandImages;
  navigation: NavigationSettings;
  services: Service[];
  serviceCategories: ServiceCategory[];
  team: TeamMember[];
  availabilitySlots: AvailabilitySlot[];
  reviews: Review[];
  products: Product[];
  productCategories: ProductCategory[];
};

const getContent = cache(async (): Promise<SiteContent> => {
  const response = await callTuOdonto("/api/site/v1/content");
  const payload = (await response.json().catch(() => null)) as
    | { ok?: boolean; content?: SiteContent; error?: string }
    | null;
  if (!response.ok || !payload?.ok || !payload.content) {
    throw new Error(payload?.error || "No se pudo cargar COISalud Láser.");
  }
  return payload.content;
});

export async function getSiteSettings() {
  return (await getContent()).settings;
}
export async function getLandingCopy() {
  return (await getContent()).landing;
}
export async function getBrandImages() {
  return (await getContent()).brandImages;
}
export async function getNavigationSettings() {
  return (await getContent()).navigation;
}
export async function getServices() {
  return (await getContent()).services;
}
export async function getFeaturedServices() {
  return (await getContent()).services.filter((service) => service.featured);
}
export async function getServiceCategories() {
  return (await getContent()).serviceCategories;
}
export async function getTeamMembers() {
  return (await getContent()).team;
}
export async function getAvailabilitySlots() {
  return (await getContent()).availabilitySlots;
}
export async function getApprovedReviews(limit?: number) {
  const reviews = (await getContent()).reviews;
  return typeof limit === "number" ? reviews.slice(0, limit) : reviews;
}
export async function getProducts() {
  return (await getContent()).products;
}
export async function getProductCategories() {
  return (await getContent()).productCategories;
}

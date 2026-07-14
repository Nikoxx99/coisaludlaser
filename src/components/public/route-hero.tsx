import Image from "next/image";

import { GoldOrbit, RiseIn } from "@/components/public/motion";
import { PublicLinkButton } from "@/components/public/link-button";
import type { BrandImageFit } from "@/lib/types";

export function RouteHero({
  eyebrow,
  title,
  copy,
  image,
  imageAlt,
  imageFit = "cover",
  ctaHref = "/citas",
  ctaLabel = "Agendar valoración",
  showPrimary = true,
  showContact = true,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
  imageAlt: string;
  imageFit?: BrandImageFit;
  ctaHref?: string;
  ctaLabel?: string;
  showPrimary?: boolean;
  showContact?: boolean;
}) {
  return (
    <section className="relative min-h-[78svh] overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        loading="eager"
        fetchPriority="high"
        sizes="(min-width: 1024px) calc(100vw - var(--rail-width)), 100vw"
        style={{ objectFit: imageFit }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(245,242,236,.96)_0%,rgba(245,242,236,.76)_38%,rgba(245,242,236,.16)_72%)]" />
      <GoldOrbit className="-right-24 top-12 h-[36rem] w-[36rem] opacity-70" />
      <div className="relative z-10 mx-auto flex min-h-[78svh] max-w-7xl items-end px-[var(--space-page-x)] pb-16 pt-16 md:pb-20">
        <RiseIn className="max-w-3xl">
          <p className="tuodonto-eyebrow">{eyebrow}</p>
          <h1 className="tuodonto-display mt-5 max-w-4xl text-[clamp(3rem,7vw,7rem)] leading-[.88] text-[var(--tuodonto-brown)]">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-[var(--tuodonto-taupe)] md:text-lg">
            {copy}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {showPrimary ? (
              <PublicLinkButton href={ctaHref}>{ctaLabel}</PublicLinkButton>
            ) : null}
            {showContact ? (
              <PublicLinkButton href="/contacto" variant="sky">
                Hablar con el consultorio
              </PublicLinkButton>
            ) : null}
          </div>
        </RiseIn>
      </div>
    </section>
  );
}

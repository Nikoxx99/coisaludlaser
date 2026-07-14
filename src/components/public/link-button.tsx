import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

import { cn } from "@/lib/utils";

type PublicLinkButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "gold" | "sky" | "ghost";
  external?: boolean;
  icon?: "arrow" | "whatsapp" | "none";
};

const variants = {
  gold:
    "tuodonto-gold-fill hover:-translate-y-0.5 hover:shadow-[0_22px_50px_rgba(3,80,225,.3)]",
  sky:
    "tuodonto-sky-fill border border-white/70 text-[var(--tuodonto-brown)] hover:-translate-y-0.5 hover:bg-[var(--tuodonto-sky-strong)]",
  ghost:
    "border border-[var(--tuodonto-line)] bg-white/45 text-[var(--tuodonto-brown)] hover:bg-white/75",
};

export function PublicLinkButton({
  href,
  children,
  className,
  variant = "gold",
  external = false,
  icon = "arrow",
}: PublicLinkButtonProps) {
  const classes = cn(
    "tuodonto-focus inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition-all",
    variants[variant],
    className
  );
  const content = (
    <>
      <span>{children}</span>
      {icon === "arrow" && <ArrowRight className="size-4" aria-hidden="true" />}
      {icon === "whatsapp" && (
        <MessageCircle className="size-4" aria-hidden="true" />
      )}
    </>
  );

  if (external) {
    return (
      <a className={classes} href={href} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <Link className={classes} href={href}>
      {content}
    </Link>
  );
}

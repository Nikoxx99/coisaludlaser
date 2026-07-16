"use client";

import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { gsap, useGSAP } from "./gsap";
import { Hero } from "./hero";
import { MenuOverlay } from "./menu-overlay";
import { StagePanels } from "./panels";
import type { EditorialLandingData } from "./types";

import "./landing.css";

const SCENE_COUNT = 4;

export function LandingEditorial({ data }: { data: EditorialLandingData }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const feedRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeScene, setActiveScene] = useState(0);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scene]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const scene = visible.target as HTMLElement;
        const index = Number(scene.dataset.sceneIndex ?? 0);
        setActiveScene(index);
        const requestedTheme =
          window.innerWidth <= 1023
            ? scene.dataset.mobileTheme ?? scene.dataset.panelTheme
            : scene.dataset.panelTheme;
        setTheme(requestedTheme === "dark" ? "dark" : "light");
      },
      { root: feedRef.current, threshold: [0.45, 0.6, 0.75] }
    );
    scenes.forEach((scene) => observer.observe(scene));
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
      }

      const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
      heroTimeline
        .from(".ed-hero-title > span:not(.sr-only)", {
          yPercent: 110,
          autoAlpha: 0,
          duration: 0.9,
          stagger: 0.055,
        })
        .fromTo(
          ".ed-hero-slash",
          { scaleY: 0, scaleX: 0.45, autoAlpha: 0, transformOrigin: "left bottom" },
          {
            scaleY: 1,
            scaleX: 1.55,
            autoAlpha: 1,
            duration: 0.72,
            stagger: 0.1,
            ease: "expo.out",
          },
          0.72
        )
        .to(
          ".ed-hero-slash",
          { scaleX: 1, duration: 0.35, stagger: 0.06, ease: "back.out(2)" },
          1.26
        )
        .from(".ed-hero-copy", { y: 28, autoAlpha: 0, duration: 0.7 }, 0.45)
        .from(".ed-hero-photo", { clipPath: "inset(0 0 100% 0)", duration: 1 }, 0.1);

      root.querySelectorAll<HTMLElement>("[data-scene]").forEach((scene, index) => {
        if (index > 0) {
          const items = scene.querySelectorAll<HTMLElement>(
            "[data-scene-title], [data-scene-reveal], [data-scene-photo]"
          );
          gsap.from(items, {
            y: 30,
            autoAlpha: 0,
            duration: 0.72,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: {
              trigger: scene,
              scroller: feedRef.current,
              start: "top 62%",
              once: true,
            },
          });
        }

        const parallaxItems = scene.querySelectorAll<HTMLElement>("[data-parallax]");
        parallaxItems.forEach((parallax, parallaxIndex) => {
          gsap.fromTo(
            parallax,
            { yPercent: parallaxIndex % 2 === 0 ? -3 : 3 },
            {
              yPercent: parallaxIndex % 2 === 0 ? 3 : -3,
              ease: "none",
              scrollTrigger: {
                trigger: scene,
                scroller: feedRef.current,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            }
          );
        });
      });

      gsap.to(".ed-orbit", {
        rotation: 360,
        duration: 24,
        repeat: -1,
        ease: "none",
      });
    },
    { scope: rootRef }
  );

  useEffect(() => {
    if (!menuOpen) return;
    const menu = document.getElementById("ed-menu");
    if (!menu) return;
    const focusable = Array.from(
      menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    const menuTrigger = menuButtonRef.current;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    first?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousOverflow;
      menuTrigger?.focus();
    };
  }, [menuOpen]);

  const scrollToScene = useCallback((index: number) => {
    rootRef.current
      ?.querySelector<HTMLElement>(`[data-scene-index="${index}"]`)
      ?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
  }, []);

  return (
    <div ref={rootRef} className="ed-root" data-theme={theme}>
      <header
        className={theme === "dark" ? "ed-topbar is-dark" : "ed-topbar"}
        aria-hidden={menuOpen}
        inert={menuOpen ? true : undefined}
      >
        <Link href="/" className="ed-logo" aria-label={data.brand.name}>
          {data.brand.logoUrl ? (
            <Image
              src={data.brand.logoUrl}
              alt=""
              width={144}
              height={56}
              sizes="144px"
            />
          ) : (
            <span>{data.brand.name.charAt(0)}</span>
          )}
        </Link>
        <span className="ed-mobile-index" aria-hidden="true">
          <strong>{String(activeScene + 1).padStart(2, "0")}</strong> / 04
        </span>
        <div className="ed-topbar-actions">
          <a className="ed-admin-link" href={data.brand.adminHref}>
            Admin
          </a>
          <button
            ref={menuButtonRef}
            type="button"
            className="ed-menu-button"
            aria-expanded={menuOpen}
            aria-controls="ed-menu"
            onClick={() => setMenuOpen(true)}
          >
            Menú
          </button>
        </div>
      </header>

      {menuOpen ? <MenuOverlay data={data} onClose={() => setMenuOpen(false)} /> : null}

      <nav
        className="ed-progress"
        aria-label="Secciones de la página"
        aria-hidden={menuOpen}
        inert={menuOpen ? true : undefined}
      >
        {Array.from({ length: SCENE_COUNT }, (_, index) => (
          <button
            key={index}
            type="button"
            aria-label={`Ir a ${data.panels.headers[index] ?? `sección ${index + 1}`}`}
            aria-current={activeScene === index ? "step" : undefined}
            className={activeScene === index ? "is-active" : undefined}
            onClick={() => scrollToScene(index)}
          >
            {String(index + 1).padStart(2, "0")}
          </button>
        ))}
      </nav>

      <main
        ref={feedRef}
        className="ed-feed"
        aria-hidden={menuOpen}
        inert={menuOpen ? true : undefined}
      >
        <Hero data={data} />
        <StagePanels data={data} />
      </main>
    </div>
  );
}

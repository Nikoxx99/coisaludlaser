import Image from "next/image";
import Link from "next/link";
import { MoveRight } from "lucide-react";

import type { EditorialLandingData } from "./types";

export function Hero({ data }: { data: EditorialLandingData }) {
  const [titleTop = data.hero.word, titleBottom = ""] = data.hero.word.split("\n");

  return (
    <section
      id="inicio"
      className="ed-scene ed-hero"
      data-scene
      data-scene-index="0"
      data-panel-theme="light"
      data-mobile-theme="light"
      aria-labelledby="ed-hero-title"
    >
      <figure className="ed-hero-photo" data-parallax>
        <Image
          src={data.images.portraitPhoto.src}
          alt={data.images.portraitPhoto.alt}
          fill
          preload
          // Este WebP ya esta optimizado. Servir el original evita que el
          // recorte vertical reciba una variante corta y tenga que ampliarla.
          unoptimized
          sizes="(max-width: 1023px) 100vw, 46vw"
          style={{ objectFit: data.images.portraitPhoto.fit }}
        />
        <span className="ed-hero-slash" aria-hidden="true" />
        <span className="ed-hero-slash ed-hero-slash--cyan" aria-hidden="true" />
      </figure>

      <div className="ed-hero-scrim" aria-hidden="true" />

      <div className="ed-hero-title-wrap">
        <h1
          id="ed-hero-title"
          className="ed-hero-title"
          data-scene-title
          aria-label={data.hero.word.replace("\n", " ")}
        >
          <span className="ed-hero-title-line" aria-hidden="true">
            {titleTop}
          </span>
          {titleBottom ? (
            <span
              className="ed-hero-title-line ed-hero-title-line--matte"
              aria-hidden="true"
              style={{
                backgroundImage: `url(${JSON.stringify(data.images.portraitPhoto.src)})`,
              }}
            >
              {titleBottom}
            </span>
          ) : null}
        </h1>
      </div>

      <div className="ed-hero-copy" data-scene-reveal>
        <p className="ed-hero-lead">
          {data.precision.title}
          {data.precision.accent ? <span>{data.precision.accent}</span> : null}
        </p>
        <p className="ed-hero-support">
          {data.hero.taglineTop}
          {data.hero.taglineBottom ? (
            <>
              <br />
              {data.hero.taglineBottom}
            </>
          ) : null}
        </p>
        {data.hero.ctaHref ? (
          <Link href={data.hero.ctaHref} className="ed-primary-cta">
            <span>{data.hero.ctaLabel}</span>
            <i aria-hidden="true">
              <MoveRight size={24} strokeWidth={1.8} />
            </i>
          </Link>
        ) : null}
      </div>
    </section>
  );
}

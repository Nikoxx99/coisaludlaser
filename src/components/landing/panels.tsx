import Image from "next/image";
import Link from "next/link";
import { MapPin, MoveRight, MoveUpRight } from "lucide-react";

import type { EditorialLandingData } from "./types";

function SceneHeader({ index, label }: { index: string; label: string }) {
  return (
    <header className="ed-scene-header" data-scene-reveal>
      <span>{index}</span>
      <i aria-hidden="true" />
      <strong>{label}</strong>
    </header>
  );
}

export function StagePanels({ data }: { data: EditorialLandingData }) {
  const { images } = data;

  return (
    <>
      <section
        id="sonrisa"
        className="ed-scene ed-sonrisa"
        data-scene
        data-scene-index="1"
        data-panel-theme="dark"
        data-mobile-theme="light"
        aria-labelledby="ed-sonrisa-title"
      >
        <p className="ed-sonrisa-display" aria-hidden="true">
          {data.sonrisa.word}
        </p>

        <div className="ed-sonrisa-copy">
          <SceneHeader index="02" label={data.panels.headers[1] ?? "Sonrisa"} />
          <h2 id="ed-sonrisa-title" data-scene-title>
            {data.sonrisa.kicker} <span>{data.sonrisa.kickerAccent}</span>
          </h2>

          {data.sonrisa.treatments.length > 0 ? (
            <ul className="ed-treatment-list" data-scene-reveal>
              {data.sonrisa.treatments.map((treatment) => (
                <li key={treatment.name}>
                  <Link href={treatment.href}>
                    <span>{treatment.name}</span>
                    <MoveRight size={22} strokeWidth={1.6} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : null}

          {data.sonrisa.exploreHref ? (
            <Link
              href={data.sonrisa.exploreHref}
              className="ed-text-link"
              data-scene-reveal
            >
              {data.sonrisa.exploreLabel}
              <MoveRight size={20} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          ) : null}
        </div>

        <div className="ed-sonrisa-product" data-parallax aria-hidden="true">
          <span className="ed-orbit" />
          <Image
            src={images.aligner.src}
            alt=""
            width={666}
            height={628}
            quality={75}
            sizes="(max-width: 1023px) 44vw, 27vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <figure className="ed-sonrisa-team" data-scene-photo>
          <Image
            src={images.teamPhoto.src}
            alt={images.teamPhoto.alt}
            fill
            unoptimized
            sizes="(max-width: 1023px) 100vw, 24vw"
            style={{ objectFit: images.teamPhoto.fit, objectPosition: "48% 20%" }}
          />
        </figure>
      </section>

      <section
        id="tecnologia"
        className="ed-scene ed-tecnologia"
        data-scene
        data-scene-index="2"
        data-panel-theme="dark"
        data-mobile-theme="dark"
        aria-labelledby="ed-tecnologia-title"
      >
        <p className="ed-tecnologia-display" aria-hidden="true">
          {data.tecnologia.title.toUpperCase()}
        </p>

        <div className="ed-tecnologia-copy">
          <SceneHeader index="03" label={data.panels.headers[2] ?? "Tecnología"} />
          <h2 id="ed-tecnologia-title" data-scene-title>
            {data.tecnologia.title}
            <span>{data.tecnologia.accent}</span>
          </h2>
          <p className="ed-tecnologia-lead" data-scene-reveal>
            {data.tecnologia.subTop} {data.tecnologia.subBottom}
          </p>
          <div className="ed-tecnologia-list" data-scene-reveal>
            {data.tecnologia.bullets.slice(0, 2).map((bullet) => (
              <details key={bullet} name="tecnologia-landing">
                <summary>
                  <span aria-hidden="true">+</span>
                  {bullet}
                </summary>
                <p>
                  Configura en el panel qué significa “{bullet}” para tu clínica y
                  publica únicamente información verificada por tu equipo.
                </p>
              </details>
            ))}
          </div>
        </div>

        <figure className="ed-clinic-ribbon" aria-hidden="true">
          <Image
            src={images.clinicRibbon.src}
            alt=""
            fill
            quality={75}
            sizes="100vw"
            style={{ objectFit: images.clinicRibbon.fit }}
          />
        </figure>

        <div className="ed-tecnologia-laser" data-parallax aria-hidden="true">
          <Image
            src={images.laserCutout.src}
            alt=""
            width={1200}
            height={1396}
            quality={75}
            sizes="(max-width: 1023px) 62vw, 33vw"
            style={{ width: "100%", height: "auto" }}
          />
        </div>

        <figure className="ed-tecnologia-portrait" data-scene-photo>
          <Image
            src={images.portrait.src}
            alt={images.portrait.alt}
            fill
            unoptimized
            sizes="(max-width: 1023px) 48vw, 23vw"
            style={{ objectFit: "contain", objectPosition: "bottom center" }}
          />
        </figure>
      </section>

      <section
        id="contacto"
        className="ed-scene ed-contacto"
        data-scene
        data-scene-index="3"
        data-panel-theme="light"
        data-mobile-theme="light"
        aria-labelledby="ed-contacto-title"
      >
        <p className="ed-contacto-display" aria-hidden="true">
          {data.contacto.word}
        </p>

        <div className="ed-contacto-copy">
          <SceneHeader index="04" label={data.panels.headers[3] ?? "Contacto"} />
          <h2 id="ed-contacto-title" data-scene-title>
            {data.contacto.title}
          </h2>
          {data.contacto.ctaHref ? (
            <Link
              href={data.contacto.ctaHref}
              className="ed-contacto-cta"
              data-scene-reveal
            >
              {data.contacto.ctaLabel}
              <MoveRight size={26} strokeWidth={1.8} aria-hidden="true" />
            </Link>
          ) : null}
          <div className="ed-contacto-meta" data-scene-reveal>
            <span>
              <MapPin size={20} strokeWidth={2} aria-hidden="true" />
              {data.brand.address}
            </span>
            <a href={data.brand.mapsHref} target="_blank" rel="noreferrer">
              {data.contacto.directions}
              <MoveUpRight size={17} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>
        </div>

        <figure className="ed-contacto-facade" data-parallax>
          <Image
            src={images.facade.src}
            alt={images.facade.alt}
            fill
            quality={75}
            sizes="(max-width: 1023px) 100vw, 54vw"
            style={{ objectFit: images.facade.fit, objectPosition: "50% 55%" }}
          />
        </figure>

        <figure className="ed-contacto-team" data-scene-photo data-parallax>
          <Image
            src={images.teamPhoto.src}
            alt={images.teamPhoto.alt}
            fill
            unoptimized
            sizes="(max-width: 1023px) 44vw, 19vw"
            style={{ objectFit: images.teamPhoto.fit, objectPosition: "48% 18%" }}
          />
        </figure>

        <footer className="ed-contacto-footer" data-scene-reveal>
          <span className="ed-footer-brand">
            {data.brand.logoUrl ? (
              <Image
                src={data.brand.logoUrl}
                alt=""
                width={144}
                height={56}
                sizes="144px"
              />
            ) : null}
            {data.brand.name}
          </span>
          <span>{data.contacto.footerTag}</span>
        </footer>
      </section>
    </>
  );
}

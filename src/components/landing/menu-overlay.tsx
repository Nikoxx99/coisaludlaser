import Link from "next/link";

import type { EditorialLandingData } from "./types";

export function MenuOverlay({
  data,
  onClose,
}: {
  data: EditorialLandingData;
  onClose: () => void;
}) {
  return (
    <div
      id="ed-menu"
      className="ed-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menú"
    >
      <button type="button" className="ed-menu-close" onClick={onClose}>
        Cerrar
      </button>
      <ul className="ed-menu-list">
        {data.nav.map((item, index) => (
          <li key={item.href} className="ed-menu-item">
            <Link
              href={item.href}
              className="ed-menu-link"
              onClick={onClose}
            >
              <small>{String(index + 1).padStart(2, "0")}</small>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="ed-menu-foot">
        <span>{data.brand.address}</span>
        <a href={`tel:${data.brand.phone}`}>{data.brand.phone}</a>
        <a href={data.brand.whatsappHref} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
      </div>
    </div>
  );
}

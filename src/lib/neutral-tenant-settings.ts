import type { NavigationSettings } from "./types";

export const NEUTRAL_NAVIGATION_SETTINGS: NavigationSettings = {
  public: {
    nosotros: true,
    servicios: true,
    tienda: false,
    citas: true,
    contacto: true,
    valora: true,
  },
  admin: {
    citas: false,
    servicios: false,
    pedidos: false,
    reportes: false,
    inbox: false,
    equipo: false,
    tienda: false,
    resenas: false,
  },
};

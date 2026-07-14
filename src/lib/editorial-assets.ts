const optimizedEditorialAssets: Readonly<Record<string, string>> = {
  "/assets/editorial/doctor-frontal.webp":
    "/assets/editorial/v3-portrait-standing.webp",
  "/assets/editorial/doctor-standing.webp":
    "/assets/editorial/v3-portrait-standing.webp",
  "/assets/editorial/v2-portrait-cutout.webp":
    "/assets/editorial/v3-portrait-standing.webp",
  "/assets/editorial/v3-portrait-full.webp":
    "/assets/editorial/v3-portrait-standing.webp",
  "/assets/editorial/doctor-frontal-photo.webp":
    "/assets/editorial/v2-portrait-photo.webp",
  "/assets/editorial/team-photo.webp": "/assets/editorial/v2-team-photo.webp",
  "/assets/editorial/laser.webp": "/assets/editorial/v2-laser-cutout.webp",
  "/assets/editorial/clinic-ribbon.webp":
    "/assets/editorial/v2-clinic-ribbon.webp",
  "/assets/editorial/facade-panel.webp": "/assets/editorial/v2-facade.webp",
};

/**
 * Keeps tenant uploads untouched while replacing bundled legacy artwork with
 * responsive, production-sized equivalents.
 */
export function getOptimizedEditorialAsset(src: string): string {
  return optimizedEditorialAssets[src] ?? src;
}

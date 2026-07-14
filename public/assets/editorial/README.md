# Editorial motion assets

Production assets extracted from the real photography used by the approved
desktop and mobile mocks. PNG files are lossless RGBA sources; WebP siblings
are the browser-ready versions.

## Floating layers

- `doctor-standing`: primary hero portrait; use for the opening pinned scene.
- `doctor-frontal`: alternate portrait for the dark technology scene.
- `doctor-frontal-bust`: production-clean portrait mask for Tecnología; prefer
  this over the full frontal extraction.
- `team`: two-person layer for Sonrisa and Contacto.
- `laser`: foreground parallax object for Tecnología.
- `aligner`: floating product object for Sonrisa.

Each floating layer includes `.png` and `.webp`. Animate wrappers rather than
the image itself so `clip-path`, transforms and shadows remain independent.

## Photo planes

- `clinic.webp`: full consultorio plane.
- `clinic-ribbon.webp`: panoramic strip for horizontal scrub.
- `facade.webp` / `facade-panel.webp`: Contacto architectural layer.
- `team-photo.webp`: sharp rectangular team inset.
- `doctor-frontal-photo.webp`: fallback when a masked photo plane is preferable
  to a transparent cutout.
- `laser-photo.webp` and `aligner-photo.webp`: source photography for masks.

## Vector motion pieces

- `orbit.svg`: rotating technical orbit.
- `cross.svg`: registration mark.
- `arrow-right.svg` and `arrow-up-right.svg`: CTA arrows.
- `location-pin.svg`: location marker.

All SVG strokes use `currentColor`, so color can be controlled from CSS.

## Rebuild

From `web/`:

```sh
uv run --python 3.12 --with 'rembg[cpu]' python scripts/extract_mock_assets.py
```

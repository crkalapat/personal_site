// One-off: turn the logo (shapes on a black background) into favicons.
//   node scripts/make-favicon.mjs path/to/logo.png
// - favicon-32.png / favicon-192.png: black keyed out to transparency, tightly cropped.
// - apple-touch-icon.png (180×180): keeps the black background (iOS fills transparency with black anyway).
import sharp from "sharp";

const src = process.argv[2];
if (!src) throw new Error("usage: node scripts/make-favicon.mjs <logo.png>");

// Pixels darker than this (max channel) fade to transparent; anything brighter is fully opaque.
const RAMP = 40;

const { data, info } = await sharp(src).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const rgba = Buffer.alloc(width * height * 4);
let x0 = width, y0 = height, x1 = -1, y1 = -1;

for (let i = 0, p = 0; i < data.length; i += 3, p += 4) {
  const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
  const a = Math.min(1, Math.max(r, g, b) / RAMP);
  // "Un-blend" anti-aliased edge pixels from black so they don't leave a dark fringe.
  const k = a > 0 ? 1 / a : 0;
  rgba[p] = Math.min(255, r * k);
  rgba[p + 1] = Math.min(255, g * k);
  rgba[p + 2] = Math.min(255, b * k);
  rgba[p + 3] = Math.round(a * 255);
  if (a > 0.05) {
    const x = (p / 4) % width, y = Math.floor(p / 4 / width);
    x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
  }
}

// Square crop around the shape with a small margin.
const side = Math.round(Math.max(x1 - x0, y1 - y0) * 1.04);
const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
const left = Math.round(cx - side / 2), top = Math.round(cy - side / 2);
// Pad first (separate pipeline — sharp would otherwise extract before extending).
const padded = await sharp(rgba, { raw: { width, height, channels: 4 } })
  .extend({ top: side, bottom: side, left: side, right: side, background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();
const square = await sharp(padded)
  .extract({ left: left + side, top: top + side, width: side, height: side })
  .png()
  .toBuffer();

for (const size of [32, 192]) {
  const out = `public/favicon-${size}.png`;
  const r = await sharp(square).resize(size, size, { kernel: "lanczos3" }).png({ compressionLevel: 9 }).toFile(out);
  console.log(out, `${r.width}×${r.height}`, `${(r.size / 1024).toFixed(1)} KB`);
}

const inner = await sharp(square).resize(150, 150).png().toBuffer();
const touch = await sharp({ create: { width: 180, height: 180, channels: 4, background: "#000" } })
  .composite([{ input: inner, gravity: "center" }])
  .png({ compressionLevel: 9 })
  .toFile("public/apple-touch-icon.png");
console.log("public/apple-touch-icon.png", `${touch.width}×${touch.height}`, `${(touch.size / 1024).toFixed(1)} KB`);

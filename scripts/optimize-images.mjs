// One-off: convert project photos to web-sized WebP.
//   node scripts/optimize-images.mjs src/assets/projects/*.png
// Writes <name>.webp next to each input (max 1200px long edge, quality ~80),
// stepping quality down if a file is still over the size budget.
import sharp from "sharp";
import { stat } from "node:fs/promises";

const MAX_EDGE = 1200;
const BUDGET = 150 * 1024;

const kb = (n) => `${(n / 1024).toFixed(0)} KB`;
let before = 0;
let after = 0;

for (const input of process.argv.slice(2)) {
  const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
  const inBytes = (await stat(input)).size;

  let quality = 80;
  let info;
  for (;;) {
    info = await sharp(input)
      .rotate() // respect EXIF orientation from phone photos
      .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toFile(output);
    if (info.size <= BUDGET || quality <= 50) break;
    quality -= 5;
  }

  before += inBytes;
  after += info.size;
  console.log(`${output}  ${info.width}×${info.height}  q${quality}  ${kb(inBytes)} → ${kb(info.size)}`);
}

console.log(`TOTAL  ${kb(before)} → ${kb(after)}`);

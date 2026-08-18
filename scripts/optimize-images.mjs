// scripts/optimize-images.mjs
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = "src/demo-second-dental/images";
const files = (await readdir(dir)).filter((f) => f.endsWith(".png"));

for (const file of files) {
  const out = path.join(dir, file.replace(/\.png$/, ".webp"));
  const info = await sharp(path.join(dir, file))
    .resize({ width: 2000, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out);
  console.log(`${file} → ${path.basename(out)}  ${(info.size / 1024).toFixed(0)} KB`);
}
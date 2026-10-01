import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const logo = await readFile(
  new URL("../public/brand/qblogo.svg", import.meta.url),
);
const base = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f5f3ec"/>
  <text x="64" y="80" font-family="Arial" font-size="31" font-weight="bold" fill="#252622">quackbytes.</text>
  <text x="64" y="158" font-family="Arial" font-size="12" letter-spacing="2" fill="#686960">INDEPENDENT SOFTWARE STUDIO</text>
  <text x="58" y="273" font-family="Arial" font-size="83" letter-spacing="-4" fill="#252622">Software for</text>
  <text x="58" y="370" font-family="Georgia" font-style="italic" font-size="88" letter-spacing="-4" fill="#bd4a2b">oddly specific</text>
  <text x="58" y="467" font-family="Arial" font-size="83" letter-spacing="-4" fill="#252622">problems.</text>
  <text x="64" y="570" font-family="Arial" font-size="17" fill="#686960">Small by design. Specific by nature.</text>
  <path d="M768 403h30v-30h60v-20h180v20h60v30h30v60h-30v30h-60v20H858v-20h-60v-30h-30z" fill="none" stroke="#c7d9db" stroke-width="14"/>
  <path d="M811 416h30v-22h65v-14h90v14h65v22h30v32h-30v22h-65v14h-90v-14h-65v-22h-30z" fill="none" stroke="#8fb6bf" stroke-width="12"/>
</svg>`;
await sharp(Buffer.from(base))
  .composite([
    {
      input: await sharp(logo).resize(216, 192).png().toBuffer(),
      left: 843,
      top: 242,
    },
  ])
  .png()
  .toFile(
    fileURLToPath(new URL("../src/app/opengraph-image.png", import.meta.url)),
  );
await sharp(logo)
  .resize(180, 180, { fit: "contain", background: "#f5f3ec" })
  .png()
  .toFile(fileURLToPath(new URL("../src/app/apple-icon.png", import.meta.url)));
console.log(
  "Created local social preview and Apple icon from the supplied logo.",
);

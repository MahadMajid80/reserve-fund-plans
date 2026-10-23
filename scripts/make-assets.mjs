// Generates the favicon, logo PNG, Apple touch icon and Open Graph image from SVG.
// Needs the Fraunces and Instrument Sans fonts installed on the machine (only for regenerating; outputs are committed).
import sharp from "sharp";
import { writeFileSync } from "node:fs";

const mark = (s = 1) => `
  <rect width="${40 * s}" height="${40 * s}" rx="${3 * s}" fill="#1f4a40"/>
  <g fill="#f7f4ec" transform="scale(${s})">
    <rect x="8" y="24" width="3.5" height="6"/><rect x="13.5" y="21" width="3.5" height="9"/>
    <rect x="19" y="18" width="3.5" height="12"/><rect x="24.5" y="14" width="3.5" height="16"/>
  </g>
  <g transform="scale(${s})"><rect x="30" y="9" width="3.5" height="21" fill="#e07a4b"/>
  <rect x="7" y="31.5" width="27.5" height="1.5" fill="#f7f4ec" opacity=".55"/></g>`;

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">${mark()}</svg>`;
writeFileSync("public/favicon.svg", favicon);
await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180"><rect width="180" height="180" fill="#1f4a40"/><g transform="translate(18 18) scale(3.6)">${mark()}</g></svg>`)).png().toFile("public/apple-touch-icon.png");

const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="200" viewBox="0 0 1040 200">
  <g transform="translate(20 20) scale(4)">${mark()}</g>
  <text x="210" y="112" font-family="Fraunces" font-weight="600" font-size="84" fill="#1f4a40" letter-spacing="-1">Reserve Fund Plans</text>
  <text x="214" y="160" font-family="Instrument Sans" font-weight="600" font-size="26" fill="#5e6762" letter-spacing="4">STRATA COMPLIANCE · WESTERN AUSTRALIA</text>
</svg>`;
await sharp(Buffer.from(logo)).png().toFile("public/logo.png");

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="#f7f4ec"/>
  <rect x="0" y="0" width="1200" height="12" fill="#b5562e"/>
  <g transform="translate(80 90) scale(2.2)">${mark()}</g>
  <text x="80" y="300" font-family="Fraunces" font-weight="500" font-size="74" fill="#12302a" letter-spacing="-1">Plan the next ten years</text>
  <text x="80" y="385" font-family="Fraunces" font-weight="500" font-size="74" fill="#12302a" letter-spacing="-1">of your <tspan fill="#b5562e" font-style="italic">strata scheme.</tspan></text>
  <text x="80" y="470" font-family="Instrument Sans" font-size="30" fill="#3f4843">10-year reserve fund plans · Insurance valuations · WHS · Asbestos</text>
  <line x1="80" y1="530" x2="1120" y2="530" stroke="#1b201e" stroke-opacity=".15"/>
  <text x="80" y="580" font-family="Fraunces" font-weight="600" font-size="34" fill="#1f4a40">Reserve Fund Plans</text>
  <text x="1120" y="580" text-anchor="end" font-family="Instrument Sans" font-weight="600" font-size="26" fill="#5e6762">Perth, Western Australia · Since 1984</text>
  ${[0,1,2,3,4,5,6,7,8,9].map(i=>`<rect x="${760+i*36}" y="${150-i*9}" width="22" height="${30+i*9}" fill="${i===9?'#b5562e':'#9db3a5'}" opacity="${0.5+i*0.05}"/>`).join("")}
</svg>`;
await sharp(Buffer.from(og)).png().toFile("public/og-image.png");
console.log("assets written");

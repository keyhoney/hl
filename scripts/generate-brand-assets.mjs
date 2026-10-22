import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const publicDir = path.resolve('public');
fs.mkdirSync(publicDir, { recursive: true });

const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1"/>
      <stop offset="1" stop-color="#3730a3"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#bg)"/>
  <rect x="10" y="16" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="28" y="16" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="18" y="29" width="10" height="7" rx="2" fill="#ffffff"/>
  <rect x="42" y="16" width="7" height="32" rx="2" fill="#c7d2fe"/>
  <rect x="42" y="41" width="13" height="7" rx="2" fill="#c7d2fe"/>
</svg>`;

const appleTouchSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="8" y1="4" x2="56" y2="60" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1"/>
      <stop offset="1" stop-color="#3730a3"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" fill="url(#bg)"/>
  <rect x="10" y="16" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="28" y="16" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="18" y="29" width="10" height="7" rx="2" fill="#ffffff"/>
  <rect x="42" y="16" width="7" height="32" rx="2" fill="#c7d2fe"/>
  <rect x="42" y="41" width="13" height="7" rx="2" fill="#c7d2fe"/>
</svg>`;

const ogLogoTile = `
  <rect x="72" y="64" width="64" height="64" rx="16" fill="url(#tile)"/>
  <rect x="82" y="80" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="100" y="80" width="8" height="32" rx="2" fill="#ffffff"/>
  <rect x="90" y="93" width="10" height="7" rx="2" fill="#ffffff"/>
  <rect x="114" y="80" width="7" height="32" rx="2" fill="#c7d2fe"/>
  <rect x="114" y="105" width="13" height="7" rx="2" fill="#c7d2fe"/>
`;

const ogImageSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#1e1b4b"/>
      <stop offset="0.55" stop-color="#312e81"/>
      <stop offset="1" stop-color="#0f172a"/>
    </linearGradient>
    <radialGradient id="glow" cx="0" cy="0" r="1" gradientTransform="translate(1010 90) rotate(135) scale(430)" gradientUnits="userSpaceOnUse">
      <stop stop-color="#6366f1" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#6366f1" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="tile" x1="72" y1="64" x2="136" y2="128" gradientUnits="userSpaceOnUse">
      <stop stop-color="#818cf8"/>
      <stop offset="1" stop-color="#4338ca"/>
    </linearGradient>
    <linearGradient id="card" x1="760" y1="120" x2="1140" y2="510" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.11"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0.035"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect width="1200" height="630" fill="url(#glow)"/>
  <circle cx="1140" cy="70" r="210" fill="none" stroke="#ffffff" stroke-opacity="0.08"/>
  <circle cx="1140" cy="70" r="150" fill="none" stroke="#ffffff" stroke-opacity="0.06"/>

  ${ogLogoTile}
  <text x="152" y="110" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="34" font-weight="800" letter-spacing="-1">
    <tspan fill="#a5b4fc">How</tspan><tspan fill="#ffffff">Learn</tspan>
  </text>

  <text x="72" y="190" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="17" font-weight="700" letter-spacing="2" fill="#a5b4fc">수능 수학 4점 기출 학습 아카이브</text>

  <text x="72" y="278" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="56" font-weight="800" letter-spacing="-2" fill="#ffffff">한 문제를,</text>
  <text x="72" y="346" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="56" font-weight="800" letter-spacing="-2" fill="#ffffff">여러 관점으로.</text>

  <text x="72" y="410" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="24" font-weight="500" letter-spacing="-0.5" fill="#cbd5e1">정석 풀이 · 스킬 풀이 · 단계별 힌트</text>

  <g font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="16" font-weight="700">
    <rect x="72" y="462" width="142" height="42" rx="21" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="143" y="489" text-anchor="middle" fill="#e0e7ff">KICE 기출</text>
    <rect x="228" y="462" width="122" height="42" rx="21" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="289" y="489" text-anchor="middle" fill="#e0e7ff">4점 문항</text>
    <rect x="364" y="462" width="164" height="42" rx="21" fill="#ffffff" fill-opacity="0.07" stroke="#ffffff" stroke-opacity="0.12"/>
    <text x="446" y="489" text-anchor="middle" fill="#e0e7ff">단계별 힌트</text>
  </g>

  <text x="72" y="566" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="18" font-weight="600" letter-spacing="0.5" fill="#94a3b8">howlearn.kr</text>

  <rect x="748" y="112" width="380" height="406" rx="32" fill="url(#card)" stroke="#ffffff" stroke-opacity="0.14"/>

  <g stroke="#ffffff" stroke-opacity="0.08">
    <path d="M788 172H1088M788 232H1088M788 292H1088M788 352H1088M788 412H1088"/>
    <path d="M848 142V472M908 142V472M968 142V472M1028 142V472"/>
  </g>

  <path d="M812 442H1064M812 442V162" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round"/>
  <path d="M1052 434L1064 442L1052 450" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M804 174L812 162L820 174" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>

  <path d="M828 390C860 390 872 300 908 300C944 300 952 368 980 368C1008 368 1016 250 1048 250" fill="none" stroke="#a5b4fc" stroke-width="5" stroke-linecap="round"/>
  <path d="M858 430L1020 214" stroke="#fbbf24" stroke-width="3" stroke-dasharray="9 9" stroke-linecap="round" opacity="0.9"/>
  <circle cx="980" cy="368" r="17" fill="#fbbf24" fill-opacity="0.18"/>
  <circle cx="980" cy="368" r="8" fill="#fbbf24"/>

  <text x="1048" y="226" font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="18" font-weight="700" text-anchor="end" fill="#c7d2fe">f(x)</text>
  <g font-family="Noto Sans KR, Malgun Gothic, sans-serif" font-size="15" font-weight="700">
    <rect x="818" y="478" width="150" height="34" rx="17" fill="#fbbf24" fill-opacity="0.12" stroke="#fbbf24" stroke-opacity="0.25"/>
    <text x="893" y="500" text-anchor="middle" fill="#fde68a">접점 · 극값</text>
  </g>
</svg>`;

function createIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const entries = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of pngBuffers) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2);
    entry.writeUInt8(0, 3);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(buffer.length, 8);
    entry.writeUInt32LE(offset, 12);
    entries.push(entry);
    offset += buffer.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers.map((item) => item.buffer)]);
}

async function main() {
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), faviconSvg);

  const sizes = [16, 32, 48];
  const icoPngs = [];

  for (const size of sizes) {
    const buffer = await sharp(Buffer.from(faviconSvg))
      .resize(size, size)
      .png()
      .toBuffer();
    icoPngs.push({ size, buffer });

    if (size === 16 || size === 32) {
      fs.writeFileSync(path.join(publicDir, `favicon-${size}x${size}.png`), buffer);
    }
  }

  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createIco(icoPngs));

  await sharp(Buffer.from(appleTouchSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  await sharp(Buffer.from(ogImageSvg))
    .png({ compressionLevel: 9 })
    .toFile(path.join(publicDir, 'og-image.png'));

  console.log('Generated favicon.svg, favicon.ico, favicon PNGs, apple-touch-icon.png, og-image.png');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

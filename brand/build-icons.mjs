// Regenerates every logo / icon / social-preview asset in /public from
// brand/abkhd-logo-original.png. Run: node brand/build-icons.mjs
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const pub = join(here, '..', 'public');
const src = join(here, 'abkhd-logo-original.png');

const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

// Crop the empty margin once; everything below starts from the tight mark.
const tight = await sharp(src).trim({ threshold: 5 }).png().toBuffer();

/** Mark centred on a size x size square, `pad` = fraction of the side kept clear. */
async function square(size, { pad = 0.06, background = CLEAR } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const mark = await sharp(tight)
    .resize(inner, inner, { fit: 'contain', background: CLEAR, kernel: 'lanczos3' })
    .toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: 'centre' }])
    .png({ compressionLevel: 9 })
    .toBuffer();
}

const out = (name, buf) => writeFileSync(join(pub, name), buf);

// Site logo (nav / footer / receipt): tight crop, transparent, 2x of a 48px slot.
out('logo.png', await sharp(tight).resize({ height: 192, kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer());
// Larger master for schema.org / partners.
out('logo-512.png', await sharp(tight).resize({ height: 512, kernel: 'lanczos3' }).png({ compressionLevel: 9 }).toBuffer());

// Favicons (transparent, minimal padding so the mark stays legible when tiny).
const f16 = await square(16, { pad: 0.02 });
const f32 = await square(32, { pad: 0.03 });
const f48 = await square(48, { pad: 0.03 });
out('favicon-16x16.png', f16);
out('favicon-32x32.png', f32);
out('favicon-48x48.png', f48);

// favicon.ico (PNG-compressed frames: 16, 32, 48)
const frames = [[16, f16], [32, f32], [48, f48]];
const head = Buffer.alloc(6); head.writeUInt16LE(1, 2); head.writeUInt16LE(frames.length, 4);
let offset = 6 + frames.length * 16;
const dir = [], data = [];
for (const [s, buf] of frames) {
  const e = Buffer.alloc(16);
  e.writeUInt8(s, 0); e.writeUInt8(s, 1); e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
  e.writeUInt32LE(buf.length, 8); e.writeUInt32LE(offset, 12);
  dir.push(e); data.push(buf); offset += buf.length;
}
out('favicon.ico', Buffer.concat([head, ...dir, ...data]));

// iOS ignores transparency (paints black), so give it a white tile.
out('apple-touch-icon.png', await square(180, { pad: 0.1, background: WHITE }));
// Android / PWA
out('android-chrome-192x192.png', await square(192, { pad: 0.08, background: WHITE }));
out('android-chrome-512x512.png', await square(512, { pad: 0.08, background: WHITE }));
// Maskable: launcher may crop to a circle, so keep the mark in the central 80%.
out('maskable-512x512.png', await square(512, { pad: 0.2, background: WHITE }));

// Social preview 1200x630 (what WhatsApp / X / Facebook / LinkedIn show).
const W = 1200, H = 630;
const mark = await sharp(tight).resize({ height: 520, kernel: 'lanczos3' }).toBuffer();
const markMeta = await sharp(mark).metadata();
const text = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <text x="600" y="290" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="96" font-weight="700" fill="#0f172a">ABKHD</text>
  <text x="604" y="352" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="40" fill="#475569">Premium tech at smarter prices</text>
  <text x="604" y="410" font-family="Segoe UI, Arial, Helvetica, sans-serif" font-size="28" fill="#64748b">Tested &amp; certified devices · Yola, Nigeria</text>
</svg>`);
out('og-image.png', await sharp({ create: { width: W, height: H, channels: 4, background: WHITE } })
  .composite([
    { input: mark, left: Math.round(300 - markMeta.width / 2), top: Math.round((H - markMeta.height) / 2) },
    { input: text, left: 0, top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toBuffer());

console.log('done');

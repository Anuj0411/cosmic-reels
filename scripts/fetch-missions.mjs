import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal astronomy still catalog; educational)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/missions");

const nasa = (id) => [
  `https://images-assets.nasa.gov/image/${id}/${id}~orig.jpg`,
  `https://images-assets.nasa.gov/image/${id}/${id}~large.jpg`,
];
const jpl = (id) => [
  `https://photojournal.jpl.nasa.gov/jpegOrig/${id}.jpg`,
  `https://photojournal.jpl.nasa.gov/jpeg/${id}.jpg`,
  `https://images-assets.nasa.gov/image/${id}/${id}~orig.jpg`,
];

const ITEMS = [
  {
    id: "hubble-orbit",
    urls: [
      "https://upload.wikimedia.org/wikipedia/commons/3/3f/HST-SM4.jpeg",
      "https://upload.wikimedia.org/wikipedia/commons/a/a0/Hubble_01.jpg",
      ...nasa("s125e007073"),
      ...nasa("S125-E-007073"),
      ...nasa("sts103-703-028"),
      ...nasa("iss064e029015"),
    ],
  },
  {
    id: "mars-jezero",
    urls: [
      "https://upload.wikimedia.org/wikipedia/commons/d/d8/PIA16239_Curiosity_at_Yellowknife_Bay.jpg",
      "https://upload.wikimedia.org/wikipedia/commons/5/56/PIA17944-MarsCuriosityRover-MountSharp-20140320.jpg",
      "https://mars.nasa.gov/system/resources/detail_files/25058_PIA24422-web.jpg",
      ...jpl("PIA16239"),
      ...jpl("PIA17944"),
    ],
  },
  {
    id: "earthrise",
    urls: [
      "https://upload.wikimedia.org/wikipedia/commons/a/a8/NASA-Apollo8-Dec24-Earthrise.jpg",
      ...nasa("as08-14-2383"),
      ...nasa("AS08-14-2383"),
    ],
  },
  {
    id: "pluto",
    urls: [
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Pluto_in_True_Color_-_High-Res.jpg",
      ...jpl("PIA19952"),
      ...jpl("PIA20732"),
      ...nasa("PIA19952"),
    ],
  },
];

const tryUrl = async (url) => {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/jpeg,image/*,*/*" },
    redirect: "follow",
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 80_000) return null;
  if (buf[0] !== 0xff || buf[1] !== 0xd8) return null;
  return buf;
};

const saveJpeg = async (id, buf) => {
  const raw = path.join(OUT, `${id}.raw.jpg`);
  const final = path.join(OUT, `${id}.jpg`);
  await fs.writeFile(raw, buf);
  await exec("sips", [
    "-Z",
    "4096",
    "-s",
    "format",
    "jpeg",
    "-s",
    "formatOptions",
    "90",
    raw,
    "--out",
    final,
  ]);
  await fs.unlink(raw).catch(() => undefined);
  const { stdout } = await exec("sips", ["-g", "pixelWidth", "-g", "pixelHeight", final]);
  const width = Number(/pixelWidth:\s+(\d+)/.exec(stdout)?.[1] ?? 0);
  const height = Number(/pixelHeight:\s+(\d+)/.exec(stdout)?.[1] ?? 0);
  const stat = await fs.stat(final);
  return { width, height, bytes: stat.size };
};

const main = async () => {
  await fs.mkdir(OUT, { recursive: true });
  for (const item of ITEMS) {
    process.stdout.write(`mission ${item.id} ... `);
    let hit = null;
    for (const url of item.urls) {
      try {
        const buf = await tryUrl(url);
        if (buf) {
          hit = { url, buf };
          break;
        }
      } catch {
        /* next */
      }
    }
    if (!hit) {
      console.log("miss");
      continue;
    }
    const dims = await saveJpeg(item.id, hit.buf);
    console.log(
      `${dims.width}x${dims.height} ${(dims.bytes / 1e6).toFixed(1)}MB <- ${hit.url.split("/").pop()}`,
    );
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

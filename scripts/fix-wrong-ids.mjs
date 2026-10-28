import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal astronomy still catalog; educational)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/deep");

const hubble = (id) => [
  `https://cdn.esahubble.org/archives/images/publicationjpg/${id}.jpg`,
  `https://cdn.esahubble.org/archives/images/large/${id}.jpg`,
];
const eso = (id) => [
  `https://cdn.eso.org/images/publicationjpg/${id}.jpg`,
  `https://cdn.eso.org/images/large/${id}.jpg`,
];

const ITEMS = [
  {
    id: "ngc-1097",
    urls: [...eso("eso0438d"), ...hubble("potw2211a"), ...hubble("potw1252a")],
  },
  {
    id: "ngc-2207",
    urls: [...hubble("heic2414a"), ...hubble("opo9941a")],
  },
  {
    id: "ngc-3314",
    urls: [...hubble("heic1208a"), ...hubble("opo0014a")],
  },
  {
    id: "ngc-4214",
    urls: [...hubble("heic1109a"), ...hubble("opo0001a")],
  },
  {
    id: "ngc-4921",
    urls: [...hubble("heic0901a")],
  },
  {
    id: "ngc-7049",
    urls: [...hubble("heic0905a")],
  },
];

const tryUrl = async (url) => {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, Accept: "image/jpeg,image/*,*/*" },
  });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 80_000) return null;
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
    process.stdout.write(`fix ${item.id} ... `);
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

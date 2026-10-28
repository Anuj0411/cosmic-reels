import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal astronomy still catalog; educational)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/deep");

const FIX = [
  {
    id: "cone-nebula",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/opo0234a.jpg",
      "https://cdn.esahubble.org/archives/images/large/opo0234a.jpg",
      "https://cdn.eso.org/images/large/eso1640a.jpg",
    ],
  },
  {
    id: "jellyfish",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic1404a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic1404a.jpg",
      "https://cdn.esahubble.org/archives/images/publicationjpg/potw1734a.jpg",
      "https://cdn.esahubble.org/archives/images/large/potw1734a.jpg",
    ],
  },
  {
    id: "sculptor-galaxy",
    urls: [
      "https://cdn.eso.org/images/publicationjpg/potw1017a.jpg",
      "https://cdn.eso.org/images/large/potw1017a.jpg",
      "https://cdn.eso.org/images/large/eso1420a.jpg",
    ],
  },
  {
    id: "ngc-1097",
    urls: [
      "https://cdn.eso.org/images/publicationjpg/eso0438d.jpg",
      "https://cdn.eso.org/images/large/eso0438d.jpg",
      "https://cdn.esahubble.org/archives/images/publicationjpg/potw2211a.jpg",
    ],
  },
  {
    id: "eskimo",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/potw2037a.jpg",
      "https://cdn.esahubble.org/archives/images/large/potw2037a.jpg",
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic9910a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic9910a.jpg",
    ],
  },
  {
    id: "rosette",
    urls: [
      "https://cdn.eso.org/images/large/potw1847a.jpg",
      "https://cdn.eso.org/images/publicationjpg/potw1847a.jpg",
      "https://cdn.eso.org/images/large/b12.jpg",
    ],
  },
  {
    id: "abell-370",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic1714a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic1714a.jpg",
    ],
  },
  {
    id: "ngc-1309",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic0603a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic0603a.jpg",
    ],
  },
  {
    id: "ngc-1365",
    urls: [
      "https://cdn.eso.org/images/large/eso1243a.jpg",
      "https://cdn.eso.org/images/publicationjpg/eso1243a.jpg",
      "https://cdn.eso.org/images/large/eso1038a.jpg",
      "https://cdn.esahubble.org/archives/images/publicationjpg/potw2138a.jpg",
    ],
  },
  {
    id: "penguin",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic1311a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic1311a.jpg",
    ],
  },
  {
    id: "retina",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic0206a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic0206a.jpg",
    ],
  },
  {
    id: "ngc-2207",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic2414a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic2414a.jpg",
      "https://cdn.esahubble.org/archives/images/publicationjpg/opo9941a.jpg",
    ],
  },
  {
    id: "ngc-3314",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic1208a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic1208a.jpg",
    ],
  },
  {
    id: "ngc-7049",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic0905a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic0905a.jpg",
    ],
  },
  {
    id: "ngc-4921",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic0901a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic0901a.jpg",
    ],
  },
  {
    id: "ngc-4214",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic1109a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic1109a.jpg",
    ],
  },
  {
    id: "spindle",
    urls: [
      "https://cdn.esahubble.org/archives/images/publicationjpg/heic0611a.jpg",
      "https://cdn.esahubble.org/archives/images/large/heic0611a.jpg",
    ],
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
  for (const item of FIX) {
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

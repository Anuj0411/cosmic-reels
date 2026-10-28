import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal astronomy still catalog; educational)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/deep");

const ITEMS = [
  { id: "cas-a", title: "Cassiopeia A", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2311a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2311a.jpg",
  ]},
  { id: "ic-348", title: "IC 348", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2325a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2325a.jpg",
  ]},
  { id: "hh-46", title: "HH 46/47", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2306a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2306a.jpg",
  ]},
  { id: "wr-140", title: "WR 140", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2414a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2414a.jpg",
  ]},
  { id: "ngc-1514", title: "NGC 1514", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2413a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2413a.jpg",
  ]},
  { id: "n79", title: "N79", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2406a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2406a.jpg",
  ]},
  { id: "uranus", title: "Uranus", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2327a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2327a.jpg",
  ]},
  { id: "pandoras-cluster", title: "Pandora's Cluster", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2213a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2213a.jpg",
  ]},
  { id: "arp-107", title: "Arp 107", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2408a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2408a.jpg",
  ]},
  { id: "ngc-604", title: "NGC 604", credit: "NASA / ESA / CSA / JWST", urls: [
    "https://cdn.esawebb.org/archives/images/publicationjpg/weic2407a.jpg",
    "https://cdn.esawebb.org/archives/images/large/weic2407a.jpg",
  ]},
  { id: "eskimo", title: "Clown Face Nebula", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/opo0013a.jpg",
    "https://cdn.esahubble.org/archives/images/large/opo0013a.jpg",
  ]},
  { id: "penguin", title: "The Penguin", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/potw1347a.jpg",
    "https://cdn.esahubble.org/archives/images/large/potw1347a.jpg",
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1307a.jpg",
  ]},
  { id: "ngc-2207", title: "NGC 2207", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1402a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic1402a.jpg",
  ]},
  { id: "ngc-3314", title: "NGC 3314", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1114a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic1114a.jpg",
    "https://cdn.esahubble.org/archives/images/publicationjpg/opo9933a.jpg",
  ]},
  { id: "retina", title: "Retina Nebula", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0206a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0206a.jpg",
  ]},
  { id: "ngc-7049", title: "NGC 7049", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0706a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0706a.jpg",
  ]},
  { id: "abell-370", title: "Abell 370", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1714a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic1714a.jpg",
  ]},
  { id: "ngc-4921", title: "NGC 4921", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0916a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0916a.jpg",
  ]},
  { id: "ngc-1309", title: "NGC 1309", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0603a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0603a.jpg",
  ]},
  { id: "ngc-4214", title: "NGC 4214", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0905a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0905a.jpg",
  ]},
  { id: "jellyfish", title: "Jellyfish Galaxy", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1708a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic1708a.jpg",
    "https://cdn.esahubble.org/archives/images/publicationjpg/potw1734a.jpg",
  ]},
  { id: "arp-143", title: "Arp 143", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic2201a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic2201a.jpg",
  ]},
  { id: "m106", title: "Messier 106", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1403a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic1403a.jpg",
  ]},
  { id: "centaurus-a", title: "Centaurus A", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic1110a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic1110a.jpg",
  ]},
  { id: "spindle", title: "Spindle Galaxy", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0611a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0611a.jpg",
  ]},
  { id: "cone-nebula", title: "Cone Nebula", credit: "NASA / ESA / Hubble", urls: [
    "https://cdn.esahubble.org/archives/images/publicationjpg/heic0207a.jpg",
    "https://cdn.esahubble.org/archives/images/large/heic0207a.jpg",
    "https://cdn.eso.org/images/large/eso1640a.jpg",
  ]},
  { id: "sculptor-galaxy", title: "Sculptor Galaxy", credit: "ESO / VISTA", urls: [
    "https://cdn.eso.org/images/large/eso0902a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso0902a.jpg",
    "https://cdn.eso.org/images/large/eso1420a.jpg",
  ]},
  { id: "rosette", title: "Rosette Nebula", credit: "ESO", urls: [
    "https://cdn.eso.org/images/large/eso1626a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso1626a.jpg",
    "https://cdn.eso.org/images/large/eso1118a.jpg",
  ]},
  { id: "ngc-1365", title: "NGC 1365", credit: "ESO / VLT", urls: [
    "https://cdn.eso.org/images/large/eso1243a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso1243a.jpg",
    "https://cdn.eso.org/images/large/eso1038a.jpg",
  ]},
  { id: "trifid", title: "Trifid Nebula", credit: "ESO", urls: [
    "https://cdn.eso.org/images/large/eso0930a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso0930a.jpg",
    "https://cdn.eso.org/images/large/eso0617a.jpg",
  ]},
  { id: "swan-nebula", title: "Swan Nebula", credit: "ESO / VST", urls: [
    "https://cdn.eso.org/images/large/eso1119a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso1119a.jpg",
    "https://cdn.eso.org/images/large/eso0619a.jpg",
  ]},
  { id: "ngc-1097", title: "NGC 1097", credit: "ESO", urls: [
    "https://cdn.eso.org/images/large/eso2213a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso2213a.jpg",
    "https://cdn.eso.org/images/large/eso0525a.jpg",
  ]},
  { id: "ngc-6744", title: "NGC 6744", credit: "ESO / VLT", urls: [
    "https://cdn.eso.org/images/large/eso1741a.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso1741a.jpg",
  ]},
  { id: "ngc-1232", title: "NGC 1232", credit: "ESO / VLT", urls: [
    "https://cdn.eso.org/images/large/eso9845d.jpg",
    "https://cdn.eso.org/images/publicationjpg/eso9845d.jpg",
    "https://cdn.eso.org/images/large/eso9845a.jpg",
  ]},
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tryUrl = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/jpeg,image/*,*/*" } });
  if (!res.ok) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 80_000) return null;
  return buf;
};

const saveJpeg = async (id, buf) => {
  const raw = path.join(OUT, `${id}.raw.jpg`);
  const final = path.join(OUT, `${id}.jpg`);
  await fs.writeFile(raw, buf);
  await exec("sips", ["-Z", "4096", "-s", "format", "jpeg", "-s", "formatOptions", "90", raw, "--out", final]);
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
    process.stdout.write(`get ${item.id} ... `);
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
      await sleep(80);
    }
    if (!hit) {
      console.log("miss");
      continue;
    }
    const dims = await saveJpeg(item.id, hit.buf);
    console.log(`${dims.width}x${dims.height} ${(dims.bytes / 1e6).toFixed(1)}MB <- ${hit.url.split("/").pop()}`);
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

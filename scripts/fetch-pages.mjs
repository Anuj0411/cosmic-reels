import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal astronomy still catalog; educational)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/deep");
const MANIFEST = path.join(ROOT, "deep-space-manifest.json");

const PAGES = [
  { id: "wr-124", title: "Wolf-Rayet 124", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2307a/" },
  { id: "ngc-346", title: "NGC 346", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2301a/" },
  { id: "sn-1987a", title: "SN 1987A", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/SN1987a-1/" },
  { id: "hh-211", title: "Herbig-Haro 211", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2322b/" },
  { id: "serpens", title: "Serpens Nebula", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2415a/" },
  { id: "ngc-604", title: "NGC 604", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2407a/" },
  { id: "penguin", title: "The Penguin", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic1311a/" },
  { id: "arp-143", title: "Arp 143", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic2201a/" },
  { id: "twin-jet", title: "Twin Jet Nebula", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic1518a/" },
  { id: "abell-370", title: "Abell 370", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic1714a/" },
  { id: "eskimo", title: "Clown Face Nebula", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/opo0013a/" },
  { id: "retina", title: "Retina Nebula", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic0206a/" },
  { id: "ngc-2207", title: "NGC 2207", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic1402a/" },
  { id: "ngc-3314", title: "NGC 3314", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic1114a/" },
  { id: "ngc-7049", title: "NGC 7049", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic0706a/" },
  { id: "ngc-4921", title: "NGC 4921", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic0916a/" },
  { id: "ngc-4214", title: "NGC 4214", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic0905a/" },
  { id: "swan-nebula", title: "Swan Nebula", credit: "ESO / VST", page: "https://www.eso.org/public/images/eso1119a/" },
  { id: "ngc-1365", title: "NGC 1365", credit: "ESO / VLT", page: "https://www.eso.org/public/images/eso1038a/" },
  { id: "trifid", title: "Trifid Nebula", credit: "ESO", page: "https://www.eso.org/public/images/eso0930a/" },
  { id: "jellyfish", title: "Jellyfish Galaxy", credit: "ESO / Hubble / Chandra", page: "https://www.eso.org/public/images/eso1437e/" },
  { id: "sculptor-galaxy", title: "Sculptor Galaxy", credit: "ESO", page: "https://www.eso.org/public/images/eso0902a/" },
  { id: "pandoras-cluster", title: "Pandora's Cluster", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2213a/" },
  { id: "ic-348", title: "IC 348", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2325a/" },
  { id: "hh-46", title: "HH 46/47", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2306a/" },
  { id: "arp-107", title: "Arp 107", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2408a/" },
  { id: "n79", title: "N79", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2406a/" },
  { id: "wr-140", title: "WR 140", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2414a/" },
  { id: "ngc-1514", title: "NGC 1514", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2413a/" },
  { id: "uranus", title: "Uranus", credit: "NASA / ESA / CSA / JWST", page: "https://esawebb.org/images/weic2327a/" },
  { id: "mayall", title: "Mayall's Object", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic0810ae/" },
  { id: "ngc-1309", title: "NGC 1309", credit: "NASA / ESA / Hubble", page: "https://esahubble.org/images/heic0603a/" },
  { id: "cone-nebula", title: "Cone Nebula", credit: "ESO", page: "https://www.eso.org/public/images/eso1146a/" },
  { id: "rosette", title: "Rosette Nebula", credit: "ESO", page: "https://www.eso.org/public/images/eso1118a/" },
  { id: "ngc-1097", title: "NGC 1097", credit: "ESO", page: "https://www.eso.org/public/images/eso0525a/" },
  { id: "ngc-1232", title: "NGC 1232", credit: "ESO / VLT", page: "https://www.eso.org/public/images/eso9845a/" },
];

const jpegFromHtml = (html) => {
  const urls = [...html.matchAll(/https?:\/\/cdn\.[a-z0-9.-]+\/[^\s"'<>]+\.jpe?g/gi)].map((m) => m[0]);
  const rank = (url) => {
    if (/\/publicationjpg\//i.test(url)) return 0;
    if (/\/large\//i.test(url)) return 1;
    if (/\/screen\//i.test(url)) return 3;
    return 2;
  };
  urls.sort((a, b) => rank(a) - rank(b));
  return urls[0] ?? null;
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
  let manifest = [];
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {
    manifest = [];
  }
  const byId = new Map(manifest.map((row) => [row.id, row]));

  for (const item of PAGES) {
    console.log(`page ${item.id}`);
    try {
      const pageRes = await fetch(item.page, { headers: { "User-Agent": UA, Accept: "text/html" } });
      if (!pageRes.ok) {
        console.log(`  page ${pageRes.status}`);
        continue;
      }
      const html = await pageRes.text();
      const url = jpegFromHtml(html);
      if (!url) {
        console.log("  no jpeg on page");
        continue;
      }
      const imgRes = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/jpeg,image/*" } });
      if (!imgRes.ok) {
        console.log(`  img ${imgRes.status} ${url}`);
        continue;
      }
      const buf = Buffer.from(await imgRes.arrayBuffer());
      if (buf.length < 40_000) {
        console.log(`  tiny bytes ${buf.length}`);
        continue;
      }
      const dims = await saveJpeg(item.id, buf);
      if (dims.width < 900) {
        console.log(`  tiny ${dims.width}x${dims.height}`);
        continue;
      }
      byId.set(item.id, {
        id: item.id,
        title: item.title,
        credit: item.credit,
        file: `deep/${item.id}.jpg`,
        ...dims,
        source: url,
        page: item.page,
      });
      await fs.writeFile(MANIFEST, JSON.stringify([...byId.values()], null, 2));
      console.log(`  saved ${item.id} ${dims.width}x${dims.height} <- ${url}`);
    } catch (error) {
      console.log(`  fail ${item.id}: ${error.message}`);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

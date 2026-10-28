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

const NEED = [
  { id: "rho-ophiuchi", title: "Rho Ophiuchi", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2316a"] },
  { id: "wr-124", title: "Wolf-Rayet 124", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2307a"] },
  { id: "ngc-346", title: "NGC 346", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2301a"] },
  { id: "cas-a", title: "Cassiopeia A", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2330a", "weic2311a"] },
  { id: "sn-1987a", title: "SN 1987A", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2322a", "weic2323a", "weic2313a", "potm2308a"] },
  { id: "ic-348", title: "IC 348", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2325a", "weic2312a", "weic2313a"] },
  { id: "hh-211", title: "Herbig-Haro 211", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2315a", "weic2314a", "weic2324a"] },
  { id: "hh-46", title: "HH 46/47", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2306a", "weic2309a", "weic2305a"] },
  { id: "pandoras-cluster", title: "Pandora's Cluster", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2303a", "weic2213a", "weic2302b"] },
  { id: "uranus", title: "Uranus", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2327a", "weic2326a", "weic2219a", "weic2304a"] },
  { id: "serpens", title: "Serpens Nebula", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2403a", "weic2412a", "weic2404a"] },
  { id: "n79", title: "N79", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2406a", "weic2405a"] },
  { id: "arp-107", title: "Arp 107", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2408a", "weic2407a"] },
  { id: "wr-140", title: "WR 140", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2415a", "weic2414a", "weic2416a"] },
  { id: "ngc-604", title: "NGC 604", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2402a", "weic2401a", "weic2410a"] },
  { id: "ngc-1514", title: "NGC 1514", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2413a", "weic2409a", "weic2411a"] },
  { id: "penguin", title: "The Penguin", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1110a", "heic1110b"] },
  { id: "mayall", title: "Mayall's Object", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1303a"] },
  { id: "eskimo", title: "Eskimo Nebula", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["opo0013a", "heic0003a"] },
  { id: "twin-jet", title: "Twin Jet Nebula", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["potw1442a", "heic9710a"] },
  { id: "abell-370", title: "Abell 370", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1714a", "heic1714b"] },
  { id: "ngc-1275", title: "NGC 1275", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0817a", "potw1032a"] },
  { id: "ngc-2207", title: "NGC 2207", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1402a", "heic1410a", "opo9901a"] },
  { id: "ngc-3314", title: "NGC 3314", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1114a", "opo9933a"] },
  { id: "retina", title: "Retina Nebula", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0206a", "opo9828a"] },
  { id: "ngc-7049", title: "NGC 7049", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0706a"] },
  { id: "ngc-4921", title: "NGC 4921", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0916a"] },
  { id: "ngc-1309", title: "NGC 1309", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0603a", "opo0530a"] },
  { id: "ngc-4214", title: "NGC 4214", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0905a", "heic1411a"] },
  { id: "thors-helmet", title: "Thor's Helmet", credit: "ESO / VLT", site: "eso", codes: ["eso1238a"] },
  { id: "pencil-nebula", title: "Pencil Nebula", credit: "ESO", site: "eso", codes: ["eso1236a"] },
  { id: "running-chicken", title: "Running Chicken", credit: "ESO / VST", site: "eso", codes: ["eso2320a"] },
  { id: "jellyfish", title: "Jellyfish Galaxy", credit: "ESO / Hubble", site: "eso", codes: ["eso1611a", "eso1407a", "eso1443a"] },
  { id: "sculptor-galaxy", title: "Sculptor Galaxy", credit: "ESO", site: "eso", codes: ["eso1121a", "eso0902a", "eso0311a"] },
  { id: "ngc-1232", title: "NGC 1232", credit: "ESO / VLT", site: "eso", codes: ["eso9845a", "eso0311a"] },
  { id: "eagle-nebula", title: "Eagle Nebula", credit: "ESO", site: "eso", codes: ["eso0926a", "eso1540a"] },
  { id: "swan-nebula", title: "Swan Nebula", credit: "ESO", site: "eso", codes: ["eso0619a"] },
  { id: "cats-paw", title: "Cat's Paw", credit: "ESO", site: "eso", codes: ["eso1003a"] },
  { id: "lobster-nebula", title: "Lobster Nebula", credit: "ESO", site: "eso", codes: ["eso1237a", "eso0720a"] },
  { id: "trifid", title: "Trifid Nebula", credit: "ESO", site: "eso", codes: ["eso0617a", "eso0937a"] },
  { id: "ngc-1365", title: "NGC 1365", credit: "ESO", site: "eso", codes: ["eso1243a"] },
  { id: "rosette", title: "Rosette Nebula", credit: "ESO", site: "eso", codes: ["eso1626a", "eso1118a", "eso1119a"] },
  { id: "cone-nebula", title: "Cone Nebula", credit: "ESO", site: "eso", codes: ["eso1640a", "eso1146a"] },
  { id: "ngc-1097", title: "NGC 1097", credit: "ESO", site: "eso", codes: ["eso2213a", "eso0525a"] },
];

const hosts = {
  hubble: [
    "https://cdn.esahubble.org/archives/images",
    "https://cdn.spacetelescope.org/archives/images",
  ],
  webb: ["https://cdn.esawebb.org/archives/images"],
  eso: ["https://cdn.eso.org/images"],
};

const sizes = ["publicationjpg", "large", "screen"];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const tryUrl = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA, Accept: "image/jpeg,image/*,*/*" } });
  if (!res.ok) return null;
  const type = res.headers.get("content-type") || "";
  if (!/image\/(jpeg|jpg|png|tiff)/i.test(type) && !url.endsWith(".jpg")) return null;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 40_000) return null;
  return buf;
};

const findImage = async (item) => {
  for (const code of item.codes) {
    for (const host of hosts[item.site]) {
      for (const size of sizes) {
        const url = `${host}/${size}/${code}.jpg`;
        try {
          const buf = await tryUrl(url);
          if (buf) return { url, buf, code };
        } catch {
          /* next */
        }
        await sleep(60);
      }
    }
  }
  return null;
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
  const existing = new Set(byId.keys());

  for (const item of NEED) {
    if (existing.has(item.id) && (await fs.stat(path.join(OUT, `${item.id}.jpg`)).catch(() => null))) {
      console.log(`skip ${item.id}`);
      continue;
    }
    console.log(`get ${item.id}`);
    try {
      const hit = await findImage(item);
      if (!hit) {
        console.log(`  miss ${item.id}`);
        continue;
      }
      const dims = await saveJpeg(item.id, hit.buf);
      if (dims.width < 900) {
        console.log(`  tiny ${item.id} ${dims.width}x${dims.height}`);
        continue;
      }
      byId.set(item.id, {
        id: item.id,
        title: item.title,
        credit: item.credit,
        file: `deep/${item.id}.jpg`,
        ...dims,
        source: hit.url,
        code: hit.code,
      });
      await fs.writeFile(MANIFEST, JSON.stringify([...byId.values()], null, 2));
      console.log(`  saved ${item.id} ${dims.width}x${dims.height} <- ${hit.code}`);
    } catch (error) {
      console.log(`  fail ${item.id}: ${error.message}`);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

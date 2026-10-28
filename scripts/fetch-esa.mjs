import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal NASA/ESA/JWST still catalog; educational)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/deep");
const MANIFEST = path.join(ROOT, "deep-space-manifest.json");

const NEED = [
  { id: "orion", title: "Orion Nebula", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0601a", "opo0601a"] },
  { id: "carina", title: "Carina Nebula", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0707a", "heic1608a"] },
  { id: "cats-eye", title: "Cat's Eye", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0414a", "opo9624a"] },
  { id: "butterfly", title: "Butterfly Nebula", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0910h", "opo0407a"] },
  { id: "whirlpool", title: "Whirlpool Galaxy", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0506a", "opo0512a"] },
  { id: "m101", title: "Pinwheel Galaxy", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0602a"] },
  { id: "hoags-object", title: "Hoag's Object", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["opo0221a"] },
  { id: "omega-centauri", title: "Omega Centauri", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1017a"] },
  { id: "ngc-602", title: "NGC 602", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic0702a", "heic0710a"] },
  { id: "southern-ring", title: "Southern Ring", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2207a", "weic2206a"] },
  { id: "stephans-quintet", title: "Stephan's Quintet", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2214a"] },
  { id: "cartwheel", title: "Cartwheel Galaxy", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2216a", "weic2218a"] },
  { id: "phantom-galaxy", title: "Phantom Galaxy", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2302a", "weic2217a", "weic2305a"] },
  { id: "cosmic-cliffs", title: "Cosmic Cliffs", credit: "NASA / ESA / CSA / JWST", site: "webb", codes: ["weic2205a"] },
  { id: "andromeda", title: "Andromeda", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1502a"] },
  { id: "mystic-mountain", title: "Mystic Mountain", credit: "NASA / ESA / Hubble", site: "hubble", codes: ["heic1006a", "heic1608a"] },
];

const hosts = {
  hubble: [
    "https://cdn.esahubble.org/archives/images",
    "https://cdn.spacetelescope.org/archives/images",
    "https://esahubble.org/static/archives/images",
  ],
  webb: [
    "https://cdn.esawebb.org/archives/images",
    "https://esawebb.org/static/archives/images",
  ],
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
        await sleep(80);
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

  for (const item of NEED) {
    console.log(`esa ${item.id}`);
    try {
      const hit = await findImage(item);
      if (!hit) {
        console.log(`  miss ${item.id}`);
        continue;
      }
      const dims = await saveJpeg(item.id, hit.buf);
      if (dims.width < 900) {
        console.log(`  tiny ${item.id} ${dims.width}×${dims.height}`);
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
      console.log(`  saved ${item.id} ${dims.width}×${dims.height} ← ${hit.code}`);
    } catch (error) {
      console.log(`  fail ${item.id}: ${error.message}`);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

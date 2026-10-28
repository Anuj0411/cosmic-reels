import { execFile } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const exec = promisify(execFile);
const UA = "cosmic-reels/1.0 (personal NASA/ESA/JWST still catalog)";
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(ROOT, "../src/assets/stills/deep");
const MANIFEST = path.join(ROOT, "deep-space-manifest.json");

const CANDIDATES = [
  { id: "pillars-creation", title: "Pillars of Creation", credit: "NASA / ESA / Hubble", query: "pillars of creation hubble 2014" },
  { id: "jwst-pillars", title: "JWST Pillars of Creation", credit: "NASA / ESA / CSA / JWST", query: "JWST pillars of creation NIRCam" },
  { id: "jwst-deep-field", title: "Webb Deep Field", credit: "NASA / ESA / CSA / JWST", query: "Webb first deep field SMACS" },
  { id: "stephans-quintet", title: "Stephan's Quintet", credit: "NASA / ESA / CSA / JWST", query: "JWST Stephan's Quintet" },
  { id: "cartwheel", title: "Cartwheel Galaxy", credit: "NASA / ESA / CSA / JWST", query: "JWST Cartwheel Galaxy" },
  { id: "southern-ring", title: "Southern Ring", credit: "NASA / ESA / CSA / JWST", query: "JWST Southern Ring Nebula" },
  { id: "phantom-galaxy", title: "Phantom Galaxy", credit: "NASA / ESA / CSA / JWST", query: "JWST Phantom Galaxy NGC 628" },
  { id: "crab-nebula", title: "Crab Nebula", credit: "NASA / ESA / Hubble", query: "Hubble most detailed Crab Nebula" },
  { id: "helix", title: "Helix Nebula", credit: "NASA / ESA / Hubble", query: "Helix Nebula Hubble" },
  { id: "cats-eye", title: "Cat's Eye", credit: "NASA / ESA / Hubble", query: "Cat's Eye Nebula Hubble" },
  { id: "ring-nebula", title: "Ring Nebula", credit: "NASA / ESA / Hubble", query: "Ring Nebula Hubble M57" },
  { id: "butterfly", title: "Butterfly Nebula", credit: "NASA / ESA / Hubble", query: "Butterfly Nebula NGC 6302 Hubble" },
  { id: "hourglass", title: "Hourglass Nebula", credit: "NASA / ESA / Hubble", query: "Hourglass Nebula Hubble" },
  { id: "bubble", title: "Bubble Nebula", credit: "NASA / ESA / Hubble", query: "Bubble Nebula Hubble NGC 7635" },
  { id: "antennae", title: "Antennae Galaxies", credit: "NASA / ESA / Hubble", query: "Antennae Galaxies Hubble" },
  { id: "whirlpool", title: "Whirlpool Galaxy", credit: "NASA / ESA / Hubble", query: "Whirlpool Galaxy Hubble M51" },
  { id: "sombrero", title: "Sombrero Galaxy", credit: "NASA / ESA / Hubble", query: "Sombrero Galaxy Hubble" },
  { id: "ngc-1300", title: "NGC 1300", credit: "NASA / ESA / Hubble", query: "NGC 1300 Hubble barred spiral" },
  { id: "arp-273", title: "Arp 273", credit: "NASA / ESA / Hubble", query: "Arp 273 Hubble rose" },
  { id: "tadpole", title: "Tadpole Galaxy", credit: "NASA / ESA / Hubble", query: "Tadpole Galaxy Hubble" },
  { id: "mice", title: "The Mice", credit: "NASA / ESA / Hubble", query: "The Mice galaxies Hubble NGC 4676" },
  { id: "hoags-object", title: "Hoag's Object", credit: "NASA / ESA / Hubble", query: "Hoag's Object Hubble" },
  { id: "westerlund-2", title: "Westerlund 2", credit: "NASA / ESA / Hubble", query: "Westerlund 2 Hubble" },
  { id: "ngc-602", title: "NGC 602", credit: "NASA / ESA / Hubble", query: "NGC 602 Hubble" },
  { id: "orion", title: "Orion Nebula", credit: "NASA / ESA / Hubble", query: "Orion Nebula Hubble mosaic" },
  { id: "horsehead", title: "Horsehead Nebula", credit: "NASA / ESA / Hubble", query: "Horsehead Nebula Hubble" },
  { id: "carina", title: "Carina Nebula", credit: "NASA / ESA / Hubble", query: "Carina Nebula Hubble 2007" },
  { id: "tarantula", title: "Tarantula Nebula", credit: "NASA / ESA / Hubble", query: "Tarantula Nebula Hubble" },
  { id: "veil", title: "Veil Nebula", credit: "NASA / ESA / Hubble", query: "Veil Nebula Hubble" },
  { id: "ultra-deep-field", title: "Hubble Ultra Deep Field", credit: "NASA / ESA / Hubble", query: "Hubble Ultra Deep Field" },
  { id: "m101", title: "Pinwheel Galaxy", credit: "NASA / ESA / Hubble", query: "Pinwheel Galaxy Hubble M101" },
  { id: "m81", title: "Bode's Galaxy", credit: "NASA / ESA / Hubble", query: "Messier 81 Hubble" },
  { id: "omega-centauri", title: "Omega Centauri", credit: "NASA / ESA / Hubble", query: "Omega Centauri Hubble" },
  { id: "ngc-3603", title: "NGC 3603", credit: "NASA / ESA / Hubble", query: "NGC 3603 Hubble" },
  { id: "red-spider", title: "Red Spider", credit: "NASA / ESA / Hubble", query: "Red Spider Nebula Hubble" },
  { id: "eskimo", title: "Eskimo Nebula", credit: "NASA / ESA / Hubble", query: "Eskimo Nebula Hubble" },
  { id: "lagoon", title: "Lagoon Nebula", credit: "NASA / ESA / Hubble", query: "Lagoon Nebula Hubble" },
  { id: "jupiter-aurora", title: "Jupiter Aurora", credit: "NASA / ESA / Hubble", query: "Jupiter aurora Hubble" },
  { id: "saturn", title: "Saturn", credit: "NASA / ESA / Hubble", query: "Saturn Hubble" },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const nasaJson = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`nasa ${res.status}`);
  return res.json();
};

const pickOrig = async (nasaId) => {
  const files = await nasaJson(`https://images-assets.nasa.gov/image/${nasaId}/collection.json`);
  const orig =
    files.find((row) => /~orig\.(jpe?g|png|tif)$/i.test(row)) ||
    files.find((row) => /~large\.(jpe?g|png)$/i.test(row));
  return orig ? orig.replace("http://", "https://") : null;
};

const searchNasa = async (query) => {
  const json = await nasaJson(
    `https://images-api.nasa.gov/search?${new URLSearchParams({
      q: query,
      media_type: "image",
    })}`,
  );
  const items = json.collection?.items ?? [];
  for (const item of items.slice(0, 8)) {
    const data = item.data?.[0];
    const nasaId = data?.nasa_id;
    const title = String(data?.title || "");
    if (!nasaId) continue;
    if (/infographic|diagram|illustration|logo|artist|poster|chart/i.test(title)) continue;
    const orig = await pickOrig(nasaId);
    await sleep(150);
    if (orig) return { nasaId, title, orig };
  }
  return null;
};

const main = async () => {
  await fs.mkdir(OUT, { recursive: true });
  let manifest = [];
  try {
    manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  } catch {
    manifest = [];
  }
  const have = new Set(manifest.map((row) => row.id));

  for (const item of CANDIDATES) {
    if (have.has(item.id)) {
      console.log(`have ${item.id}`);
      continue;
    }
    try {
      console.log(`search ${item.id}`);
      const hit = await searchNasa(item.query);
      if (!hit) {
        console.log(`skip ${item.id}`);
        continue;
      }
      const ext = path.extname(new URL(hit.orig).pathname).toLowerCase() || ".jpg";
      const raw = path.join(OUT, `${item.id}.raw${ext}`);
      const final = path.join(OUT, `${item.id}.jpg`);
      console.log(`get ${item.id} ← ${hit.nasaId} ${hit.title.slice(0, 70)}`);
      const res = await fetch(hit.orig, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`download ${res.status}`);
      await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
      await exec("sips", ["-Z", "4096", "-s", "format", "jpeg", "-s", "formatOptions", "90", raw, "--out", final]);
      await fs.unlink(raw).catch(() => undefined);
      const { stdout } = await exec("sips", ["-g", "pixelWidth", "-g", "pixelHeight", final]);
      const width = Number(/pixelWidth:\s+(\d+)/.exec(stdout)?.[1] ?? 0);
      const height = Number(/pixelHeight:\s+(\d+)/.exec(stdout)?.[1] ?? 0);
      if (width < 1400) {
        await fs.unlink(final).catch(() => undefined);
        console.log(`skip ${item.id} too small ${width}×${height}`);
        continue;
      }
      const stat = await fs.stat(final);
      manifest.push({
        id: item.id,
        title: item.title,
        credit: item.credit,
        file: `deep/${item.id}.jpg`,
        width,
        height,
        bytes: stat.size,
        nasaId: hit.nasaId,
        sourceTitle: hit.title,
      });
      await fs.writeFile(MANIFEST, JSON.stringify(manifest, null, 2));
      console.log(`  saved ${width}×${height} ${(stat.size / 1e6).toFixed(1)}MB  total=${manifest.length}`);
      await sleep(200);
    } catch (error) {
      console.log(`fail ${item.id}: ${error.message}`);
    }
  }

  console.log(`\nGot ${manifest.length} images`);
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

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

const EXTRA = [
  { id: "cats-eye", title: "Cat's Eye", credit: "NASA / ESA / Hubble", nasaId: "PIA03685" },
  { id: "butterfly", title: "Butterfly Nebula", credit: "NASA / ESA / Hubble", nasaId: "PIA14416" },
  { id: "orion", title: "Orion Nebula", credit: "NASA / ESA / Hubble", nasaId: "PIA03230" },
  { id: "carina", title: "Carina Nebula", credit: "NASA / ESA / Hubble", nasaId: "PIA11170" },
  { id: "ngc-602", title: "NGC 602", credit: "NASA / ESA / Hubble", nasaId: "PIA11133" },
  { id: "eskimo", title: "Eskimo Nebula", credit: "NASA / ESA / Hubble", nasaId: "PIA01322" },
  { id: "omega-centauri", title: "Omega Centauri", credit: "NASA / ESA / Hubble", nasaId: "PIA12108" },
  { id: "m101", title: "Pinwheel Galaxy", credit: "NASA / ESA / Hubble", nasaId: "PIA10922" },
  { id: "hoags-object", title: "Hoag's Object", credit: "NASA / ESA / Hubble", nasaId: "PIA04209" },
  { id: "saturn", title: "Saturn", credit: "NASA / ESA / Hubble", nasaId: "PIA17172" },
  { id: "whirlpool", title: "Whirlpool Galaxy", credit: "NASA / ESA / Hubble", nasaId: "PIA05996" },
  { id: "stephans-quintet", title: "Stephan's Quintet", credit: "NASA / ESA / CSA / JWST", query: "webb stephan quintet NIRCam" },
  { id: "cartwheel", title: "Cartwheel Galaxy", credit: "NASA / ESA / CSA / JWST", query: "webb cartwheel galaxy NIRCam" },
  { id: "southern-ring", title: "Southern Ring", credit: "NASA / ESA / CSA / JWST", query: "webb southern ring NGC 3132" },
  { id: "phantom-galaxy", title: "Phantom Galaxy", credit: "NASA / ESA / CSA / JWST", query: "webb NGC 628 M74" },
];

const nasaJson = async (url) => {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`nasa ${res.status} ${url}`);
  return res.json();
};

const origFromId = async (nasaId) => {
  const files = await nasaJson(`https://images-assets.nasa.gov/image/${encodeURIComponent(nasaId)}/collection.json`);
  const orig =
    files.find((row) => /~orig\.(jpe?g|png)$/i.test(row)) ||
    files.find((row) => /~large\.(jpe?g|png)$/i.test(row)) ||
    files.find((row) => /~orig\.tif$/i.test(row));
  return orig ? orig.replace("http://", "https://") : null;
};

const searchId = async (query) => {
  const json = await nasaJson(
    `https://images-api.nasa.gov/search?${new URLSearchParams({ q: query, media_type: "image" })}`,
  );
  for (const item of json.collection?.items ?? []) {
    const data = item.data?.[0];
    const title = String(data?.title || "");
    if (/infographic|diagram|illustration|logo|artist|poster/i.test(title)) continue;
    if (data?.nasa_id) return data.nasa_id;
  }
  return null;
};

const save = async (item, nasaId) => {
  const orig = await origFromId(nasaId);
  if (!orig) throw new Error("no orig");
  const ext = path.extname(new URL(orig).pathname).toLowerCase() || ".jpg";
  const raw = path.join(OUT, `${item.id}.raw${ext}`);
  const final = path.join(OUT, `${item.id}.jpg`);
  console.log(`get ${item.id} ← ${nasaId}`);
  const res = await fetch(orig, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`download ${res.status}`);
  await fs.writeFile(raw, Buffer.from(await res.arrayBuffer()));
  await exec("sips", ["-Z", "4096", "-s", "format", "jpeg", "-s", "formatOptions", "90", raw, "--out", final]);
  await fs.unlink(raw).catch(() => undefined);
  const { stdout } = await exec("sips", ["-g", "pixelWidth", "-g", "pixelHeight", final]);
  const width = Number(/pixelWidth:\s+(\d+)/.exec(stdout)?.[1] ?? 0);
  const height = Number(/pixelHeight:\s+(\d+)/.exec(stdout)?.[1] ?? 0);
  const stat = await fs.stat(final);
  return { ...item, file: `deep/${item.id}.jpg`, width, height, bytes: stat.size, nasaId };
};

const main = async () => {
  await fs.mkdir(OUT, { recursive: true });
  const manifest = JSON.parse(await fs.readFile(MANIFEST, "utf8"));
  const byId = new Map(manifest.map((row) => [row.id, row]));

  for (const item of EXTRA) {
    try {
      const nasaId = item.nasaId || (await searchId(item.query));
      if (!nasaId) {
        console.log(`skip ${item.id}`);
        continue;
      }
      const row = await save(item, nasaId);
      byId.set(item.id, row);
      await fs.writeFile(MANIFEST, JSON.stringify([...byId.values()], null, 2));
      console.log(`  saved ${row.width}×${row.height}`);
    } catch (error) {
      console.log(`fail ${item.id}: ${error.message}`);
    }
  }
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

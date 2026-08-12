import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildPrediction } from "./prediction-model.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const readJson = async (name) => JSON.parse(await readFile(path.join(repoRoot, "public", name), "utf8"));

const history = await readJson("mandi-history.json");
const rate = await readJson("mandi-rate.json");
const prediction = buildPrediction(history, rate);

await writeFile(
  path.join(repoRoot, "public", "mandi-prediction.json"),
  `${JSON.stringify(prediction, null, 2)}\n`
);
console.log(`Saved ${prediction.forecasts.length} forecasts from ${prediction.points.length} history points.`);

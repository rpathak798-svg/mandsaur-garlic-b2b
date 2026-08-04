import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "public", "mandi-rate.json");

const sources = [
  "https://www.commodityonline.com/hi/mandi/madhya-pradesh/mandsaur/mandsaur",
  "https://www.commodityonline.com/mandiprices/garlic/madhya-pradesh/mandsaur",
  "https://www.commodityonline.com/mandiprices/district/madhya-pradesh/mandsaur/garlic"
];

const requestHeaders = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7",
  "cache-control": "no-cache",
  "pragma": "no-cache",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
};

function cleanNumber(value) {
  if (!value) {
    return null;
  }

  const parsed = Number(String(value).replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8377;|&rupee;/g, "Rs ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeDate(value) {
  const slash = String(value || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slash) {
    const [, day, month, year] = slash;
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  const monthMap = {
    jan: "01",
    feb: "02",
    mar: "03",
    apr: "04",
    may: "05",
    jun: "06",
    jul: "07",
    aug: "08",
    sep: "09",
    oct: "10",
    nov: "11",
    dec: "12"
  };
  const named = String(value || "").match(/(\d{1,2})\s+([A-Za-z]{3})\s+'?(\d{2,4})/);
  if (named) {
    const [, day, monthName, yearValue] = named;
    const year = yearValue.length === 2 ? `20${yearValue}` : yearValue;
    const month = monthMap[monthName.toLowerCase()];
    if (month) {
      return `${year}-${month}-${day.padStart(2, "0")}`;
    }
  }

  return null;
}

function isValidRate(candidate) {
  return Boolean(
    candidate &&
      candidate.minPrice > 0 &&
      candidate.maxPrice > 0 &&
      candidate.avgPrice > 0 &&
      candidate.maxPrice >= candidate.minPrice &&
      candidate.avgPrice >= 100 &&
      candidate.avgPrice <= 100000 &&
      candidate.arrivalDate
  );
}

function extractFromTableText(text, sourceUrl) {
  const candidates = [];
  const garlicMatches = [...text.matchAll(/\bGarlic\b/gi)];

  for (const match of garlicMatches) {
    const windowText = text.slice(match.index, match.index + 650);
    if (!/\bMandsaur\b/i.test(windowText)) {
      continue;
    }

    const dateMatch = windowText.match(/\b\d{1,2}\/\d{1,2}\/\d{4}\b/);
    const priceMatches = [...windowText.matchAll(/Rs\s*([\d,.]+)\s*\/\s*Quintal/gi)]
      .map((priceMatch) => cleanNumber(priceMatch[1]))
      .filter((price) => typeof price === "number");

    if (!dateMatch || priceMatches.length < 3) {
      continue;
    }

    const candidate = {
      minPrice: priceMatches[0],
      maxPrice: priceMatches[1],
      avgPrice: priceMatches[2],
      arrivalDate: normalizeDate(dateMatch[0]),
      sourceUrl
    };

    if (isValidRate(candidate)) {
      candidates.push(candidate);
    }
  }

  return candidates.sort((a, b) => b.arrivalDate.localeCompare(a.arrivalDate))[0] || null;
}

function extractFromSummaryText(text, sourceUrl) {
  const summary = text.match(
    /average\s+Garlic\s+price\s+in\s+Mandsaur\s+is\s+(?:Rs|\u20b9)\s*([\d,.]+)\s*\/\s*Quintal[\s\S]{0,240}?lowest\s+market\s+price\s+is\s+(?:Rs|\u20b9)\s*([\d,.]+)[\s\S]{0,240}?costliest\s+market\s+price\s+is\s+(?:Rs|\u20b9)\s*([\d,.]+)/i
  );

  const dateMatch =
    text.match(/Price updated\s*:?\s*(\d{1,2}\s+[A-Za-z]{3}\s+'?\d{2,4})/i) ||
    text.match(/Price updated\s*:?\s*(\d{1,2}\/\d{1,2}\/\d{4})/i) ||
    text.match(/Last price updated\s*:?\s*(\d{1,2}\s+[A-Za-z]{3}\s+'?\d{2,4})/i);

  if (!summary || !dateMatch) {
    return null;
  }

  const candidate = {
    avgPrice: cleanNumber(summary[1]),
    minPrice: cleanNumber(summary[2]),
    maxPrice: cleanNumber(summary[3]),
    arrivalDate: normalizeDate(dateMatch[1]),
    sourceUrl
  };

  return isValidRate(candidate) ? candidate : null;
}

async function fetchSource(sourceUrl) {
  const response = await fetch(sourceUrl, {
    headers: requestHeaders,
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`${sourceUrl} returned HTTP ${response.status}`);
  }

  return response.text();
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return {};
  }
}

async function main() {
  const warnings = [];

  for (const sourceUrl of sources) {
    try {
      const html = await fetchSource(sourceUrl);
      const text = htmlToText(html);
      const candidate = extractFromTableText(text, sourceUrl) || extractFromSummaryText(text, sourceUrl);

      if (!candidate) {
        warnings.push(`${sourceUrl}: Garlic Mandsaur rate not found`);
        continue;
      }

      const previous = await readPrevious();
      const next = {
        status: "live",
        commodity: "Garlic",
        market: "Mandsaur",
        district: "Mandsaur",
        state: "Madhya Pradesh",
        unit: "Quintal",
        minPrice: candidate.minPrice,
        maxPrice: candidate.maxPrice,
        avgPrice: candidate.avgPrice,
        kgPrice: Number((candidate.avgPrice / 100).toFixed(2)),
        arrivalDate: candidate.arrivalDate,
        sourceName: "CommodityOnline",
        sourceUrl: candidate.sourceUrl,
        updatedAtIso: new Date().toISOString(),
        previousAvgPrice: previous.avgPrice ?? null,
        note: "Auto-updated from CommodityOnline. Confirm final B2B deal rate on WhatsApp before dispatch."
      };

      await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`);
      console.log(`Updated Mandsaur garlic mandi rate: avg Rs ${next.avgPrice}/Quintal from ${next.sourceUrl}`);
      return;
    } catch (error) {
      warnings.push(error.message);
    }
  }

  console.error("Could not update mandi rate.");
  for (const warning of warnings) {
    console.error(`- ${warning}`);
  }
  process.exit(1);
}

main();

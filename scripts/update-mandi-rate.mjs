import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "public", "mandi-rate.json");

const primaryCommoditySources = [
  "https://www.commodityonline.com/mandi/madhya-pradesh/mandsaur/mandsaur/garlic",
  "https://www.commodityonline.com/hi/mandi/madhya-pradesh/mandsaur/mandsaur/garlic",
  "https://www.commodityonline.com/mandi/madhya-pradesh/mandsaur/mandsaur"
];

const fallbackCommoditySources = [
  "https://www.commodityonline.com/hi/mandi/madhya-pradesh/mandsaur/mandsaur",
  "https://www.commodityonline.com/mandiprices/garlic/madhya-pradesh/mandsaur",
  "https://www.commodityonline.com/mandiprices/district/madhya-pradesh/mandsaur/garlic"
];

const requestHeaders = {
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
  "accept-language": "hi-IN,hi;q=0.9,en-IN;q=0.8,en;q=0.7",
  "cache-control": "no-cache",
  "connection": "close",
  "pragma": "no-cache",
  "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
};

const agmarknetHeaders = {
  "accept": "application/json, text/plain, */*",
  "connection": "close",
  "content-type": "application/json",
  "origin": "https://agmarknet.gov.in",
  "referer": "https://agmarknet.gov.in/",
  "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
};

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  let timeout;
  const timeoutPromise = new Promise((_, reject) => {
    timeout = setTimeout(() => {
      controller.abort();
      reject(new Error(`${url} timed out after ${Math.round(timeoutMs / 1000)}s`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([fetch(url, {
      ...options,
      signal: controller.signal
    }), timeoutPromise]);
  } catch (error) {
    if (error.name === "AbortError" || /timed out/i.test(error.message)) {
      throw new Error(`${url} timed out after ${Math.round(timeoutMs / 1000)}s`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

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

function todayInIndia(offsetDays = 0) {
  const indiaNow = new Date(Date.now() + 5.5 * 60 * 60 * 1000);
  indiaNow.setUTCDate(indiaNow.getUTCDate() - offsetDays);
  return indiaNow.toISOString().slice(0, 10);
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
      candidate.arrivalDate &&
      candidate.sourceUrl
  );
}

function isOlderThanPrevious(candidate, previous) {
  return Boolean(previous?.arrivalDate && candidate?.arrivalDate && candidate.arrivalDate < previous.arrivalDate);
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
  const response = await fetchWithTimeout(sourceUrl, {
    headers: requestHeaders,
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`${sourceUrl} returned HTTP ${response.status}`);
  }

  return response.text();
}

async function fetchAgmarknetDailyReport(date) {
  const response = await fetchWithTimeout("https://api.agmarknet.gov.in/v1/prices-and-arrivals/market-report/daily", {
    method: "POST",
    headers: agmarknetHeaders,
    body: JSON.stringify({
      date,
      marketIds: [522],
      stateIds: [19],
      includeExcel: false
    })
  });

  if (!response.ok) {
    throw new Error(`Agmarknet ${date} returned HTTP ${response.status}`);
  }

  return response.json();
}

function extractFromAgmarknetReport(report, date) {
  const rows = [];
  const states = report.states || report.data?.states || [];

  for (const state of states) {
    for (const market of state.markets || []) {
      if (String(market.marketId) !== "522") {
        continue;
      }

      for (const commodity of market.commodities || []) {
        if (String(commodity.commodityId) !== "25" && !/garlic/i.test(commodity.commodityName || "")) {
          continue;
        }

        for (const row of commodity.data || []) {
          const candidate = {
            minPrice: cleanNumber(row.minimumPrice),
            maxPrice: cleanNumber(row.maximumPrice),
            avgPrice: cleanNumber(row.modalPrice),
            arrivalDate: date,
            sourceName: "Agmarknet",
            sourceUrl: "https://agmarknet.gov.in/home"
          };

          if (isValidRate(candidate)) {
            rows.push({
              ...candidate,
              variety: row.variety || "",
              grade: row.grade || "",
              arrivals: cleanNumber(row.arrivals) || 0
            });
          }
        }
      }
    }
  }

  const preferred = rows.filter((row) => /^average$/i.test(row.variety));
  const pool = preferred.length > 0 ? preferred : rows;

  return pool.sort((a, b) => b.avgPrice - a.avgPrice || b.arrivals - a.arrivals)[0] || null;
}

async function fetchAgmarknetCandidate() {
  const warnings = [];

  for (let offset = 0; offset < 4; offset += 1) {
    const date = todayInIndia(offset);

    try {
      console.log(`Checking Agmarknet daily report for ${date}`);
      const report = await fetchAgmarknetDailyReport(date);
      const candidate = extractFromAgmarknetReport(report, date);

      if (candidate) {
        return { candidate, warnings };
      }

      warnings.push(`Agmarknet ${date}: Garlic Mandsaur rate not found`);
    } catch (error) {
      warnings.push(error.message);
    }
  }

  return { candidate: null, warnings };
}

async function readPrevious() {
  try {
    return JSON.parse(await readFile(outputPath, "utf8"));
  } catch {
    return {};
  }
}

async function writeCandidate(candidate, previous) {
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
    sourceName: candidate.sourceName || "CommodityOnline",
    sourceUrl: candidate.sourceUrl,
    updatedAtIso: new Date().toISOString(),
    previousAvgPrice: previous.avgPrice ?? null,
    note: "Auto-updated from mandi data sources. Confirm final B2B deal rate on WhatsApp before dispatch."
  };

  await writeFile(outputPath, `${JSON.stringify(next, null, 2)}\n`);
  console.log(`Updated Mandsaur garlic mandi rate: avg Rs ${next.avgPrice}/Quintal from ${next.sourceName}`);
}

async function main() {
  const warnings = [];
  const previous = await readPrevious();

  for (const sourceUrl of primaryCommoditySources) {
    try {
      console.log(`Checking CommodityOnline source ${sourceUrl}`);
      const html = await fetchSource(sourceUrl);
      const text = htmlToText(html);
      const candidate = extractFromTableText(text, sourceUrl) || extractFromSummaryText(text, sourceUrl);

      if (!candidate) {
        warnings.push(`${sourceUrl}: Garlic Mandsaur rate not found`);
        continue;
      }

      if (isOlderThanPrevious(candidate, previous)) {
        warnings.push(`${sourceUrl}: latest date ${candidate.arrivalDate} is older than current file date ${previous.arrivalDate}`);
        continue;
      }

      candidate.sourceName = "CommodityOnline";
      await writeCandidate(candidate, previous);
      return;
    } catch (error) {
      warnings.push(error.message);
    }
  }

  const agmarknet = await fetchAgmarknetCandidate();
  warnings.push(...agmarknet.warnings);

  if (agmarknet.candidate && !isOlderThanPrevious(agmarknet.candidate, previous)) {
    await writeCandidate(agmarknet.candidate, previous);
    return;
  }

  if (agmarknet.candidate) {
    warnings.push(`Agmarknet latest date ${agmarknet.candidate.arrivalDate} is older than current file date ${previous.arrivalDate}`);
  }

  for (const sourceUrl of fallbackCommoditySources) {
    try {
      console.log(`Checking CommodityOnline source ${sourceUrl}`);
      const html = await fetchSource(sourceUrl);
      const text = htmlToText(html);
      const candidate = extractFromTableText(text, sourceUrl) || extractFromSummaryText(text, sourceUrl);

      if (!candidate) {
        warnings.push(`${sourceUrl}: Garlic Mandsaur rate not found`);
        continue;
      }

      if (isOlderThanPrevious(candidate, previous)) {
        warnings.push(`${sourceUrl}: latest date ${candidate.arrivalDate} is older than current file date ${previous.arrivalDate}`);
        continue;
      }

      candidate.sourceName = "CommodityOnline";
      await writeCandidate(candidate, previous);
      return;
    } catch (error) {
      warnings.push(error.message);
    }
  }

  if (previous.avgPrice && previous.arrivalDate) {
    console.warn(`Keeping previous mandi rate: avg Rs ${previous.avgPrice}/Quintal from ${previous.arrivalDate}`);
    for (const warning of warnings) {
      console.warn(`- ${warning}`);
    }
    return;
  }

  console.error("Could not update mandi rate.");
  for (const warning of warnings) {
    console.error(`- ${warning}`);
  }
  process.exit(1);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error.message);
    process.exit(1);
  });

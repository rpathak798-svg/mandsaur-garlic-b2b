import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const outputPath = path.join(repoRoot, "public", "mandi-history.json");

const MARKET_ID = 522;
const STATE_ID = 19;
const COMMODITY_ID = 25;
const API_URL = "https://api.agmarknet.gov.in/v1/prices-and-arrivals/market-report/daily";

const requestHeaders = {
  "accept": "application/json, text/plain, */*",
  "connection": "close",
  "content-type": "application/json",
  "origin": "https://agmarknet.gov.in",
  "referer": "https://agmarknet.gov.in/",
  "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36"
};

function formatDate(date) {
  return date.toISOString().slice(0, 10);
}

function todayInIndia() {
  return new Date(Date.now() + 5.5 * 60 * 60 * 1000);
}

function daysAgo(days) {
  const date = todayInIndia();
  date.setUTCDate(date.getUTCDate() - days);
  return date;
}

function cleanNumber(value) {
  const parsed = Number(String(value ?? "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : null;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`${url} returned HTTP ${response.status}`);
    }

    return response;
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchDailyReport(date) {
  const response = await fetchWithTimeout(API_URL, {
    method: "POST",
    headers: requestHeaders,
    body: JSON.stringify({
      date,
      marketIds: [MARKET_ID],
      stateIds: [STATE_ID],
      includeExcel: false
    })
  });

  return response.json();
}

function extractGarlicRows(report, date) {
  const states = report.states || report.data?.states || [];
  const rows = [];

  for (const state of states) {
    for (const market of state.markets || []) {
      if (String(market.marketId) !== String(MARKET_ID)) {
        continue;
      }

      for (const commodity of market.commodities || []) {
        if (String(commodity.commodityId) !== String(COMMODITY_ID) && !/garlic/i.test(commodity.commodityName || "")) {
          continue;
        }

        for (const row of commodity.data || []) {
          const minPrice = cleanNumber(row.minimumPrice);
          const maxPrice = cleanNumber(row.maximumPrice);
          const avgPrice = cleanNumber(row.modalPrice);

          if (minPrice && maxPrice && avgPrice) {
            rows.push({
              date,
              minPrice,
              maxPrice,
              avgPrice,
              arrivals: cleanNumber(row.arrivals) || 0,
              variety: row.variety || "",
              grade: row.grade || ""
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

async function readExistingHistory() {
  try {
    const data = JSON.parse(await readFile(outputPath, "utf8"));
    return Array.isArray(data.records) ? data.records : [];
  } catch {
    return [];
  }
}

async function fetchNearestRecord(anchorDate, searchDays = 7) {
  for (let offset = 0; offset <= searchDays; offset += 1) {
    const date = new Date(anchorDate);
    date.setUTCDate(anchorDate.getUTCDate() - offset);

    try {
      const report = await fetchDailyReport(formatDate(date));
      const row = extractGarlicRows(report, formatDate(date));

      if (row) {
        return row;
      }
    } catch (error) {
      console.warn(`${formatDate(date)}: ${error.message}`);
    }
  }

  return null;
}

function mergeRecords(existing, nextRecords) {
  const byDate = new Map();

  for (const record of [...existing, ...nextRecords]) {
    if (record?.date && record?.avgPrice) {
      byDate.set(record.date, record);
    }
  }

  return [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));
}

async function collectBackfill() {
  const records = [];

  for (let days = 0; days <= 1095; days += 30) {
    const record = await fetchNearestRecord(daysAgo(days), 10);

    if (record) {
      records.push(record);
      console.log(`History point ${record.date}: Rs ${record.avgPrice}/Quintal`);
    }
  }

  return records;
}

async function collectRecent() {
  const records = [];

  for (let days = 0; days <= 7; days += 1) {
    const record = await fetchNearestRecord(daysAgo(days), 0);

    if (record) {
      records.push(record);
      console.log(`Recent history point ${record.date}: Rs ${record.avgPrice}/Quintal`);
      break;
    }
  }

  return records;
}

async function main() {
  const existing = await readExistingHistory();
  const backfill = process.argv.includes("--backfill");
  const nextRecords = backfill ? await collectBackfill() : await collectRecent();
  const records = mergeRecords(existing, nextRecords);

  if (records.length === existing.length && nextRecords.length === 0) {
    console.log("No new Mandsaur garlic history point found.");
    return;
  }

  const payload = {
    commodity: "Garlic",
    market: "Mandsaur APMC",
    state: "Madhya Pradesh",
    unit: "Quintal",
    sourceName: "Agmarknet",
    sourceUrl: "https://agmarknet.gov.in/home",
    updatedAtIso: new Date().toISOString(),
    note: "Historical mandi records used for trend-based AI-style rate prediction. Confirm final B2B deal rate on WhatsApp.",
    records
  };

  await writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Saved ${records.length} Mandsaur garlic history points.`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

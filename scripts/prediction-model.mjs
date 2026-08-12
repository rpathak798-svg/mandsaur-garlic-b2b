function average(values) {
  const valid = values.filter((value) => Number.isFinite(value));
  return valid.length ? valid.reduce((sum, value) => sum + value, 0) / valid.length : null;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function addDays(date, days) {
  const next = new Date(`${date}T00:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
}

export function buildPrediction(history, currentRate, generatedAtIso = new Date().toISOString()) {
  const records = Array.isArray(history?.records) ? history.records : [];
  const points = records
    .map((record) => ({
      date: record.date,
      avgPrice: Number(record.avgPrice),
      minPrice: Number(record.minPrice),
      maxPrice: Number(record.maxPrice),
      arrivals: Number(record.arrivals) || 0
    }))
    .filter((record) => record.date && Number.isFinite(record.avgPrice));

  if (currentRate?.arrivalDate && Number.isFinite(Number(currentRate.avgPrice))) {
    points.push({
      date: currentRate.arrivalDate,
      avgPrice: Number(currentRate.avgPrice),
      minPrice: Number(currentRate.minPrice),
      maxPrice: Number(currentRate.maxPrice),
      arrivals: 0
    });
  }

  const sorted = [...new Map(points.map((point) => [point.date, point])).values()]
    .sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 3) {
    return { status: "waiting", generatedAtIso, points: sorted, forecasts: [] };
  }

  const latest = sorted.at(-1);
  const recent = sorted.slice(-6);
  const previous = sorted.slice(-12, -6);
  const recentAvg = average(recent.map((point) => point.avgPrice)) || latest.avgPrice;
  const previousAvg = average(previous.map((point) => point.avgPrice)) || sorted[0].avgPrice;
  const elapsedDays = Math.max(1, Math.round((Date.parse(latest.date) - Date.parse(recent[0].date)) / 86400000));
  const dailyTrend = (recentAvg - previousAvg) / elapsedDays;
  const latestMonth = new Date(`${latest.date}T00:00:00Z`).getUTCMonth();
  const seasonalAvg = average(sorted
    .filter((point) => new Date(`${point.date}T00:00:00Z`).getUTCMonth() === latestMonth)
    .map((point) => point.avgPrice));
  const seasonalPull = seasonalAvg ? (seasonalAvg - latest.avgPrice) * 0.08 : 0;
  const changes = sorted.slice(1).map((point, index) =>
    Math.abs(point.avgPrice - sorted[index].avgPrice) / Math.max(1, sorted[index].avgPrice));
  const volatility = clamp(average(changes) || 0.06, 0.03, 0.18);
  const trendPercent = ((recentAvg - previousAvg) / Math.max(1, previousAvg)) * 100;
  const confidence = clamp(Math.round(42 + sorted.length * 1.2 - volatility * 110), 35, 82);

  const forecasts = [7, 15, 30].map((days) => {
    const estimate = clamp(latest.avgPrice + dailyTrend * days + seasonalPull, latest.avgPrice * 0.75, latest.avgPrice * 1.25);
    const band = estimate * volatility * Math.sqrt(days / 7);
    return {
      days,
      date: addDays(latest.date, days),
      price: Math.round(estimate),
      low: Math.round(Math.max(1, estimate - band)),
      high: Math.round(estimate + band)
    };
  });

  return {
    status: "ready",
    generatedAtIso,
    model: "Trend + seasonality + volatility",
    sourceName: history?.sourceName || "Agmarknet",
    sourceUrl: history?.sourceUrl || "https://agmarknet.gov.in/home",
    latest,
    trendPercent,
    confidence,
    volatilityPercent: Math.round(volatility * 1000) / 10,
    points: sorted,
    forecasts
  };
}

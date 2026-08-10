import { useEffect, useState } from "react";
import "./App.css";

const WHATSAPP_NUMBER = "917772993222";
const whatsappIcon = "/whatsapp-logo.svg";
const heroImage = "/garlic-b2b-hero.png";
const mandiRateUrl = "/mandi-rate.json";
const mandiHistoryUrl = "/mandi-history.json";

const defaultMessage = [
  "Namaste Mandsaur Garlic,",
  "Mujhe B2B garlic inquiry karni hai.",
  "",
  "Buyer Type: Wholesaler / Trader",
  "Quantity: Please discuss",
  "Requirement: Fresh whole garlic",
  "Delivery Location: Please discuss",
  "",
  "Please current rate, availability, packing aur dispatch details share karein."
].join("\n");

function whatsappUrl(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon() {
  return <img className="whatsapp-icon" src={whatsappIcon} alt="" aria-hidden="true" />;
}

function formatPrice(value) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Rate pending";
  }

  return `Rs ${Math.round(value).toLocaleString("en-IN")}`;
}

function formatDate(value) {
  if (!value) {
    return "Update pending";
  }

  const parsed = new Date(`${value}T00:00:00+05:30`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

function daysBetween(start, end) {
  const startDate = new Date(`${start}T00:00:00+05:30`);
  const endDate = new Date(`${end}T00:00:00+05:30`);
  const diff = endDate.getTime() - startDate.getTime();
  return Math.max(1, Math.round(diff / 86400000));
}

function average(values) {
  const valid = values.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (valid.length === 0) {
    return null;
  }

  return valid.reduce((sum, value) => sum + value, 0) / valid.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function buildPrediction(history, currentRate) {
  const records = Array.isArray(history?.records) ? history.records : [];
  const points = records
    .map((record) => ({
      date: record.date,
      avgPrice: Number(record.avgPrice),
      minPrice: Number(record.minPrice),
      maxPrice: Number(record.maxPrice)
    }))
    .filter((record) => record.date && Number.isFinite(record.avgPrice));

  if (currentRate?.arrivalDate && currentRate?.avgPrice) {
    points.push({
      date: currentRate.arrivalDate,
      avgPrice: currentRate.avgPrice,
      minPrice: currentRate.minPrice,
      maxPrice: currentRate.maxPrice
    });
  }

  const byDate = new Map(points.map((point) => [point.date, point]));
  const sorted = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  if (sorted.length < 3) {
    return {
      status: "waiting",
      points: sorted,
      message: "Prediction ke liye abhi history collect ho rahi hai."
    };
  }

  const latest = sorted[sorted.length - 1];
  const recent = sorted.slice(-6);
  const previous = sorted.slice(-12, -6);
  const recentAvg = average(recent.map((point) => point.avgPrice)) || latest.avgPrice;
  const previousAvg = average(previous.map((point) => point.avgPrice)) || sorted[0].avgPrice;
  const recentWindowDays = daysBetween(recent[0].date, latest.date);
  const dailyTrend = (recentAvg - previousAvg) / Math.max(1, recentWindowDays);
  const latestMonth = new Date(`${latest.date}T00:00:00+05:30`).getMonth();
  const seasonalAvg = average(sorted.filter((point) => new Date(`${point.date}T00:00:00+05:30`).getMonth() === latestMonth).map((point) => point.avgPrice));
  const seasonalPull = seasonalAvg ? (seasonalAvg - latest.avgPrice) * 0.08 : 0;

  const changes = sorted.slice(1).map((point, index) => {
    const previousPoint = sorted[index];
    return Math.abs(point.avgPrice - previousPoint.avgPrice) / Math.max(1, previousPoint.avgPrice);
  });
  const volatility = clamp(average(changes) || 0.06, 0.03, 0.18);
  const trendPercent = previousAvg ? ((recentAvg - previousAvg) / previousAvg) * 100 : 0;
  const confidence = clamp(Math.round(42 + sorted.length * 1.2 - volatility * 110), 35, 82);

  const forecasts = [7, 15, 30].map((days) => {
    const trendMove = dailyTrend * days;
    const estimate = clamp(latest.avgPrice + trendMove + seasonalPull, latest.avgPrice * 0.75, latest.avgPrice * 1.25);
    const band = estimate * volatility * Math.sqrt(days / 7);

    return {
      days,
      date: formatDate(new Date(Date.now() + days * 86400000).toISOString().slice(0, 10)),
      price: Math.round(estimate),
      low: Math.round(Math.max(1, estimate - band)),
      high: Math.round(estimate + band)
    };
  });

  return {
    status: "ready",
    points: sorted,
    latest,
    forecasts,
    trendPercent,
    confidence,
    sourceName: history?.sourceName || "Agmarknet",
    sourceUrl: history?.sourceUrl || "https://agmarknet.gov.in/home"
  };
}

function makeChartPath(points) {
  const chartPoints = points.slice(-36);
  if (chartPoints.length < 2) {
    return "";
  }

  const values = chartPoints.map((point) => point.avgPrice);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(1, max - min);

  return chartPoints
    .map((point, index) => {
      const x = (index / (chartPoints.length - 1)) * 100;
      const y = 38 - ((point.avgPrice - min) / range) * 32;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

export default function App() {
  const openDefaultWhatsapp = whatsappUrl(defaultMessage);
  const [mandiRate, setMandiRate] = useState(null);
  const [mandiHistory, setMandiHistory] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch(mandiRateUrl, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mandi rate file not available");
        }

        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setMandiRate(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMandiRate(null);
        }
      });

    fetch(mandiHistoryUrl, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mandi history file not available");
        }

        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setMandiHistory(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setMandiHistory(null);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const prediction = buildPrediction(mandiHistory, mandiRate);
  const chartPath = makeChartPath(prediction.points || []);

  const rateMessage = [
    "Namaste Mandsaur Garlic,",
    "Mujhe aaj ka mandi rate confirm karna hai.",
    mandiRate?.status === "live" && mandiRate?.avgPrice
      ? `Website par rate: Avg ${formatPrice(mandiRate.avgPrice)} / Quintal, Min ${formatPrice(mandiRate.minPrice)}, Max ${formatPrice(mandiRate.maxPrice)}.`
      : "Website par rate update pending dikh raha hai.",
    "",
    "Please available quality, packing aur dispatch detail share karein."
  ].join("\n");

  function handleEnquirySubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const message = [
      "Namaste Mandsaur Garlic,",
      "Mujhe B2B garlic inquiry karni hai.",
      "",
      `Buyer Type: ${data.get("buyerType")}`,
      `Quantity: ${data.get("quantity")}`,
      `Requirement: ${data.get("requirement")}`,
      `Delivery Location: ${data.get("location")}`,
      `Name / Company: ${data.get("name") || "Not shared"}`,
      "",
      "Please current rate, available lot quality, packing options, payment terms aur dispatch timing share karein."
    ].join("\n");

    window.open(whatsappUrl(message), "_blank", "noopener");
  }

  return (
    <>
      <header className="site-header" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Mandsaur Garlic home">
          <span className="brand-mark">MG</span>
          <span>
            <strong>Mandsaur Garlic</strong>
            <small>B2B Wholesale</small>
          </span>
        </a>
        <nav className="nav-links" aria-label="Page sections">
          <a href="#mandi-rate">Mandi Rate</a>
          <a href="#prediction">AI Prediction</a>
          <a href="#products">Products</a>
          <a href="#process">Process</a>
          <a href="#enquiry">Enquiry</a>
        </nav>
        <a className="nav-cta" href={openDefaultWhatsapp} target="_blank" rel="noopener noreferrer" aria-label="Talk on WhatsApp">
          <WhatsAppIcon />
          WhatsApp
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-label="Mandsaur Garlic B2B enquiry">
          <img className="hero-image" src={heroImage} alt="Fresh garlic sacks ready for bulk trade" />
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <p className="eyebrow">Mandsaur, Madhya Pradesh | Mandi se seedha B2B Supply</p>
            <h1>Bulk Garlic Supply for Traders, Exporters & Food Businesses</h1>
            <p className="hero-copy">
              Fresh Mandsaur garlic in graded lots, mandi sourcing, jute/net bag packing,
              and dispatch support. Rate, quality aur quantity ke liye WhatsApp pe baat karo.
            </p>
            <div className="hero-actions">
              <a className="btn primary" href={openDefaultWhatsapp} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon />
                WhatsApp Pe Baat Karo
              </a>
              <a className="btn secondary" href="#enquiry">Send B2B Enquiry</a>
            </div>
            <dl className="hero-metrics" aria-label="Business highlights">
              <div>
                <dt>10kg-50kg</dt>
                <dd>Packaging options</dd>
              </div>
              <div>
                <dt>Graded</dt>
                <dd>Size & quality sorting</dd>
              </div>
              <div>
                <dt>Bulk</dt>
                <dd>Trader-ready lots</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="intro band">
          <div className="section-head">
            <p className="eyebrow">Why Mandsaur Garlic</p>
            <h2>Hindi + English B2B communication, simple buying process.</h2>
          </div>
          <div className="intro-grid">
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Direct Mandi Sourcing</h3>
              <p>Mandsaur mandi se fresh garlic sourcing, daily availability aur rate discussion.</p>
            </article>
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Bulk Buyer Focus</h3>
              <p>Traders, wholesalers, exporters, processors, hotels aur food brands ke liye lots.</p>
            </article>
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Dispatch Support</h3>
              <p>Packaging, loading, transport coordination aur buyer location ke hisab se planning.</p>
            </article>
          </div>
        </section>

        <section id="mandi-rate" className="mandi-rate">
          <div className="section-head">
            <p className="eyebrow">Daily Mandsaur Mandi Rate</p>
            <h2>Garlic mandi bhav auto update hota hai.</h2>
            <p>
              Source: Agmarknet and CommodityOnline mandi data. Final deal se pehle quality,
              grade aur loading ke hisab se rate WhatsApp par confirm karein.
            </p>
          </div>

          <div className="rate-panel">
            <div className="rate-main">
              <span className="rate-label">Average Garlic Rate</span>
              <strong>{formatPrice(mandiRate?.avgPrice)}</strong>
              <small>per Quintal</small>
            </div>
            <dl className="rate-stats">
              <div>
                <dt>Min Rate</dt>
                <dd>{formatPrice(mandiRate?.minPrice)}</dd>
              </div>
              <div>
                <dt>Max Rate</dt>
                <dd>{formatPrice(mandiRate?.maxPrice)}</dd>
              </div>
              <div>
                <dt>Updated</dt>
                <dd>{formatDate(mandiRate?.arrivalDate)}</dd>
              </div>
            </dl>
            <div className="rate-source">
              <span>{mandiRate?.status === "live" ? "Live data loaded" : "Waiting for daily update"}</span>
              <a href={mandiRate?.sourceUrl || "https://agmarknet.gov.in/home"} target="_blank" rel="noopener noreferrer">
                View source
              </a>
            </div>
            <a className="btn primary rate-cta" href={whatsappUrl(rateMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Confirm Today's Rate
            </a>
          </div>
        </section>

        <section id="prediction" className="prediction band">
          <div className="section-head">
            <p className="eyebrow">AI Rate Prediction</p>
            <h2>Last 3 years ke mandi signals se garlic rate forecast.</h2>
            <p>
              Yeh forecast historical Mandsaur APMC records, latest mandi rate, trend aur volatility se estimate banta hai.
              Final trading rate quality, size, demand aur transport ke hisab se confirm karein.
            </p>
          </div>

          <div className="prediction-panel">
            <div className="prediction-chart">
              <div className="prediction-topline">
                <span>Trend Signal</span>
                <strong>
                  {prediction.status === "ready"
                    ? `${prediction.trendPercent >= 0 ? "+" : ""}${prediction.trendPercent.toFixed(1)}%`
                    : "Collecting"}
                </strong>
              </div>
              <svg className="trend-chart" viewBox="0 0 100 42" role="img" aria-label="Garlic rate history trend chart">
                <line x1="0" y1="38" x2="100" y2="38" />
                {chartPath ? <polyline points={chartPath} /> : null}
              </svg>
              <div className="prediction-meta">
                <span>{prediction.points?.length || 0} history points</span>
                <span>{prediction.status === "ready" ? `${prediction.confidence}% confidence` : "Waiting for more data"}</span>
              </div>
            </div>

            <div className="forecast-grid">
              {prediction.status === "ready" ? (
                prediction.forecasts.map((forecast) => (
                  <article className="forecast-card" key={forecast.days}>
                    <span>{forecast.days} Days</span>
                    <h3>{formatPrice(forecast.price)}</h3>
                    <p>{forecast.date}</p>
                    <small>
                      Range: {formatPrice(forecast.low)} to {formatPrice(forecast.high)}
                    </small>
                  </article>
                ))
              ) : (
                <article className="forecast-card forecast-empty">
                  <span>Data Required</span>
                  <h3>History loading</h3>
                  <p>{prediction.message}</p>
                  <small>Daily automation ab historical data collect karega.</small>
                </article>
              )}
            </div>

            <div className="prediction-source">
              <span>
                Source: {prediction.sourceName || "Agmarknet"} | Last rate: {formatPrice(prediction.latest?.avgPrice || mandiRate?.avgPrice)}
              </span>
              <a href={prediction.sourceUrl || "https://agmarknet.gov.in/home"} target="_blank" rel="noopener noreferrer">
                View data source
              </a>
            </div>
          </div>
        </section>

        <section id="products" className="products">
          <div className="section-head">
            <p className="eyebrow">Products | Product</p>
            <h2>Garlic lots for wholesale and commercial buying.</h2>
          </div>
          <div className="product-grid">
            <article className="product-card">
              <p className="tag">Fresh Garlic</p>
              <h3>Whole Garlic Bulbs</h3>
              <p>Clean, dry, market-ready garlic bulbs for traders and retailers.</p>
              <span>Size: Small / Medium / Large</span>
            </article>
            <article className="product-card">
              <p className="tag">Sorted Lots</p>
              <h3>Graded Garlic</h3>
              <p>Buyer requirement ke according size sorting and quality separation.</p>
              <span>Use: Exporters, processors, wholesalers</span>
            </article>
            <article className="product-card">
              <p className="tag">Packing</p>
              <h3>Jute & Net Bags</h3>
              <p>Bulk packing options for transport, storage and mandi trade.</p>
              <span>Options: 10kg, 20kg, 25kg, 50kg</span>
            </article>
          </div>
        </section>

        <section id="process" className="process band">
          <div className="section-head">
            <p className="eyebrow">Buying Process | Kharid Prakriya</p>
            <h2>Inquiry se dispatch tak clear B2B workflow.</h2>
          </div>
          <ol className="steps">
            <li>
              <strong>1. Requirement Share Karein</strong>
              <span>Quantity, size, packing, delivery city aur buyer type WhatsApp par bhejein.</span>
            </li>
            <li>
              <strong>2. Rate & Quality Confirm</strong>
              <span>Current mandi rate, available lot, photos/video and packing details share honge.</span>
            </li>
            <li>
              <strong>3. Loading & Dispatch</strong>
              <span>Payment terms, transport and loading schedule final karke maal dispatch hoga.</span>
            </li>
          </ol>
        </section>

        <section id="enquiry" className="enquiry">
          <div className="enquiry-copy">
            <p className="eyebrow">WhatsApp Pe Baat Karo Format</p>
            <h2>Send a clean B2B garlic enquiry in one tap.</h2>
            <p>
              Form bharte hi WhatsApp message ready ho jayega. Isse rate, availability,
              packing aur dispatch details jaldi confirm ho sakte hain.
            </p>
            <div className="contact-strip">
              <strong>mandsaurgarlic.com</strong>
              <span>Wholesale | Export | Processing | Trading</span>
            </div>
          </div>

          <form className="enquiry-form" onSubmit={handleEnquirySubmit}>
            <label>
              Buyer Type
              <select name="buyerType" required defaultValue="Wholesaler / Trader">
                <option value="Wholesaler / Trader">Wholesaler / Trader</option>
                <option value="Exporter">Exporter</option>
                <option value="Food Processor">Food Processor</option>
                <option value="Hotel / Restaurant Supplier">Hotel / Restaurant Supplier</option>
                <option value="Retail Chain">Retail Chain</option>
              </select>
            </label>

            <label>
              Required Quantity
              <input name="quantity" type="text" placeholder="Example: 5 ton / 200 bags" required />
            </label>

            <label>
              Garlic Requirement
              <select name="requirement" required defaultValue="Fresh whole garlic">
                <option value="Fresh whole garlic">Fresh whole garlic</option>
                <option value="Graded garlic">Graded garlic</option>
                <option value="Large size garlic">Large size garlic</option>
                <option value="Medium size garlic">Medium size garlic</option>
                <option value="Custom packing garlic">Custom packing garlic</option>
              </select>
            </label>

            <label>
              Delivery Location
              <input name="location" type="text" placeholder="City, State / Port" required />
            </label>

            <label>
              Name / Company
              <input name="name" type="text" placeholder="Your name or company" />
            </label>

            <button className="btn primary full" type="submit">
              <WhatsAppIcon />
              Open WhatsApp Enquiry
            </button>
            <p className="form-note">WhatsApp number connected: +91 7772993222</p>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; 2026 Mandsaur Garlic. B2B garlic wholesale and sourcing.</p>
        <a className="footer-whatsapp" href={openDefaultWhatsapp} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          WhatsApp Pe Baat Karo
        </a>
      </footer>

      <a className="floating-whatsapp" href={openDefaultWhatsapp} target="_blank" rel="noopener noreferrer" aria-label="Open WhatsApp enquiry">
        <WhatsAppIcon />
        <strong>WhatsApp</strong>
      </a>
    </>
  );
}

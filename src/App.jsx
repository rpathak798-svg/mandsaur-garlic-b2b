import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import "./App.css";

const WHATSAPP_NUMBER = "917772993222";
const whatsappIcon = "/whatsapp-logo.svg";
const logoImage = "/mandsaur-garlic-logo.svg";
const heroImage = "/garlic-b2b-hero.png";
const mandiRateUrl = "/mandi-rate.json";
const mandiPredictionUrl = "/mandi-prediction.json";

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

  const parsed = new Date(`${value}T12:00:00Z`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Asia/Kolkata"
  });
}

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.[0]?.payload) return null;
  const point = payload[0].payload;
  return (
    <div className="chart-tooltip">
      <strong>{formatDate(point.date)}</strong>
      <span>Modal: {formatPrice(point.avgPrice)}</span>
      <small>Low {formatPrice(point.minPrice)} | High {formatPrice(point.maxPrice)}</small>
    </div>
  );
}

export default function App() {
  const openDefaultWhatsapp = whatsappUrl(defaultMessage);
  const [mandiRate, setMandiRate] = useState(null);
  const [prediction, setPrediction] = useState({ status: "loading", points: [], forecasts: [] });
  const [chartRange, setChartRange] = useState(12);

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

    fetch(mandiPredictionUrl, { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Mandi prediction file not available");
        }

        return response.json();
      })
      .then((data) => {
        if (isMounted) {
          setPrediction(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPrediction({ status: "waiting", points: [], forecasts: [] });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const chartData = useMemo(() => {
    const points = prediction.points || [];
    return chartRange === 0 ? points : points.slice(-chartRange);
  }, [prediction.points, chartRange]);
  const chartAverage = useMemo(() => {
    if (!chartData.length) return 0;
    return Math.round(chartData.reduce((sum, point) => sum + point.avgPrice, 0) / chartData.length);
  }, [chartData]);

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
          <img className="brand-logo" src={logoImage} alt="Mandsaur Garlic logo" />
        </a>
        <nav className="nav-links" aria-label="Page sections">
          <a href="#mandi-rate">Mandi Rate</a>
          <a href="#prediction">AI Prediction</a>
          <a href="#products">Products</a>
          <a href="#service-area">Supply Area</a>
          <a href="#faq">FAQ</a>
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
            <p className="eyebrow">Mandsaur, Madhya Pradesh | Daily Garlic Mandi Bhav</p>
            <h1>Mandsaur Garlic Wholesale Supplier with Live Mandi Rate</h1>
            <p className="hero-copy">
              Fresh Mandsaur garlic for traders, exporters, wholesalers and food businesses.
              Daily mandi rate, AI price prediction, graded lots, packing and dispatch support.
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
                <dt>Daily</dt>
                <dd>Mandi rate update</dd>
              </div>
              <div>
                <dt>Graded</dt>
                <dd>Small to large lots</dd>
              </div>
              <div>
                <dt>India</dt>
                <dd>Dispatch support</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="intro band">
          <div className="section-head">
            <p className="eyebrow">Why Mandsaur Garlic</p>
            <h2>Trusted B2B garlic sourcing from the Mandsaur mandi belt.</h2>
          </div>
          <div className="intro-grid">
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Direct Mandi Sourcing</h3>
              <p>Fresh garlic lots sourced around Mandsaur APMC with daily availability and rate discussion.</p>
            </article>
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Wholesale Buyer Focus</h3>
              <p>Trader, exporter, processor, hotel supplier and retail-chain enquiries handled in a clear format.</p>
            </article>
            <article>
              <span className="mini-icon" aria-hidden="true"></span>
              <h3>Rate + Prediction Desk</h3>
              <p>Live mandi bhav and AI-style garlic price trend signals help buyers time B2B discussions.</p>
            </article>
          </div>
        </section>

        <section id="service-area" className="market-proof">
          <div className="section-head">
            <p className="eyebrow">Mandsaur Garlic Wholesale</p>
            <h2>Bulk garlic supply for mandis, traders and commercial buyers across India.</h2>
            <p>
              Mandsaur Garlic helps buyers compare mandi bhav, discuss quality grade, confirm packing,
              and plan dispatch from Madhya Pradesh. Common buyer requirements include fresh whole garlic,
              graded garlic, large-size garlic, medium-size garlic, and custom bag packing.
            </p>
          </div>
          <div className="service-grid">
            <article>
              <strong>Primary Market</strong>
              <span>Mandsaur APMC, Madhya Pradesh</span>
            </article>
            <article>
              <strong>Buyer Types</strong>
              <span>Wholesalers, traders, exporters, processors, food suppliers</span>
            </article>
            <article>
              <strong>Supply Support</strong>
              <span>Sorting, packing, loading and transport coordination</span>
            </article>
            <article>
              <strong>Rate Signals</strong>
              <span>Daily mandi rate, historical chart and 7/15/30 day prediction range</span>
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
                <div>
                  <span>Latest mandi signal</span>
                  <strong>{formatPrice(prediction.latest?.avgPrice || mandiRate?.avgPrice)}</strong>
                </div>
                <div className={`trend-badge ${prediction.trendPercent >= 0 ? "up" : "down"}`}>
                  {prediction.status === "ready"
                    ? `${prediction.trendPercent >= 0 ? "+" : "-"}${Math.abs(prediction.trendPercent).toFixed(1)}%`
                    : "Collecting"}
                </div>
              </div>
              <div className="chart-range" aria-label="Chart time range">
                {[
                  [3, "3M"],
                  [12, "1Y"],
                  [0, "3Y"]
                ].map(([value, label]) => (
                  <button
                    className={chartRange === value ? "active" : ""}
                    key={label}
                    type="button"
                    onClick={() => setChartRange(value)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="trend-chart" role="img" aria-label="Interactive garlic mandi rate history chart">
                {chartData.length > 1 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 4, left: -18, bottom: 0 }}>
                      <defs>
                        <linearGradient id="rateFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#42c77a" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="#42c77a" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
                      <XAxis dataKey="date" tickFormatter={(date) => date.slice(5)} minTickGap={28} />
                      <YAxis tickFormatter={(value) => `${Math.round(value / 1000)}k`} domain={["dataMin - 1000", "dataMax + 1000"]} />
                      <Tooltip content={<ChartTooltip />} cursor={{ stroke: "rgba(255,255,255,0.35)" }} />
                      <ReferenceLine y={chartAverage} stroke="rgba(242,196,109,0.7)" strokeDasharray="5 5" />
                      <Area type="monotone" dataKey="avgPrice" stroke="#42c77a" strokeWidth={3} fill="url(#rateFill)" activeDot={{ r: 5, fill: "#f2c46d" }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <span className="chart-loading">Rate history loading...</span>
                )}
              </div>
              <div className="prediction-meta">
                <span>Average {formatPrice(chartAverage)}</span>
                <span>{prediction.points?.length || 0} verified points</span>
              </div>
            </div>

            <div className="forecast-grid">
              {prediction.status === "ready" ? (
                prediction.forecasts.map((forecast) => (
                  <article className="forecast-card" key={forecast.days}>
                    <div className="forecast-label">
                      <span>{forecast.days} Days</span>
                      <b>{prediction.confidence}% confidence</b>
                    </div>
                    <h3>{formatPrice(forecast.price)}</h3>
                    <p>{formatDate(forecast.date)}</p>
                    <div className="forecast-range">
                      <i style={{ left: `${Math.max(8, Math.min(92, ((forecast.price - forecast.low) / (forecast.high - forecast.low)) * 100))}%` }} />
                    </div>
                    <small>{formatPrice(forecast.low)} - {formatPrice(forecast.high)}</small>
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
                Auto-updated: {formatDate(prediction.latest?.date)} | Model: {prediction.model || "Trend analysis"}
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

        <section id="faq" className="faq">
          <div className="section-head">
            <p className="eyebrow">Buyer Questions</p>
            <h2>Mandsaur garlic B2B buying FAQs.</h2>
          </div>
          <div className="faq-grid">
            <article>
              <h3>Do you supply bulk garlic from Mandsaur?</h3>
              <p>Yes. We support B2B buyers with Mandsaur garlic sourcing, quality discussion, packing and dispatch coordination.</p>
            </article>
            <article>
              <h3>Is the mandi rate final deal rate?</h3>
              <p>No. Mandi bhav is a reference signal. Final B2B rate depends on quality, size, grade, quantity, packing and loading.</p>
            </article>
            <article>
              <h3>Can I check future garlic price trend?</h3>
              <p>The AI Prediction section shows 7, 15 and 30 day estimated ranges from historical mandi signals and volatility.</p>
            </article>
          </div>
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

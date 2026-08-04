import { useEffect, useState } from "react";
import "./App.css";

const WHATSAPP_NUMBER = "917772993222";
const whatsappIcon = "/whatsapp-logo.svg";
const heroImage = "/garlic-b2b-hero.png";
const mandiRateUrl = "/mandi-rate.json";

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

export default function App() {
  const openDefaultWhatsapp = whatsappUrl(defaultMessage);
  const [mandiRate, setMandiRate] = useState(null);

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

    return () => {
      isMounted = false;
    };
  }, []);

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
              Source: CommodityOnline Mandsaur mandi page. Final deal se pehle quality,
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
              <a href={mandiRate?.sourceUrl || "https://www.commodityonline.com/hi/mandi/madhya-pradesh/mandsaur/mandsaur"} target="_blank" rel="noopener noreferrer">
                View source
              </a>
            </div>
            <a className="btn primary rate-cta" href={whatsappUrl(rateMessage)} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Confirm Today's Rate
            </a>
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

import "./App.css";

const WHATSAPP_NUMBER = "917772993222";
const whatsappIcon = "/whatsapp-logo.svg";
const heroImage = "/garlic-b2b-hero.png";

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

export default function App() {
  const openDefaultWhatsapp = whatsappUrl(defaultMessage);

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

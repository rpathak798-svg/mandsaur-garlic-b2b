import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from "recharts";

/* ══════════════════════════════════════════════
   THEME PALETTE — "Mandi Tech Modern"
══════════════════════════════════════════════ */
const P = {
  bg: "#F8F9FA",         // Clean corporate dashboard gray
  surface: "#FFFFFF",    // Crisp card surface
  darkNav: "#0F291B",    // Premium Forest Green (Agriculture Core)
  accent: "#E28704",     // Saffron Sourcing Amber
  accentL: "#FFF9EE",    
  text: "#1F2937",       // Charcoal typography
  textM: "#6B7280",      // Secondary metadata text
  border: "#E5E7EB",     // Light grid separators
  bull: "#10B981",       // Market Up
  bullBg: "#E6F4EA",
  bear: "#EF4444",       // Market Down
  bearBg: "#FCE8E6",
  premium: "#7C3AED",    // Export Ready Tag Blue-Purple
};

/* ══════════════════════════════════════════════
   LIVE DATA METRICS
══════════════════════════════════════════════ */
const TICKER_COMMODITIES = [
  { name: "GARLIC SUPER", price: 12400, change: "+310", pct: "+2.56%", up: true },
  { name: "JEERA UNJHA", price: 28200, change: "+640", pct: "+2.32%", up: true },
  { name: "MCX GOLD", price: 62450, change: "-120", pct: "-0.19%", up: false },
  { name: "SOYBEAN INDORE", price: 4680, change: "+45", pct: "+0.97%", up: true },
  { name: "MENTHA OIL", price: 924.5, change: "-6.2", pct: "-0.67%", up: false },
  { name: "CORIANDER", price: 7420, change: "+180", pct: "+2.48%", up: true },
];

const GARLIC_GRADES = [
  { id: "super", name: "Super Grade White", size: "55mm+", price: 12400, minOrder: "50 q", allicin: "High", usage: "Export & Premium Retail" },
  { id: "agrade", name: "A Grade Premium", size: "45-55mm", price: 9200, minOrder: "100 q", allicin: "Standard", usage: "Domestic Wholesale" },
  { id: "processing", name: "Processing Grade", size: "25-38mm", price: 5400, minOrder: "200 q", allicin: "Intense", usage: "Garlic Paste & Powder Factories" },
];

const SPOT_MANDI_BOARD = [
  { mandi: "Mandsaur (MP)", arrival: "24,500 Bags", minPrice: 7800, maxPrice: 12400, trend: "▲ Strong" },
  { mandi: "Neemuch (MP)", arrival: "18,200 Bags", minPrice: 6500, maxPrice: 11200, trend: "▲ Steady" },
  { mandi: "Jaora (MP)", arrival: "8,400 Bags", minPrice: 5200, maxPrice: 9800, trend: "▼ Soft" },
  { mandi: "Gondal (GJ)", arrival: "11,000 Bags", minPrice: 8200, maxPrice: 13100, trend: "▲ Active" },
];

const INTRADAY_CHART_MOCK = [
  { time: "10:00 AM", Super: 12100, AGrade: 8900 },
  { time: "11:30 AM", Super: 12250, AGrade: 9100 },
  { time: "01:00 PM", Super: 12200, AGrade: 9000 },
  { time: "02:30 PM", Super: 12380, AGrade: 9150 },
  { time: "03:30 PM", Super: 12400, AGrade: 9200 },
];

/* ══════════════════════════════════════════════
   STYLESHEET ARCHITECTURE (CSS INJECTION)
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Inter', sans-serif; }
body { background-color: ${P.bg}; color: ${P.text}; }

/* Layout Elements */
.mandi-navbar { background: ${P.darkNav}; padding: 16px 40px; display: flex; justify-content: space-between; align-items: center; color: white; position: sticky; top: 0; z-index: 100; }
.logo-title { font-size: 22px; font-weight: 700; display: flex; align-items: center; gap: 8px; letter-spacing: -0.5px; }
.logo-title span { color: ${P.accent}; }

.live-ticker-strip { background: ${P.surface}; border-bottom: 1px solid ${P.border}; height: 44px; display: flex; align-items: center; overflow: hidden; }
.ticker-badge { background: ${P.accent}; color: white; font-weight: 700; font-size: 11px; padding: 0 20px; height: 100%; display: flex; align-items: center; z-index: 10; letter-spacing: 0.5px; }
.ticker-carousel { display: flex; animation: spinTicker 28s linear infinite; white-space: nowrap; }
.ticker-node { display: flex; align-items: center; gap: 6px; padding: 0 24px; border-right: 1px solid ${P.border}; font-size: 13px; font-weight: 600; }

/* Grid Blueprint */
.app-viewport { max-width: 1400px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: 1fr 400px; gap: 24px; }
@media (max-width: 1100px) { .app-viewport { grid-template-columns: 1fr; padding: 16px; } }

/* Cards & Widgets */
.b2b-card { background: ${P.surface}; border: 1px solid ${P.border}; border-radius: 12px; padding: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); margin-bottom: 24px; }
.card-title-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-h2 { font-size: 18px; font-weight: 700; color: ${P.text}; }

/* Grid Grade Matrices */
.grade-matrix { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-bottom: 24px; }
@media (max-width: 600px) { .grade-matrix { grid-template-columns: 1fr; } }
.grade-box { border: 2px solid ${P.border}; border-radius: 10px; padding: 16px; cursor: pointer; transition: all 0.2s; background: ${P.surface}; }
.grade-box:hover { border-color: ${P.accent}; }
.grade-box.selected { border-color: ${P.accent}; background: ${P.accentL}; }
.grade-header { font-size: 14px; font-weight: 700; margin-bottom: 4px; color: ${P.text}; }

/* Interactive B2B Data Tables */
.mandi-table { width: 100%; border-collapse: collapse; text-align: left; }
.mandi-table th { font-size: 11px; text-transform: uppercase; color: ${P.textM}; padding: 12px; border-bottom: 1px solid ${P.border}; font-weight: 600; letter-spacing: 0.5px; }
.mandi-table td { padding: 14px 12px; font-size: 14px; border-bottom: 1px solid ${P.border}; }
.mandi-table tr:last-child td { border-bottom: none; }

/* Interactive Form Sourcing Inputs */
.b2b-field-group { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px; }
@media (max-width: 500px) { .b2b-field-group { grid-template-columns: 1fr; } }
.b2b-field { display: flex; flex-direction: column; gap: 6px; }
.b2b-field label { font-size: 12px; font-weight: 600; color: ${P.text}; }
.b2b-input, .b2b-select { background: ${P.bg}; border: 1px solid ${P.border}; border-radius: 8px; padding: 11px 14px; font-size: 14px; outline: none; color: ${P.text}; }
.b2b-input:focus { border-color: ${P.accent}; background: #fff; }

/* Action Buttons */
.btn-mandi-primary { width: 100%; background: ${P.accent}; color: white; padding: 14px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; transition: background 0.2s; text-align: center; display: block; text-decoration: none; }
.btn-mandi-primary:hover { background: #be7103; }
.btn-whatsapp-b2b { width: 100%; background: #25D366; color: white; padding: 12px; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; text-align: center; margin-top: 10px; display: flex; align-items: center; justify-content: center; gap: 8px; text-decoration: none; }
.btn-whatsapp-b2b:hover { background: #1fba55; }

/* Typography Badges */
.trend-up { color: ${P.bull}; font-weight: 600; }
.trend-dn { color: ${P.bear}; font-weight: 600; }
.pill-mkt { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase; }
.pill-up { background: ${P.bullBg}; color: ${P.bull}; }
.pill-dn { background: ${P.bearBg}; color: ${P.bear}; }

@keyframes spinTicker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

/* ══════════════════════════════════════════════
   CORE ENGINE ARCHITECTURE
══════════════════════════════════════════════ */
export default function CompleteB2BGarlicWebsite() {
  const [selectedGradeId, setSelectedGradeId] = useState("super");
  const [orderQty, setOrderQty] = useState(100); // Default 100 Quintals
  const [destination, setDestination] = useState("Mumbai");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerName, setBuyerName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Computed Values
  const currentGradeObj = GARLIC_GRADES.find(g => g.id === selectedGradeId);
  const basePriceMatric = currentGradeObj.price * orderQty;
  
  // Freight Matrix Simulation Rules
  const freightPerQuintal = destination === "Mumbai" ? 220 : destination === "Delhi" ? 180 : destination === "Bangalore" ? 340 : 410;
  const computedFreightTotal = freightPerQuintal * orderQty;
  const netInvoiceTotal = basePriceMatric + computedFreightTotal;

  const handleB2BInquirySubmit = (e) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  // WhatsApp Message Generator Configuration
  const waCustomText = `Namaskar! Mein Garilc Sourcing Portal se bulk inquiry submit kar raha hoon.\n\n*Details:*\n- Variety Grade: ${currentGradeObj.name}\n- Bulk Quantity: ${orderQty} Quintals\n- Supply Destination: ${destination}\n- Buyer Name: ${buyerName}\n\nKripya dispatch aur loading schedule share karein.`;
  const waDeepLink = `https://wa.me/917772993222?text=${encodeURIComponent(waCustomText)}`;

  return (
    <>
      <style>{CSS}</style>

      {/* DYNAMIC HEADER CORE */}
      <header className="mandi-navbar">
        <div className="logo-title">
          🧄 Garlic<span>Online</span>.com
        </div>
        <div style={{ fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)" }}>
          National Agri-B2B Trade Terminal
        </div>
      </header>

      {/* SPINNING COMMODITY STRIP */}
      <div className="live-ticker-strip">
        <div className="ticker-badge">LIVE MANDI TICKER</div>
        <div className="ticker-carousel">
          {TICKER_COMMODITIES.concat(TICKER_COMMODITIES).map((node, i) => (
            <div key={i} className="ticker-node">
              <span>{node.name}</span>
              <span style={{ color: P.text, fontWeight: 700 }}>₹{node.price.toLocaleString()}</span>
              <span className={node.up ? "trend-up" : "trend-dn"}>{node.pct}</span>
            </div>
          ))}
        </div>
      </div>

      {/* DASHBOARD CONTAINER VIEWPORT */}
      <div className="app-viewport">
        
        {/* MAIN BODY INTERACTIVE WORKSPACE */}
        <div>
          
          {/* STEP 1: SELECT VARIETY GRADE */}
          <div className="b2b-card">
            <div className="card-title-row">
              <div className="card-h2">1. Select Commercial Garlic Grade</div>
              <span style={{ fontSize: "12px", color: P.accent, fontWeight: "700" }}>Direct from Mandsaur Supply Chain</span>
            </div>
            
            <div className="grade-matrix">
              {GARLIC_GRADES.map((grade) => {
                const isActive = selectedGradeId === grade.id;
                return (
                  <div key={grade.id} className={`grade-box ${isActive ? 'selected' : ''}`} onClick={() => setSelectedGradeId(grade.id)}>
                    <div className="grade-header">{grade.name}</div>
                    <div style={{ fontSize: "11px", color: P.textM, marginBottom: "8px" }}>Bulb Size: {grade.size}</div>
                    <div style={{ fontSize: "20px", fontWeight: "700", color: P.text }}>₹{grade.price}/<span style={{ fontSize: "12px" }}>q</span></div>
                    <div style={{ fontSize: "11px", color: P.accent, fontWeight: "600", marginTop: "6px" }}>Min Order: {grade.minOrder}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* REAL-TIME DYNAMIC B2B ANALYTICS GRAPH */}
          <div className="b2b-card">
            <div className="card-title-row">
              <div>
                <div className="card-h2">Mandsaur Intraday Price Matrix</div>
                <div style={{ fontSize: "12px", color: P.textM, marginTop: "2px" }}>Spot Market Price Index Trends (₹/Quintal)</div>
              </div>
              <div className="pill-mkt pill-up">Live Trading Active</div>
            </div>
            <div style={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INTRADAY_CHART_MOCK}>
                  <defs>
                    <linearGradient id="superGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={P.accent} stopOpacity={0.2}/>
                      <stop offset="95%" stopColor={P.accent} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.border} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: P.textM }} />
                  <YAxis domain={['dataMin - 500', 'dataMax + 500']} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: P.textM }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="Super" stroke={P.accent} strokeWidth={3} fillOpacity={1} fill="url(#superGlow)" name="Super Grade" />
                  <Area type="monotone" dataKey="AGrade" stroke={P.premium} strokeWidth={2} fillOpacity={0} name="A Grade" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* NATIONAL SPOT MANDI RATES TABLE */}
          <div className="b2b-card">
            <div className="card-title-row">
              <div className="card-h2">Regional Garlic Arrival & Spot Indexes</div>
              <span style={{ fontSize: "12px", color: P.textM }}>Updated today 11:30 AM</span>
            </div>
            <table className="mandi-table">
              <thead>
                <tr>
                  <th>Mandi Location</th>
                  <th>Daily Arrivals</th>
                  <th>Min Price (₹/q)</th>
                  <th>Max Price (₹/q)</th>
                  <th>Market Trend</th>
                </tr>
              </thead>
              <tbody>
                {SPOT_MANDI_BOARD.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600 }}>{row.mandi}</td>
                    <td style={{ color: P.textM }}>{row.arrival}</td>
                    <td>₹{row.minPrice.toLocaleString()}</td>
                    <td style={{ fontWeight: 700 }}>₹{row.maxPrice.toLocaleString()}</td>
                    <td className={row.trend.includes("▲") ? "trend-up" : "trend-dn"}>{row.trend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN: PROCUREMENT DESK & LOGISTICS ENGINE */}
        <div>
          
          {/* B2B INQUIRY LOGISTIC ENGINE COST CALC */}
          <div className="b2b-card" style={{ border: `1.5px solid ${P.accent}` }}>
            <div className="card-h2" style={{ marginBottom: "14px" }}>📋 Smart Sourcing Console</div>
            
            <form onSubmit={handleB2BInquirySubmit}>
              <div className="b2b-field" style={{ marginBottom: "12px" }}>
                <label>Target Sourcing Quantity (Quintals)</label>
                <input type="number" className="b2b-input" value={orderQty} onChange={(e) => setOrderQty(Math.max(1, Number(e.target.value)))} min="1" required />
                <span style={{ fontSize: "11px", color: P.textM }}>1 Metric Ton = 10 Quintals</span>
              </div>

              <div className="b2b-field" style={{ marginBottom: "18px" }}>
                <label>Supply Destination Route</label>
                <select className="b2b-select" value={destination} onChange={(e) => setDestination(e.target.value)}>
                  <option value="Mumbai">Mumbai (Vashi Mandi / Port)</option>
                  <option value="Delhi">Delhi (Azadpur Mandi Wholesale)</option>
                  <option value="Bangalore">Bangalore Hub</option>
                  <option value="Kolkata">Kolkata / Border Export Hub</option>
                </select>
              </div>

              {/* LIVE COMMERCIAL BILLING ESTIMATIONS BLOCK */}
              <div style={{ background: P.bg, borderRadius: "8px", padding: "14px", marginBottom: "18px" }}>
                <div style={{ display: "flex", justifyIncoterm: "space-between", justifyContent: "space-between", fontSize: "13px", marginBottom: "6px" }}>
                  <span style={{ color: P.textM }}>Garlic Material Cost:</span>
                  <span style={{ fontWeight: 600 }}>₹{basePriceMatric.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", marginBottom: "8px" }}>
                  <span style={{ color: P.textM }}>Est. Freight ({destination}):</span>
                  <span style={{ fontWeight: 600 }}>₹{computedFreightTotal.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700, borderTop: `1px dashed ${P.border}`, paddingTop: "8px" }}>
                  <span>Est. Gross Invoice:</span>
                  <span style={{ color: P.accent }}>₹{netInvoiceTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* CAPTURE SOURCING DATA FIELDS */}
              <div className="b2b-field" style={{ marginBottom: "12px" }}>
                <label>Your Name / Company *</label>
                <input type="text" className="b2b-input" placeholder="e.g., Balaji Food Processors" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required />
              </div>

              <div className="b2b-field" style={{ marginBottom: "16px" }}>
                <label>Contact Number (WhatsApp) *</label>
                <input type="tel" className="b2b-input" placeholder="e.g., 98XXXXXXXX" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} required />
              </div>

              <button type="submit" className="btn-mandi-primary">
                Submit Formal RFQ Quote
              </button>

              <a href={waDeepLink} target="_blank" rel="noopener noreferrer" className="btn-whatsapp-b2b">
                <span>💬</span> Instant Order WhatsApp Desk
              </a>
            </form>

            {isSubmitted && (
              <div style={{ marginTop: "12px", padding: "10px", background: P.bullBg, color: P.bull, borderRadius: "6px", fontSize: "12px", fontWeight: 600, textAlign: "center" }}>
                ✓ Inquiry successfully routed to Mandsaur Sourcing Partners!
              </div>
            )}
          </div>

          {/* B2B PLATFORM TRUST MATRIX MARKS */}
          <div className="b2b-card" style={{ background: P.darkNav, color: "white" }}>
            <div style={{ fontSize: "12px", color: P.accent, fontWeight: 700, letterSpacing: "1px", textTransform: "uppercase", marginBottom: "6px" }}>Mandsaur Direct Logistics</div>
            <h3 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>Corporate Supply Standards</h3>
            <ul style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", paddingLeft: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li><b>Rigorous Sorting:</b> Double machine-loop sorting process filters moisture damage, dirt, and asymmetric shapes.</li>
              <li><b>Export Grading:</b> Phytosanitary documentation support available for Nhava Sheva (Mumbai) / Mundra cargo shipments.</li>
              <li><b>Cold Chain Fleet:</b> GPS tracking integrated with regular ventilated and temp-controlled reefers for long-route shipments.</li>
            </ul>
          </div>

        </div>

      </div>
    </>
  );
}

import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

/* ══════════════════════════════════════════════
   PREMIUM THEME PALETTE (Mandi-FinTech)
══════════════════════════════════════════════ */
const P = {
  bg: "#F9FAF6",         // Airy cream-white canvas
  surface: "#FFFFFF",    // Pure white crisp containers
  darkNav: "#112D1D",    // Deep Forest Green (Trust & Agri Base)
  accent: "#D4820A",     // Rich Saffron Amber (Commodity & Energy Alert)
  accentL: "#FEF3C7",    // Soft saffron background
  text: "#1F2937",       // Charcoal core text
  textM: "#4B5563",      // Slate gray body text
  textSub: "#9CA3AF",    // Light border/disabled text
  border: "#E5E7EB",     // Minimal structural borders
  bull: "#10B981",       // Market Up (Emerald)
  bullBg: "#DCFCE7",     
  bear: "#EF4444",       // Market Down (Ruby)
  bearBg: "#FEE2E2",
};

/* ══════════════════════════════════════════════
   LIVE DATA STRUCTURE
══════════════════════════════════════════════ */
const MCX_DATA = {
  GOLD: { name: "MCX Gold (10g)", price: 62450, change: "+120", pct: "+0.19%", up: true, unit: "10g", history: [{t:"09:00",p:62100},{t:"10:00",p:62250},{t:"11:00",p:62180},{t:"12:00",p:62300},{t:"13:00",p:62450},{t:"14:00",p:62420}] },
  SILVER: { name: "MCX Silver (1kg)", price: 74200, change: "-350", pct: "-0.47%", up: false, unit: "1kg", history: [{t:"09:00",p:74550},{t:"10:00",p:74400},{t:"11:00",p:74600},{t:"12:00",p:74300},{t:"13:00",p:74200},{t:"14:00",p:74250}] },
  CRUDEOIL: { name: "MCX Crude Oil (bbl)", price: 6420, change: "+85", pct: "+1.34%", up: true, unit: "bbl", history: [{t:"09:00",p:63350},{t:"10:00",p:63600},{t:"11:00",p:63900},{t:"12:00",p:64000},{t:"13:00",p:64200},{t:"14:00",p:64150}] },
  GARLIC: { name: "Mandsaur Garlic (q)", price: 12400, change: "+250", pct: "+2.05%", up: true, unit: "Quintal", history: [{t:"09:00",p:12150},{t:"10:00",p:12200},{t:"11:00",p:12250},{t:"12:00",p:12350},{t:"13:00",p:12400},{t:"14:00",p:12400}] }
};

const SPOT_MANDI_AGRI = [
  { item: "Garlic (Super Grade)", location: "Mandsaur (MP)", price: 12400, arrival: "18,400 bags", trend: "+2.4%", up: true },
  { item: "Jeera (Premium)", location: "Unjha (GJ)", price: 28500, arrival: "9,200 bags", trend: "+5.1%", up: true },
  { item: "Soybean Yellow", location: "Indore (MP)", price: 4650, arrival: "11,800 bags", trend: "-1.2%", up: false },
  { item: "Mustard Seeds", location: "Jaipur (RJ)", price: 5420, arrival: "22,100 bags", trend: "-0.5%", up: false },
  { item: "Chana (Desi)", location: "Bikaner (RJ)", price: 5800, arrival: "5,700 bags", trend: "+0.8%", up: true },
];

const SPOT_MANDI_METALS = [
  { item: "Copper Cathode", location: "Mumbai Spot", price: 715, arrival: "120 Tons", trend: "+0.29%", up: true },
  { item: "Zinc Ingot", location: "Delhi Wholesales", price: 224, arrival: "85 Tons", trend: "-0.53%", up: false },
  { item: "Aluminium Scrap", location: "Chennai Yard", price: 198, arrival: "240 Tons", trend: "+1.10%", up: true },
];

const FLASH_NEWS = [
  { id: 1, time: "10:45 AM", text: "Jeera market triggers circuit break in Unjha setup over high export demand forecasts." },
  { id: 2, time: "09:12 AM", text: "Mandsaur crop analysis report 2026 shows lower moisture levels, readying stock for premium direct exports." },
  { id: 3, time: "08:00 AM", text: "US Federal Reserve signals localized pause; gold baseline scales support levels seamlessly." }
];

/* ══════════════════════════════════════════════
   ADVANCED STYLESHEET (CSS Injection)
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; font-family: 'Inter', sans-serif; }
body { background: ${P.bg}; color: ${P.text}; overflow-x: hidden; -webkit-font-smoothing: antialiased; }

/* Dynamic Header Layout */
.top-nav { background: ${P.darkNav}; color: white; padding: 14px 40px; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
.brand-group { display: flex; align-items: center; gap: 10px; cursor: pointer; }
.brand-icon { font-size: 24px; background: linear-gradient(135deg, ${P.accent}, #F59E0B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.brand-logo-text { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
.brand-logo-text em { color: ${P.accent}; font-style: normal; }
.nav-actions { display: flex; align-items: center; gap: 20px; }
.search-input { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; padding: 8px 16px; color: white; width: 280px; font-size: 13px; outline: none; transition: all 0.2s; }
.search-input:focus { background: rgba(255,255,255,0.15); border-color: ${P.accent}; width: 320px; }

/* Real-Time Infinity Ticker */
.ticker-container { background: ${P.surface}; border-bottom: 1px solid ${P.border}; height: 44px; display: flex; align-items: center; overflow: hidden; }
.ticker-label { background: ${P.accent}; color: white; font-size: 11px; font-weight: 700; letter-spacing: 1px; padding: 0 20px; height: 100%; display: flex; align-items: center; z-index: 10; box-shadow: 4px 0 10px rgba(0,0,0,0.05); }
.ticker-track { display: flex; animation: scrollTicker 35s linear infinite; white-space: nowrap; }
.ticker-track:hover { animation-play-state: paused; }
.ticker-node { display: flex; align-items: center; gap: 8px; padding: 0 28px; border-right: 1px solid ${P.border}; font-size: 13px; font-weight: 600; }
.node-up { color: ${P.bull}; } .node-dn { color: ${P.bear}; }

/* Grid Space Architecture */
.dashboard-space { max-width: 1440px; margin: 0 auto; padding: 32px; display: grid; grid-template-columns: 1fr 380px; gap: 32px; }

/* Interactive Widgets */
.card-wrapper { background: ${P.surface}; border: 1px solid ${P.border}; border-radius: 14px; padding: 24px; box-shadow: 0 1px 4px rgba(17,45,29,0.02); margin-bottom: 24px; transition: box-shadow 0.2s; }
.card-wrapper:hover { box-shadow: 0 10px 25px rgba(17,45,29,0.05); }
.card-header-main { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.card-title-main { font-size: 18px; font-weight: 700; color: ${P.text}; }

/* Quick Sourcing Selector Cards */
.selection-matrix { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }
.selector-cell { background: ${P.surface}; border: 1px solid ${P.border}; border-radius: 12px; padding: 18px; cursor: pointer; transition: all 0.2s; position: relative; }
.selector-cell.active { border-color: ${P.accent}; background: linear-gradient(180deg, white 0%, ${P.accentL} 100%); box-shadow: 0 4px 15px rgba(212,130,10,0.08); }
.cell-name { font-size: 12px; font-weight: 600; color: ${P.textM}; text-transform: uppercase; letter-spacing: 0.5px; }
.cell-value { font-size: 22px; font-weight: 700; margin: 6px 0 2px 0; }

/* Custom Badge Pill */
.pill-badge { display: inline-flex; align-items: center; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.pill-up { background: ${P.bullBg}; color: ${P.bull}; }
.pill-dn { background: ${P.bearBg}; color: ${P.bear}; }

/* Pro Trading Tab System */
.tab-row { display: flex; gap: 20px; border-bottom: 1px solid ${P.border}; margin-bottom: 20px; }
.tab-node { padding: 10px 4px; font-size: 14px; font-weight: 600; color: ${P.textM}; cursor: pointer; position: relative; }
.tab-node.active { color: ${P.darkNav}; }
.tab-node.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 3px; background: ${P.darkNav}; border-radius: 3px 3px 0 0; }

/* Sleek Commodity Data Tables */
.mandi-matrix { width: 100%; border-collapse: collapse; text-align: left; }
.mandi-matrix th { font-size: 11px; font-weight: 700; text-transform: uppercase; color: ${P.textSub}; padding: 12px 16px; border-bottom: 1px solid ${P.border}; letter-spacing: 0.5px; }
.mandi-matrix td { padding: 16px; font-size: 14px; border-bottom: 1px solid ${P.border}; vertical-align: middle; }
.mandi-matrix tr:last-child td { border-bottom: none; }
.mandi-matrix tr:hover td { background: ${P.bg}; }

/* Right Columns Feed Blocks */
.news-block { padding: 14px 0; border-bottom: 1px solid ${P.border}; }
.news-block:last-child { border-bottom: none; }
.news-meta { font-size: 11px; font-weight: 700; color: ${P.accent}; margin-bottom: 4px; display: flex; align-items: center; gap: 6px; }
.news-content { font-size: 13.5px; color: ${P.text}; line-height: 1.5; font-weight: 500; }

/* Live Utility Calculator */
.calc-input-group { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
.calc-box { background: ${P.bg}; border: 1px solid ${P.border}; border-radius: 8px; padding: 10px 14px; }
.calc-box label { font-size: 10px; font-weight: 700; color: ${P.textM}; text-transform: uppercase; display: block; margin-bottom: 4px; }
.calc-box input { border: none; background: transparent; font-size: 16px; font-weight: 700; width: 100%; outline: none; color: ${P.text}; }

/* Responsiveness Engine */
@media (max-width: 1150px) {
  .dashboard-space { grid-template-columns: 1fr; padding: 20px; }
  .selection-matrix { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 650px) {
  .top-nav { padding: 14px 20px; }
  .search-input { display: none; }
  .selection-matrix { grid-template-columns: 1fr; }
  .mandi-matrix th:nth-child(3), .mandi-matrix td:nth-child(3) { display: none; } /* Hide arrivals on crisp mobile view */
}

@keyframes scrollTicker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
`;

/* ══════════════════════════════════════════════
   MAIN INTERACTIVE EXPORT COMPONENT
══════════════════════════════════════════════ */
export default function UltimateCommodityDashboard() {
  const [selectedKey, setSelectedKey] = useState("GARLIC");
  const [activeMandiTab, setActiveMandiTab] = useState("agri");
  const [calcQty, setCalcQty] = useState(10); // Standard Lot Size / 10 Quintals

  const activeCommodity = MCX_DATA[selectedKey];
  const activeMandiDataset = activeMandiTab === "agri" ? SPOT_MANDI_AGRI : SPOT_MANDI_METALS;

  return (
    <>
      <style>{CSS}</style>

      {/* 10x PREMIUM HEADER TERMINAL */}
      <nav className="top-nav">
        <div className="brand-group">
          <span className="brand-icon">📈</span>
          <div className="brand-logo-text">Commodity<em>Pro</em></div>
        </div>
        <div className="nav-actions">
          <input type="text" className="search-input" placeholder="Search Mandis, Futures, Analytics..." />
          <div style={{ fontSize: "12px", fontWeight: "700", color: P.accent, background: "rgba(212,130,10,0.12)", padding: "6px 12px", borderRadius: "6px" }}>
            🟢 LIVE FEED (2026)
          </div>
        </div>
      </nav>

      {/* MARQUEE RUNNING TICKER STREAM */}
      <div className="ticker-container">
        <div className="ticker-label">REAL-TIME MCX</div>
        <div className="ticker-track">
          {Object.keys(MCX_DATA).concat(Object.keys(MCX_DATA)).map((k, index) => {
            const item = MCX_DATA[k];
            return (
              <div key={index} className="ticker-node">
                <span style={{ color: P.text }}>{item.name.split(" ")[1] || item.name}</span>
                <span style={{ fontWeight: 700 }}>₹{item.price.toLocaleString()}</span>
                <span className={item.up ? "node-up" : "node-dn"}>
                  {item.up ? "▲" : "▼"} {item.pct}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* DASHBOARD GRID ARRANGEMENT */}
      <div className="dashboard-space">
        
        {/* LEFT COMPONENT COLUMN */}
        <div>
          
          {/* MATRIX INTERACTIVE CHOICE CARDS */}
          <div className="selection-matrix">
            {Object.keys(MCX_DATA).map((k) => {
              const node = MCX_DATA[k];
              const isSelected = selectedKey === k;
              return (
                <div key={k} className={`selector-cell ${isSelected ? 'active' : ''}`} onClick={() => setSelectedKey(k)}>
                  <div className="cell-name">{node.name.split(" ")[0]}</div>
                  <div className="cell-value">₹{node.price.toLocaleString()}</div>
                  <span className={`pill-badge ${node.up ? 'pill-up' : 'pill-dn'}`}>
                    {node.change} ({node.pct})
                  </span>
                </div>
              );
            })}
          </div>

          {/* DYNAMIC CHART HOUSING CONTAINER */}
          <div className="card-wrapper">
            <div className="card-header-main">
              <div>
                <div className="card-title-main">{activeCommodity.name} Intraday Performance</div>
                <div style={{ fontSize: "12px", color: P.textM, marginTop: "4px" }}>Ticks updated via socket stream · Unit: Per {activeCommodity.unit}</div>
              </div>
              <span className={`pill-badge ${activeCommodity.up ? 'pill-up' : 'pill-dn'}`} style={{ padding: "8px 14px", fontSize: "14px" }}>
                Current Spot Trend: {activeCommodity.pct}
              </span>
            </div>
            
            <div style={{ width: "100%", height: 320, marginTop: 10 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activeCommodity.history}>
                  <defs>
                    <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={activeCommodity.up ? P.bull : P.accent} stopOpacity={0.25}/>
                      <stop offset="95%" stopColor={activeCommodity.up ? P.bull : P.accent} stopOpacity={0.00}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.border} />
                  <XAxis dataKey="t" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: P.textM }} />
                  <YAxis domain={['dataMin - 50', 'dataMax + 50']} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v.toLocaleString()}`} tick={{ fontSize: 11, fill: P.textM }} width={65} />
                  <Tooltip contentStyle={{ background: P.darkNav, color: "white", borderRadius: "10px", border: "none" }} />
                  <Area type="monotone" dataKey="p" name="Rate" stroke={activeCommodity.up ? P.bull : P.accent} strokeWidth={2.5} fillOpacity={1} fill="url(#chartGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SPOT VALUE TABLES COMPONENT */}
          <div className="card-wrapper">
            <div className="card-header-main" style={{ marginBottom: "12px" }}>
              <div className="card-title-main">National Spot Mandi Board</div>
              <div className="tab-row" style={{ marginBottom: 0, borderBottom: "none" }}>
                <span className={`tab-node ${activeMandiTab === 'agri' ? 'active' : ''}`} onClick={() => setActiveMandiTab('agri')}>Agricultural Goods</span>
                <span className={`tab-node ${activeMandiTab === 'metals' ? 'active' : ''}`} onClick={() => setActiveMandiTab('metals')}>Metals & Industrials</span>
              </div>
            </div>

            <table className="mandi-matrix">
              <thead>
                <tr>
                  <th>Commodity Variant</th>
                  <th>Primary Mandi Hub</th>
                  <th>Today's Arrivals</th>
                  <th style={{ textAlign: "right" }}>Benchmark Rate</th>
                </tr>
              </thead>
              <tbody>
                {activeMandiDataset.map((row, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 600, color: P.text }}>{row.item}</td>
                    <td style={{ color: P.textM, fontWeight: 500 }}>📍 {row.location}</td>
                    <td style={{ color: P.textM, fontStyle: "italic", fontSize: "13px" }}>{row.arrival}</td>
                    <td style={{ textAlign: "right" }}>
                      <div style={{ fontWeight: 700 }}>₹{row.price.toLocaleString()}</div>
                      <span className={row.up ? "node-up" : "node-dn"} style={{ fontSize: "12px", fontWeight: 600 }}>{row.trend}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        {/* RIGHT COLUMN SIDEBAR */}
        <div>
          
          {/* PREMIUM LIVE HEADLINES BOX */}
          <div className="card-wrapper">
            <div className="card-header-main">
              <div className="card-title-main">Commodity Intelligence Feed</div>
              <span style={{ fontSize: "11px", fontWeight: 700, color: P.textSub, textTransform: "uppercase" }}>Flash</span>
            </div>
            <div>
              {FLASH_NEWS.map((news) => (
                <div key={news.id} className="news-block">
                  <div className="news-meta">
                    <span>⚡</span>
                    <span>{news.time}</span>
                  </div>
                  <div className="news-content">{news.text}</div>
                </div>
              ))}
            </div>
          </div>

          {/* INTEGRATED FREIGHT & VALUE MATRIX CALCULATOR */}
          <div className="card-wrapper" style={{ border: `1.5px solid ${P.accent}`, background: "#FFFDF9" }}>
            <div className="card-title-main" style={{ fontSize: "16px", color: P.text }}>
              🧮 Smart Bulk Value Estimator
            </div>
            <p style={{ fontSize: "13px", color: P.textM, marginTop: "6px", lineHeight: 1.4 }}>
              Selected Index: <b>{activeCommodity.name.split(" ")[1]}</b> ke conversion calculation estimation system check karein.
            </p>
            
            <div className="calc-input-group">
              <div className="calc-box">
                <label>Enter Volume ({activeCommodity.unit === 'Quintal' ? 'Quintal' : 'Units'})</label>
                <input type="number" value={calcQty} onChange={(e) => setCalcQty(Number(e.target.value))} min="1" />
              </div>
              <div className="calc-box" style={{ background: P.accentL, borderColor: "transparent" }}>
                <label style={{ color: P.accent }}>Estimated Value</label>
                <div style={{ fontSize: "16px", fontWeight: "800", color: P.text, marginTop: "4px" }}>
                  ₹{(calcQty * activeCommodity.price).toLocaleString()}
                </div>
              </div>
            </div>
            
            <div style={{ marginTop: "16px", fontSize: "11px", color: P.textSub, textAlign: "center", fontWeight: 500 }}>
              *This computes real-time pricing indicators without freight tariffs.
            </div>
          </div>

          {/* WHATSAPP PUSH PROFILE ALERT PANEL */}
          <div className="card-wrapper" style={{ background: P.darkNav, color: "white", textAlign: "center", padding: "28px" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>📱</div>
            <h4 style={{ fontSize: "16px", fontWeight: 700, marginBottom: "6px" }}>Instant WhatsApp Mandi Alert</h4>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: "18px" }}>
              Apni pasand ki mandi ke daily open-close prices aur arrivals seedhe instant alert par set karein.
            </p>
            <button style={{ background: P.accent, color: "white", width: "100%", padding: "12px", border: "none", borderRadius: "8px", fontWeight: 700, cursor: "pointer", fontSize: "14px" }}>
              Activate Free Price Lock Alerts
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

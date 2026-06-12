import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from "recharts";

/* ══════════════════════════════════════════════
   PALETTE — "Neo-FinTech"
   Clean white/gray backgrounds, sharp data colors
══════════════════════════════════════════════ */
const P = {
  bg: "#F3F4F6",         // Very light gray for body
  surface: "#FFFFFF",    // White for cards
  text: "#111827",       // Deep dark gray for headings
  textSub: "#6B7280",    // Mid gray for secondary text
  border: "#E5E7EB",     // Light border
  bull: "#10B981",       // Emerald Green (Up)
  bullBg: "#D1FAE5",     // Light Green bg
  bear: "#EF4444",       // Ruby Red (Down)
  bearBg: "#FEE2E2",     // Light Red bg
  accent: "#2563EB",     // Royal Blue for buttons/tabs
  accentBg: "#DBEAFE",
  gold: "#F59E0B",
  darkNav: "#1F2937",
};

/* ══════════════════════════════════════════════
   MOCK DATA
══════════════════════════════════════════════ */
const MCX_TICKER = [
  { name: "GOLD", price: 62450, change: 120, pct: 0.19, up: true },
  { name: "SILVER", price: 74200, change: -350, pct: -0.47, up: false },
  { name: "CRUDEOIL", price: 6420, change: 85, pct: 1.34, up: true },
  { name: "COPPER", price: 715.4, change: 2.1, pct: 0.29, up: true },
  { name: "ZINC", price: 224.5, change: -1.2, pct: -0.53, up: false },
  { name: "NATURALGAS", price: 185.2, change: -4.5, pct: -2.37, up: false },
];

const SPOT_MANDI = [
  { item: "Garlic (Super)", mandi: "Mandsaur", price: "₹12,400", trend: "+2.4%" },
  { item: "Soybean", mandi: "Indore", price: "₹4,650", trend: "-1.2%" },
  { item: "Jeera", mandi: "Unjha", price: "₹28,500", trend: "+5.1%" },
  { item: "Chana", mandi: "Bikaner", price: "₹5,800", trend: "+0.8%" },
  { item: "Mustard", mandi: "Jaipur", price: "₹5,420", trend: "-0.5%" },
];

const NEWS = [
  { time: "10:45 AM", title: "Gold prices hit new resistance level amid US Fed rate pause expectations." },
  { time: "09:30 AM", title: "Mandsaur mandi sees highest garlic arrivals this season; quality remains premium." },
  { time: "08:15 AM", title: "Crude oil stabilizes as Middle East supply concerns ease slightly." },
  { time: "Yesterday", title: "Soybean crush margins improve for Indore plants ahead of festive demand." },
];

const CHART_DATA_GOLD = [
  { time: "09:00", price: 62100 }, { time: "10:00", price: 62250 },
  { time: "11:00", price: 62180 }, { time: "12:00", price: 62300 },
  { time: "13:00", price: 62450 }, { time: "14:00", price: 62400 },
];

/* ══════════════════════════════════════════════
   CSS (Mobile-First, Responsive Grid)
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: ${P.bg}; color: ${P.text}; }

/* NAV */
.nav { background: ${P.darkNav}; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; color: white; position: sticky; top: 0; z-index: 50; }
.logo { font-size: 20px; font-weight: 700; letter-spacing: -0.5px; display: flex; align-items: center; gap: 8px; }
.logo span { color: ${P.gold}; }
.search-bar { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); border-radius: 8px; padding: 8px 16px; color: white; width: 300px; outline: none; }
.search-bar::placeholder { color: rgba(255,255,255,0.5); }
@media (max-width: 600px) { .search-bar { display: none; } }

/* TICKER */
.ticker-wrap { background: ${P.surface}; border-bottom: 1px solid ${P.border}; overflow: hidden; display: flex; height: 40px; align-items: center; }
.ticker-title { background: ${P.accent}; color: white; font-weight: 600; font-size: 11px; padding: 0 16px; height: 100%; display: flex; align-items: center; z-index: 10; text-transform: uppercase; letter-spacing: 1px; }
.ticker-move { display: flex; animation: marquee 30s linear infinite; white-space: nowrap; }
.ticker-move:hover { animation-play-state: paused; }
.ticker-item { display: flex; align-items: center; gap: 8px; padding: 0 24px; border-right: 1px solid ${P.border}; font-size: 13px; font-weight: 500; }
.t-up { color: ${P.bull}; } .t-dn { color: ${P.bear}; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }

/* MAIN LAYOUT */
.container { max-width: 1400px; margin: 0 auto; padding: 24px; display: grid; grid-template-columns: 1fr 350px; gap: 24px; }
@media (max-width: 1024px) { .container { grid-template-columns: 1fr; padding: 16px; } }

/* CARDS */
.card { background: ${P.surface}; border: 1px solid ${P.border}; border-radius: 12px; padding: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.card-title { font-size: 16px; font-weight: 600; margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; }
.card-title-link { font-size: 12px; color: ${P.accent}; cursor: pointer; font-weight: 500; }

/* MARKET OVERVIEW GRID */
.market-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
.mkt-card { background: ${P.surface}; border: 1px solid ${P.border}; border-radius: 10px; padding: 16px; display: flex; flex-direction: column; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; }
.mkt-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-color: ${P.accent}; }
.mkt-name { font-size: 13px; color: ${P.textSub}; font-weight: 500; margin-bottom: 8px; }
.mkt-price { font-size: 24px; font-weight: 700; margin-bottom: 4px; }
.mkt-badge { display: inline-block; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 600; }
.badge-up { background: ${P.bullBg}; color: ${P.bull}; }
.badge-dn { background: ${P.bearBg}; color: ${P.bear}; }

/* TABLE */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 12px 8px; font-size: 11px; text-transform: uppercase; color: ${P.textSub}; border-bottom: 1px solid ${P.border}; font-weight: 600; }
.data-table td { padding: 14px 8px; font-size: 14px; border-bottom: 1px solid ${P.border}; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: ${P.bg}; cursor: pointer; }
.item-primary { font-weight: 600; color: ${P.text}; }
.item-sub { font-size: 12px; color: ${P.textSub}; display: block; margin-top: 2px; }

/* NEWS FEED */
.news-item { padding: 16px 0; border-bottom: 1px solid ${P.border}; }
.news-item:last-child { border-bottom: none; }
.news-time { font-size: 11px; color: ${P.textSub}; font-weight: 600; margin-bottom: 6px; display: flex; align-items: center; gap: 4px; }
.news-title { font-size: 14px; line-height: 1.5; color: ${P.text}; cursor: pointer; }
.news-title:hover { color: ${P.accent}; text-decoration: underline; }

/* TABS */
.tabs { display: flex; gap: 16px; margin-bottom: 16px; border-bottom: 1px solid ${P.border}; }
.tab { padding: 8px 0; font-size: 14px; font-weight: 500; color: ${P.textSub}; cursor: pointer; position: relative; }
.tab.active { color: ${P.accent}; font-weight: 600; }
.tab.active::after { content: ''; position: absolute; bottom: -1px; left: 0; right: 0; height: 2px; background: ${P.accent}; }
`;

/* ══════════════════════════════════════════════
   COMPONENTS
══════════════════════════════════════════════ */
export default function CommodityDashboard() {
  const [activeTab, setActiveTab] = useState("agri");

  return (
    <>
      <style>{CSS}</style>

      {/* NAVBAR */}
      <nav className="nav">
        <div className="logo">
          📊 Commo<span>Pro</span>
        </div>
        <input type="text" className="search-bar" placeholder="Search commodities, mandis..." />
      </nav>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-title">MCX LIVE</div>
        <div className="ticker-move">
          {[...MCX_TICKER, ...MCX_TICKER].map((item, i) => (
            <div key={i} className="ticker-item">
              <span>{item.name}</span>
              <span>₹{item.price.toLocaleString()}</span>
              <span className={item.up ? "t-up" : "t-dn"}>
                {item.up ? "▲" : "▼"} {Math.abs(item.change)} ({item.pct}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="container">
        
        {/* LEFT COLUMN: Main Markets & Charts */}
        <div>
          {/* MARKET OVERVIEW CARDS */}
          <div className="market-grid">
            <div className="mkt-card">
              <div className="mkt-name">MCX GOLD (10g)</div>
              <div className="mkt-price">₹62,450</div>
              <div><span className="mkt-badge badge-up">+₹120 (0.19%)</span></div>
            </div>
            <div className="mkt-card">
              <div className="mkt-name">NCDEX SOYBEAN (100kg)</div>
              <div className="mkt-price">₹4,650</div>
              <div><span className="mkt-badge badge-dn">-₹45 (0.95%)</span></div>
            </div>
            <div className="mkt-card">
              <div className="mkt-name">MANDSAUR GARLIC (100kg)</div>
              <div className="mkt-price">₹12,400</div>
              <div><span className="mkt-badge badge-up">+₹200 (2.40%)</span></div>
            </div>
          </div>

          {/* INTERACTIVE CHART SECTION */}
          <div className="card" style={{ marginBottom: "24px" }}>
            <div className="card-title">
              Gold Intraday Chart
              <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
                <span className="tab active">1D</span>
                <span className="tab">1W</span>
                <span className="tab">1M</span>
              </div>
            </div>
            <div style={{ height: "300px", width: "100%" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA_GOLD}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={P.accent} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={P.accent} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={P.border} />
                  <XAxis dataKey="time" tickLine={false} axisLine={false} tick={{fontSize: 12, fill: P.textSub}} />
                  <YAxis domain={['dataMin - 100', 'dataMax + 100']} tickLine={false} axisLine={false} tick={{fontSize: 12, fill: P.textSub}} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: `1px solid ${P.border}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="price" stroke={P.accent} strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* SPOT MARKETS TABLE */}
          <div className="card">
            <div className="card-title">
              Spot Mandi Rates
              <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
                <span className={activeTab === 'agri' ? "tab active" : "tab"} onClick={() => setActiveTab('agri')}>Agri</span>
                <span className={activeTab === 'metals' ? "tab active" : "tab"} onClick={() => setActiveTab('metals')}>Base Metals</span>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Commodity</th>
                  <th>Mandi / Location</th>
                  <th style={{textAlign: 'right'}}>Price (Quintal)</th>
                  <th style={{textAlign: 'right'}}>Trend</th>
                </tr>
              </thead>
              <tbody>
                {SPOT_MANDI.map((item, i) => (
                  <tr key={i}>
                    <td>
                      <span className="item-primary">{item.item}</span>
                    </td>
                    <td className="item-sub" style={{marginTop: 0, fontSize: '13px'}}>{item.mandi}</td>
                    <td style={{textAlign: 'right', fontWeight: 600}}>{item.price}</td>
                    <td style={{textAlign: 'right'}}>
                      <span className={item.trend.includes('+') ? "t-up" : "t-dn"} style={{fontSize: '13px', fontWeight: 600}}>
                        {item.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN: News & Insights */}
        <div>
          <div className="card" style={{ marginBottom: "24px" }}>
            <div className="card-title">
              Market News
              <span className="card-title-link">View All</span>
            </div>
            <div>
              {NEWS.map((n, i) => (
                <div key={i} className="news-item">
                  <div className="news-time">⏱ {n.time}</div>
                  <div className="news-title">{n.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS / ALERTS */}
          <div className="card" style={{ background: P.accentBg, borderColor: '#BFDBFE' }}>
            <h3 style={{ fontSize: '15px', color: '#1E3A8A', marginBottom: '8px' }}>Create Price Alert</h3>
            <p style={{ fontSize: '13px', color: '#3B82F6', marginBottom: '16px', lineHeight: 1.5 }}>
              Never miss a market move. Set custom alerts for MCX or local mandi prices via WhatsApp.
            </p>
            <button style={{ width: '100%', background: P.accent, color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
              + Set Alert
            </button>
          </div>
        </div>

      </div>
    </>
  );
}

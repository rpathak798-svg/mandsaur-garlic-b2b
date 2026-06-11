import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ══════════════════════════════════════════════
   WHATSAPP
══════════════════════════════════════════════ */
const WA = "917772993222";
const waMsg = (t) => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;
const waDefault = waMsg("Namaskar! 🧄 MandsaurGarlic.com se inquiry kar raha hoon. Kripya garlic ki jankari dijiye.");

/* ══════════════════════════════════════════════
   PALETTE — "Khet aur Mandi"
   Ivory page, deep forest nav, saffron accents
   Risk: Warm ivory background (NOT dark) — 
   bright airy like a premium commodity catalog
══════════════════════════════════════════════ */
const P = {
  ivory:   "#FEFAF2",
  parchm: "#F5EDD8",
  border:  "#E2D5B8",
  forest:  "#1A3A2A",
  forestL: "#2A5A3A",
  leaf:    "#3A8A50",
  leafL:   "#5AB870",
  saffron: "#D4820A",
  amber:   "#F0A030",
  amberL:  "#FFCC60",
  clove:   "#8B4513",
  text:    "#1A1A0A",
  textM:   "#4A4030",
  textD:   "#8A7860",
  white:   "#FFFFFF",
  red:     "#C84030",
  blue:    "#2060A0",
};

/* ══════════════════════════════════════════════
   DATA
══════════════════════════════════════════════ */
const PRODUCTS = [
  { id:1, name:"Super Grade White", size:"55-65mm", shelf:"18 months", origin:"Mandsaur", price:"₹8,200–12,800/q",
    tag:"Export Ready", tagC:P.blue,
    desc:"Bold white bulbs, tightly packed cloves, low moisture. Preferred by Dubai, Bangladesh, Malaysia buyers. Phytosanitary available.",
    icon:"🧄" },
  { id:2, name:"A Grade Premium", size:"45-55mm", shelf:"14 months", origin:"Neemuch / Mandsaur", price:"₹6,500–9,800/q",
    tag:"Most Popular", tagC:P.saffron,
    desc:"India's most traded grade. Consistent sizing, clean curing. Ideal for domestic wholesale, hotel supply chains, food processors.",
    icon:"🧄" },
  { id:3, name:"Organic Certified", size:"35-50mm", shelf:"12 months", origin:"Dalauda, MP", price:"₹11,500–14,000/q",
    tag:"NPOP Certified", tagC:P.leaf,
    desc:"Zero chemicals, lab-verified. Certificate of Analysis available. Preferred by health supplement and nutraceutical companies.",
    icon:"🌿" },
  { id:4, name:"Desi Garlic", size:"30-45mm", shelf:"16 months", origin:"Sitamau / Garoth", price:"₹5,800–8,500/q",
    tag:"High Allicin", tagC:P.clove,
    desc:"Traditional Indian variety. Stronger pungency, higher allicin content. Used in Ayurvedic preparations and premium pickles.",
    icon:"🧄" },
  { id:5, name:"Processing Grade", size:"25-38mm", shelf:"10 months", origin:"Ratlam / Jaora", price:"₹3,500–5,700/q",
    tag:"Bulk Available", tagC:P.textD,
    desc:"Ideal for garlic powder, paste, dehydrated flakes. High volume availability. Factory direct pricing for 100q+ orders.",
    icon:"🏭" },
  { id:6, name:"Kali / Single Clove", size:"20-30mm", shelf:"20 months", origin:"Mandsaur Special", price:"₹14,000–18,000/q",
    tag:"Premium Rare", tagC:P.red,
    desc:"Single clove garlic — highest medicinal value. Intense flavour. Limited seasonal availability. Sought by export and pharma buyers.",
    icon:"⚫" },
];

const MANDI = [
  { name:"Mandsaur", grade:"Super",   min:8200,  max:12800, arr:"18,400", ch:+12.4 },
  { name:"Neemuch",  grade:"A Grade", min:6500,  max:9800,  arr:"22,100", ch:+8.1  },
  { name:"Ratlam",   grade:"A Grade", min:5800,  max:8500,  arr:"9,200",  ch:-3.2  },
  { name:"Dalauda",  grade:"B Grade", min:4200,  max:6200,  arr:"5,700",  ch:+5.7  },
  { name:"Jaora",    grade:"B Grade", min:3800,  max:5700,  arr:"3,400",  ch:-1.8  },
  { name:"Indore",   grade:"Super",   min:9000,  max:14500, arr:"11,800", ch:+15.3 },
  { name:"Ujjain",   grade:"A Grade", min:6200,  max:9100,  arr:"7,600",  ch:+4.2  },
];

const REVIEWS = [
  { name:"Al Baraka Trading", loc:"Dubai, UAE", stars:5, text:"Consistent Super grade quality across 3 container shipments. Phytosanitary documentation perfect every time. Our preferred Mandsaur supplier.", role:"Bulk Importer" },
  { name:"Ramesh Agarwal", loc:"Delhi Wholesale Market", stars:5, text:"15 saal se kharid rahe hain. Quality kabhi down nahi hui. Sahi daam aur seedha dealing — yahi kaam aata hai.", role:"Wholesale Buyer" },
  { name:"BD Food Imports Ltd", loc:"Dhaka, Bangladesh", stars:5, text:"We import 4-5 containers monthly. MandsaurGarlic team is responsive and shipments are always on time. Highly recommend.", role:"Export Buyer" },
  { name:"Suresh Retailers", loc:"Mumbai", stars:5, text:"A Grade ki quality bilkul consistent hai. Hotel chain supply ke liye best source mila hai Mandsaur se.", role:"Hotel Chain Supplier" },
];

const TIMELINE = [
  { year:"2010", event:"Garlic Wala Trading Founded", sub:"Mandsaur mandi se humble beginnings" },
  { year:"2015", event:"Pan-India Network Built", sub:"Delhi, Mumbai, Bangalore wholesale markets connected" },
  { year:"2019", event:"First Export Shipment", sub:"Bangladesh — 3 containers Super grade" },
  { year:"2022", event:"Export to 8 Countries", sub:"UAE, Malaysia, Indonesia, Sri Lanka added" },
  { year:"2024", event:"MandsaurGarlic.com Launched", sub:"India's first dedicated garlic B2B platform" },
  { year:"2026", event:"850T Daily Platform Volume", sub:"2,400+ farmers, 14 countries, real-time mandi bhav" },
];

const PRICE_DATA = [
  {m:"Jan",super:6200,agrade:4800},{m:"Feb",super:5800,agrade:4200},
  {m:"Mar",super:7400,agrade:5600},{m:"Apr",super:9800,agrade:7200},
  {m:"May",super:12400,agrade:9100},{m:"Jun",super:11800,agrade:8600},
];

const CERTS = ["Phytosanitary Certificate","Certificate of Origin","FSSAI Certificate","Organic Certificate (NPOP)","Lab Analysis Report","Fumigation Certificate"];
const COUNTRIES = ["Bangladesh","UAE / Dubai","Malaysia","Indonesia","Sri Lanka","Nepal","USA","UK","Canada","Singapore","Other"];

/* ══════════════════════════════════════════════
   CSS
══════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Inter:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior:smooth; }
body {
  font-family:'Inter',sans-serif;
  background:${P.ivory};
  color:${P.text};
  overflow-x:hidden;
}
::-webkit-scrollbar { width:5px; }
::-webkit-scrollbar-track { background:${P.parchm}; }
::-webkit-scrollbar-thumb { background:${P.border}; border-radius:3px; }

/* ── NAV ── */
.nav {
  position:fixed; top:0; left:0; right:0; z-index:100;
  height:68px;
  display:flex; align-items:center; justify-content:space-between;
  padding:0 40px;
  background:${P.forest};
  border-bottom:2px solid rgba(240,160,48,0.3);
  box-shadow:0 2px 24px rgba(0,0,0,0.25);
}
.nav-logo {
  display:flex; align-items:center; gap:12px;
  text-decoration:none; cursor:pointer;
}
.nav-logo-mark {
  width:42px; height:42px; border-radius:10px;
  background:linear-gradient(135deg,${P.amber},${P.saffron});
  display:flex; align-items:center; justify-content:center;
  font-size:22px;
  box-shadow:0 4px 12px rgba(212,130,10,0.4);
}
.nav-logo-name {
  font-family:'Cormorant Garamond',serif;
  font-size:22px; font-weight:700; color:${P.ivory};
  letter-spacing:-.3px; line-height:1;
}
.nav-logo-name em { color:${P.amber}; font-style:italic; }
.nav-logo-sub { font-size:9px; color:rgba(255,255,255,0.45); letter-spacing:1.5px; text-transform:uppercase; }
.nav-links { display:flex; align-items:center; gap:6px; }
.nav-link {
  padding:7px 16px; border-radius:7px;
  font-size:13px; font-weight:500; color:rgba(255,255,255,0.7);
  background:transparent; border:none; cursor:pointer;
  transition:all .18s; white-space:nowrap;
}
.nav-link:hover { color:#fff; background:rgba(255,255,255,0.08); }
.nav-link.active { color:${P.amber}; background:rgba(212,130,10,0.15); }
.nav-cta {
  padding:9px 22px; border-radius:8px; border:none; cursor:pointer;
  background:linear-gradient(135deg,${P.amber},${P.saffron});
  color:#fff; font-family:'Inter',sans-serif;
  font-size:13px; font-weight:700;
  box-shadow:0 4px 14px rgba(212,130,10,0.35);
  transition:all .18s; white-space:nowrap;
}
.nav-cta:hover { transform:translateY(-1px); box-shadow:0 6px 20px rgba(212,130,10,0.45); }

/* ── TICKER ── */
.ticker {
  position:fixed; top:68px; left:0; right:0; z-index:99;
  height:32px; display:flex; align-items:center; overflow:hidden;
  background:${P.forest};
  border-bottom:1px solid rgba(240,160,48,0.2);
}
.ticker-label {
  flex-shrink:0; background:${P.amber}; color:#1a0800;
  padding:0 14px; height:100%; display:flex; align-items:center;
  font-size:9px; font-weight:800; letter-spacing:1.5px; margin-right:16px;
}
.ticker-wrap { overflow:hidden; flex:1; }
.ticker-inner {
  display:flex; animation:tickscroll 32s linear infinite; white-space:nowrap;
}
.ticker-inner:hover { animation-play-state:paused; }
.ti { display:inline-flex; align-items:center; gap:8px; padding:0 20px; font-size:11px; color:rgba(255,255,255,0.6); border-right:1px solid rgba(255,255,255,0.1); height:32px; }
.ti b { color:rgba(255,255,255,0.9); font-weight:600; }
.tup { color:${P.leafL}; font-weight:700; }
.tdn { color:#FF7070; font-weight:700; }
@keyframes tickscroll { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

/* ── HERO ── */
.hero {
  min-height:100vh;
  padding-top:100px;
  background:
    linear-gradient(170deg, ${P.forest} 0%, ${P.forestL} 45%, ${P.forest} 100%);
  display:flex; align-items:center;
  position:relative; overflow:hidden;
}
.hero-pattern {
  position:absolute; inset:0; opacity:.05;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 40px, rgba(240,160,48,.3) 40px, rgba(240,160,48,.3) 41px),
    repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(240,160,48,.3) 40px, rgba(240,160,48,.3) 41px);
}
.hero-garlic-right {
  position:absolute; right:-40px; top:50%; transform:translateY(-55%);
  font-size:420px; opacity:.06; line-height:1; pointer-events:none;
  filter:grayscale(1);
}
.hero-inner {
  max-width:1100px; margin:0 auto; padding:60px 40px;
  display:grid; grid-template-columns:1fr 420px; gap:60px; align-items:center;
  position:relative; z-index:1;
}
@media(max-width:900px){ .hero-inner{grid-template-columns:1fr;padding:40px 24px;} }
.hero-tag {
  display:inline-flex; align-items:center; gap:7px; margin-bottom:20px;
  background:rgba(240,160,48,0.15); border:1px solid rgba(240,160,48,0.35);
  color:${P.amberL}; font-size:10px; font-weight:700; letter-spacing:1.8px;
  text-transform:uppercase; padding:5px 14px; border-radius:20px;
}
.hero h1 {
  font-family:'Cormorant Garamond',serif;
  font-size:68px; line-height:1.02;
  color:${P.ivory}; margin-bottom:16px; font-weight:700;
}
.hero h1 em { color:${P.amber}; font-style:italic; }
.hero-sub {
  color:rgba(255,255,255,0.65); font-size:16px; line-height:1.75;
  margin-bottom:36px; max-width:500px;
}
.hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:52px; }
.btn-primary {
  padding:14px 32px; border-radius:10px; border:none; cursor:pointer;
  background:linear-gradient(135deg,${P.amber},${P.saffron}); color:#fff;
  font-family:'Inter',sans-serif; font-size:14px; font-weight:700;
  box-shadow:0 8px 24px rgba(212,130,10,0.4); transition:all .2s;
}
.btn-primary:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(212,130,10,0.5); }
.btn-ghost {
  padding:14px 30px; border-radius:10px; cursor:pointer;
  background:rgba(255,255,255,0.08); color:${P.ivory};
  font-family:'Inter',sans-serif; font-size:14px; font-weight:600;
  border:1px solid rgba(255,255,255,0.2); transition:all .2s;
}
.btn-ghost:hover { background:rgba(255,255,255,0.14); border-color:rgba(255,255,255,0.35); }
.hero-stats {
  display:grid; grid-template-columns:repeat(3,1fr);
  border:1px solid rgba(255,255,255,0.1); border-radius:14px; overflow:hidden;
  background:rgba(255,255,255,0.04);
}
.hstat { padding:18px 16px; text-align:center; border-right:1px solid rgba(255,255,255,0.08); }
.hstat:last-child { border-right:none; }
.hstat-n {
  font-family:'Cormorant Garamond',serif;
  font-size:34px; font-weight:700; color:${P.amber}; display:block; line-height:1;
}
.hstat-l { font-size:10px; color:rgba(255,255,255,0.5); margin-top:4px; text-transform:uppercase; letter-spacing:.7px; }

/* HERO RIGHT CARD */
.hero-card {
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(240,160,48,0.25);
  border-radius:20px; padding:26px;
  backdrop-filter:blur(10px);
}
.hcard-label { font-size:9px; font-weight:700; color:${P.amber}; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:16px; display:flex; align-items:center; gap:6px; }
.hpulse { width:6px; height:6px; border-radius:50%; background:${P.leafL}; animation:blink 1.4s infinite; }
@keyframes blink { 0%,100%{opacity:1} 50%{opacity:.3} }
.hcard-row { display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.07); }
.hcard-row:last-child { border-bottom:none; }
.hcard-key { font-size:12px; color:rgba(255,255,255,0.55); }
.hcard-val { font-size:13px; font-weight:600; color:#fff; text-align:right; }
.hcard-up { font-size:10px; color:${P.leafL}; font-weight:700; }
.hcard-dn { font-size:10px; color:#FF7070; font-weight:700; }

/* ── SECTIONS ── */
.section { max-width:1100px; margin:0 auto; padding:100px 40px; }
@media(max-width:700px){ .section{padding:70px 20px;} }
.section-label {
  font-size:10px; font-weight:700; letter-spacing:2px; text-transform:uppercase;
  color:${P.saffron}; margin-bottom:10px; display:flex; align-items:center; gap:8px;
}
.section-label::before { content:''; display:block; width:24px; height:2px; background:${P.amber}; }
.section-title {
  font-family:'Cormorant Garamond',serif;
  font-size:48px; font-weight:700; color:${P.forest};
  line-height:1.1; margin-bottom:12px;
}
.section-title em { color:${P.saffron}; font-style:italic; }
.section-sub { font-size:15px; color:${P.textM}; line-height:1.7; max-width:600px; }

/* ── WHY US ── */
.why-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:16px; margin-top:48px; }
.why-card {
  background:${P.white};
  border:1px solid ${P.border};
  border-radius:16px; padding:28px 24px;
  transition:all .22s;
  position:relative; overflow:hidden;
}
.why-card::before {
  content:''; position:absolute; top:0; left:0; right:0; height:3px;
  background:var(--accent,${P.amber});
}
.why-card:hover { transform:translateY(-4px); box-shadow:0 16px 40px rgba(26,58,42,0.1); border-color:${P.amber}; }
.why-icon { font-size:32px; margin-bottom:14px; }
.why-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:${P.forest}; margin-bottom:8px; }
.why-text { font-size:13px; color:${P.textM}; line-height:1.65; }

/* ── PRODUCTS ── */
.products-bg { background:${P.forest}; }
.products-inner { max-width:1100px; margin:0 auto; padding:100px 40px; }
@media(max-width:700px){ .products-inner{padding:70px 20px;} }
.products-inner .section-title { color:${P.ivory}; }
.products-inner .section-sub { color:rgba(255,255,255,0.6); }
.products-inner .section-label { color:${P.amberL}; }
.prod-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(320px,1fr)); gap:18px; margin-top:48px; }
.prod-card {
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:16px; overflow:hidden;
  transition:all .22s; cursor:pointer;
}
.prod-card:hover {
  background:rgba(255,255,255,0.09);
  border-color:rgba(240,160,48,0.45);
  transform:translateY(-3px);
  box-shadow:0 16px 40px rgba(0,0,0,0.3);
}
.prod-top {
  padding:22px 22px 16px;
  background:linear-gradient(135deg,rgba(240,160,48,0.1),rgba(58,138,80,0.06));
  border-bottom:1px solid rgba(255,255,255,0.07);
  display:flex; justify-content:space-between; align-items:flex-start;
}
.prod-icon { font-size:36px; }
.prod-tag { font-size:10px; font-weight:700; letter-spacing:.5px; padding:3px 10px; border-radius:5px; text-transform:uppercase; border:1px solid; }
.prod-body { padding:18px 22px; }
.prod-name { font-family:'Cormorant Garamond',serif; font-size:21px; font-weight:700; color:${P.ivory}; margin-bottom:8px; line-height:1.2; }
.prod-desc { font-size:12px; color:rgba(255,255,255,0.55); line-height:1.65; margin-bottom:16px; }
.prod-specs { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:18px; }
.prod-spec { font-size:11px; color:rgba(255,255,255,0.5); background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.1); padding:3px 9px; border-radius:5px; }
.prod-foot { display:flex; align-items:center; justify-content:space-between; padding-top:14px; border-top:1px solid rgba(255,255,255,0.08); }
.prod-price { font-family:'Cormorant Garamond',serif; font-size:22px; font-weight:700; color:${P.amber}; }
.prod-price sub { font-size:11px; color:rgba(255,255,255,0.4); font-family:'Inter',sans-serif; font-weight:400; }
.prod-btn {
  background:linear-gradient(135deg,rgba(240,160,48,.2),rgba(212,130,10,.15));
  color:${P.amber}; border:1px solid rgba(240,160,48,.35);
  padding:8px 18px; border-radius:8px; font-size:12px; font-weight:700; cursor:pointer; transition:all .18s;
}
.prod-btn:hover { background:linear-gradient(135deg,${P.amber},${P.saffron}); color:#fff; border-color:${P.amber}; }

/* ── BHAV / MANDI ── */
.mandi-table-wrap {
  background:${P.white}; border:1px solid ${P.border}; border-radius:16px;
  overflow:hidden; margin-top:40px;
  box-shadow:0 4px 20px rgba(26,58,42,0.06);
}
.mandi-hd {
  background:${P.forest}; padding:16px 24px;
  display:flex; justify-content:space-between; align-items:center;
  border-bottom:1px solid rgba(255,255,255,0.1);
}
.mandi-hd h3 { font-family:'Cormorant Garamond',serif; font-size:20px; color:${P.ivory}; font-weight:700; }
.mandi-hd span { font-size:11px; color:rgba(255,255,255,0.45); }
table { width:100%; border-collapse:collapse; }
thead th {
  background:${P.parchm}; padding:11px 20px;
  text-align:left; font-size:10px; font-weight:700;
  color:${P.saffron}; text-transform:uppercase; letter-spacing:.8px;
  border-bottom:1px solid ${P.border};
}
tbody td { padding:14px 20px; font-size:13px; border-bottom:1px solid ${P.border}; color:${P.textM}; }
tbody tr:last-child td { border-bottom:none; }
tbody tr:hover td { background:${P.parchm}; }
.mname { font-weight:700; color:${P.forest}; }
.mup { color:${P.leaf}; font-weight:700; }
.mdn { color:${P.red}; font-weight:700; }
.marr { color:${P.textD}; font-size:11px; }
.chart-wrap {
  background:${P.white}; border:1px solid ${P.border}; border-radius:16px;
  padding:24px; margin-top:20px;
  box-shadow:0 4px 20px rgba(26,58,42,0.06);
}
.chart-title { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:${P.forest}; margin-bottom:4px; }
.chart-sub { font-size:12px; color:${P.textD}; margin-bottom:20px; }
.ct { background:${P.ivory}; border:1px solid ${P.border}; border-radius:8px; padding:10px 14px; font-size:12px; }
.ct-lbl { color:${P.saffron}; font-weight:700; margin-bottom:6px; }
.ct-row { display:flex; justify-content:space-between; gap:14px; }
.ct-k { color:${P.textD}; } .ct-v { color:${P.text}; font-weight:600; }

/* ── EXPORT ── */
.export-bg { background:${P.parchm}; border-top:1px solid ${P.border}; border-bottom:1px solid ${P.border}; }
.export-grid { display:grid; grid-template-columns:1fr 1fr; gap:40px; align-items:start; }
@media(max-width:800px){ .export-grid{grid-template-columns:1fr;} }
.form-section-title { font-family:'Cormorant Garamond',serif; font-size:24px; font-weight:700; color:${P.forest}; margin-bottom:6px; }
.form-section-sub { font-size:13px; color:${P.textM}; margin-bottom:24px; line-height:1.6; }
.fgrid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
@media(max-width:560px){ .fgrid{grid-template-columns:1fr;} }
.fg { display:flex; flex-direction:column; gap:5px; }
.fl { font-size:10px; font-weight:700; color:${P.saffron}; text-transform:uppercase; letter-spacing:.6px; }
.fi,.fsel,.fta {
  background:${P.white}; border:1.5px solid ${P.border}; color:${P.text};
  padding:11px 14px; border-radius:10px;
  font-family:'Inter',sans-serif; font-size:13px;
  outline:none; transition:border-color .15s; width:100%;
}
.fi:focus,.fsel:focus,.fta:focus { border-color:${P.saffron}; box-shadow:0 0 0 3px rgba(212,130,10,0.1); }
.fi::placeholder,.fta::placeholder { color:${P.textD}; }
.fsel option { background:${P.white}; }
.fta { resize:vertical; min-height:90px; line-height:1.5; }
.fcheck { display:flex; align-items:center; gap:9px; padding:9px 12px; background:${P.white}; border:1.5px solid ${P.border}; border-radius:9px; cursor:pointer; transition:all .15s; }
.fcheck:hover { border-color:${P.saffron}; }
.fcheck input { accent-color:${P.saffron}; width:14px; height:14px; }
.fcheck-lbl { font-size:12px; color:${P.text}; }
.submit-btn {
  width:100%; padding:14px; border-radius:12px; border:none; cursor:pointer; margin-top:6px;
  background:linear-gradient(135deg,${P.forest},${P.forestL}); color:#fff;
  font-family:'Inter',sans-serif; font-size:15px; font-weight:700;
  box-shadow:0 8px 24px rgba(26,58,42,0.25); transition:all .2s;
}
.submit-btn:hover { transform:translateY(-2px); box-shadow:0 12px 32px rgba(26,58,42,0.35); }
.export-why { background:${P.white}; border:1px solid ${P.border}; border-radius:16px; padding:28px; }
.ew-item { display:flex; gap:14px; padding:14px 0; border-bottom:1px solid ${P.border}; }
.ew-item:last-child { border-bottom:none; }
.ew-icon { font-size:24px; flex-shrink:0; width:40px; height:40px; background:${P.parchm}; border-radius:10px; display:flex; align-items:center; justify-content:center; }
.ew-title { font-size:14px; font-weight:700; color:${P.forest}; margin-bottom:3px; }
.ew-sub { font-size:12px; color:${P.textM}; line-height:1.6; }

/* ── STORY / TIMELINE ── */
.timeline { position:relative; max-width:700px; margin:48px auto 0; }
.timeline::before { content:''; position:absolute; left:24px; top:0; bottom:0; width:2px; background:linear-gradient(to bottom,${P.amber},${P.forest}); }
.tl-item { display:flex; gap:20px; margin-bottom:36px; position:relative; }
.tl-dot { width:48px; height:48px; border-radius:50%; background:${P.forest}; border:3px solid ${P.amber}; display:flex; align-items:center; justify-content:center; flex-shrink:0; font-family:'Cormorant Garamond',serif; font-size:13px; font-weight:700; color:${P.amber}; z-index:1; }
.tl-body { padding-top:10px; }
.tl-year { font-size:11px; font-weight:700; color:${P.saffron}; text-transform:uppercase; letter-spacing:1px; margin-bottom:3px; }
.tl-event { font-family:'Cormorant Garamond',serif; font-size:20px; font-weight:700; color:${P.forest}; margin-bottom:3px; }
.tl-sub { font-size:12px; color:${P.textM}; }

/* ── REVIEWS ── */
.reviews-bg { background:${P.forest}; }
.reviews-inner { max-width:1100px; margin:0 auto; padding:100px 40px; }
@media(max-width:700px){ .reviews-inner{padding:70px 20px;} }
.reviews-inner .section-title { color:${P.ivory}; }
.reviews-inner .section-label { color:${P.amberL}; }
.rev-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); gap:16px; margin-top:48px; }
.rev-card {
  background:rgba(255,255,255,0.05);
  border:1px solid rgba(255,255,255,0.1);
  border-radius:16px; padding:24px;
  transition:all .2s;
}
.rev-card:hover { background:rgba(255,255,255,0.08); border-color:rgba(240,160,48,0.35); }
.rev-stars { color:${P.amber}; font-size:14px; margin-bottom:12px; letter-spacing:1px; }
.rev-text { font-size:13px; color:rgba(255,255,255,0.7); line-height:1.7; margin-bottom:16px; font-style:italic; }
.rev-name { font-size:14px; font-weight:700; color:${P.ivory}; }
.rev-loc { font-size:11px; color:rgba(255,255,255,0.45); margin-top:2px; }
.rev-role { display:inline-block; font-size:10px; font-weight:700; color:${P.amber}; background:rgba(240,160,48,0.12); border:1px solid rgba(240,160,48,0.25); padding:2px 9px; border-radius:5px; margin-top:6px; }

/* ── CONTACT ── */
.contact-grid { display:grid; grid-template-columns:1fr 1fr; gap:48px; margin-top:48px; }
@media(max-width:800px){ .contact-grid{grid-template-columns:1fr;} }
.contact-info { display:flex; flex-direction:column; gap:20px; }
.ci-item { display:flex; gap:14px; align-items:flex-start; }
.ci-icon { width:44px; height:44px; border-radius:11px; background:${P.forest}; display:flex; align-items:center; justify-content:center; font-size:18px; flex-shrink:0; }
.ci-title { font-size:13px; font-weight:700; color:${P.forest}; margin-bottom:3px; }
.ci-val { font-size:13px; color:${P.textM}; line-height:1.6; }
.ci-val a { color:${P.saffron}; text-decoration:none; }
.ci-val a:hover { text-decoration:underline; }
.contact-form-card { background:${P.white}; border:1px solid ${P.border}; border-radius:18px; padding:28px; box-shadow:0 8px 32px rgba(26,58,42,0.08); }

/* ── FOOTER ── */
.footer {
  background:${P.forest};
  padding:48px 40px 28px;
  border-top:2px solid rgba(240,160,48,0.2);
}
.footer-inner { max-width:1100px; margin:0 auto; }
.footer-top { display:grid; grid-template-columns:1fr 1fr 1fr; gap:40px; margin-bottom:40px; }
@media(max-width:700px){ .footer-top{grid-template-columns:1fr;gap:24px;} }
.footer-brand-name { font-family:'Cormorant Garamond',serif; font-size:24px; color:${P.ivory}; font-weight:700; margin-bottom:8px; }
.footer-brand-name em { color:${P.amber}; font-style:italic; }
.footer-brand-sub { font-size:12px; color:rgba(255,255,255,0.45); line-height:1.7; }
.footer-col-title { font-size:11px; font-weight:700; color:${P.amber}; text-transform:uppercase; letter-spacing:1px; margin-bottom:14px; }
.footer-link { display:block; font-size:13px; color:rgba(255,255,255,0.55); margin-bottom:8px; cursor:pointer; transition:color .15s; text-decoration:none; }
.footer-link:hover { color:${P.amberL}; }
.footer-bottom { border-top:1px solid rgba(255,255,255,0.08); padding-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; }
.footer-copy { font-size:12px; color:rgba(255,255,255,0.35); }
.footer-wa {
  display:inline-flex; align-items:center; gap:8px;
  background:#25D366; color:#fff;
  padding:8px 18px; border-radius:8px; text-decoration:none;
  font-size:13px; font-weight:700; transition:all .18s;
}
.footer-wa:hover { background:#1db954; }

/* ── MODALS / OVERLAYS ── */
.overlay { position:fixed; inset:0; background:rgba(0,0,0,.7); backdrop-filter:blur(8px); z-index:200; display:flex; align-items:center; justify-content:center; padding:20px; }
.modal {
  background:${P.white}; border-radius:20px;
  width:100%; max-width:560px; max-height:92vh; overflow-y:auto;
  box-shadow:0 32px 80px rgba(0,0,0,.4);
}
.modal-hd {
  background:${P.forest}; padding:22px 28px;
  border-radius:20px 20px 0 0;
  display:flex; justify-content:space-between; align-items:flex-start;
}
.modal-hd h2 { font-family:'Cormorant Garamond',serif; font-size:22px; color:${P.ivory}; font-weight:700; }
.modal-hd p { font-size:12px; color:rgba(255,255,255,0.55); margin-top:3px; }
.mclose { background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); color:rgba(255,255,255,0.8); width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; transition:all .15s; flex-shrink:0; }
.mclose:hover { background:rgba(255,255,255,0.2); color:#fff; }
.modal-body { padding:24px 28px; }
.mprice-box { background:${P.parchm}; border:1.5px solid ${P.border}; border-radius:12px; padding:16px 20px; margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; }
.mprice { font-family:'Cormorant Garamond',serif; font-size:36px; font-weight:700; color:${P.saffron}; }
.mprice-sub { font-size:11px; color:${P.textD}; margin-top:3px; }
.minfo-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:18px; }
.minfo { background:${P.parchm}; border:1px solid ${P.border}; border-radius:9px; padding:11px 14px; }
.minfo label { font-size:10px; color:${P.saffron}; text-transform:uppercase; letter-spacing:.5px; display:block; margin-bottom:4px; }
.minfo span { font-size:13px; font-weight:600; color:${P.text}; }
.mdesc { background:${P.parchm}; border:1px solid ${P.border}; border-radius:9px; padding:12px 16px; font-size:12px; color:${P.textM}; line-height:1.7; margin-bottom:20px; }
.wa-btn {
  width:100%; padding:13px; border-radius:11px; border:none; cursor:pointer;
  background:#25D366; color:#fff;
  font-family:'Inter',sans-serif; font-size:14px; font-weight:700;
  display:flex; align-items:center; justify-content:center; gap:8px;
  transition:all .18s; margin-bottom:8px;
}
.wa-btn:hover { background:#1db954; transform:translateY(-1px); }
.inquiry-btn {
  width:100%; padding:13px; border-radius:11px; border:none; cursor:pointer;
  background:${P.forest}; color:#fff;
  font-family:'Inter',sans-serif; font-size:14px; font-weight:700;
  transition:all .18s;
}
.inquiry-btn:hover { background:${P.forestL}; }

/* ── WA FLOAT ── */
.wa-float {
  position:fixed; bottom:28px; right:28px; z-index:400;
  width:62px; height:62px; border-radius:50%;
  background:#25D366;
  display:flex; align-items:center; justify-content:center;
  box-shadow:0 6px 24px rgba(37,211,102,0.55);
  text-decoration:none; cursor:pointer; border:none;
  animation:waRing 2.5s infinite;
}
@keyframes waRing {
  0%{box-shadow:0 6px 24px rgba(37,211,102,0.55),0 0 0 0 rgba(37,211,102,0.4)}
  60%{box-shadow:0 6px 24px rgba(37,211,102,0.55),0 0 0 12px rgba(37,211,102,0)}
  100%{box-shadow:0 6px 24px rgba(37,211,102,0.55),0 0 0 0 rgba(37,211,102,0)}
}

/* ── TOAST ── */
.toast {
  position:fixed; bottom:28px; right:110px; z-index:500;
  background:${P.forest}; color:#fff; border:1px solid rgba(240,160,48,0.3);
  padding:12px 18px; border-radius:12px; font-size:13px; font-weight:500;
  box-shadow:0 14px 40px rgba(0,0,0,.25);
  display:flex; align-items:center; gap:8px; max-width:300px;
  animation:slideUp .28s cubic-bezier(.34,1.56,.64,1);
}
@keyframes slideUp { from{transform:translateY(16px) scale(.96);opacity:0} to{transform:none;opacity:1} }

/* ── RESPONSIVE ── */
@media(max-width:700px){
  .hero h1{font-size:42px;}
  .hero-stats{grid-template-columns:1fr 1fr;}
  .section-title{font-size:34px;}
  .nav-links{display:none;}
  .footer-top{grid-template-columns:1fr;}
}
`;

/* ══════════════════════════════════════════════
   TOOLTIPS
══════════════════════════════════════════════ */
function CT({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return(
    <div className="ct">
      <div className="ct-lbl">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} className="ct-row">
          <span className="ct-k">{p.name}</span>
          <span className="ct-v" style={{color:p.color}}>₹{p.value?.toLocaleString()}/q</span>
        </div>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════
   WHATSAPP SVG ICON
══════════════════════════════════════════════ */
function WASvg({size=28}) {
  return(
    <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
      <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z" fill="#fff"/>
      <path d="M24 7.2C14.8 7.2 7.2 14.8 7.2 24c0 3.3.9 6.4 2.6 9.1l.4.6-1.7 6.2 6.4-1.7.6.3c2.6 1.5 5.5 2.3 8.5 2.3 9.2 0 16.8-7.6 16.8-16.8S33.2 7.2 24 7.2z" fill="#25D366"/>
      <path d="M33.5 28.1c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.4 1.8-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-.9.2-.2.5-.5.7-.8.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.8-.1-.2-1-2.4-1.3-3.3-.3-.8-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.2 5 7.8 6.8 1.1.5 2 .7 2.6.9 1.1.3 2.1.3 2.9.2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.5z" fill="#fff"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App() {
  const [section, setSection] = useState("home");
  const [selProd, setSelProd] = useState(null);
  const [toast, setToast] = useState(null);
  const [expForm, setExpForm] = useState({company:"",country:"Bangladesh",name:"",phone:"",email:"",qty:"",grade:"Super (55mm+)",port:"Nhava Sheva (Mumbai)",incoterm:"FOB",certs:[],message:""});
  const [contactForm, setContactForm] = useState({name:"",phone:"",message:""});
  const [inquiryForm, setInquiryForm] = useState({name:"",phone:"",qty:"",message:""});

  const flash = (m) => { setToast(m); setTimeout(()=>setToast(null),3500); };
  const toggleCert = (c) => setExpForm(f=>({...f,certs:f.certs.includes(c)?f.certs.filter(x=>x!==c):[...f.certs,c]}));
  const scroll = (id) => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); };

  const submitExp = (e) => { e.preventDefault(); flash("🌍 Export inquiry received! We'll respond within 24 hours."); setExpForm(f=>({...f,message:""})); };
  const submitContact = (e) => { e.preventDefault(); flash("✅ Message bhej diya! Hum jald hi contact karenge."); setContactForm({name:"",phone:"",message:""}); };
  const submitInquiry = (e) => { e.preventDefault(); flash("✅ Inquiry bhej di! 2-4 ghante mein contact karenge."); setSelProd(null); setInquiryForm({name:"",phone:"",qty:"",message:""}); };

  useEffect(()=>{
    document.title="MandsaurGarlic.com — India Ka #1 Garlic B2B Platform";
    const sm=(n,c,p=false)=>{let el=document.querySelector(p?`meta[property='${n}']`:`meta[name='${n}']`);if(!el){el=document.createElement('meta');p?el.setAttribute('property',n):el.setAttribute('name',n);document.head.appendChild(el);}el.setAttribute('content',c);};
    sm('description','Mandsaur Garlic B2B Platform — India ka sabse bada garlic trading hub. Farmers se seedha buy karo. Export inquiry, live mandi bhav, logistics.');
    sm('keywords','mandsaur garlic, garlic wholesale india, garlic export, lahsun mandi bhav, garlic b2b, neemuch garlic, garlic price today');
    sm('og:title','MandsaurGarlic.com — India Ka #1 Garlic B2B Platform',true);
    sm('og:description','Mandsaur se seedha garlic kharido. Live mandi bhav, export inquiry, 2400+ farmers.',true);
    sm('og:url','https://www.mandsaurgarlic.com',true);
    sm('og:type','website',true);
    let sc=document.getElementById('sd');if(!sc){sc=document.createElement('script');sc.id='sd';sc.type='application/ld+json';document.head.appendChild(sc);}
    sc.text=JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"MandsaurGarlic","url":"https://www.mandsaurgarlic.com","telephone":"+91-7772993222","address":{"@type":"PostalAddress","addressLocality":"Mandsaur","addressRegion":"Madhya Pradesh","addressCountry":"IN"}});
  },[]);

  const NAV_LINKS = [
    {id:"why",label:"Why Us"},
    {id:"products",label:"Products"},
    {id:"bhav",label:"Live Bhav"},
    {id:"export",label:"Export"},
    {id:"story",label:"Our Story"},
    {id:"reviews",label:"Reviews"},
    {id:"contact",label:"Contact"},
  ];

  return(
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo" onClick={()=>scroll("home")}>
          <div className="nav-logo-mark">🧄</div>
          <div>
            <div className="nav-logo-name">Mandsaur<em>Garlic</em></div>
            <div className="nav-logo-sub">India's Garlic B2B Hub</div>
          </div>
        </div>
        <div className="nav-links">
          {NAV_LINKS.map(l=>(
            <button key={l.id} className="nav-link" onClick={()=>scroll(l.id)}>{l.label}</button>
          ))}
        </div>
        <button className="nav-cta" onClick={()=>scroll("contact")}>Get Quote</button>
      </nav>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-label">LIVE BHAV</div>
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...MANDI,...MANDI].map((m,i)=>(
              <div key={i} className="ti">
                <b>{m.name}</b>
                <span>{m.grade}</span>
                <span>₹{m.min.toLocaleString()}–{m.max.toLocaleString()}/q</span>
                <span className={m.ch>0?"tup":"tdn"}>{m.ch>0?"▲+":"▼"}{Math.abs(m.ch)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO */}
      <section id="home" className="hero">
        <div className="hero-pattern"/>
        <div className="hero-garlic-right">🧄</div>
        <div className="hero-inner">
          <div>
            <div className="hero-tag">🇮🇳 Mandsaur, Madhya Pradesh</div>
            <h1>India Ki <em>Garlic</em><br/>Seedha Khet Se</h1>
            <p className="hero-sub">
              Mandsaur — India ka largest garlic hub. Farmers se seedha buy karo, export karo, sahi daam pao.
              Middlemen hatao. Real-time mandi bhav. 2,400+ verified farmers.
            </p>
            <div className="hero-actions">
              <button className="btn-primary" onClick={()=>scroll("products")}>🧄 Products Dekho</button>
              <button className="btn-ghost" onClick={()=>scroll("export")}>🌍 Export Inquiry</button>
              <a href={waDefault} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <button className="btn-ghost" style={{display:"flex",alignItems:"center",gap:7}}>
                  <WASvg size={16}/> WhatsApp
                </button>
              </a>
            </div>
            <div className="hero-stats">
              {[["2,400+","Farmers"],["850T","Daily Volume"],["14","Export Countries"],["40+","Yrs Experience"]].map(([n,l],i)=>(
                <div key={i} className="hstat">
                  <span className="hstat-n">{n}</span>
                  <span className="hstat-l">{l}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-card">
            <div className="hcard-label"><span className="hpulse"/>⚡ Aaj Ka Live Snapshot</div>
            {[
              ["Mandsaur Super","₹8,200–12,800/q",true,"+12.4%"],
              ["Export FOB Avg","₹9,400/q",true,"+15.3%"],
              ["Organic Premium","₹11,500–14,000/q",true,"+22.1%"],
              ["Neemuch A Grade","₹6,500–9,800/q",true,"+8.1%"],
              ["Processing Grade","₹3,800–5,700/q",false,"-1.8%"],
            ].map(([k,v,up,pct],i)=>(
              <div key={i} className="hcard-row">
                <span className="hcard-key">{k}</span>
                <div style={{textAlign:"right"}}>
                  <div className="hcard-val">{v}</div>
                  <div className={up?"hcard-up":"hcard-dn"}>{pct}</div>
                </div>
              </div>
            ))}
            <div style={{marginTop:16}}>
              <a href={waDefault} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <button style={{width:"100%",padding:"11px",background:"#25D366",color:"#fff",border:"none",borderRadius:10,fontFamily:"'Inter',sans-serif",fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  <WASvg size={15}/> WhatsApp Pe Quote Lo
                </button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section id="why" style={{background:P.parchm,borderTop:`1px solid ${P.border}`,borderBottom:`1px solid ${P.border}`}}>
        <div className="section">
          <div className="section-label">Why Choose Us</div>
          <div className="section-title">India Ka Sabse Trusted<br/><em>Garlic Trading Hub</em></div>
          <p className="section-sub">Mandsaur mandi se direct connection. Quality guaranteed. Export-ready documentation. Zero middlemen between farm and your warehouse.</p>
          <div className="why-grid">
            {[
              {icon:"🌾",title:"Farm Direct",text:"Mandsaur, Neemuch, Ratlam ke 2,400+ verified farmers se seedha kharidari. Koi middleman commission nahi.",acc:P.leaf},
              {icon:"✅",title:"Grade Guaranteed",text:"Super, A Grade, B Grade, Organic — har lot graded, checked aur certified before dispatch. No surprises.",acc:P.saffron},
              {icon:"✈️",title:"Export Ready",text:"Phytosanitary, Certificate of Origin, FSSAI, Lab Report — sab documentation available. 14 countries mein exports.",acc:P.blue},
              {icon:"📊",title:"Live Mandi Bhav",text:"Mandsaur, Neemuch, Ratlam, Indore ke real-time rates. Kabhi galat price pe mat bikao.",acc:P.amber},
              {icon:"🚛",title:"Pan-India Delivery",text:"Verified transporters. GPS tracking. Refrigerated trucks available. Farm se port tak — ek hi jagah.",acc:P.clove},
              {icon:"💬",title:"WhatsApp Support",text:"Seedha WhatsApp pe baat karo. Pre-filled inquiry messages. Quick quote within 2 hours. 24/7 available.",acc:P.leaf},
            ].map((w,i)=>(
              <div key={i} className="why-card" style={{"--accent":w.acc}}>
                <div className="why-icon">{w.icon}</div>
                <div className="why-title">{w.title}</div>
                <p className="why-text">{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="products-bg">
        <div className="products-inner">
          <div className="section-label">Our Products</div>
          <div className="section-title">Premium Garlic Varieties</div>
          <p className="section-sub" style={{color:"rgba(255,255,255,0.6)"}}>6 varieties, fresh from Mandsaur. Domestic wholesale se export containers tak — sab available.</p>
          <div className="prod-grid">
            {PRODUCTS.map(p=>(
              <div key={p.id} className="prod-card" onClick={()=>setSelProd(p)}>
                <div className="prod-top">
                  <div className="prod-icon">{p.icon}</div>
                  <span className="prod-tag" style={{color:p.tagC,borderColor:p.tagC,background:`${p.tagC}18`}}>{p.tag}</span>
                </div>
                <div className="prod-body">
                  <div className="prod-name">{p.name}</div>
                  <p className="prod-desc">{p.desc}</p>
                  <div className="prod-specs">
                    <span className="prod-spec">📏 {p.size}</span>
                    <span className="prod-spec">⏱ {p.shelf} shelf life</span>
                    <span className="prod-spec">📍 {p.origin}</span>
                  </div>
                  <div className="prod-foot">
                    <div className="prod-price">{p.price}<sub>/quintal</sub></div>
                    <button className="prod-btn">Get Quote →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE BHAV */}
      <section id="bhav">
        <div className="section">
          <div className="section-label">Live Mandi Rates</div>
          <div className="section-title">Aaj Ka <em>Mandi Bhav</em></div>
          <p className="section-sub">Mandsaur region ke sabhi mandion ke live prices. Apna soda karne se pehle check karo.</p>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:14,marginTop:36,marginBottom:20}}>
            {[{l:"Sabse Zyada",v:"₹14,500/q",s:"Indore Super",c:P.saffron},{l:"Export FOB Avg",v:"₹9,400/q",s:"Nhava Sheva",c:P.blue},{l:"Aaj Aawak",v:"~78,000q",s:"All mandis combined",c:P.leaf},{l:"YoY Growth",v:"+245%",s:"Export vs last year",c:P.leaf}].map((s,i)=>(
              <div key={i} style={{background:P.white,border:`1px solid ${P.border}`,borderRadius:13,padding:"18px 20px",boxShadow:`0 4px 14px rgba(26,58,42,0.06)`}}>
                <div style={{fontSize:10,color:P.saffron,fontWeight:700,textTransform:"uppercase",letterSpacing:".7px",marginBottom:8}}>{s.l}</div>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:28,fontWeight:700,color:s.c,marginBottom:3}}>{s.v}</div>
                <div style={{fontSize:11,color:P.textD}}>{s.s}</div>
              </div>
            ))}
          </div>
          <div className="mandi-table-wrap">
            <div className="mandi-hd"><h3>🌾 Today's Rates — {new Date().toLocaleDateString('hi-IN')}</h3><span>Updated 9:30 AM · Live</span></div>
            <table>
              <thead><tr><th>Mandi</th><th>Best Grade</th><th>Min (₹/q)</th><th>Max (₹/q)</th><th>Arrivals</th><th>Change</th></tr></thead>
              <tbody>
                {MANDI.map((m,i)=>(
                  <tr key={i}>
                    <td><span className="mname">{m.name}</span></td>
                    <td>{m.grade}</td>
                    <td>₹{m.min.toLocaleString()}</td>
                    <td style={{fontWeight:700}}>₹{m.max.toLocaleString()}</td>
                    <td><span className="marr">{m.arr} katte</span></td>
                    <td><span className={m.ch>0?"mup":"mdn"}>{m.ch>0?"▲ +":"▼ "}{Math.abs(m.ch)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="chart-wrap">
            <div className="chart-title">📈 Price Trend 2026 — Super vs A Grade</div>
            <div className="chart-sub">Jan–Jun 2026 · ₹/quintal</div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={PRICE_DATA}>
                <defs>
                  <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.saffron} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={P.saffron} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={P.leaf} stopOpacity={0.2}/>
                    <stop offset="95%" stopColor={P.leaf} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={P.border} vertical={false}/>
                <XAxis dataKey="m" tick={{fill:P.textD,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:P.textD,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<CT/>}/>
                <Area type="monotone" dataKey="super" name="Super" stroke={P.saffron} strokeWidth={2.5} fill="url(#gs)"/>
                <Area type="monotone" dataKey="agrade" name="A Grade" stroke={P.leaf} strokeWidth={2} fill="url(#ga)"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* EXPORT */}
      <section id="export" className="export-bg">
        <div className="section">
          <div className="section-label">International Export</div>
          <div className="section-title">Export <em>Inquiry</em></div>
          <div className="export-grid">
            <div>
              <div className="form-section-title">Send Export Quote Request</div>
              <p className="form-section-sub">Bangladesh, UAE, Malaysia, USA — 14 countries mein export. FOB pricing, phytosanitary docs, container scheduling — 24 hrs mein response.</p>
              <form onSubmit={submitExp} style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="fgrid">
                  <div className="fg"><label className="fl">Company Name *</label><input className="fi" placeholder="Your company" required value={expForm.company} onChange={e=>setExpForm({...expForm,company:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Country *</label><select className="fsel" value={expForm.country} onChange={e=>setExpForm({...expForm,country:e.target.value})}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="fg"><label className="fl">Contact Person *</label><input className="fi" placeholder="Your name" required value={expForm.name} onChange={e=>setExpForm({...expForm,name:e.target.value})}/></div>
                  <div className="fg"><label className="fl">WhatsApp *</label><input className="fi" placeholder="+country code" required value={expForm.phone} onChange={e=>setExpForm({...expForm,phone:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Quantity (MT) *</label><input className="fi" type="number" placeholder="Metric tonnes" required value={expForm.qty} onChange={e=>setExpForm({...expForm,qty:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Grade</label><select className="fsel" value={expForm.grade} onChange={e=>setExpForm({...expForm,grade:e.target.value})}>{"Super (55mm+),A Grade (45-55mm),B Grade,Organic Certified".split(",").map(g=><option key={g}>{g}</option>)}</select></div>
                  <div className="fg"><label className="fl">Port</label><select className="fsel" value={expForm.port} onChange={e=>setExpForm({...expForm,port:e.target.value})}>{"Nhava Sheva (Mumbai),Mundra (Gujarat),Kandla,Chennai".split(",").map(p=><option key={p}>{p}</option>)}</select></div>
                  <div className="fg"><label className="fl">Incoterms</label><select className="fsel" value={expForm.incoterm} onChange={e=>setExpForm({...expForm,incoterm:e.target.value})}>{"FOB,CIF,CFR,EXW,DDP".split(",").map(t=><option key={t}>{t}</option>)}</select></div>
                </div>
                <div style={{marginTop:4}}>
                  <div className="fl" style={{marginBottom:8}}>Certificates Required</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                    {CERTS.map(c=>(
                      <label key={c} className="fcheck">
                        <input type="checkbox" checked={expForm.certs.includes(c)} onChange={()=>toggleCert(c)}/>
                        <span className="fcheck-lbl">{c}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="fg"><label className="fl">Message</label><textarea className="fta" placeholder="Special requirements, sample request, monthly volume..." value={expForm.message} onChange={e=>setExpForm({...expForm,message:e.target.value})}/></div>
                <button type="submit" className="submit-btn">🌍 Submit Export Inquiry</button>
                <a href={waMsg(`Hi! I want to export Mandsaur Garlic to ${expForm.country}. Please send FOB quote for ${expForm.qty||'[qty]'} MT ${expForm.grade}.`)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <button type="button" className="wa-btn"><WASvg size={18}/> WhatsApp Pe Direct Quote Lo</button>
                </a>
              </form>
            </div>
            <div className="export-why">
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:700,color:P.forest,marginBottom:20}}>Why Export From Mandsaur?</div>
              {[
                {icon:"🏆",title:"India's Largest Garlic Hub",sub:"Mandsaur mandi — India ka #1 garlic trading center. Best prices, highest volumes, widest variety."},
                {icon:"✅",title:"High Allicin Content",sub:"Indian garlic mein Chinese garlic se significantly zyada allicin content. International buyers prefer karein."},
                {icon:"📋",title:"Full Documentation",sub:"Phytosanitary, COO, FSSAI, Lab Report, Fumigation — sab certifications available within 3-5 days."},
                {icon:"🚢",title:"Multiple Ports",sub:"Nhava Sheva, Mundra, Kandla — aapke nearest port se dispatch. Container stuffing experts on ground."},
                {icon:"💰",title:"Competitive FOB Pricing",sub:"Farm-direct sourcing se cost kaafi kam. Market se 15-20% better rates guaranteed for bulk orders."},
                {icon:"🤝",title:"Long-Term Relationship",sub:"Repeat buyers ko priority allocation, rate lock options, aur dedicated account manager. No surprises."},
              ].map((e,i)=>(
                <div key={i} className="ew-item">
                  <div className="ew-icon">{e.icon}</div>
                  <div>
                    <div className="ew-title">{e.title}</div>
                    <p className="ew-sub">{e.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* OUR STORY */}
      <section id="story" style={{background:P.ivory,borderTop:`1px solid ${P.border}`}}>
        <div className="section" style={{maxWidth:900}}>
          <div className="section-label">Our Journey</div>
          <div className="section-title">Mandsaur Se <em>Duniya Tak</em></div>
          <p className="section-sub">Mandsaur mandi se shuru hoke, aaj 14 countries mein garlic export karte hain. Yeh hai hamari kahani — farmers ka vishwas aur buyers ki zaroorat ek jagah jodne ki.</p>
          <div className="timeline">
            {TIMELINE.map((t,i)=>(
              <div key={i} className="tl-item">
                <div className="tl-dot">{t.year.slice(2)}</div>
                <div className="tl-body">
                  <div className="tl-year">{t.year}</div>
                  <div className="tl-event">{t.event}</div>
                  <div className="tl-sub">{t.sub}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:60,display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:16,textAlign:"center"}}>
            {[["4,90,000+","Tonnes Sold"],["6","Garlic Varieties"],["14","Export Countries"],["2,400+","Farmers Network"],["40+","Years Experience"],["24hr","Quote Response"]].map(([n,l],i)=>(
              <div key={i} style={{background:P.white,border:`1px solid ${P.border}`,borderRadius:13,padding:"22px 16px",boxShadow:`0 4px 14px rgba(26,58,42,0.06)`}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:700,color:P.saffron,marginBottom:4}}>{n}</div>
                <div style={{fontSize:11,color:P.textD,textTransform:"uppercase",letterSpacing:".7px"}}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" className="reviews-bg">
        <div className="reviews-inner">
          <div className="section-label">Customer Reviews</div>
          <div className="section-title">Buyers Kya Kehte Hain</div>
          <div className="rev-grid">
            {REVIEWS.map((r,i)=>(
              <div key={i} className="rev-card">
                <div className="rev-stars">{"★".repeat(r.stars)}</div>
                <p className="rev-text">"{r.text}"</p>
                <div className="rev-name">{r.name}</div>
                <div className="rev-loc">📍 {r.loc}</div>
                <div className="rev-role">{r.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{background:P.parchm,borderTop:`1px solid ${P.border}`}}>
        <div className="section">
          <div className="section-label">Get In Touch</div>
          <div className="section-title">Hamse <em>Baat Karo</em></div>
          <p className="section-sub">Price quote, export inquiry, ya koi bhi sawaal — hum 2 ghante ke andar response karte hain. WhatsApp ya form — aapki choice.</p>
          <div className="contact-grid">
            <div className="contact-info">
              {[
                {icon:"📍",title:"Address",val:"New Krishi Upaj Mandi\nMandsaur, Madhya Pradesh 458001\nIndia"},
                {icon:"📱",title:"WhatsApp / Call",val:<><a href="tel:+917772993222">+91-7772993222</a><br/>Mon–Sat, 8 AM – 8 PM</>},
                {icon:"✉️",title:"Email",val:<a href="mailto:info@mandsaurgarlic.com">info@mandsaurgarlic.com</a>},
                {icon:"🌐",title:"Website",val:<a href="https://www.mandsaurgarlic.com">www.mandsaurgarlic.com</a>},
              ].map((c,i)=>(
                <div key={i} className="ci-item">
                  <div className="ci-icon">{c.icon}</div>
                  <div>
                    <div className="ci-title">{c.title}</div>
                    <div className="ci-val" style={{whiteSpace:"pre-line"}}>{c.val}</div>
                  </div>
                </div>
              ))}
              <a href={waDefault} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none",marginTop:8}}>
                <button style={{width:"100%",padding:"14px",background:"#25D366",color:"#fff",border:"none",borderRadius:12,fontFamily:"'Inter',sans-serif",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:10}}>
                  <WASvg size={20}/> WhatsApp Pe Chat Karo
                </button>
              </a>
            </div>
            <div className="contact-form-card">
              <div className="form-section-title">Quick Inquiry</div>
              <form onSubmit={submitContact} style={{display:"flex",flexDirection:"column",gap:12,marginTop:16}}>
                <div className="fg"><label className="fl">Aapka Naam *</label><input className="fi" placeholder="Full name" required value={contactForm.name} onChange={e=>setContactForm({...contactForm,name:e.target.value})}/></div>
                <div className="fg"><label className="fl">WhatsApp / Phone *</label><input className="fi" placeholder="Mobile number" required value={contactForm.phone} onChange={e=>setContactForm({...contactForm,phone:e.target.value})}/></div>
                <div className="fg"><label className="fl">Message *</label><textarea className="fta" style={{minHeight:100}} placeholder="Kya chahiye? Grade, quantity, destination batao..." required value={contactForm.message} onChange={e=>setContactForm({...contactForm,message:e.target.value})}/></div>
                <button type="submit" className="submit-btn">📩 Inquiry Bhejo</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-brand-name">Mandsaur<em>Garlic</em></div>
              <p className="footer-brand-sub">India Ka #1 Garlic B2B Platform.<br/>Mandsaur · Neemuch · Ratlam · Dalauda<br/>Madhya Pradesh, India</p>
            </div>
            <div>
              <div className="footer-col-title">Quick Links</div>
              {["Why Us","Products","Live Bhav","Export","Our Story","Reviews","Contact"].map((l,i)=>(
                <a key={i} className="footer-link" onClick={()=>scroll(["why","products","bhav","export","story","reviews","contact"][i])}>{l}</a>
              ))}
            </div>
            <div>
              <div className="footer-col-title">Products</div>
              {PRODUCTS.map(p=><a key={p.id} className="footer-link" onClick={()=>{scroll("products");setSelProd(p);}}>{p.name}</a>)}
            </div>
          </div>
          <div className="footer-bottom">
            <span className="footer-copy">© 2026 MandsaurGarlic.com · All Rights Reserved · +91-7772993222</span>
            <a href={waDefault} target="_blank" rel="noopener noreferrer" className="footer-wa">
              <WASvg size={16}/> WhatsApp Us
            </a>
          </div>
        </div>
      </footer>

      {/* PRODUCT MODAL */}
      {selProd&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setSelProd(null)}>
          <div className="modal">
            <div className="modal-hd">
              <div>
                <h2>{selProd.icon} {selProd.name}</h2>
                <p>📍 {selProd.origin} · {selProd.tag}</p>
              </div>
              <button className="mclose" onClick={()=>setSelProd(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="mprice-box">
                <div>
                  <div style={{fontSize:11,color:P.textD,marginBottom:4}}>Price Range</div>
                  <div className="mprice">{selProd.price}</div>
                  <div className="mprice-sub">per quintal · Min 10q · Bulk discount available</div>
                </div>
                <div style={{fontSize:50}}>{selProd.icon}</div>
              </div>
              <div className="minfo-grid">
                {[["Bulb Size",selProd.size],["Shelf Life",selProd.shelf],["Origin",selProd.origin],["Grade Tag",selProd.tag]].map(([l,v],i)=>(
                  <div key={i} className="minfo"><label>{l}</label><span>{v}</span></div>
                ))}
              </div>
              <div className="mdesc">📋 {selProd.desc}</div>
              <form onSubmit={submitInquiry} style={{display:"flex",flexDirection:"column",gap:10}}>
                <div className="fgrid">
                  <div className="fg"><label className="fl">Naam *</label><input className="fi" placeholder="Aapka naam" required value={inquiryForm.name} onChange={e=>setInquiryForm({...inquiryForm,name:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Phone *</label><input className="fi" placeholder="Mobile" required value={inquiryForm.phone} onChange={e=>setInquiryForm({...inquiryForm,phone:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Quantity (Quintal)</label><input className="fi" type="number" placeholder="Kitna chahiye?" value={inquiryForm.qty} onChange={e=>setInquiryForm({...inquiryForm,qty:e.target.value})}/></div>
                </div>
                <div className="fg"><label className="fl">Message</label><textarea className="fta" style={{minHeight:70}} placeholder="Delivery location, packaging preference..." value={inquiryForm.message} onChange={e=>setInquiryForm({...inquiryForm,message:e.target.value})}/></div>
                <button type="submit" className="inquiry-btn">📩 Inquiry Bhejo</button>
              </form>
              <div style={{marginTop:8}}>
                <a href={waMsg(`Namaskar! 🧄 ${selProd.name} ke baare mein inquiry karna chahta hoon.\n\nProduct: ${selProd.name}\nPrice: ${selProd.price}\nSize: ${selProd.size}\n\nKya available hai? Quote bhejiye.`)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <button className="wa-btn"><WASvg size={18}/> WhatsApp Pe Direct Quote Lo</button>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WA FLOAT */}
      <a href={waDefault} target="_blank" rel="noopener noreferrer" className="wa-float">
        <WASvg size={32}/>
      </a>

      {/* TOAST */}
      {toast&&<div className="toast">✅ {toast}</div>}
    </>
  );
}

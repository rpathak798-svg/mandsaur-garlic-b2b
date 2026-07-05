import { useState, useEffect, useRef } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const WA_NUM = "917772993222";
const wa = (t) => `https://wa.me/${WA_NUM}?text=${encodeURIComponent(t)}`;
const WA_DEFAULT = wa("Namaskar! 🧄 MandsaurGarlic.com se inquiry — kripya garlic ki jankari dijiye.");

/* ─────────────────────────────────────────────
   PALETTE  — "Commodity Green" inspired by
   CommodityOnline's green but richer, warmer
───────────────────────────────────────────── */
const C = {
  bg:      "#F7F9F4",   // very light green-tinted white
  surface: "#FFFFFF",
  card:    "#FFFFFF",
  parchm:  "#F2F7EE",
  border:  "#DDE8D5",
  forest:  "#0F3D1F",
  forestM: "#1A5C30",
  leaf:    "#2A8A45",
  leafL:   "#3DB860",
  mint:    "#E8F5ED",
  saffron: "#D4820A",
  amber:   "#F0A030",
  amberL:  "#FFD080",
  ivory:   "#FEFAF2",
  text:    "#111A0F",
  textM:   "#3A4A35",
  textD:   "#7A8A72",
  white:   "#FFFFFF",
  red:     "#C83030",
  blue:    "#1A60B0",
  orange:  "#E07020",
};

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const LISTINGS = [
  { id:1, type:"seller", verified:true, name:"Ramesh Patidar Farms", loc:"Malhargarh, Mandsaur", grade:"Super", size:"55-65mm", qty:"500 Quintal", price:8900, avail:"Immediate", rating:4.9, deals:142, phyto:true, desc:"Export-ready Super grade. Full container available. FOB Nhava Sheva.", badge:"Top Seller" },
  { id:2, type:"seller", verified:true, name:"Suresh Chouhan Traders", loc:"Sitamau, Neemuch", grade:"A Grade", size:"45-55mm", qty:"200 Quintal", price:7200, avail:"3 Days", rating:4.7, deals:89, phyto:false, desc:"Consistent quality. Regular Delhi/Mumbai wholesale buyers.", badge:"Verified" },
  { id:3, type:"buyer", verified:true, name:"Al Baraka Trading LLC", loc:"Dubai, UAE", grade:"Super", size:"55mm+", qty:"5 Containers", price:9500, avail:"Ongoing", rating:4.8, deals:34, phyto:true, desc:"Looking for monthly container supply. FOB price preferred. Long-term contract.", badge:"Export Buyer" },
  { id:4, type:"seller", verified:true, name:"Dinesh Organic Farms", loc:"Dalauda, Mandsaur", grade:"Organic", size:"35-50mm", qty:"40 Quintal", price:11500, avail:"Immediate", rating:4.9, deals:61, phyto:true, desc:"NPOP certified organic. Lab report available. Pharmaceutical buyers preferred.", badge:"Organic" },
  { id:5, type:"buyer", verified:true, name:"BD Food Imports Ltd", loc:"Dhaka, Bangladesh", grade:"A Grade", size:"45-55mm", qty:"3 Containers/month", price:8000, avail:"Regular", rating:4.8, deals:28, phyto:true, desc:"Monthly requirement 3 containers A Grade. Established importer since 2018.", badge:"Export Buyer" },
  { id:6, type:"seller", verified:false, name:"Kailash Sharma", loc:"Jaora, Ratlam", grade:"B Grade", size:"28-40mm", qty:"800 Quintal", price:3800, avail:"5 Days", rating:4.3, deals:22, phyto:false, desc:"Processing grade. Best for powder, paste, dehydration units. Huge qty.", badge:"Bulk" },
  { id:7, type:"seller", verified:true, name:"Jagdish Malviya Exports", loc:"Garoth, Mandsaur", grade:"Super", size:"58-68mm", qty:"1000 Quintal", price:9400, avail:"Immediate", rating:4.9, deals:198, phyto:true, desc:"2 full containers ready. Competitive FOB pricing. 6 countries exported.", badge:"Top Seller" },
  { id:8, type:"buyer", verified:true, name:"Metro Cash & Carry India", loc:"Mumbai, Maharashtra", grade:"A Grade", size:"40-55mm", qty:"100 Quintal/week", price:7800, avail:"Weekly", rating:4.7, deals:156, phyto:false, desc:"Weekly requirement for 18 stores. Quality-tested buyers. Immediate payment.", badge:"Premium Buyer" },
];

const MANDI = [
  { name:"Mandsaur",  grade:"Super",   min:8200,  max:12800, arr:18400, ch:+12.4 },
  { name:"Neemuch",   grade:"A Grade", min:6500,  max:9800,  arr:22100, ch:+8.1  },
  { name:"Ratlam",    grade:"A Grade", min:5800,  max:8500,  arr:9200,  ch:-3.2  },
  { name:"Dalauda",   grade:"B Grade", min:4200,  max:6200,  arr:5700,  ch:+5.7  },
  { name:"Jaora",     grade:"B Grade", min:3800,  max:5700,  arr:3400,  ch:-1.8  },
  { name:"Indore",    grade:"Super",   min:9000,  max:14500, arr:11800, ch:+15.3 },
  { name:"Ujjain",    grade:"A Grade", min:6200,  max:9100,  arr:7600,  ch:+4.2  },
];

const NEWS = [
  { date:"Jun 9", tag:"Market", title:"Mandsaur mein Super grade ka bhav ₹12,800/q ke par", sub:"Kal ki aawak 18,400 katte rahi, phir bhi demand strong" },
  { date:"Jun 8", tag:"Export", title:"Bangladesh ne is season mein India se 2.4 lakh MT garlic import kiya", sub:"Pichhle saal ke mukable 34% zyada — main source Mandsaur" },
  { date:"Jun 7", tag:"Policy", title:"Garlic export pe minimum export price hatai gayi — trade ko rahat", sub:"APEDA ne notification jaari kiya, exporters ne welcome kiya" },
  { date:"Jun 6", tag:"Mandi", title:"Neemuch mandi mein record 22,100 katte ek din mein aaye", sub:"Season ki sabse badi single-day arrival, prices stable rahe" },
];

const PRICE_7D = [
  {d:"Jun 3",s:10200,a:7800},{d:"Jun 4",s:10800,a:8100},{d:"Jun 5",s:11200,a:8400},
  {d:"Jun 6",s:11600,a:8800},{d:"Jun 7",s:12100,a:9000},{d:"Jun 8",s:12400,a:9100},{d:"Jun 9",s:12800,a:9400},
];

const GRADES = ["All","Super","A Grade","B Grade","Organic"];
const TYPES  = ["All","Sellers","Buyers"];
const COUNTRIES = ["Bangladesh","UAE / Dubai","Malaysia","Indonesia","Sri Lanka","Nepal","USA","UK","Canada","Singapore","Other"];
const CERTS = ["Phytosanitary Certificate","Certificate of Origin","FSSAI Certificate","Organic (NPOP)","Lab Analysis Report","Fumigation Certificate"];

/* ─────────────────────────────────────────────
   CSS — CommodityOnline structure +
   premium garlic market aesthetics
───────────────────────────────────────────── */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&family=Playfair+Display:ital,wght@0,700;1,700&display=swap');

*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;font-size:16px;}
body{font-family:'Poppins',sans-serif;background:${C.bg};color:${C.text};min-height:100vh;overflow-x:hidden;}
::-webkit-scrollbar{width:5px;}::-webkit-scrollbar-track{background:${C.parchm};}::-webkit-scrollbar-thumb{background:${C.leaf};border-radius:3px;}
a{text-decoration:none;color:inherit;}
button{font-family:'Poppins',sans-serif;cursor:pointer;}
input,select,textarea{font-family:'Poppins',sans-serif;}

/* ── TOP BAR ── */
.topbar{
  background:${C.forest};height:36px;
  display:flex;align-items:center;justify-content:space-between;
  padding:0 20px;font-size:12px;color:rgba(255,255,255,.6);
  border-bottom:1px solid rgba(255,255,255,.08);
}
.topbar-left{display:flex;align-items:center;gap:20px;}
.topbar-right{display:flex;align-items:center;gap:16px;}
.topbar a{color:rgba(255,255,255,.6);transition:color .15s;}
.topbar a:hover{color:rgba(255,255,255,.9);}
.topbar-phone{color:${C.amberL}!important;font-weight:600;}

/* ── NAV ── */
.nav{
  background:${C.surface};
  border-bottom:2px solid ${C.border};
  position:sticky;top:0;z-index:100;
  box-shadow:0 2px 12px rgba(15,61,31,.08);
}
.nav-main{
  max-width:1200px;margin:0 auto;
  display:flex;align-items:center;gap:16px;
  padding:0 20px;height:64px;
}
.nav-logo{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.nav-logo-icon{
  width:44px;height:44px;border-radius:12px;
  background:linear-gradient(135deg,${C.leaf},${C.forest});
  display:flex;align-items:center;justify-content:center;
  font-size:24px;box-shadow:0 4px 12px rgba(42,138,69,.3);
}
.nav-logo-text{line-height:1.15;}
.nav-logo-name{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:${C.forest};letter-spacing:-.3px;}
.nav-logo-name em{color:${C.leaf};font-style:italic;}
.nav-logo-sub{font-size:9px;color:${C.textD};letter-spacing:1.2px;text-transform:uppercase;}
.nav-search{
  flex:1;max-width:480px;
  display:flex;align-items:center;
  background:${C.parchm};border:1.5px solid ${C.border};border-radius:10px;
  overflow:hidden;transition:border-color .2s;
}
.nav-search:focus-within{border-color:${C.leaf};box-shadow:0 0 0 3px rgba(42,138,69,.1);}
.nav-search-input{
  flex:1;border:none;outline:none;background:transparent;
  padding:10px 14px;font-size:13px;color:${C.text};
}
.nav-search-input::placeholder{color:${C.textD};}
.nav-search-btn{
  background:${C.leaf};color:#fff;border:none;
  padding:10px 18px;font-size:13px;font-weight:600;
  display:flex;align-items:center;gap:6px;transition:background .15s;
}
.nav-search-btn:hover{background:${C.forest};}
.nav-actions{display:flex;align-items:center;gap:10px;flex-shrink:0;}
.nav-btn-ghost{
  padding:8px 18px;border-radius:8px;font-size:13px;font-weight:600;
  background:transparent;color:${C.leaf};border:1.5px solid ${C.leaf};
  transition:all .15s;
}
.nav-btn-ghost:hover{background:${C.leaf};color:#fff;}
.nav-btn-solid{
  padding:8px 18px;border-radius:8px;font-size:13px;font-weight:700;
  background:linear-gradient(135deg,${C.leaf},${C.forest});color:#fff;border:none;
  box-shadow:0 4px 12px rgba(42,138,69,.3);transition:all .15s;
}
.nav-btn-solid:hover{transform:translateY(-1px);box-shadow:0 6px 18px rgba(42,138,69,.4);}

/* ── NAV TABS ── */
.nav-tabs{
  background:${C.forest};border-bottom:1px solid rgba(255,255,255,.08);
}
.nav-tabs-inner{
  max-width:1200px;margin:0 auto;
  display:flex;align-items:center;
  padding:0 20px;overflow-x:auto;scrollbar-width:none;
}
.nav-tabs-inner::-webkit-scrollbar{display:none;}
.ntab{
  padding:11px 18px;font-size:13px;font-weight:500;
  color:rgba(255,255,255,.65);border:none;background:transparent;
  cursor:pointer;white-space:nowrap;border-bottom:2.5px solid transparent;
  transition:all .15s;display:flex;align-items:center;gap:6px;
}
.ntab:hover{color:#fff;background:rgba(255,255,255,.06);}
.ntab.on{color:${C.amberL};border-bottom-color:${C.amber};}
.ntab .nbadge{background:${C.amber};color:#1a0800;font-size:9px;font-weight:800;padding:2px 6px;border-radius:10px;}

/* ── TICKER ── */
.ticker{
  background:${C.forest};padding:8px 0;
  border-bottom:1px solid rgba(255,255,255,.06);overflow:hidden;
  display:flex;align-items:center;
}
.ticker-label{
  flex-shrink:0;background:${C.amber};color:#1a0800;
  padding:3px 14px;font-size:9px;font-weight:800;letter-spacing:1.2px;
  margin:0 16px;border-radius:3px;
}
.ticker-track{overflow:hidden;flex:1;}
.ticker-inner{display:flex;animation:marquee 28s linear infinite;white-space:nowrap;}
.ticker-inner:hover{animation-play-state:paused;}
.ti{display:inline-flex;align-items:center;gap:8px;padding:0 20px;font-size:11.5px;color:rgba(255,255,255,.6);border-right:1px solid rgba(255,255,255,.08);}
.ti b{color:rgba(255,255,255,.9);font-weight:600;}
.tup{color:#5EE882;font-weight:700;} .tdn{color:#FF7070;font-weight:700;}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ── HERO BANNER ── */
.hero{
  background:linear-gradient(135deg,${C.forest} 0%,${C.forestM} 50%,#0A2A14 100%);
  padding:52px 20px 60px;position:relative;overflow:hidden;
}
.hero::before{
  content:'';position:absolute;inset:0;
  background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23FFFFFF' fill-opacity='0.025'%3E%3Cpath d='M30 5 C30 5 22 18 22 27 C22 36 30 40 30 40 C30 40 38 36 38 27 C38 18 30 5 30 5Z'/%3E%3C/g%3E%3C/svg%3E");
}
.hero-inner{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 360px;gap:40px;align-items:center;position:relative;z-index:1;}
@media(max-width:900px){.hero-inner{grid-template-columns:1fr;}}
.hero-tag{display:inline-flex;align-items:center;gap:6px;background:rgba(240,160,48,.15);border:1px solid rgba(240,160,48,.35);color:${C.amberL};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:4px 12px;border-radius:20px;margin-bottom:16px;}
.hero h1{font-family:'Playfair Display',serif;font-size:52px;line-height:1.05;color:#fff;margin-bottom:12px;font-weight:700;}
.hero h1 em{color:${C.amberL};font-style:italic;}
.hero-sub{font-size:15px;color:rgba(255,255,255,.65);line-height:1.75;margin-bottom:28px;max-width:520px;}
.hero-ctas{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:40px;}
.btn-primary{padding:12px 28px;border-radius:10px;border:none;background:linear-gradient(135deg,${C.amber},${C.saffron});color:#fff;font-size:13px;font-weight:700;box-shadow:0 6px 20px rgba(212,130,10,.4);transition:all .18s;}
.btn-primary:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(212,130,10,.5);}
.btn-outline-w{padding:12px 26px;border-radius:10px;background:rgba(255,255,255,.1);color:#fff;font-size:13px;font-weight:600;border:1.5px solid rgba(255,255,255,.25);transition:all .18s;}
.btn-outline-w:hover{background:rgba(255,255,255,.18);}
.hero-stats{display:flex;gap:0;border:1px solid rgba(255,255,255,.12);border-radius:12px;overflow:hidden;background:rgba(255,255,255,.04);}
.hstat{flex:1;padding:16px 14px;text-align:center;border-right:1px solid rgba(255,255,255,.08);}
.hstat:last-child{border-right:none;}
.hstat-n{font-family:'Playfair Display',serif;font-size:28px;color:${C.amberL};display:block;font-weight:700;line-height:1;}
.hstat-l{font-size:9px;color:rgba(255,255,255,.5);text-transform:uppercase;letter-spacing:.6px;margin-top:4px;}
/* hero card */
.hero-card{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.15);border-radius:18px;padding:22px;}
.hcard-hd{font-size:10px;font-weight:700;color:${C.amberL};letter-spacing:1.2px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px;}
.hpulse{width:6px;height:6px;border-radius:50%;background:${C.leafL};animation:pulse 1.4s infinite;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
.hrow{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,.07);}
.hrow:last-of-type{border-bottom:none;margin-bottom:14px;}
.hkey{font-size:12px;color:rgba(255,255,255,.55);}
.hval{font-size:12px;font-weight:600;color:#fff;text-align:right;}
.hup{font-size:10px;color:#5EE882;font-weight:700;} .hdn{font-size:10px;color:#FF7070;font-weight:700;}

/* ── LAYOUT ── */
.page{max-width:1200px;margin:0 auto;padding:28px 20px 60px;}
.page-grid{display:grid;grid-template-columns:1fr 300px;gap:24px;}
@media(max-width:960px){.page-grid{grid-template-columns:1fr;}}

/* ── SECTION HEADS ── */
.sh{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;flex-wrap:wrap;gap:8px;}
.sh-left{display:flex;align-items:center;gap:10px;}
.sh-dot{width:4px;height:22px;background:linear-gradient(to bottom,${C.amber},${C.leaf});border-radius:2px;}
.sh-title{font-size:17px;font-weight:700;color:${C.forest};}
.sh-count{font-size:12px;color:${C.textD};background:${C.parchm};border:1px solid ${C.border};padding:2px 10px;border-radius:10px;}
.sh-link{font-size:12px;font-weight:600;color:${C.leaf};display:flex;align-items:center;gap:3px;}
.sh-link:hover{color:${C.forest};}

/* ── FILTERS ── */
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;align-items:center;}
.filter-chip{padding:6px 14px;border-radius:7px;border:1.5px solid ${C.border};font-size:12px;font-weight:500;background:${C.surface};color:${C.textM};cursor:pointer;transition:all .15s;}
.filter-chip:hover{border-color:${C.leaf};color:${C.leaf};}
.filter-chip.on{background:${C.mint};border-color:${C.leaf};color:${C.leaf};font-weight:700;}
.search-mini{display:flex;align-items:center;gap:6px;background:${C.surface};border:1.5px solid ${C.border};border-radius:8px;padding:7px 12px;flex:1;max-width:280px;transition:border-color .15s;}
.search-mini:focus-within{border-color:${C.leaf};}
.search-mini input{border:none;outline:none;background:transparent;font-size:12px;color:${C.text};flex:1;font-family:'Poppins',sans-serif;}
.search-mini input::placeholder{color:${C.textD};}

/* ── LISTING CARDS ── */
.listing-grid{display:flex;flex-direction:column;gap:12px;margin-bottom:24px;}
.lcard{
  background:${C.surface};border:1.5px solid ${C.border};border-radius:14px;
  padding:18px 20px;cursor:pointer;transition:all .2s;
  display:grid;grid-template-columns:auto 1fr auto;gap:16px;align-items:start;
}
.lcard:hover{border-color:${C.leaf};box-shadow:0 6px 24px rgba(15,61,31,.1);transform:translateY(-1px);}
.lcard-icon{
  width:52px;height:52px;border-radius:12px;
  display:flex;align-items:center;justify-content:center;font-size:24px;
  flex-shrink:0;
}
.lcard-icon.seller{background:${C.mint};} .lcard-icon.buyer{background:#EEF4FF;}
.lcard-body{min-width:0;}
.lcard-top{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:4px;}
.lcard-name{font-size:15px;font-weight:700;color:${C.forest};}
.lcard-badge{font-size:10px;font-weight:700;padding:2px 9px;border-radius:5px;text-transform:uppercase;letter-spacing:.4px;}
.badge-seller{background:${C.mint};color:${C.leaf};border:1px solid rgba(42,138,69,.2);}
.badge-buyer{background:#EEF4FF;color:${C.blue};border:1px solid rgba(26,96,176,.2);}
.badge-top{background:rgba(240,160,48,.15);color:${C.saffron};border:1px solid rgba(212,130,10,.25);}
.badge-org{background:rgba(42,138,69,.12);color:${C.leaf};border:1px solid rgba(42,138,69,.25);}
.badge-bulk{background:${C.parchm};color:${C.textD};border:1px solid ${C.border};}
.lcard-verified{font-size:10px;color:${C.leaf};display:flex;align-items:center;gap:2px;font-weight:600;}
.lcard-loc{font-size:12px;color:${C.textD};margin-bottom:8px;display:flex;align-items:center;gap:4px;}
.lcard-desc{font-size:12px;color:${C.textM};line-height:1.6;margin-bottom:10px;}
.lcard-tags{display:flex;gap:6px;flex-wrap:wrap;}
.ltag{font-size:11px;color:${C.textM};background:${C.parchm};border:1px solid ${C.border};padding:2px 9px;border-radius:5px;}
.ltag.ok{color:${C.leaf};background:${C.mint};border-color:rgba(42,138,69,.2);}
.lcard-right{text-align:right;flex-shrink:0;display:flex;flex-direction:column;align-items:flex-end;gap:8px;}
.lcard-price{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:${C.saffron};line-height:1;}
.lcard-price-sub{font-size:10px;color:${C.textD};font-family:'Poppins',sans-serif;font-weight:400;}
.lcard-qty{font-size:11px;color:${C.textM};background:${C.parchm};padding:3px 10px;border-radius:6px;font-weight:600;}
.lcard-avail{font-size:10px;color:${C.leaf};font-weight:600;display:flex;align-items:center;gap:3px;}
.lcard-btn{padding:7px 16px;border-radius:8px;font-size:12px;font-weight:700;border:none;background:linear-gradient(135deg,${C.leaf},${C.forest});color:#fff;transition:all .15s;}
.lcard-btn:hover{transform:scale(1.03);}
.lcard-rating{font-size:11px;color:${C.saffron};font-weight:600;}

/* ── SIDEBAR ── */
.sidebar{display:flex;flex-direction:column;gap:16px;}
.sbox{background:${C.surface};border:1.5px solid ${C.border};border-radius:14px;overflow:hidden;}
.sbox-hd{background:${C.forest};padding:13px 18px;display:flex;align-items:center;gap:8px;}
.sbox-hd-title{font-size:13px;font-weight:700;color:#fff;}
.sbox-body{padding:16px;}

/* ── MANDI TABLE ── */
.mandi-row{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid ${C.border};font-size:12px;}
.mandi-row:last-child{border-bottom:none;}
.mname{font-weight:700;color:${C.forest};} .mprice{font-weight:600;color:${C.textM};}
.mup{color:${C.leaf};font-weight:700;font-size:11px;} .mdn{color:${C.red};font-weight:700;font-size:11px;}

/* ── NEWS ── */
.news-item{padding:12px 0;border-bottom:1px solid ${C.border};}
.news-item:last-child{border-bottom:none;}
.news-tag{display:inline-block;font-size:9px;font-weight:700;padding:2px 7px;border-radius:4px;margin-bottom:5px;text-transform:uppercase;letter-spacing:.5px;}
.news-tag.market{background:${C.mint};color:${C.leaf};} .news-tag.export{background:#EEF4FF;color:${C.blue};}
.news-tag.policy{background:rgba(212,130,10,.12);color:${C.saffron};} .news-tag.mandi{background:${C.parchm};color:${C.textD};}
.news-title{font-size:13px;font-weight:600;color:${C.forest};line-height:1.4;margin-bottom:3px;}
.news-sub{font-size:11px;color:${C.textD};line-height:1.5;}
.news-date{font-size:10px;color:${C.textD};margin-top:4px;}

/* ── FULL TABLE ── */
.ftable-wrap{background:${C.surface};border:1.5px solid ${C.border};border-radius:14px;overflow:hidden;margin-bottom:24px;}
.ftable-hd{background:${C.forest};padding:14px 20px;display:flex;justify-content:space-between;align-items:center;}
.ftable-hd h3{font-family:'Playfair Display',serif;font-size:18px;color:#fff;font-weight:700;}
.ftable-hd span{font-size:11px;color:rgba(255,255,255,.45);}
table{width:100%;border-collapse:collapse;}
thead th{background:${C.parchm};padding:10px 18px;text-align:left;font-size:10px;font-weight:700;color:${C.saffron};text-transform:uppercase;letter-spacing:.7px;border-bottom:1.5px solid ${C.border};}
tbody td{padding:12px 18px;font-size:13px;border-bottom:1px solid ${C.border};color:${C.textM};}
tbody tr:last-child td{border-bottom:none;}
tbody tr:hover td{background:${C.parchm};}
.tmn{font-weight:700;color:${C.forest};}
.tup{color:${C.leaf};font-weight:700;} .tdn{color:${C.red};font-weight:700;}
.tarr{color:${C.textD};font-size:11px;}

/* ── CHART ── */
.chart-card{background:${C.surface};border:1.5px solid ${C.border};border-radius:14px;padding:20px;margin-bottom:24px;}
.chart-title{font-size:14px;font-weight:700;color:${C.forest};margin-bottom:4px;}
.chart-sub{font-size:11px;color:${C.textD};margin-bottom:16px;}
.ct{background:${C.ivory};border:1px solid ${C.border};border-radius:8px;padding:10px 14px;font-size:12px;}
.ctl{color:${C.saffron};font-weight:700;margin-bottom:5px;}
.ctr{display:flex;justify-content:space-between;gap:12px;margin-bottom:2px;}
.ctk{color:${C.textD};} .ctv{font-weight:700;color:${C.text};}

/* ── EXPORT FORM ── */
.export-wrap{background:${C.surface};border:1.5px solid ${C.border};border-radius:16px;padding:28px;margin-bottom:24px;}
.exp-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
@media(max-width:600px){.exp-grid{grid-template-columns:1fr;}}
.fg{display:flex;flex-direction:column;gap:5px;}
.fl{font-size:10px;font-weight:700;color:${C.saffron};text-transform:uppercase;letter-spacing:.5px;}
.fi,.fsel,.fta{background:${C.parchm};border:1.5px solid ${C.border};color:${C.text};padding:10px 13px;border-radius:9px;font-size:13px;outline:none;transition:border-color .15s;width:100%;}
.fi:focus,.fsel:focus,.fta:focus{border-color:${C.leaf};box-shadow:0 0 0 3px rgba(42,138,69,.1);}
.fi::placeholder,.fta::placeholder{color:${C.textD};}
.fsel option{background:${C.surface};}
.fta{resize:vertical;min-height:80px;line-height:1.5;}
.fcheck{display:flex;align-items:center;gap:8px;padding:8px 12px;background:${C.parchm};border:1.5px solid ${C.border};border-radius:8px;cursor:pointer;transition:all .15s;}
.fcheck:hover{border-color:${C.leaf};}
.fcheck input{accent-color:${C.leaf};width:14px;height:14px;}
.fcheck-lbl{font-size:12px;color:${C.text};}
.fsep{font-size:10px;font-weight:700;color:${C.leaf};text-transform:uppercase;letter-spacing:.6px;margin:4px 0;display:flex;align-items:center;gap:8px;}
.fsep::after{content:'';flex:1;height:1px;background:${C.border};}
.submit-btn{width:100%;padding:13px;border-radius:10px;border:none;background:linear-gradient(135deg,${C.leaf},${C.forest});color:#fff;font-size:14px;font-weight:700;box-shadow:0 6px 20px rgba(15,61,31,.25);transition:all .2s;margin-top:4px;}
.submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(15,61,31,.35);}
.wa-submit{width:100%;padding:12px;border-radius:10px;border:none;background:#25D366;color:#fff;font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:8px;transition:all .18s;margin-top:8px;}
.wa-submit:hover{background:#1db954;}

/* ── POST LISTING FORM ── */
.step-bar{display:flex;background:${C.parchm};border:1.5px solid ${C.border};border-radius:10px;overflow:hidden;margin-bottom:22px;}
.step{flex:1;padding:11px;text-align:center;font-size:12px;font-weight:500;color:${C.textD};cursor:pointer;transition:all .15s;border-right:1px solid ${C.border};}
.step:last-child{border-right:none;}
.step.on{background:${C.mint};color:${C.leaf};font-weight:700;}
.step-n{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${C.border};color:${C.textD};font-size:10px;font-weight:700;margin-right:5px;vertical-align:middle;}
.step.on .step-n{background:${C.leaf};color:#fff;}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.65);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px;}
.modal{background:${C.surface};border-radius:18px;width:100%;max-width:560px;max-height:92vh;overflow-y:auto;box-shadow:0 28px 70px rgba(0,0,0,.35);}
.mhd{background:${C.forest};padding:20px 24px;border-radius:18px 18px 0 0;display:flex;justify-content:space-between;align-items:flex-start;}
.mhd h2{font-family:'Playfair Display',serif;font-size:20px;color:#fff;font-weight:700;margin-bottom:3px;}
.mhd p{font-size:12px;color:rgba(255,255,255,.55);}
.mclose{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.8);width:30px;height:30px;border-radius:50%;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0;}
.mclose:hover{background:rgba(255,255,255,.2);color:#fff;}
.mbody{padding:22px 24px;}
.mpricebox{background:${C.parchm};border:1.5px solid ${C.border};border-radius:12px;padding:15px 18px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center;}
.mprice{font-family:'Playfair Display',serif;font-size:32px;font-weight:700;color:${C.saffron};}
.mprice-sub{font-size:11px;color:${C.textD};margin-top:3px;}
.minfo-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:16px;}
.minfo{background:${C.parchm};border:1px solid ${C.border};border-radius:8px;padding:9px 12px;}
.minfo label{font-size:9px;color:${C.saffron};text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:3px;}
.minfo span{font-size:13px;font-weight:600;color:${C.text};}
.mdesc{background:${C.parchm};border:1px solid ${C.border};border-radius:9px;padding:11px 14px;font-size:12px;color:${C.textM};line-height:1.65;margin-bottom:18px;}
.mform{display:flex;flex-direction:column;gap:10px;}
.mbtn-green{width:100%;padding:12px;border-radius:10px;border:none;background:linear-gradient(135deg,${C.leaf},${C.forest});color:#fff;font-size:14px;font-weight:700;transition:all .18s;}
.mbtn-green:hover{transform:translateY(-1px);}
.mbtn-wa{width:100%;padding:11px;border-radius:10px;border:none;background:#25D366;color:#fff;font-size:13px;font-weight:700;display:flex;align-items:center;justify-content:center;gap:7px;transition:all .18s;margin-top:6px;}
.mbtn-wa:hover{background:#1db954;}

/* ── DASHBOARD CARDS ── */
.dash-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:20px;}
.dcard{background:${C.surface};border:1.5px solid ${C.border};border-radius:12px;padding:16px 18px;position:relative;overflow:hidden;transition:all .18s;}
.dcard:hover{border-color:${C.leaf};transform:translateY(-2px);}
.dcard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--acc,${C.leaf});}
.dcard-icon{font-size:20px;margin-bottom:8px;}
.dcard-val{font-family:'Playfair Display',serif;font-size:24px;color:${C.forest};margin-bottom:2px;}
.dcard-lbl{font-size:10px;color:${C.textD};text-transform:uppercase;letter-spacing:.5px;}
.dcard-delta{font-size:10px;font-weight:700;margin-top:4px;}

/* ── ACTIVITY ── */
.activity-item{display:flex;gap:12px;align-items:flex-start;padding:11px 0;border-bottom:1px solid ${C.border};}
.activity-item:last-child{border-bottom:none;}
.ai-icon{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;}
.ai-title{font-size:12px;font-weight:600;color:${C.text};margin-bottom:2px;}
.ai-sub{font-size:11px;color:${C.textD};}
.ai-time{font-size:10px;color:${C.textD};white-space:nowrap;margin-left:auto;}

/* ── SELL FORM STEPS ── */
.sell-card{background:${C.surface};border:1.5px solid ${C.border};border-radius:14px;padding:24px;margin-bottom:16px;}

/* ── WA FLOAT ── */
.wa-float{position:fixed;bottom:24px;right:24px;z-index:400;width:58px;height:58px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 6px 22px rgba(37,211,102,.5);text-decoration:none;border:none;animation:ring 2.5s infinite;}
@keyframes ring{0%{box-shadow:0 6px 22px rgba(37,211,102,.5),0 0 0 0 rgba(37,211,102,.4)}60%{box-shadow:0 6px 22px rgba(37,211,102,.5),0 0 0 11px rgba(37,211,102,0)}100%{box-shadow:0 6px 22px rgba(37,211,102,.5),0 0 0 0 rgba(37,211,102,0)}}

/* ── TOAST ── */
.toast{position:fixed;bottom:24px;right:96px;z-index:500;background:${C.forest};color:#fff;border:1px solid rgba(240,160,48,.3);padding:12px 18px;border-radius:11px;font-size:13px;font-weight:500;box-shadow:0 12px 36px rgba(0,0,0,.25);display:flex;align-items:center;gap:8px;max-width:300px;animation:sin .28s cubic-bezier(.34,1.56,.64,1);}
@keyframes sin{from{transform:translateY(16px) scale(.95);opacity:0}to{transform:none;opacity:1}}

/* ── FOOTER ── */
.footer{background:${C.forest};border-top:2px solid rgba(255,255,255,.07);padding:44px 20px 24px;}
.footer-inner{max-width:1200px;margin:0 auto;}
.footer-grid{display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:36px;margin-bottom:36px;}
@media(max-width:800px){.footer-grid{grid-template-columns:1fr 1fr;gap:24px;}}
@media(max-width:500px){.footer-grid{grid-template-columns:1fr;}}
.footer-brand-name{font-family:'Playfair Display',serif;font-size:22px;color:#fff;font-weight:700;margin-bottom:8px;}
.footer-brand-name em{color:${C.amberL};font-style:italic;}
.footer-brand-sub{font-size:12px;color:rgba(255,255,255,.45);line-height:1.7;margin-bottom:16px;}
.fcol-title{font-size:11px;font-weight:700;color:${C.amberL};text-transform:uppercase;letter-spacing:1px;margin-bottom:14px;}
.flink{display:block;font-size:13px;color:rgba(255,255,255,.55);margin-bottom:8px;cursor:pointer;transition:color .15s;}
.flink:hover{color:rgba(255,255,255,.9);}
.footer-bottom{border-top:1px solid rgba(255,255,255,.08);padding-top:20px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px;}
.fcopy{font-size:12px;color:rgba(255,255,255,.35);}
.footer-wa{display:inline-flex;align-items:center;gap:7px;background:#25D366;color:#fff;padding:8px 18px;border-radius:8px;font-size:13px;font-weight:700;text-decoration:none;transition:all .18s;}
.footer-wa:hover{background:#1db954;}

/* ── RESPONSIVE MOBILE ── */
@media(max-width:700px){
  .hero h1{font-size:34px;}
  .hero-stats{flex-direction:column;}
  .hstat{border-right:none;border-bottom:1px solid rgba(255,255,255,.08);}
  .hstat:last-child{border-bottom:none;}
  .lcard{grid-template-columns:auto 1fr;grid-template-rows:auto auto;}
  .lcard-right{grid-column:2;grid-row:2;flex-direction:row;align-items:center;justify-content:space-between;width:100%;text-align:left;}
  .nav-main .nav-actions{display:none;}
  .topbar{display:none;}
  .footer-grid{grid-template-columns:1fr;}
  .page-grid{grid-template-columns:1fr;}
}
@media(max-width:500px){
  .lcard{grid-template-columns:1fr;}
  .lcard-icon{display:none;}
}
`;

/* ─────────────────────────────────────────────
   TOOLTIP
───────────────────────────────────────────── */
function CTooltip({active,payload,label}) {
  if(!active||!payload?.length) return null;
  return(
    <div className="ct">
      <div className="ctll" style={{color:C.saffron,fontWeight:700,marginBottom:5}}>{label}</div>
      {payload.map((p,i)=>(
        <div key={i} className="ctr">
          <span className="ctk">{p.name}</span>
          <span className="ctv" style={{color:p.color}}>₹{p.value?.toLocaleString()}/q</span>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   WA SVG
───────────────────────────────────────────── */
function WASvg({sz=26}) {
  return(
    <svg viewBox="0 0 48 48" width={sz} height={sz} fill="none">
      <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z" fill="#fff"/>
      <path d="M24 7.2C14.8 7.2 7.2 14.8 7.2 24c0 3.3.9 6.4 2.6 9.1l.4.6-1.7 6.2 6.4-1.7.6.3c2.6 1.5 5.5 2.3 8.5 2.3 9.2 0 16.8-7.6 16.8-16.8S33.2 7.2 24 7.2z" fill="#25D366"/>
      <path d="M33.5 28.1c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.4 1.8-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-.9.2-.2.5-.5.7-.8.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.8-.1-.2-1-2.4-1.3-3.3-.3-.8-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.2 5 7.8 6.8 1.1.5 2 .7 2.6.9 1.1.3 2.1.3 2.9.2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.5z" fill="#fff"/>
    </svg>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
───────────────────────────────────────────── */
export default function App() {
  const [tab, setTab]         = useState("home");
  const [listType, setLType]  = useState("All");
  const [grade, setGrade]     = useState("All");
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(null);
  const [toast, setToast]     = useState(null);
  const [sellStep, setSStep]  = useState(0);
  const [userListings, setUL] = useState([]);

  // forms
  const [iqF, setIqF]   = useState({name:"",phone:"",qty:"",msg:""});
  const [expF, setExpF] = useState({co:"",country:"Bangladesh",name:"",phone:"",email:"",qty:"",grade:"Super (55mm+)",port:"Nhava Sheva (Mumbai)",inc:"FOB",certs:[],msg:""});
  const [sellF, setSF]  = useState({type:"seller",name:"",phone:"",loc:"Mandsaur",grade:"A Grade",qty:"",size:"",price:"",phyto:false,desc:""});
  const [conF, setConF] = useState({name:"",phone:"",msg:""});

  const flash = m => { setToast(m); setTimeout(()=>setToast(null),3400); };
  const toggleCert = c => setExpF(f=>({...f,certs:f.certs.includes(c)?f.certs.filter(x=>x!==c):[...f.certs,c]}));

  const submitIq = e => { e.preventDefault(); flash("✅ Inquiry bhej di! 2-4 hrs mein contact karenge."); setModal(null); setIqF({name:"",phone:"",qty:"",msg:""}); };
  const submitExp = e => { e.preventDefault(); flash("🌍 Export inquiry received! 24 hrs mein response milega."); };
  const submitSell = e => {
    e.preventDefault();
    setUL(p=>[{id:Date.now(),type:sellF.type,verified:false,name:sellF.name,loc:sellF.loc,grade:sellF.grade,size:sellF.size||"35-55mm",qty:sellF.qty+" Quintal",price:parseInt(sellF.price)||6000,avail:"Immediate",rating:0,deals:0,phyto:sellF.phyto,desc:sellF.desc||"Naya listing.",badge:sellF.type==="seller"?"Verified":"Buyer"},...p]);
    flash("🧄 Listing live ho gayi!"); setSStep(0); setTab("listings");
    setSF({type:"seller",name:"",phone:"",loc:"Mandsaur",grade:"A Grade",qty:"",size:"",price:"",phyto:false,desc:""});
  };
  const submitCon = e => { e.preventDefault(); flash("✅ Message bhej diya! Hum jald contact karenge."); setConF({name:"",phone:"",msg:""}); };

  useEffect(()=>{
    document.title="MandsaurGarlic.com — India Ka #1 Garlic B2B Marketplace";
    const sm=(n,c,p=false)=>{let el=document.querySelector(p?`meta[property='${n}']`:`meta[name='${n}']`);if(!el){el=document.createElement('meta');p?el.setAttribute('property',n):el.setAttribute('name',n);document.head.appendChild(el);}el.setAttribute('content',c);};
    sm('description','MandsaurGarlic.com — India ka #1 garlic B2B marketplace. Verified farmers, live mandi bhav, export buyers, logistics. Mandsaur, Neemuch, Ratlam.');
    sm('keywords','mandsaur garlic, garlic wholesale india, garlic export, lahsun mandi bhav, garlic b2b marketplace, neemuch garlic, ratlam garlic');
    sm('og:title','MandsaurGarlic.com — India Ka #1 Garlic B2B Marketplace',true);
    sm('og:description','Verified garlic sellers & buyers. Live mandi bhav. Export inquiry. 2400+ farmers.',true);
    sm('og:url','https://www.mandsaurgarlic.com',true);
    sm('og:type','website',true);
  },[]);

  const allListings = [...LISTINGS,...userListings];
  const filtered = allListings.filter(l=>{
    const g = grade==="All" || l.grade===grade;
    const t = listType==="All" || (listType==="Sellers"&&l.type==="seller") || (listType==="Buyers"&&l.type==="buyer");
    const s = !search || l.name.toLowerCase().includes(search.toLowerCase()) || l.loc.toLowerCase().includes(search.toLowerCase());
    return g&&t&&s;
  });

  const TABS = [
    {k:"home",    i:"🏠",  l:"Home"},
    {k:"listings",i:"🛒",  l:"Sellers"},
    {k:"buyers",  i:"🏢",  l:"Buyers"},
    {k:"bhav",    i:"📊",  l:"Mandi Bhav"},
    {k:"export",  i:"🌍",  l:"Export"},
    {k:"sell",    i:"➕",  l:"Post Listing"},
    {k:"contact", i:"📞",  l:"Contact"},
  ];

  const badgeClass = b => b==="Top Seller"?"badge-top":b==="Export Buyer"||b==="Premium Buyer"?"badge-buyer":b==="Organic"?"badge-org":b==="Bulk"?"badge-bulk":"badge-seller";

  return(
    <>
      <style>{CSS}</style>

      {/* TOP BAR */}
      <div className="topbar">
        <div className="topbar-left">
          <span>🇮🇳 India's #1 Garlic B2B Platform</span>
          <span>📍 Mandsaur, Madhya Pradesh</span>
        </div>
        <div className="topbar-right">
          <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="topbar-phone">
            📱 +91-7772993222
          </a>
          <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          <span onClick={()=>setTab("contact")} style={{cursor:"pointer"}}>Contact</span>
        </div>
      </div>

      {/* NAV */}
      <header className="nav">
        <div className="nav-main">
          <div className="nav-logo" onClick={()=>setTab("home")} style={{cursor:"pointer"}}>
            <div className="nav-logo-icon">🧄</div>
            <div className="nav-logo-text">
              <div className="nav-logo-name">Mandsaur<em>Garlic</em></div>
              <div className="nav-logo-sub">B2B Marketplace</div>
            </div>
          </div>
          <div className="nav-search">
            <input className="nav-search-input" placeholder="Search garlic variety, location, grade..." value={search} onChange={e=>setSearch(e.target.value)} onKeyDown={e=>e.key==="Enter"&&setTab("listings")}/>
            <button className="nav-search-btn" onClick={()=>setTab("listings")}>🔍 Search</button>
          </div>
          <div className="nav-actions">
            <button className="nav-btn-ghost" onClick={()=>setTab("sell")}>+ Post Listing</button>
            <button className="nav-btn-solid" onClick={()=>{window.open(WA_DEFAULT,'_blank')}}>💬 WhatsApp</button>
          </div>
        </div>
        <div className="nav-tabs">
          <div className="nav-tabs-inner">
            {TABS.map(t=>(
              <button key={t.k} className={`ntab ${tab===t.k?"on":""}`} onClick={()=>setTab(t.k)}>
                {t.i} {t.l}
                {t.k==="listings"&&<span className="nbadge">{allListings.filter(l=>l.type==="seller").length}</span>}
                {t.k==="buyers"&&<span className="nbadge">{allListings.filter(l=>l.type==="buyer").length}</span>}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-label">LIVE BHAV</div>
        <div className="ticker-track">
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

      {/* ══ HOME ══ */}
      {tab==="home"&&<>
        <div className="hero">
          <div className="hero-inner">
            <div>
              <div className="hero-tag">🇮🇳 Mandsaur Mandi — India's Garlic Capital</div>
              <h1>India Ka Sabse Bada<br/><em>Garlic B2B</em> Marketplace</h1>
              <p className="hero-sub">Verified farmers se seedha kharido. Export buyers se seedha milo. Live mandi bhav, full documentation, logistics — sab ek jagah. Zero middlemen.</p>
              <div className="hero-ctas">
                <button className="btn-primary" onClick={()=>setTab("listings")}>🛒 Garlic Kharido</button>
                <button className="btn-outline-w" onClick={()=>setTab("export")}>🌍 Export Inquiry</button>
                <button className="btn-outline-w" onClick={()=>setTab("sell")}>➕ Listing Daalo</button>
              </div>
              <div className="hero-stats">
                {[["2,400+","Farmers"],["850T","Daily Stock"],["14","Countries"],["₹0","Listing Fee"]].map(([n,l],i)=>(
                  <div key={i} className="hstat"><span className="hstat-n">{n}</span><span className="hstat-l">{l}</span></div>
                ))}
              </div>
            </div>
            <div className="hero-card">
              <div className="hcard-hd"><span className="hpulse"/>⚡ Aaj Ka Live Snapshot</div>
              {[["Mandsaur Super","₹8,200–12,800/q",true,"+12.4%"],["Export FOB","₹9,400/q avg",true,"+15.3%"],["Organic Premium","₹11,500–14,000/q",true,"+22.1%"],["Neemuch A Grade","₹6,500–9,800/q",true,"+8.1%"],["Processing Grade","₹3,800–5,700/q",false,"-1.8%"]].map(([k,v,up,p],i)=>(
                <div key={i} className="hrow">
                  <span className="hkey">{k}</span>
                  <div style={{textAlign:"right"}}>
                    <div className="hval">{v}</div>
                    <div className={up?"hup":"hdn"}>{p}</div>
                  </div>
                </div>
              ))}
              <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <button style={{width:"100%",padding:"10px",background:"#25D366",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                  <WASvg sz={16}/> WhatsApp Pe Quote Lo
                </button>
              </a>
            </div>
          </div>
        </div>

        {/* HOME MAIN */}
        <div className="page">
          {/* Dashboard KPIs */}
          <div className="dash-grid">
            {[
              {i:"🧄",v:"4,820q",l:"Today's Listings",d:"+18 new",acc:C.leaf},
              {i:"🌍",v:"₹1.6Cr",l:"Export Revenue (May)",d:"+52% vs Apr",acc:C.saffron},
              {i:"👤",v:"124",l:"Active Buyers",d:"+18 this month",acc:C.blue},
              {i:"📦",v:"6",l:"Pending Orders",d:"2 export",acc:C.orange},
              {i:"💬",v:"2",l:"New Inquiries",d:"WhatsApp",acc:C.red},
              {i:"⭐",v:"4.8",l:"Platform Rating",d:"From 89 reviews",acc:C.amber},
            ].map((d,i)=>(
              <div key={i} className="dcard" style={{"--acc":d.acc}}>
                <div className="dcard-icon">{d.i}</div>
                <div className="dcard-val">{d.v}</div>
                <div className="dcard-lbl">{d.l}</div>
                <div className="dcard-delta" style={{color:d.acc}}>{d.d}</div>
              </div>
            ))}
          </div>

          <div className="page-grid">
            <div>
              {/* Latest Listings */}
              <div className="sh">
                <div className="sh-left"><div className="sh-dot"/><span className="sh-title">Latest Listings</span><span className="sh-count">{allListings.length} active</span></div>
                <span className="sh-link" onClick={()=>setTab("listings")} style={{cursor:"pointer"}}>View All →</span>
              </div>
              <div className="listing-grid">
                {allListings.slice(0,4).map(l=>(
                  <div key={l.id} className="lcard" onClick={()=>setModal(l)}>
                    <div className={`lcard-icon ${l.type}`}>{l.type==="seller"?"🧄":"🏢"}</div>
                    <div className="lcard-body">
                      <div className="lcard-top">
                        <span className="lcard-name">{l.name}</span>
                        <span className={`lcard-badge ${badgeClass(l.badge)}`}>{l.badge}</span>
                        {l.verified&&<span className="lcard-verified">✅ Verified</span>}
                      </div>
                      <div className="lcard-loc">📍 {l.loc}</div>
                      <p className="lcard-desc">{l.desc}</p>
                      <div className="lcard-tags">
                        <span className="ltag">📦 {l.qty}</span>
                        <span className="ltag">📏 {l.size}</span>
                        {l.phyto&&<span className="ltag ok">✈ Phyto Ready</span>}
                        {l.rating>0&&<span className="ltag">⭐ {l.rating} ({l.deals} deals)</span>}
                      </div>
                    </div>
                    <div className="lcard-right">
                      <div><div className="lcard-price">₹{l.price.toLocaleString()}<span className="lcard-price-sub">/q</span></div></div>
                      <div className="lcard-qty">{l.qty}</div>
                      <div className="lcard-avail">🟢 {l.avail}</div>
                      <button className="lcard-btn" onClick={e=>{e.stopPropagation();setModal(l);}}>Inquiry →</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Chart */}
              <div className="chart-card">
                <div className="chart-title">📈 7-Day Price Trend — Super vs A Grade</div>
                <div className="chart-sub">June 3–9, 2026 · Mandsaur Mandi · ₹/quintal</div>
                <ResponsiveContainer width="100%" height={180}>
                  <AreaChart data={PRICE_7D}>
                    <defs>
                      <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.saffron} stopOpacity={0.2}/><stop offset="95%" stopColor={C.saffron} stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="ga" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={C.leaf} stopOpacity={0.2}/><stop offset="95%" stopColor={C.leaf} stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                    <XAxis dataKey="d" tick={{fill:C.textD,fontSize:10}} axisLine={false} tickLine={false}/>
                    <YAxis tick={{fill:C.textD,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                    <Tooltip content={<CTooltip/>}/>
                    <Area type="monotone" dataKey="s" name="Super" stroke={C.saffron} strokeWidth={2.5} fill="url(#gs)"/>
                    <Area type="monotone" dataKey="a" name="A Grade" stroke={C.leaf} strokeWidth={2} fill="url(#ga)"/>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SIDEBAR */}
            <div className="sidebar">
              {/* Mandi Bhav */}
              <div className="sbox">
                <div className="sbox-hd"><span style={{fontSize:16}}>📊</span><span className="sbox-hd-title">Live Mandi Bhav</span></div>
                <div className="sbox-body">
                  {MANDI.map((m,i)=>(
                    <div key={i} className="mandi-row">
                      <div><div className="mname">{m.name}</div><div style={{fontSize:10,color:C.textD}}>{m.grade} · {m.arr.toLocaleString()} katte</div></div>
                      <div style={{textAlign:"right"}}>
                        <div className="mprice">₹{m.min.toLocaleString()}–{m.max.toLocaleString()}</div>
                        <div className={m.ch>0?"mup":"mdn"}>{m.ch>0?"▲+":"▼"}{Math.abs(m.ch)}%</div>
                      </div>
                    </div>
                  ))}
                  <button onClick={()=>setTab("bhav")} style={{width:"100%",marginTop:12,padding:"9px",background:C.mint,color:C.leaf,border:`1.5px solid ${C.leaf}`,borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer"}}>View Full Bhav Table →</button>
                </div>
              </div>

              {/* Agri News */}
              <div className="sbox">
                <div className="sbox-hd"><span style={{fontSize:16}}>📰</span><span className="sbox-hd-title">Agri Updates</span></div>
                <div className="sbox-body">
                  {NEWS.map((n,i)=>(
                    <div key={i} className="news-item">
                      <span className={`news-tag ${n.tag.toLowerCase()}`}>{n.tag}</span>
                      <div className="news-title">{n.title}</div>
                      <div className="news-sub">{n.sub}</div>
                      <div className="news-date">📅 {n.date}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick WA */}
              <div className="sbox">
                <div className="sbox-hd"><WASvg sz={16}/><span className="sbox-hd-title" style={{marginLeft:6}}>Quick Contact</span></div>
                <div className="sbox-body">
                  <p style={{fontSize:12,color:C.textM,lineHeight:1.65,marginBottom:14}}>Seedha WhatsApp pe baat karo — 2 ghante mein response guaranteed.</p>
                  <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                    <button style={{width:"100%",padding:"11px",background:"#25D366",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                      <WASvg sz={16}/> +91-7772993222
                    </button>
                  </a>
                  <button onClick={()=>setTab("export")} style={{width:"100%",marginTop:8,padding:"10px",background:C.mint,color:C.leaf,border:`1.5px solid ${C.leaf}`,borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer"}}>🌍 Export Inquiry Form</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>}

      {/* ══ LISTINGS & BUYERS ══ */}
      {(tab==="listings"||tab==="buyers")&&<div className="page">
        <div className="sh">
          <div className="sh-left">
            <div className="sh-dot"/>
            <span className="sh-title">{tab==="listings"?"🧄 Garlic Sellers":"🏢 Garlic Buyers"}</span>
            <span className="sh-count">{filtered.length} results</span>
          </div>
          <button className="nav-btn-solid" style={{padding:"8px 16px",fontSize:12}} onClick={()=>setTab("sell")}>+ Post Listing</button>
        </div>
        <div className="filters">
          <div className="search-mini">
            <span style={{color:C.textD}}>🔍</span>
            <input placeholder="Name, location..." value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          {(tab==="listings"?["All","Sellers","Buyers"]:["All","Buyers","Sellers"]).map(t=>(
            <button key={t} className={`filter-chip ${listType===t?"on":""}`} onClick={()=>setLType(t)}>{t}</button>
          ))}
          {GRADES.map(g=>(
            <button key={g} className={`filter-chip ${grade===g?"on":""}`} onClick={()=>setGrade(g)}>{g}</button>
          ))}
        </div>
        <div className="page-grid">
          <div>
            <div className="listing-grid">
              {filtered.map(l=>(
                <div key={l.id} className="lcard" onClick={()=>setModal(l)}>
                  <div className={`lcard-icon ${l.type}`}>{l.type==="seller"?"🧄":"🏢"}</div>
                  <div className="lcard-body">
                    <div className="lcard-top">
                      <span className="lcard-name">{l.name}</span>
                      <span className={`lcard-badge ${badgeClass(l.badge)}`}>{l.badge}</span>
                      {l.verified&&<span className="lcard-verified">✅ Verified</span>}
                    </div>
                    <div className="lcard-loc">📍 {l.loc}</div>
                    <p className="lcard-desc">{l.desc}</p>
                    <div className="lcard-tags">
                      <span className="ltag">📦 {l.qty}</span>
                      <span className="ltag">🌾 {l.grade}</span>
                      <span className="ltag">📏 {l.size}</span>
                      {l.phyto&&<span className="ltag ok">✈ Phyto</span>}
                      {l.rating>0&&<span className="ltag">⭐{l.rating} · {l.deals} deals</span>}
                    </div>
                  </div>
                  <div className="lcard-right">
                    <div><div className="lcard-price">₹{l.price.toLocaleString()}<span className="lcard-price-sub">/q</span></div></div>
                    <div className="lcard-avail">🟢 {l.avail}</div>
                    <button className="lcard-btn" onClick={e=>{e.stopPropagation();setModal(l);}}>Inquiry →</button>
                  </div>
                </div>
              ))}
              {filtered.length===0&&<div style={{textAlign:"center",padding:"40px",color:C.textD}}>No listings found. <span style={{color:C.leaf,cursor:"pointer"}} onClick={()=>{setSearch("");setGrade("All");setLType("All");}}>Clear filters</span></div>}
            </div>
          </div>
          <div className="sidebar">
            <div className="sbox">
              <div className="sbox-hd"><span style={{fontSize:16}}>📊</span><span className="sbox-hd-title">Live Bhav</span></div>
              <div className="sbox-body">
                {MANDI.slice(0,4).map((m,i)=>(
                  <div key={i} className="mandi-row">
                    <div><div className="mname">{m.name}</div><div style={{fontSize:10,color:C.textD}}>{m.grade}</div></div>
                    <div style={{textAlign:"right"}}>
                      <div className="mprice" style={{fontSize:12}}>₹{m.min.toLocaleString()}–{m.max.toLocaleString()}</div>
                      <div className={m.ch>0?"mup":"mdn"}>{m.ch>0?"▲+":"▼"}{Math.abs(m.ch)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sbox">
              <div className="sbox-hd"><span style={{fontSize:16}}>📰</span><span className="sbox-hd-title">Latest News</span></div>
              <div className="sbox-body">
                {NEWS.slice(0,3).map((n,i)=>(
                  <div key={i} className="news-item">
                    <span className={`news-tag ${n.tag.toLowerCase()}`}>{n.tag}</span>
                    <div className="news-title">{n.title}</div>
                    <div className="news-date">📅 {n.date}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* ══ MANDI BHAV ══ */}
      {tab==="bhav"&&<div className="page">
        <div className="sh"><div className="sh-left"><div className="sh-dot"/><span className="sh-title">📊 Live Mandi Bhav</span></div><span style={{fontSize:12,color:C.textD}}>Updated: Jun 9, 2026 · 9:30 AM</span></div>
        <div className="dash-grid" style={{marginBottom:20}}>
          {[{l:"Highest Today",v:"₹14,500/q",s:"Indore Super",c:C.saffron},{l:"Export FOB Avg",v:"₹9,400/q",s:"Nhava Sheva",c:C.blue},{l:"Total Arrivals",v:"~78,000q",s:"All Mandis",c:C.leaf},{l:"Export Growth",v:"+245%",s:"vs Last Year",c:C.leaf}].map((s,i)=>(
            <div key={i} style={{background:C.surface,border:`1.5px solid ${C.border}`,borderRadius:12,padding:"16px 18px"}}>
              <div style={{fontSize:10,color:C.saffron,fontWeight:700,textTransform:"uppercase",letterSpacing:".6px",marginBottom:7}}>{s.l}</div>
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:26,fontWeight:700,color:s.c,marginBottom:3}}>{s.v}</div>
              <div style={{fontSize:11,color:C.textD}}>{s.s}</div>
            </div>
          ))}
        </div>
        <div className="ftable-wrap">
          <div className="ftable-hd"><h3>🌾 Aaj Ke Mandi Rates</h3><span>Jun 9, 2026 · Real-time</span></div>
          <table>
            <thead><tr><th>Mandi</th><th>Best Grade</th><th>Min (₹/q)</th><th>Max (₹/q)</th><th>Arrivals</th><th>Change</th></tr></thead>
            <tbody>
              {MANDI.map((m,i)=>(
                <tr key={i}>
                  <td><span className="tmn">{m.name}</span></td>
                  <td>{m.grade}</td>
                  <td>₹{m.min.toLocaleString()}</td>
                  <td style={{fontWeight:700}}>₹{m.max.toLocaleString()}</td>
                  <td><span className="tarr">{m.arr.toLocaleString()} katte</span></td>
                  <td><span className={m.ch>0?"tup":"tdn"}>{m.ch>0?"▲ +":"▼ "}{Math.abs(m.ch)}%</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="chart-card">
          <div className="chart-title">📈 7-Day Price Trend</div>
          <div className="chart-sub">Super Grade vs A Grade · Jun 3-9, 2026</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={PRICE_7D}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
              <XAxis dataKey="d" tick={{fill:C.textD,fontSize:10}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.textD,fontSize:9}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<CTooltip/>}/>
              <Line type="monotone" dataKey="s" name="Super" stroke={C.saffron} strokeWidth={2.5} dot={{r:4,fill:C.saffron}}/>
              <Line type="monotone" dataKey="a" name="A Grade" stroke={C.leaf} strokeWidth={2} dot={{r:3,fill:C.leaf}}/>
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>}

      {/* ══ EXPORT ══ */}
      {tab==="export"&&<div className="page">
        <div className="sh"><div className="sh-left"><div className="sh-dot"/><span className="sh-title">🌍 Export Inquiry</span></div></div>
        <div className="page-grid">
          <div>
            <div className="export-wrap">
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.forest,marginBottom:6}}>Export Quote Request</div>
              <p style={{fontSize:13,color:C.textM,marginBottom:22,lineHeight:1.6}}>Bangladesh, UAE, Malaysia, USA — 14 countries mein export. 24 hrs mein response guaranteed.</p>
              <form onSubmit={submitExp} style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="fsep">📋 Company Information</div>
                <div className="exp-grid">
                  <div className="fg"><label className="fl">Company Name *</label><input className="fi" placeholder="Your company" required value={expF.co} onChange={e=>setExpF({...expF,co:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Import Country *</label><select className="fsel" value={expF.country} onChange={e=>setExpF({...expF,country:e.target.value})}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
                  <div className="fg"><label className="fl">Contact Person *</label><input className="fi" placeholder="Your name" required value={expF.name} onChange={e=>setExpF({...expF,name:e.target.value})}/></div>
                  <div className="fg"><label className="fl">WhatsApp *</label><input className="fi" placeholder="+country code" required value={expF.phone} onChange={e=>setExpF({...expF,phone:e.target.value})}/></div>
                  <div className="fg" style={{gridColumn:"1/-1"}}><label className="fl">Email</label><input className="fi" type="email" placeholder="business@email.com" value={expF.email} onChange={e=>setExpF({...expF,email:e.target.value})}/></div>
                </div>
                <div className="fsep">🧄 Order Details</div>
                <div className="exp-grid">
                  <div className="fg"><label className="fl">Quantity (MT) *</label><input className="fi" type="number" placeholder="Metric tonnes" required value={expF.qty} onChange={e=>setExpF({...expF,qty:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Grade</label><select className="fsel" value={expF.grade} onChange={e=>setExpF({...expF,grade:e.target.value})}>{"Super (55mm+),A Grade (45-55mm),B Grade,Organic Certified".split(",").map(g=><option key={g}>{g}</option>)}</select></div>
                  <div className="fg"><label className="fl">Port</label><select className="fsel" value={expF.port} onChange={e=>setExpF({...expF,port:e.target.value})}>{"Nhava Sheva (Mumbai),Mundra (Gujarat),Kandla,Chennai".split(",").map(p=><option key={p}>{p}</option>)}</select></div>
                  <div className="fg"><label className="fl">Incoterms</label><select className="fsel" value={expF.inc} onChange={e=>setExpF({...expF,inc:e.target.value})}>{"FOB,CIF,CFR,EXW,DDP".split(",").map(t=><option key={t}>{t}</option>)}</select></div>
                </div>
                <div className="fsep">📄 Certificates Required</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                  {CERTS.map(c=>(
                    <label key={c} className="fcheck">
                      <input type="checkbox" checked={expF.certs.includes(c)} onChange={()=>toggleCert(c)}/>
                      <span className="fcheck-lbl">{c}</span>
                    </label>
                  ))}
                </div>
                <div className="fg"><label className="fl">Additional Message</label><textarea className="fta" placeholder="Special requirements, sample request..." value={expF.msg} onChange={e=>setExpF({...expF,msg:e.target.value})}/></div>
                <button type="submit" className="submit-btn">🌍 Submit Export Inquiry</button>
                <a href={wa(`Hi! Export inquiry from MandsaurGarlic.com\nCompany: ${expF.co||'[company]'}\nCountry: ${expF.country}\nQty: ${expF.qty||'[qty]'} MT\nGrade: ${expF.grade}\nIncoterms: ${expF.inc}\nPlease send FOB quote.`)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <button type="button" className="wa-submit"><WASvg sz={17}/> WhatsApp Pe Direct Quote Lo</button>
                </a>
              </form>
            </div>
          </div>
          <div className="sidebar">
            <div className="sbox">
              <div className="sbox-hd"><span style={{fontSize:16}}>🏆</span><span className="sbox-hd-title">Why Export From Us?</span></div>
              <div className="sbox-body">
                {[["🌾","India's Largest Hub","Mandsaur — #1 garlic trading center. Best prices, highest volume."],["✅","High Allicin","Indian garlic has higher allicin vs Chinese. International buyers prefer."],["📋","Full Docs","Phyto, COO, FSSAI, Lab Report — all within 3-5 days."],["🚢","Multiple Ports","Nhava Sheva, Mundra, Kandla — export from nearest port."],["💰","Best FOB Price","Farm-direct sourcing = 15-20% better than market rates."]].map(([i,t,s],k)=>(
                  <div key={k} style={{display:"flex",gap:12,paddingBottom:12,marginBottom:12,borderBottom:k<4?`1px solid ${C.border}`:"none"}}>
                    <span style={{fontSize:20,flexShrink:0}}>{i}</span>
                    <div><div style={{fontSize:13,fontWeight:700,color:C.forest,marginBottom:2}}>{t}</div><div style={{fontSize:11,color:C.textM,lineHeight:1.6}}>{s}</div></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="sbox">
              <div className="sbox-hd"><span style={{fontSize:16}}>📊</span><span className="sbox-hd-title">Export Rates</span></div>
              <div className="sbox-body">
                {[["Super Grade FOB","USD 850-950/MT"],["A Grade FOB","USD 650-750/MT"],["Container (20ft)","~18-20 MT"],["Min Order","1 Container"],["Dispatch","7 days"]].map(([k,v],i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<4?`1px solid ${C.border}`:"none",fontSize:13}}>
                    <span style={{color:C.textM}}>{k}</span>
                    <span style={{fontWeight:700,color:C.forest}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* ══ POST LISTING ══ */}
      {tab==="sell"&&<div className="page">
        <div className="sh"><div className="sh-left"><div className="sh-dot"/><span className="sh-title">➕ Post a Listing</span></div><span style={{fontSize:12,color:C.textD}}>Free · 2,400+ buyers dekh sakte hain</span></div>
        <div className="page-grid">
          <div className="sell-card">
            <div className="step-bar">
              {["Basic Info","Product Details","Publish"].map((s,i)=>(
                <div key={i} className={`step ${sellStep===i?"on":""}`} onClick={()=>setSStep(i)}>
                  <span className="step-n">{sellStep>i?"✓":i+1}</span>{s}
                </div>
              ))}
            </div>
            <form onSubmit={submitSell}>
              {sellStep===0&&(
                <div className="exp-grid" style={{gap:14}}>
                  <div className="fg" style={{gridColumn:"1/-1"}}>
                    <label className="fl">Listing Type</label>
                    <div style={{display:"flex",gap:10,marginTop:4}}>
                      {["seller","buyer"].map(t=>(
                        <label key={t} className="fcheck" style={{flex:1}}>
                          <input type="radio" name="type" checked={sellF.type===t} onChange={()=>setSF({...sellF,type:t})}/>
                          <span className="fcheck-lbl">{t==="seller"?"🧄 Seller (Main bechna chahta hoon)":"🏢 Buyer (Mujhe kharidna hai)"}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="fg"><label className="fl">Aapka Naam / Company *</label><input className="fi" placeholder="Full name ya company" required value={sellF.name} onChange={e=>setSF({...sellF,name:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Phone / WhatsApp *</label><input className="fi" placeholder="10-digit" required value={sellF.phone} onChange={e=>setSF({...sellF,phone:e.target.value})}/></div>
                  <div className="fg" style={{gridColumn:"1/-1"}}><label className="fl">Location *</label><input className="fi" placeholder="Village, District, State" required value={sellF.loc} onChange={e=>setSF({...sellF,loc:e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1"}}><button type="button" className="submit-btn" onClick={()=>setSStep(1)}>Next: Product Details →</button></div>
                </div>
              )}
              {sellStep===1&&(
                <div className="exp-grid" style={{gap:14}}>
                  <div className="fg"><label className="fl">Grade *</label><select className="fsel" value={sellF.grade} onChange={e=>setSF({...sellF,grade:e.target.value})}>{"Super,A Grade,B Grade,Organic".split(",").map(g=><option key={g}>{g}</option>)}</select></div>
                  <div className="fg"><label className="fl">Quantity (Quintal) *</label><input className="fi" type="number" placeholder="Kitna?" required value={sellF.qty} onChange={e=>setSF({...sellF,qty:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Bulb Size (mm)</label><input className="fi" placeholder="e.g. 40-55mm" value={sellF.size} onChange={e=>setSF({...sellF,size:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Price (₹/quintal) *</label><input className="fi" type="number" placeholder="Aapka rate" required value={sellF.price} onChange={e=>setSF({...sellF,price:e.target.value})}/></div>
                  {sellF.price&&sellF.qty&&(
                    <div style={{gridColumn:"1/-1",background:C.mint,border:`1.5px solid ${C.leaf}`,borderRadius:10,padding:"12px 16px"}}>
                      <div style={{fontSize:10,color:C.leaf,fontWeight:700,textTransform:"uppercase"}}>Estimated Total</div>
                      <div style={{fontFamily:"'Playfair Display',serif",fontSize:28,color:C.saffron}}>₹{((parseInt(sellF.price)||0)*(parseInt(sellF.qty)||0)).toLocaleString()}</div>
                    </div>
                  )}
                  <label className="fcheck" style={{gridColumn:"1/-1"}}>
                    <input type="checkbox" checked={sellF.phyto} onChange={e=>setSF({...sellF,phyto:e.target.checked})}/>
                    <span className="fcheck-lbl">✈️ Phytosanitary Certificate Available (Export Ready)</span>
                  </label>
                  <div className="fg" style={{gridColumn:"1/-1"}}><label className="fl">Description</label><textarea className="fta" placeholder="Quality details, availability, special features..." value={sellF.desc} onChange={e=>setSF({...sellF,desc:e.target.value})}/></div>
                  <div style={{gridColumn:"1/-1",display:"flex",gap:10}}>
                    <button type="button" style={{padding:"12px 20px",border:`1.5px solid ${C.border}`,borderRadius:9,background:C.surface,color:C.textM,fontSize:13,fontWeight:600,cursor:"pointer"}} onClick={()=>setSStep(0)}>← Back</button>
                    <button type="submit" className="submit-btn" style={{flex:1}}>🚀 Publish Listing — FREE</button>
                  </div>
                </div>
              )}
            </form>
          </div>
          <div className="sidebar">
            <div className="sbox">
              <div className="sbox-hd"><span style={{fontSize:16}}>✅</span><span className="sbox-hd-title">Listing Benefits</span></div>
              <div className="sbox-body">
                {["2,400+ verified buyers tak seedha reach","Export buyers bhi dekhte hain","WhatsApp pe direct inquiry aayegi","Live mandi bhav se price compare karo","Phyto badge se zyada buyers attract karo","Free listing — koi hidden charge nahi"].map((b,i)=>(
                  <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:i<5?`1px solid ${C.border}`:"none",fontSize:12,color:C.textM,alignItems:"flex-start"}}>
                    <span style={{color:C.leaf,fontWeight:700,flexShrink:0}}>✅</span>{b}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* ══ CONTACT ══ */}
      {tab==="contact"&&<div className="page">
        <div className="sh"><div className="sh-left"><div className="sh-dot"/><span className="sh-title">📞 Contact Us</span></div></div>
        <div className="page-grid">
          <div>
            <div className="export-wrap">
              <div style={{fontFamily:"'Playfair Display',serif",fontSize:22,fontWeight:700,color:C.forest,marginBottom:20}}>Quick Inquiry</div>
              <form onSubmit={submitCon} style={{display:"flex",flexDirection:"column",gap:12}}>
                <div className="fg"><label className="fl">Aapka Naam *</label><input className="fi" placeholder="Full name" required value={conF.name} onChange={e=>setConF({...conF,name:e.target.value})}/></div>
                <div className="fg"><label className="fl">WhatsApp / Phone *</label><input className="fi" placeholder="Mobile number" required value={conF.phone} onChange={e=>setConF({...conF,phone:e.target.value})}/></div>
                <div className="fg"><label className="fl">Message *</label><textarea className="fta" style={{minHeight:100}} placeholder="Grade, quantity, destination batao..." required value={conF.msg} onChange={e=>setConF({...conF,msg:e.target.value})}/></div>
                <button type="submit" className="submit-btn">📩 Message Bhejo</button>
                <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <button type="button" className="wa-submit"><WASvg sz={17}/> WhatsApp Pe Seedha Baat Karo</button>
                </a>
              </form>
            </div>
          </div>
          <div className="sidebar">
            <div className="sbox">
              <div className="sbox-hd"><span style={{fontSize:16}}>📍</span><span className="sbox-hd-title">Contact Info</span></div>
              <div className="sbox-body">
                {[["📍","Address","New Krishi Upaj Mandi\nMandsaur, MP 458001"],["📱","WhatsApp / Call","+91-7772993222"],["✉️","Email","info@mandsaurgarlic.com"],["🕐","Working Hours","Mon–Sat: 8 AM – 8 PM\nSun: 10 AM – 4 PM"]].map(([i,t,v],k)=>(
                  <div key={k} style={{display:"flex",gap:12,padding:"12px 0",borderBottom:k<3?`1px solid ${C.border}`:"none"}}>
                    <span style={{fontSize:20,flexShrink:0}}>{i}</span>
                    <div><div style={{fontSize:13,fontWeight:700,color:C.forest,marginBottom:3}}>{t}</div><div style={{fontSize:12,color:C.textM,lineHeight:1.65,whiteSpace:"pre-line"}}>{v}</div></div>
                  </div>
                ))}
                <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                  <button style={{width:"100%",marginTop:14,padding:"11px",background:"#25D366",color:"#fff",border:"none",borderRadius:9,fontSize:13,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                    <WASvg sz={15}/> +91-7772993222
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <div className="footer-brand-name">Mandsaur<em>Garlic</em></div>
              <p className="footer-brand-sub">India Ka #1 Garlic B2B Marketplace. Mandsaur · Neemuch · Ratlam · Madhya Pradesh, India.</p>
              <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="footer-wa"><WASvg sz={15}/> +91-7772993222</a>
            </div>
            <div>
              <div className="fcol-title">Platform</div>
              {[["listings","🛒 Sellers"],["buyers","🏢 Buyers"],["bhav","📊 Mandi Bhav"],["export","🌍 Export"],["sell","➕ Post Listing"]].map(([k,l])=><span key={k} className="flink" onClick={()=>setTab(k)}>{l}</span>)}
            </div>
            <div>
              <div className="fcol-title">Garlic Grades</div>
              {["Super Grade (55mm+)","A Grade (45-55mm)","B Grade (28-40mm)","Organic Certified","Desi Garlic","Single Clove (Kali)"].map(g=><span key={g} className="flink" onClick={()=>{setGrade(g.split(" ")[0]);setTab("listings");}}>{g}</span>)}
            </div>
            <div>
              <div className="fcol-title">Export Markets</div>
              {["Bangladesh","UAE / Dubai","Malaysia","Indonesia","USA","UK"].map(c=><span key={c} className="flink">{c}</span>)}
            </div>
          </div>
          <div className="footer-bottom">
            <span className="fcopy">© 2026 MandsaurGarlic.com · All Rights Reserved · Mandsaur, Madhya Pradesh, India</span>
            <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="footer-wa"><WASvg sz={14}/> WhatsApp Us</a>
          </div>
        </div>
      </footer>

      {/* LISTING MODAL */}
      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="mhd">
              <div>
                <h2>{modal.type==="seller"?"🧄":"🏢"} {modal.name}</h2>
                <p>📍 {modal.loc} · {modal.badge} {modal.verified?"· ✅ Verified":""}</p>
              </div>
              <button className="mclose" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="mbody">
              <div className="mpricebox">
                <div>
                  <div style={{fontSize:11,color:C.textD,marginBottom:4}}>{modal.type==="seller"?"Asking Price":"Buying Price"}</div>
                  <div className="mprice">₹{modal.price.toLocaleString()}</div>
                  <div className="mprice-sub">per quintal · {modal.qty} available</div>
                </div>
                <div style={{fontSize:44}}>{modal.type==="seller"?"🧄":"🏢"}</div>
              </div>
              <div className="minfo-grid">
                {[["Grade",modal.grade],["Size",modal.size],["Quantity",modal.qty],["Availability",modal.avail],["Phyto",modal.phyto?"Yes ✅":"Available on request"],["Rating",modal.rating>0?`⭐ ${modal.rating} (${modal.deals} deals)`:"New"]].map(([l,v],i)=>(
                  <div key={i} className="minfo"><label>{l}</label><span>{v}</span></div>
                ))}
              </div>
              <div className="mdesc">💬 {modal.desc}</div>
              <form className="mform" onSubmit={submitIq}>
                <div className="exp-grid" style={{gap:10}}>
                  <div className="fg"><label className="fl">Aapka Naam *</label><input className="fi" placeholder="Name" required value={iqF.name} onChange={e=>setIqF({...iqF,name:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Phone *</label><input className="fi" placeholder="Mobile" required value={iqF.phone} onChange={e=>setIqF({...iqF,phone:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Quantity (q)</label><input className="fi" type="number" placeholder="Kitna?" value={iqF.qty} onChange={e=>setIqF({...iqF,qty:e.target.value})}/></div>
                </div>
                <div className="fg"><label className="fl">Message</label><textarea className="fta" style={{minHeight:65}} placeholder="Special requirement?" value={iqF.msg} onChange={e=>setIqF({...iqF,msg:e.target.value})}/></div>
                <button type="submit" className="mbtn-green">📩 Inquiry Bhejo</button>
              </form>
              <a href={wa(`Namaskar! 🧄MandsaurGarlic.com pe aapki listing dekhi:\n\n*${modal.name}*\nGrade: ${modal.grade} | Size: ${modal.size}\nPrice: ₹${modal.price}/q | Qty: ${modal.qty}\n\nKya available hai? Quote dijiye.`)} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                <button className="mbtn-wa"><WASvg sz={17}/> WhatsApp Pe Direct Quote Lo</button>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* WA FLOAT */}
      <a href={WA_DEFAULT} target="_blank" rel="noopener noreferrer" className="wa-float">
        <WASvg sz={30}/>
      </a>

      {/* TOAST */}
      {toast&&<div className="toast">✅ {toast}</div>}
    </>
  );
}

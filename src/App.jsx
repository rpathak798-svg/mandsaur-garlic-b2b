import { useState, useEffect, useRef } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

/* ════════════════════════════════════════════════════════
   WHATSAPP CONFIG
════════════════════════════════════════════════════════ */
const WA_NUMBER = "917772993222";
const waLink = (msg) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
const waGeneral = waLink("Namaskar! 🧄 MandsaurGarlic.com se inquiry kar raha/rahi hoon. Kripya garlic ki jankari dijiye.");

/* ════════════════════════════════════════════════════════
   THEME — Warm Garlic Farm Theme
════════════════════════════════════════════════════════ */
const C = {
  bg:"#1C1208", surface:"#251A0A", card:"#2E2010", cardH:"#3A280E",
  border:"#4A3418",
  gold:"#F0A500", goldL:"#FFD166", goldD:"#A06A00", amber:"#E07B00",
  green:"#5DBE5A", greenD:"#2A7A28", greenL:"#8FE88C",
  cream:"#FFF4E0", creamD:"#C8A878", ivory:"#FAF0D8",
  text:"#FFF0D8", textD:"#A08060",
  red:"#E85040", blue:"#5A9EE0", purple:"#9870D8", white:"#fff",
};

/* ════════════════════════════════════════════════════════
   MOCK DATA
════════════════════════════════════════════════════════ */
const PRICE_TREND = [
  {m:"Jan",super:6200,agrade:4800,bgrade:2900},
  {m:"Feb",super:5800,agrade:4200,bgrade:2600},
  {m:"Mar",super:7400,agrade:5600,bgrade:3200},
  {m:"Apr",super:9800,agrade:7200,bgrade:4100},
  {m:"May",super:12400,agrade:9100,bgrade:5300},
  {m:"Jun",super:11800,agrade:8600,bgrade:4900},
];
const MONTHLY_DEALS = [
  {m:"Jan",deals:38,val:24},{m:"Feb",deals:42,val:31},{m:"Mar",deals:61,val:48},
  {m:"Apr",deals:89,val:72},{m:"May",deals:124,val:108},{m:"Jun",deals:97,val:86},
];
const EXPORT_DIST = [
  {country:"Bangladesh",pct:34,color:C.green},
  {country:"UAE/Dubai",pct:22,color:C.gold},
  {country:"Malaysia",pct:18,color:C.blue},
  {country:"Indonesia",pct:11,color:C.purple},
  {country:"Others",pct:15,color:C.creamD},
];
const LISTINGS = [
  {id:1,grade:"Super",farmer:"Ramesh Patidar",village:"Malhargarh",dist:"Mandsaur",
   name:"Mandsaur Bold White — Export Ready",qty:500,size:"55-65mm",moisture:"60%",
   cured:true,phyto:true,price:8900,avail:"Immediate",badge:"Export",
   desc:"FOB-ready lot. Phytosanitary done. Full container. Previous: Dubai, Bangladesh."},
  {id:2,grade:"A Grade",farmer:"Suresh Chouhan",village:"Sitamau",dist:"Neemuch",
   name:"Neemuch Premium Garlic",qty:200,size:"45-55mm",moisture:"63%",
   cured:true,phyto:false,price:7200,avail:"3 Days",badge:"Popular",
   desc:"Consistent quality. Regular buyers from Delhi, Mumbai wholesale."},
  {id:3,grade:"Organic",farmer:"Dinesh Bairagi",village:"Dalauda",dist:"Mandsaur",
   name:"Dalauda Certified Organic",qty:40,size:"35-50mm",moisture:"64%",
   cured:true,phyto:true,price:11500,avail:"Immediate",badge:"Organic",
   desc:"NPOP certified. Lab report available. Health supplement companies preferred."},
  {id:4,grade:"B Grade",farmer:"Kailash Sharma",village:"Jaora",dist:"Ratlam",
   name:"Ratlam Processing Grade — Bulk",qty:800,size:"28-40mm",moisture:"70%",
   cured:false,phyto:false,price:3800,avail:"5 Days",badge:"Bulk",
   desc:"Best for powder, paste, dehydration units. Huge quantity."},
  {id:5,grade:"Super",farmer:"Jagdish Malviya",village:"Garoth",dist:"Mandsaur",
   name:"Garoth Super — 2 Full Containers",qty:1000,size:"58-68mm",moisture:"59%",
   cured:true,phyto:true,price:9400,avail:"Immediate",badge:"Export",
   desc:"Largest lot. Competitive FOB pricing. 6 international buyers trusted."},
  {id:6,grade:"A Grade",farmer:"Prahlad Tiwari",village:"Mandsaur City",dist:"Mandsaur",
   name:"Mandsaur City — Fresh Mandi Arrival",qty:150,size:"40-52mm",moisture:"65%",
   cured:true,phyto:false,price:6500,avail:"Immediate",badge:"Fresh",
   desc:"Just arrived. Quick sale. Negotiable for 100q+."},
];
const MANDI = [
  {name:"Mandsaur",grade:"Super",min:8200,max:12800,arr:"18,400",ch:+12.4},
  {name:"Neemuch",grade:"A Grade",min:6500,max:9800,arr:"22,100",ch:+8.1},
  {name:"Ratlam",grade:"A Grade",min:5800,max:8500,arr:"9,200",ch:-3.2},
  {name:"Dalauda",grade:"B Grade",min:4200,max:6200,arr:"5,700",ch:+5.7},
  {name:"Jaora",grade:"B Grade",min:3800,max:5700,arr:"3,400",ch:-1.8},
  {name:"Indore",grade:"Super",min:9000,max:14500,arr:"11,800",ch:+15.3},
  {name:"Ujjain",grade:"A Grade",min:6200,max:9100,arr:"7,600",ch:+4.2},
];
const TRANSPORTERS = [
  {id:1,name:"MP Garlic Transport",loc:"Mandsaur",rating:4.8,trucks:45,
   routes:["Mandsaur→Delhi","Mandsaur→Mumbai","Mandsaur→Nhava Sheva"],
   rate:"₹18-22/km/ton",contact:"9876001122",special:"Refrigerated trucks"},
  {id:2,name:"Chouhan Logistics",loc:"Neemuch",rating:4.6,trucks:28,
   routes:["Neemuch→Delhi","Neemuch→Ahmedabad","Neemuch→Indore"],
   rate:"₹16-20/km/ton",contact:"9765002233",special:"GPS on all vehicles"},
  {id:3,name:"Malwa Freight Services",loc:"Ratlam",rating:4.7,trucks:62,
   routes:["Ratlam→JNPT Port","Ratlam→Mundra","Pan India"],
   rate:"₹15-19/km/ton",contact:"9654003344",special:"Export stuffing experts"},
  {id:4,name:"Kisan Cargo Solutions",loc:"Mandsaur",rating:4.5,trucks:18,
   routes:["Local Mandsaur","Mandsaur→Indore","Small loads OK"],
   rate:"₹20-28/km/ton",contact:"9543004455",special:"Low MOQ farmer-friendly"},
];
const PAYMENT_HISTORY = [
  {id:"TXN-2841",date:"31 May 2026",party:"Al Baraka Trading, Dubai",amt:4720000,status:"Received",type:"Export",method:"SWIFT"},
  {id:"TXN-2840",date:"30 May 2026",party:"Suresh Wholesalers, Delhi",amt:864000,status:"Received",type:"Domestic",method:"NEFT"},
  {id:"TXN-2839",date:"29 May 2026",party:"Bangladesh Food Imports Ltd",amt:6390000,status:"Pending",type:"Export",method:"LC"},
  {id:"TXN-2838",date:"28 May 2026",party:"Metro Cash & Carry, Mumbai",amt:975000,status:"Received",type:"Domestic",method:"UPI"},
  {id:"TXN-2837",date:"27 May 2026",party:"Malabar Traders, Calicut",amt:432000,status:"Processing",type:"Domestic",method:"RTGS"},
  {id:"TXN-2836",date:"26 May 2026",party:"KL Garlic Imports, Malaysia",amt:8140000,status:"Received",type:"Export",method:"SWIFT"},
];
const WA_MESSAGES = [
  {id:1,from:"Al Baraka Trading",phone:"+971501234567",time:"09:14 AM",
   msg:"Hello, we need 5 containers Super grade. Please send FOB quote for July shipment.",unread:true,country:"🇦🇪"},
  {id:2,from:"Ramesh Broker, Delhi",phone:"+919876543210",time:"08:52 AM",
   msg:"Bhai 200 quintal A grade chahiye kal tak. Price confirm karo.",unread:true,country:"🇮🇳"},
  {id:3,from:"BD Food Imports",phone:"+8801712345678",time:"Yesterday",
   msg:"Payment done for TXN-2839. Please confirm dispatch date.",unread:false,country:"🇧🇩"},
  {id:4,from:"Metro Buyer, Mumbai",phone:"+912212345678",time:"Yesterday",
   msg:"Quality report for last lot was excellent. Ready for next order 300q.",unread:false,country:"🇮🇳"},
  {id:5,from:"Organic Herbs Inc, USA",phone:"+14155551234",time:"2 days ago",
   msg:"We are interested in certified organic garlic. Can you send COA and pricing?",unread:false,country:"🇺🇸"},
];
const WA_TEMPLATES = [
  {name:"Price Quote",text:"Namaskar! 🧄\n\nAapke inquiry ke liye shukriya.\n\nAaj ka rate:\n• Super Grade: ₹8,200–12,800/q\n• A Grade: ₹6,500–9,800/q\n• B Grade: ₹3,800–5,700/q\n\nQuality: Properly cured, graded\nAvailability: Immediate\n\nDetailed quote ke liye quantity batayein.\n\n*MandsaurGarlic.com*"},
  {name:"Export Quote",text:"Dear Buyer,\n\nThank you for your interest in Mandsaur Garlic!\n\n🧄 Super Grade FOB Price: USD 850-950/MT\n📦 Min Order: 1 container (18-20 MT)\n✅ Phytosanitary: Available\n🚢 Port: Nhava Sheva / Mundra\n⏱ Dispatch: Within 7 days of order\n\nWe can provide:\n• Certificate of Origin\n• Lab Analysis Report\n• Fumigation Certificate\n\nPlease share your exact requirements.\n\nMandsaurGarlic.com"},
  {name:"Dispatch Alert",text:"🚛 Dispatch Alert!\n\nAapka order dispatch ho gaya hai.\n\n📦 Quantity: [QTY] Quintal\n🚛 Truck No: [TRUCK]\n📍 From: Mandsaur\n📍 To: [DESTINATION]\n⏱ ETA: [DATE]\n\nTracking ke liye hamse contact karo.\n\nMandsaurGarlic.com"},
  {name:"Payment Reminder",text:"Namaskar,\n\n💰 Payment Reminder\n\nTransaction: [TXN_ID]\nAmount: ₹[AMOUNT]\nDue Date: [DATE]\n\nPayment options:\n• UPI: garlic@upi\n• NEFT: [Bank Details]\n• SWIFT (Export): Contact us\n\nKoi sawaal ho toh batayein.\n\nMandsaurGarlic.com"},
];
const COUNTRIES = ["Bangladesh","UAE / Dubai","Malaysia","Indonesia","Sri Lanka","Nepal","USA","UK","Canada","Singapore","Other"];
const CERTS = ["Phytosanitary Certificate","Certificate of Origin","FSSAI Certificate","Organic Certificate (NPOP)","Lab Analysis Report","Fumigation Certificate"];

/* ════════════════════════════════════════════════════════
   STYLES
════════════════════════════════════════════════════════ */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=Noto+Sans:wght@300;400;500;600;700&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
:root{
  --bg:${C.bg};--surface:${C.surface};--card:${C.card};--cardH:${C.cardH};
  --border:${C.border};--gold:${C.gold};--green:${C.green};--cream:${C.cream};
  --text:${C.text};--textD:${C.textD};--red:${C.red};--blue:${C.blue};
}
html{scroll-behavior:smooth}
body{
  font-family:'Noto Sans',sans-serif;
  background:var(--bg);
  color:var(--text);
  min-height:100vh;overflow-x:hidden;
  background-image:
    radial-gradient(ellipse 120% 60% at 50% -10%, rgba(240,165,0,0.07) 0%, transparent 60%),
    url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23F0A500' fill-opacity='0.025'%3E%3Cpath d='M30 10 C30 10 25 18 25 25 C25 32 30 36 30 36 C30 36 35 32 35 25 C35 18 30 10 30 10Z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--surface)}
::-webkit-scrollbar-thumb{background:${C.goldD};border-radius:3px}

/* ── NAV ── */
.nav{
  position:sticky;top:0;z-index:100;height:60px;
  background:rgba(28,18,8,0.97);backdrop-filter:blur(20px);
  border-bottom:1px solid ${C.border};
  display:flex;align-items:center;padding:0 20px;gap:8px;
  box-shadow:0 2px 20px rgba(0,0,0,0.4);
}
.nav-logo{
  display:flex;align-items:center;gap:10px;margin-right:12px;flex-shrink:0;
  text-decoration:none;
}
.nav-logo-icon{
  width:36px;height:36px;border-radius:10px;
  background:linear-gradient(135deg,${C.gold},${C.amber});
  display:flex;align-items:center;justify-content:center;
  font-size:20px;box-shadow:0 4px 14px rgba(240,165,0,0.4);
}
.nav-logo-text{font-family:'Playfair Display',serif;font-size:19px;color:${C.ivory};font-weight:700;letter-spacing:-.3px}
.nav-logo-text em{color:${C.gold};font-style:italic}
.nav-tabs{display:flex;gap:2px;flex:1;overflow-x:auto;scrollbar-width:none}
.nav-tabs::-webkit-scrollbar{display:none}
.ntab{
  padding:6px 14px;border-radius:8px;border:none;cursor:pointer;
  font-family:'Noto Sans',sans-serif;font-size:13px;font-weight:500;white-space:nowrap;
  background:transparent;color:${C.textD};transition:all .18s;
  display:flex;align-items:center;gap:5px;
}
.ntab:hover{background:${C.card};color:${C.cream}}
.ntab.on{background:linear-gradient(135deg,rgba(240,165,0,.18),rgba(224,123,0,.1));color:${C.gold};border:1px solid rgba(240,165,0,.3)}
.ntab .badge{
  background:${C.red};color:#fff;
  border-radius:10px;padding:1px 6px;font-size:10px;font-weight:700;
}
.nav-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.live-pill{
  display:flex;align-items:center;gap:5px;
  background:rgba(93,190,90,0.12);border:1px solid rgba(93,190,90,0.3);
  color:${C.green};padding:4px 11px;border-radius:20px;font-size:11px;font-weight:700;
}
.lpulse{width:6px;height:6px;background:${C.green};border-radius:50%;animation:pulse 1.4s infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.8)}}

/* ── TICKER ── */
.ticker{
  background:${C.surface};border-bottom:1px solid ${C.border};
  height:36px;display:flex;align-items:center;overflow:hidden;
  box-shadow:inset 0 -1px 0 rgba(240,165,0,0.1);
}
.tlabel{
  flex-shrink:0;
  background:linear-gradient(135deg,${C.gold},${C.amber});
  color:#1a0800;
  padding:0 14px;height:100%;display:flex;align-items:center;
  font-size:10px;font-weight:800;letter-spacing:1px;margin-right:16px;
}
.ttrack{overflow:hidden;flex:1;height:100%}
.tinner{display:flex;animation:tick 30s linear infinite;white-space:nowrap;height:100%;align-items:center}
.tinner:hover{animation-play-state:paused}
.ti{display:inline-flex;align-items:center;gap:8px;padding:0 20px;font-size:12px;color:${C.textD};border-right:1px solid ${C.border};height:100%}
.ti b{color:${C.cream};font-weight:600}
.tup{color:${C.green};font-weight:700}
.tdn{color:${C.red};font-weight:700}
@keyframes tick{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}

/* ── HERO ── */
.hero{
  position:relative;padding:60px 24px 70px;overflow:hidden;
  background:
    radial-gradient(ellipse 80% 60% at 30% 50%, rgba(240,165,0,0.08) 0%,transparent 65%),
    radial-gradient(ellipse 50% 40% at 80% 20%, rgba(93,190,90,0.06) 0%,transparent 55%),
    radial-gradient(ellipse 60% 80% at 90% 80%, rgba(240,165,0,0.05) 0%,transparent 60%),
    ${C.bg};
}
/* Garlic pattern background */
.hero::before{
  content:'';position:absolute;inset:0;
  background-image:url("data:image/svg+xml,%3Csvg width='120' height='120' viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23F0A500' fill-opacity='0.03'%3E%3Cellipse cx='60' cy='45' rx='12' ry='20'/%3E%3Cellipse cx='45' cy='58' rx='10' ry='17'/%3E%3Cellipse cx='75' cy='58' rx='10' ry='17'/%3E%3Ccircle cx='60' cy='72' r='14'/%3E%3C/g%3E%3C/svg%3E");
  pointer-events:none;
}
.hero-garlic-bg{
  position:absolute;right:-30px;top:50%;transform:translateY(-50%);
  font-size:300px;opacity:.06;pointer-events:none;line-height:1;
  filter:sepia(1) saturate(2) hue-rotate(10deg);
}
.hero-inner{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:1fr 360px;gap:40px;align-items:center;position:relative;z-index:1}
@media(max-width:840px){.hero-inner{grid-template-columns:1fr}}
.hero-eyebrow{
  display:inline-flex;align-items:center;gap:8px;margin-bottom:18px;
  color:${C.gold};font-size:11px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;
  background:rgba(240,165,0,0.12);border:1px solid rgba(240,165,0,0.3);
  padding:5px 14px;border-radius:20px;
}
.hero h1{font-family:'Playfair Display',serif;font-size:52px;line-height:1.06;color:${C.ivory};margin-bottom:14px}
.hero h1 i{color:${C.gold};font-style:italic}
.hero-sub{color:${C.textD};font-size:15px;line-height:1.8;margin-bottom:32px;max-width:480px}
.hero-ctas{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:40px}
.btn-G{
  padding:12px 26px;border-radius:10px;border:none;cursor:pointer;
  background:linear-gradient(135deg,${C.green},${C.greenD});color:#fff;
  font-family:'Noto Sans',sans-serif;font-size:13px;font-weight:700;
  box-shadow:0 6px 20px rgba(93,190,90,0.3);transition:all .18s;
}
.btn-G:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(93,190,90,0.4)}
.btn-O{
  padding:12px 26px;border-radius:10px;cursor:pointer;
  background:linear-gradient(135deg,${C.gold},${C.amber});color:#1a0800;
  font-family:'Noto Sans',sans-serif;font-size:13px;font-weight:700;border:none;
  box-shadow:0 6px 20px rgba(240,165,0,0.3);transition:all .18s;
}
.btn-O:hover{transform:translateY(-2px);box-shadow:0 10px 28px rgba(240,165,0,0.4)}
.btn-N{
  padding:12px 22px;border-radius:10px;cursor:pointer;
  background:rgba(255,255,255,0.05);color:${C.cream};
  font-family:'Noto Sans',sans-serif;font-size:13px;font-weight:600;
  border:1px solid ${C.border};transition:all .18s;
}
.btn-N:hover{background:${C.card};border-color:${C.creamD}}
.hero-kpis{display:grid;grid-template-columns:repeat(4,1fr);border:1px solid rgba(240,165,0,0.2);border-radius:14px;overflow:hidden;background:rgba(240,165,0,0.04)}
.hkpi{padding:16px;text-align:center;border-right:1px solid rgba(240,165,0,0.15)}
.hkpi:last-child{border-right:none}
.hkpi-n{font-family:'Playfair Display',serif;font-size:26px;color:${C.gold};display:block}
.hkpi-l{font-size:10px;color:${C.textD};margin-top:3px;text-transform:uppercase;letter-spacing:.5px}
.hero-snapshot{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid rgba(240,165,0,0.25);
  border-radius:20px;padding:22px;
  position:relative;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,0.4),inset 0 1px 0 rgba(240,165,0,0.1);
}
.hero-snapshot::before{
  content:'🧄';position:absolute;right:-10px;bottom:-20px;
  font-size:100px;opacity:.06;pointer-events:none;line-height:1;
}
.snap-title{font-size:10px;color:${C.gold};font-weight:800;letter-spacing:1.2px;text-transform:uppercase;margin-bottom:14px;display:flex;align-items:center;gap:6px}
.snap-row{display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(74,52,24,0.6)}
.snap-row:last-child{border-bottom:none}
.snap-label{font-size:12px;color:${C.textD};display:flex;align-items:center;gap:5px}
.snap-dot{width:6px;height:6px;border-radius:50%;background:${C.green};animation:pulse 1.4s infinite}
.snap-val{font-size:13px;font-weight:600;color:${C.text};text-align:right}
.snap-pct{font-size:10px;font-weight:700}

/* ── LAYOUT ── */
.main{max-width:1080px;margin:0 auto;padding:32px 20px 60px}
.sec-h{margin-bottom:26px}
.sec-title{
  font-family:'Playfair Display',serif;font-size:28px;color:${C.ivory};margin-bottom:5px;
  display:flex;align-items:center;gap:10px;
}
.sec-sub{font-size:13px;color:${C.textD};line-height:1.6}

/* ── KPI CARDS ── */
.kpi-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:24px}
.kpi{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:14px;padding:18px 20px;
  position:relative;overflow:hidden;
  box-shadow:0 4px 16px rgba(0,0,0,0.2);
}
.kpi::before{content:'';position:absolute;top:0;left:0;right:0;height:2.5px;background:var(--accent,${C.gold})}
.kpi::after{content:'';position:absolute;top:0;right:0;width:60px;height:60px;background:radial-gradient(circle,rgba(240,165,0,.07) 0%,transparent 70%);border-radius:50%}
.kpi-icon{font-size:22px;margin-bottom:8px}
.kpi-val{font-family:'Playfair Display',serif;font-size:28px;color:${C.ivory};display:block;margin-bottom:3px}
.kpi-label{font-size:11px;color:${C.textD};text-transform:uppercase;letter-spacing:.5px}
.kpi-delta{font-size:11px;font-weight:700;margin-top:6px;display:flex;align-items:center;gap:3px}
.delta-up{color:${C.green}}.delta-dn{color:${C.red}}

/* ── CHART CARDS ── */
.chart-row{display:grid;grid-template-columns:2fr 1fr;gap:14px;margin-bottom:24px}
@media(max-width:700px){.chart-row{grid-template-columns:1fr}}
.chart-card{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:16px;padding:22px;
  box-shadow:0 4px 16px rgba(0,0,0,0.2);
}
.chart-title{font-size:14px;font-weight:700;color:${C.ivory};margin-bottom:4px}
.chart-sub{font-size:11px;color:${C.textD};margin-bottom:16px}
.custom-tooltip{background:${C.surface};border:1px solid rgba(240,165,0,0.2);border-radius:10px;padding:10px 14px;font-size:12px;box-shadow:0 8px 24px rgba(0,0,0,0.3)}
.ct-label{color:${C.gold};margin-bottom:6px;font-weight:700}
.ct-row{display:flex;justify-content:space-between;gap:16px;margin-bottom:2px}
.ct-k{color:${C.textD}}.ct-v{color:${C.cream};font-weight:600}

/* ── FILTERS ── */
.filters{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:24px;align-items:center}
.search-box{
  flex:1;min-width:200px;max-width:320px;
  display:flex;align-items:center;gap:8px;
  background:${C.card};border:1px solid ${C.border};border-radius:10px;padding:10px 14px;
  transition:border-color .15s;box-shadow:inset 0 1px 3px rgba(0,0,0,0.2);
}
.search-box:focus-within{border-color:${C.gold}}
.search-box input{border:none;outline:none;background:transparent;font-family:'Noto Sans',sans-serif;font-size:13px;color:${C.text};flex:1}
.search-box input::placeholder{color:${C.textD}}
.chip{
  padding:7px 15px;border-radius:8px;border:1px solid ${C.border};cursor:pointer;
  font-family:'Noto Sans',sans-serif;font-size:12px;font-weight:500;
  background:${C.card};color:${C.textD};transition:all .15s;
}
.chip:hover{border-color:${C.creamD};color:${C.cream}}
.chip.on{background:rgba(240,165,0,0.15);border-color:${C.gold};color:${C.gold}}

/* ── LISTING CARDS ── */
.lgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(310px,1fr));gap:16px;margin-bottom:40px}
.lcard{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:16px;
  overflow:hidden;cursor:pointer;transition:all .22s;display:flex;flex-direction:column;
  box-shadow:0 4px 16px rgba(0,0,0,0.2);
}
.lcard:hover{
  background:${C.cardH};
  border-color:rgba(240,165,0,0.45);
  transform:translateY(-4px);
  box-shadow:0 16px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(240,165,0,0.15);
}
.lc-top{
  padding:13px 16px 11px;
  background:linear-gradient(135deg,rgba(240,165,0,0.1),rgba(93,190,90,0.05));
  border-bottom:1px solid ${C.border};
  display:flex;justify-content:space-between;align-items:center;
}
.lc-grade{font-size:12px;font-weight:700;color:${C.creamD};display:flex;align-items:center;gap:5px}
.lc-badge{font-size:10px;font-weight:700;letter-spacing:.5px;padding:2px 10px;border-radius:6px;text-transform:uppercase}
.b-Export{background:rgba(90,158,224,.18);color:${C.blue};border:1px solid rgba(90,158,224,.3)}
.b-Popular{background:rgba(240,165,0,.18);color:${C.gold};border:1px solid rgba(240,165,0,.3)}
.b-Organic{background:rgba(93,190,90,.18);color:${C.green};border:1px solid rgba(93,190,90,.3)}
.b-Bulk{background:rgba(160,128,96,.18);color:${C.creamD};border:1px solid ${C.border}}
.b-Fresh{background:rgba(240,165,0,.18);color:${C.gold};border:1px solid rgba(240,165,0,.3)}
.lc-body{padding:14px 16px;flex:1;display:flex;flex-direction:column;gap:9px}
.lc-farmer{font-size:11px;color:${C.textD}}
.lc-farmer b{color:${C.creamD};font-weight:600}
.lc-name{font-family:'Playfair Display',serif;font-size:17px;color:${C.ivory};line-height:1.3}
.lc-chips{display:flex;gap:6px;flex-wrap:wrap}
.lc-chip{font-size:10px;color:${C.textD};background:rgba(74,52,24,0.5);border:1px solid ${C.border};padding:2px 8px;border-radius:5px}
.lc-chip.ok{color:${C.green};background:rgba(93,190,90,.1);border-color:rgba(93,190,90,.25)}
.lc-foot{display:flex;align-items:center;justify-content:space-between;margin-top:auto;padding-top:11px;border-top:1px solid ${C.border}}
.lc-price{font-family:'Playfair Display',serif;font-size:24px;color:${C.gold}}
.lc-price sub{font-size:11px;color:${C.textD};font-family:'Noto Sans',sans-serif;font-weight:400}
.lc-btn{
  background:linear-gradient(135deg,rgba(240,165,0,.2),rgba(224,123,0,.15));
  color:${C.gold};border:1px solid rgba(240,165,0,.35);
  padding:8px 16px;border-radius:9px;
  font-family:'Noto Sans',sans-serif;font-size:12px;font-weight:700;cursor:pointer;transition:all .15s;
}
.lc-btn:hover{background:linear-gradient(135deg,${C.gold},${C.amber});color:#1a0800;border-color:${C.gold}}

/* ── MANDI TABLE ── */
.mtable-wrap{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:16px;overflow:hidden;margin-bottom:28px;
  box-shadow:0 4px 20px rgba(0,0,0,0.2);
}
.mtable-hd{
  background:linear-gradient(135deg,rgba(240,165,0,0.12),rgba(224,123,0,0.08));
  padding:15px 22px;display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid ${C.border};
}
.mtable-hd h3{font-family:'Playfair Display',serif;font-size:19px;color:${C.ivory}}
.mtable-hd span{font-size:11px;color:${C.textD}}
table{width:100%;border-collapse:collapse}
thead th{background:rgba(74,52,24,0.4);padding:10px 18px;text-align:left;font-size:10px;font-weight:700;color:${C.gold};text-transform:uppercase;letter-spacing:.7px;border-bottom:1px solid ${C.border}}
tbody td{padding:13px 18px;font-size:13px;border-bottom:1px solid rgba(74,52,24,0.5)}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover td{background:rgba(240,165,0,0.04)}
.mn{font-weight:700;color:${C.ivory}}
.mup{color:${C.green};font-weight:700}.mdn{color:${C.red};font-weight:700}
.marr{color:${C.textD};font-size:11px}

/* ── STAT CARDS ── */
.stat-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px;margin-bottom:32px}
.stat-card{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:13px;padding:18px 20px;
  box-shadow:0 4px 14px rgba(0,0,0,0.2);
}
.sc-label{font-size:10px;color:${C.gold};font-weight:700;text-transform:uppercase;letter-spacing:.7px;margin-bottom:8px}
.sc-val{font-family:'Playfair Display',serif;font-size:28px;margin-bottom:3px}
.sc-sub{font-size:11px;color:${C.textD}}

/* ── FORMS ── */
.form-wrap{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:18px;padding:28px;margin-bottom:32px;
  box-shadow:0 8px 32px rgba(0,0,0,0.25);
}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:560px){.form-grid{grid-template-columns:1fr}}
.fg{display:flex;flex-direction:column;gap:5px}
.fl{font-size:10px;font-weight:700;color:${C.gold};text-transform:uppercase;letter-spacing:.6px}
.fi,.fsel,.fta{
  background:rgba(28,18,8,0.6);border:1px solid ${C.border};color:${C.text};
  padding:10px 14px;border-radius:10px;font-family:'Noto Sans',sans-serif;font-size:13px;
  outline:none;transition:border-color .15s;width:100%;
}
.fi:focus,.fsel:focus,.fta:focus{border-color:${C.gold};box-shadow:0 0 0 3px rgba(240,165,0,0.1)}
.fi::placeholder,.fta::placeholder{color:${C.textD}}
.fsel option{background:${C.bg}}
.fta{resize:vertical;min-height:80px;line-height:1.5}
.fcheck{
  display:flex;align-items:center;gap:9px;padding:10px 13px;
  background:rgba(28,18,8,0.5);border:1px solid ${C.border};border-radius:9px;cursor:pointer;transition:all .15s;
}
.fcheck:hover{border-color:${C.gold};background:rgba(240,165,0,0.06)}
.fcheck input{accent-color:${C.gold};width:15px;height:15px}
.fcheck-label{font-size:12px;color:${C.text}}
.step-bar{display:flex;gap:0;background:rgba(28,18,8,0.5);border:1px solid ${C.border};border-radius:12px;overflow:hidden;margin-bottom:26px}
.step{flex:1;padding:13px;text-align:center;font-size:12px;font-weight:500;color:${C.textD};cursor:pointer;transition:all .15s;border-right:1px solid ${C.border}}
.step:last-child{border-right:none}
.step.on{background:rgba(240,165,0,0.12);color:${C.gold};font-weight:700}
.step-n{display:inline-flex;align-items:center;justify-content:center;width:18px;height:18px;border-radius:50%;background:${C.border};color:${C.textD};font-size:10px;font-weight:700;margin-right:6px;vertical-align:middle}
.step.on .step-n{background:${C.gold};color:#1a0800}
.sec-sep{font-size:10px;color:${C.gold};font-weight:700;text-transform:uppercase;letter-spacing:.8px;margin-bottom:14px;margin-top:4px;display:flex;align-items:center;gap:8px}
.sec-sep::after{content:'';flex:1;height:1px;background:rgba(240,165,0,0.2)}

/* ── TRANSPORTERS ── */
.tgrid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px;margin-bottom:26px}
.tcard{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:14px;padding:18px;cursor:pointer;transition:all .18s;
  box-shadow:0 4px 14px rgba(0,0,0,0.2);
}
.tcard:hover{border-color:rgba(240,165,0,.4);transform:translateY(-2px);box-shadow:0 10px 28px rgba(0,0,0,.3)}
.tcard.sel{border-color:${C.gold};background:rgba(240,165,0,0.06)}
.tc-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px}
.tc-name{font-size:14px;font-weight:700;color:${C.ivory}}
.tc-rating{display:flex;align-items:center;gap:3px;background:rgba(240,165,0,.14);color:${C.gold};padding:2px 9px;border-radius:6px;font-size:11px;font-weight:700}
.tc-loc{font-size:11px;color:${C.textD};margin-bottom:10px}
.tc-route{font-size:11px;color:${C.textD};padding:2px 0;display:flex;align-items:center;gap:5px}
.tc-route::before{content:'→';color:${C.gold}}
.tc-spec{margin-top:9px;font-size:11px;color:${C.green};background:rgba(93,190,90,.08);border:1px solid rgba(93,190,90,.2);padding:5px 10px;border-radius:7px}

/* ── TRACKER ── */
.tracker{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:14px;padding:22px;margin-bottom:28px;
}
.track-steps{display:flex;justify-content:space-between;position:relative;margin:22px 0 8px}
.track-steps::before{content:'';position:absolute;top:15px;left:8%;right:8%;height:2px;background:${C.border};z-index:0}
.tstep{display:flex;flex-direction:column;align-items:center;gap:7px;position:relative;z-index:1}
.tdot{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;border:2px solid ${C.border};background:${C.surface};transition:all .3s}
.tdot.done{background:${C.gold};border-color:${C.gold};color:#1a0800}
.tdot.cur{background:rgba(240,165,0,.18);border-color:${C.gold};color:${C.gold};box-shadow:0 0 14px rgba(240,165,0,.3)}
.tlabel{font-size:10px;color:${C.textD};text-align:center;font-weight:500}
.tlabel.done{color:${C.gold}}

/* ── PAYMENT ── */
.pay-row{display:grid;grid-template-columns:1fr 320px;gap:14px;margin-bottom:28px}
@media(max-width:780px){.pay-row{grid-template-columns:1fr}}
.pay-table-wrap{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:14px;overflow:hidden;
  box-shadow:0 4px 16px rgba(0,0,0,0.2);
}
.pay-hd{background:linear-gradient(135deg,rgba(240,165,0,0.1),rgba(224,123,0,0.07));padding:13px 18px;border-bottom:1px solid ${C.border};display:flex;justify-content:space-between;align-items:center}
.pay-hd h3{font-family:'Playfair Display',serif;font-size:17px;color:${C.ivory}}
.ptable td{padding:12px 16px}
.ptable th{padding:9px 16px}
.pstatus{display:inline-flex;align-items:center;gap:5px;padding:2px 10px;border-radius:5px;font-size:11px;font-weight:700}
.ps-Received{background:rgba(93,190,90,.15);color:${C.green}}
.ps-Pending{background:rgba(240,165,0,.15);color:${C.gold}}
.ps-Processing{background:rgba(90,158,224,.15);color:${C.blue}}
.pay-card{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:14px;padding:20px;
}
.pay-method{display:flex;align-items:center;gap:10px;background:rgba(28,18,8,0.5);border:1px solid ${C.border};border-radius:10px;padding:12px 14px;margin-bottom:10px;cursor:pointer;transition:all .15s}
.pay-method:hover{border-color:${C.gold}}
.pay-method.sel{border-color:${C.gold};background:rgba(240,165,0,0.07)}
.pm-icon{font-size:22px;width:36px;text-align:center}
.pm-info{flex:1}
.pm-name{font-size:13px;font-weight:700;color:${C.ivory};margin-bottom:2px}
.pm-sub{font-size:11px;color:${C.textD}}
.pm-radio{width:14px;height:14px;accent-color:${C.gold}}
.pay-detail-box{background:rgba(28,18,8,0.5);border:1px solid ${C.border};border-radius:10px;padding:13px;margin:13px 0;font-size:12px;line-height:2.1;color:${C.textD}}
.pay-detail-box b{color:${C.cream}}

/* ── WHATSAPP HUB ── */
.wa-layout{display:grid;grid-template-columns:260px 1fr;gap:0;
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:16px;overflow:hidden;min-height:520px;margin-bottom:28px;
  box-shadow:0 8px 32px rgba(0,0,0,0.3);
}
.wa-sidebar{border-right:1px solid ${C.border};display:flex;flex-direction:column}
.wa-sidebar-hd{padding:14px 16px;border-bottom:1px solid ${C.border};background:rgba(240,165,0,0.05)}
.wa-sidebar-hd h3{font-size:13px;font-weight:700;color:${C.ivory};margin-bottom:2px}
.wa-sidebar-hd span{font-size:10px;color:${C.textD}}
.wa-contact{display:flex;align-items:flex-start;gap:10px;padding:12px 14px;cursor:pointer;transition:background .15s;border-bottom:1px solid rgba(74,52,24,0.5)}
.wa-contact:hover{background:rgba(240,165,0,0.04)}
.wa-contact.sel{background:rgba(240,165,0,0.07);border-left:2px solid ${C.gold}}
.wa-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,${C.gold},${C.amber});display:flex;align-items:center;justify-content:center;font-size:16px;flex-shrink:0}
.wa-cname{font-size:13px;font-weight:600;color:${C.ivory};margin-bottom:2px}
.wa-cpreview{font-size:11px;color:${C.textD};white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:140px}
.wa-ctime{font-size:10px;color:${C.textD}}
.wa-unread{width:16px;height:16px;background:${C.green};border-radius:50%;font-size:9px;font-weight:700;color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.wa-chat{display:flex;flex-direction:column;flex:1}
.wa-chat-hd{padding:13px 16px;border-bottom:1px solid ${C.border};background:rgba(240,165,0,0.05);display:flex;align-items:center;gap:10px}
.wa-chat-hd-name{font-size:14px;font-weight:700;color:${C.ivory}}
.wa-chat-hd-sub{font-size:11px;color:${C.textD}}
.wa-msgs{flex:1;padding:16px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;min-height:300px}
.wa-bubble{max-width:75%;padding:10px 14px;border-radius:12px;font-size:13px;line-height:1.55;white-space:pre-wrap;word-break:break-word}
.wa-bubble.recv{background:rgba(74,52,24,0.6);border:1px solid ${C.border};align-self:flex-start;color:${C.text};border-radius:4px 12px 12px 12px}
.wa-bubble.sent{background:linear-gradient(135deg,${C.greenD},rgba(42,122,40,0.8));align-self:flex-end;color:#fff;border-radius:12px 4px 12px 12px}
.wa-bubble-time{font-size:10px;color:${C.textD};margin-top:3px;text-align:right}
.wa-input-area{padding:12px 14px;border-top:1px solid ${C.border};display:flex;gap:8px;align-items:flex-end}
.wa-input{flex:1;background:rgba(28,18,8,0.6);border:1px solid ${C.border};color:${C.text};padding:10px 13px;border-radius:10px;font-family:'Noto Sans',sans-serif;font-size:13px;outline:none;transition:border-color .15s;resize:none;max-height:120px}
.wa-input:focus{border-color:${C.gold}}
.wa-send{width:38px;height:38px;border-radius:9px;border:none;cursor:pointer;background:linear-gradient(135deg,${C.gold},${C.amber});color:#1a0800;font-size:16px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.wa-send:hover{transform:scale(1.08)}
.wa-tmpl-list{padding:12px 14px;border-top:1px solid ${C.border};background:rgba(28,18,8,0.3)}
.wa-tmpl-title{font-size:10px;color:${C.gold};font-weight:700;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px}
.wa-tmpl-btns{display:flex;gap:6px;flex-wrap:wrap}
.wa-tmpl-btn{padding:5px 12px;border-radius:6px;border:1px solid ${C.border};cursor:pointer;font-family:'Noto Sans',sans-serif;font-size:11px;font-weight:600;background:rgba(240,165,0,0.08);color:${C.gold};transition:all .15s}
.wa-tmpl-btn:hover{border-color:${C.gold};background:rgba(240,165,0,0.15)}

/* ── MODAL ── */
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.82);backdrop-filter:blur(10px);z-index:200;display:flex;align-items:center;justify-content:center;padding:16px}
.modal{
  background:linear-gradient(160deg,${C.card} 0%,${C.surface} 100%);
  border:1px solid rgba(240,165,0,0.2);border-radius:20px;
  width:100%;max-width:540px;max-height:92vh;overflow-y:auto;
  box-shadow:0 32px 80px rgba(0,0,0,.7),0 0 0 1px rgba(240,165,0,0.1);
}
.m-hd{padding:20px 24px 16px;border-bottom:1px solid ${C.border};display:flex;justify-content:space-between;align-items:flex-start;position:sticky;top:0;background:${C.card};z-index:5}
.m-hd h2{font-family:'Playfair Display',serif;font-size:20px;color:${C.ivory};margin-bottom:3px}
.m-hd p{font-size:12px;color:${C.textD}}
.mclose{background:rgba(240,165,0,.1);border:1px solid rgba(240,165,0,.2);color:${C.gold};width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:15px;display:flex;align-items:center;justify-content:center;transition:all .15s;flex-shrink:0}
.mclose:hover{background:rgba(240,165,0,.2)}
.m-body{padding:20px 24px}
.m-price{background:linear-gradient(135deg,rgba(240,165,0,.12),rgba(224,123,0,.06));border:1px solid rgba(240,165,0,.28);border-radius:13px;padding:16px 20px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}
.m-price-big{font-family:'Playfair Display',serif;font-size:34px;color:${C.gold}}
.m-price-sub{font-size:11px;color:${C.textD};margin-top:3px}
.m-info-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:16px}
.m-info{background:rgba(28,18,8,0.5);border:1px solid ${C.border};border-radius:9px;padding:10px 13px}
.m-info label{font-size:10px;color:${C.gold};text-transform:uppercase;letter-spacing:.5px;display:block;margin-bottom:4px}
.m-info span{font-size:13px;font-weight:600;color:${C.text}}
.m-desc{background:rgba(28,18,8,0.5);border:1px solid ${C.border};border-radius:9px;padding:11px 14px;font-size:12px;color:${C.textD};line-height:1.7;margin-bottom:18px}
.m-tabs{display:flex;gap:6px;margin-bottom:16px}
.mtab{flex:1;padding:9px;text-align:center;border-radius:9px;cursor:pointer;font-size:12px;font-weight:600;background:rgba(28,18,8,0.5);border:1px solid ${C.border};color:${C.textD};transition:all .15s}
.mtab.on{background:rgba(240,165,0,.13);border-color:${C.gold};color:${C.gold}}

/* ── DASHBOARD CARDS ── */
.dash-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px;margin-bottom:22px}
.dcard{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:13px;padding:16px 18px;
  position:relative;overflow:hidden;
  box-shadow:0 4px 14px rgba(0,0,0,0.2);
  transition:all .18s;
}
.dcard:hover{transform:translateY(-2px);border-color:rgba(240,165,0,0.3)}
.dcard-accent{position:absolute;top:0;left:0;right:0;height:2.5px}
.dcard-icon{font-size:22px;margin-bottom:8px}
.dcard-val{font-family:'Playfair Display',serif;font-size:26px;color:${C.ivory};margin-bottom:2px}
.dcard-label{font-size:10px;color:${C.textD};text-transform:uppercase;letter-spacing:.5px}
.dcard-delta{font-size:10px;font-weight:700;margin-top:5px}

/* ── ACTIVITY ── */
.activity{
  background:linear-gradient(160deg,${C.card},${C.surface});
  border:1px solid ${C.border};border-radius:14px;overflow:hidden;margin-bottom:20px;
}
.activity-hd{background:rgba(240,165,0,0.07);padding:12px 18px;border-bottom:1px solid ${C.border};display:flex;justify-content:space-between;align-items:center}
.activity-hd h3{font-size:13px;font-weight:700;color:${C.ivory}}
.aitem{display:flex;align-items:flex-start;gap:11px;padding:12px 16px;border-bottom:1px solid rgba(74,52,24,0.5)}
.aitem:last-child{border-bottom:none}
.aicon{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
.ainfo-title{font-size:12px;font-weight:600;color:${C.text};margin-bottom:2px}
.ainfo-sub{font-size:11px;color:${C.textD}}
.atime{font-size:10px;color:${C.textD};white-space:nowrap;margin-left:auto}

/* ── TOAST ── */
.toast{position:fixed;bottom:22px;right:100px;z-index:999;background:linear-gradient(135deg,${C.card},${C.surface});border:1px solid rgba(240,165,0,0.35);color:${C.text};padding:12px 18px;border-radius:13px;font-size:13px;font-weight:500;box-shadow:0 14px 40px rgba(0,0,0,.5);display:flex;align-items:center;gap:9px;max-width:320px;animation:toastIn .28s cubic-bezier(.34,1.56,.64,1)}
@keyframes toastIn{from{transform:translateY(18px) scale(.95);opacity:0}to{transform:none;opacity:1}}

/* ── FOOTER ── */
.footer{
  background:linear-gradient(180deg,${C.surface},${C.bg});
  border-top:1px solid rgba(240,165,0,0.15);
  padding:32px 20px;text-align:center;
}
.footer-logo{font-family:'Playfair Display',serif;font-size:22px;color:${C.ivory};margin-bottom:8px}
.footer-logo em{color:${C.gold};font-style:italic}
.footer-sub{font-size:12px;color:${C.textD}}

/* ── RESPONSIVE ── */
@media(max-width:700px){
  .hero h1{font-size:32px}
  .hero-kpis{grid-template-columns:1fr 1fr}
  .wa-layout{grid-template-columns:1fr}
  .wa-sidebar{max-height:200px;overflow-y:auto}
  .pay-row{grid-template-columns:1fr}
  .lgrid{grid-template-columns:1fr}
  .nav-tabs .ntab span.label{display:none}
}
`;
/* ════════════════════════════════════════════════════════
   CUSTOM TOOLTIP
════════════════════════════════════════════════════════ */
function CTooltip({active,payload,label}){
  if(!active||!payload?.length) return null;
  return(
    <div className="custom-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} className="ct-row">
          <span className="ct-k">{p.name}</span>
          <span className="ct-v" style={{color:p.color}}>₹{p.value?.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}
function DTooltip({active,payload,label}){
  if(!active||!payload?.length) return null;
  return(
    <div className="custom-tooltip">
      <div className="ct-label">{label}</div>
      {payload.map((p,i)=>(
        <div key={i} className="ct-row">
          <span className="ct-k">{p.name}</span>
          <span className="ct-v" style={{color:p.color}}>{p.value}{p.name==="val"?" Cr":""}</span>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   MAIN APP
════════════════════════════════════════════════════════ */
export default function App(){
  const [tab,setTab]=useState("dashboard");
  const [search,setSearch]=useState("");
  const [gradeF,setGradeF]=useState("All");
  const [modal,setModal]=useState(null);
  const [mTab,setMTab]=useState("inquiry");
  const [selTrans,setSelTrans]=useState(null);
  const [bookStep,setBookStep]=useState(0);
  const [toast,setToast]=useState(null);
  const [userListings,setUserListings]=useState([]);
  const [sellStep,setSellStep]=useState(0);
  const [selWA,setSelWA]=useState(WA_MESSAGES[0]);
  const [waChat,setWaChat]=useState({});
  const [waInput,setWaInput]=useState("");
  const [payMethod,setPayMethod]=useState("upi");
  const [payForm,setPayForm]=useState({amount:"",to:"",ref:""});

  const [iqF,setIqF]=useState({name:"",phone:"",company:"",country:"India",qty:"",message:""});
  const [expF,setExpF]=useState({company:"",country:"Bangladesh",name:"",phone:"",email:"",qty:"",grade:"Super",port:"Nhava Sheva (Mumbai)",incoterm:"FOB",certs:[],message:""});
  const [logF,setLogF]=useState({from:"Mandsaur",to:"",qty:"",date:"",type:"Normal",name:"",contact:""});
  const [sellF,setSellF]=useState({name:"",phone:"",village:"",dist:"Mandsaur",grade:"A Grade",qty:"",size:"",price:"",cured:false,phyto:false,desc:""});

  const flash=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),3600)};
  const allL=[...LISTINGS,...userListings];
  const filtered=allL.filter(l=>{
    const q=search.toLowerCase();
    return(l.name.toLowerCase().includes(q)||l.farmer.toLowerCase().includes(q)||l.dist.toLowerCase().includes(q))
      &&(gradeF==="All"||l.grade===gradeF);
  });
  const toggleCert=(c)=>setExpF(f=>({...f,certs:f.certs.includes(c)?f.certs.filter(x=>x!==c):[...f.certs,c]}));

  const getChatMsgs=(id)=>waChat[id]||[
    {role:"recv",text:WA_MESSAGES.find(m=>m.id===id)?.msg||"",time:WA_MESSAGES.find(m=>m.id===id)?.time||""}
  ];
  const sendWA=()=>{
    if(!waInput.trim()) return;
    const id=selWA.id;
    const msgs=getChatMsgs(id);
    setWaChat({...waChat,[id]:[...msgs,{role:"sent",text:waInput,time:"Now"}]});
    setWaInput("");
    flash("✅ Message sent!");
    setTimeout(()=>{
      const auto="Thank you for your message! We will get back to you shortly. 🧄";
      setWaChat(p=>({...p,[id]:[...getChatMsgs(id),{role:"recv",text:auto,time:"Just now"}]}));
    },2000);
  };
  const useTemplate=(tmpl)=>setWaInput(tmpl.text);

  const submitIq=(e)=>{e.preventDefault();flash("✅ Inquiry bhej di! Farmer 2-4 hrs mein contact karega.");setModal(null);setIqF({name:"",phone:"",company:"",country:"India",qty:"",message:""})};
  const submitExp=(e)=>{e.preventDefault();flash("🌍 Export inquiry receive! 24 hrs mein response milega.");setExpF(f=>({...f,message:""}));setTab("dashboard")};
  const submitLog=(e)=>{e.preventDefault();setBookStep(1);setTimeout(()=>setBookStep(2),1600);setTimeout(()=>{setBookStep(3);flash("🚛 Booking confirmed! Transporter 30 min mein call karega.")},3000)};
  const submitSell=(e)=>{
    e.preventDefault();
    setUserListings(p=>[{id:Date.now(),grade:sellF.grade,farmer:sellF.name,village:sellF.village,dist:sellF.dist,
      name:`${sellF.village} ${sellF.grade} Garlic`,qty:parseInt(sellF.qty)||50,size:sellF.size||"35-55mm",
      moisture:"65%",cured:sellF.cured,phyto:sellF.phyto,price:parseInt(sellF.price)||6000,
      avail:"Immediate",badge:"Fresh",desc:sellF.desc||`${sellF.name} dwara fresh garlic.`},...p]);
    flash("🧄 Listing live! Buyers dekh sakte hain abhi.");
    setTab("listings");setSellStep(0);
    setSellF({name:"",phone:"",village:"",dist:"Mandsaur",grade:"A Grade",qty:"",size:"",price:"",cured:false,phyto:false,desc:""});
  };
  const submitPay=(e)=>{e.preventDefault();flash(`💰 Payment initiated via ${payMethod.toUpperCase()}. Reference: MG-${Math.floor(Math.random()*90000+10000)}`);setPayForm({amount:"",to:"",ref:""})};

  // SEO meta tags
  useEffect(()=>{
    document.title="MandsaurGarlic.com — India Ka #1 Garlic B2B Platform | Buy Sell Export Garlic";
    const setMeta=(name,content,prop=false)=>{
      let el=document.querySelector(prop?`meta[property='${name}']`:`meta[name='${name}']`);
      if(!el){el=document.createElement('meta');prop?el.setAttribute('property',name):el.setAttribute('name',name);document.head.appendChild(el);}
      el.setAttribute('content',content);
    };
    setMeta('description','Mandsaur Garlic B2B Platform — India ka sabse bada garlic trading hub. Farmers se seedha buy karo. Export inquiry, live mandi bhav, logistics sab ek jagah. Mandsaur, Neemuch, Ratlam.');
    setMeta('keywords','mandsaur garlic, garlic wholesale, garlic export india, lahsun mandi bhav, garlic b2b platform, mandsaur mandi, neemuch garlic, garlic price today, garlic buyer seller india');
    setMeta('author','MandsaurGarlic.com');
    setMeta('robots','index, follow');
    setMeta('og:title','MandsaurGarlic.com — India Ka #1 Garlic B2B Platform',true);
    setMeta('og:description','Mandsaur se seedha garlic kharido. Live mandi bhav, export inquiry, logistics. 2400+ farmers, 14 countries.',true);
    setMeta('og:url','https://www.mandsaurgarlic.com',true);
    setMeta('og:type','website',true);
    setMeta('og:image','https://www.mandsaurgarlic.com/og-image.png',true);
    setMeta('twitter:card','summary_large_image');
    setMeta('twitter:title','MandsaurGarlic.com — India Ka #1 Garlic B2B Platform');
    setMeta('twitter:description','Mandsaur se seedha garlic kharido. Live mandi bhav, export, logistics.');
    // Canonical
    let canonical=document.querySelector("link[rel='canonical']");
    if(!canonical){canonical=document.createElement('link');canonical.setAttribute('rel','canonical');document.head.appendChild(canonical);}
    canonical.setAttribute('href','https://www.mandsaurgarlic.com');
    // Schema.org structured data
    let schema=document.getElementById('schema-org');
    if(!schema){schema=document.createElement('script');schema.id='schema-org';schema.type='application/ld+json';document.head.appendChild(schema);}
    schema.text=JSON.stringify({"@context":"https://schema.org","@type":"Organization","name":"MandsaurGarlic","url":"https://www.mandsaurgarlic.com","description":"India Ka #1 Garlic B2B Platform — Mandsaur, Madhya Pradesh","contactPoint":{"@type":"ContactPoint","telephone":"+91-7772993222","contactType":"customer service","availableLanguage":["Hindi","English"]},"sameAs":["https://wa.me/917772993222"]});
  },[]);

  const TABS=[
    {key:"dashboard",icon:"📊",label:"Dashboard"},
    {key:"listings",icon:"🛒",label:"Listings"},
    {key:"prices",icon:"📈",label:"Bhav"},
    {key:"export",icon:"🌍",label:"Export"},
    {key:"logistics",icon:"🚛",label:"Logistics"},
    {key:"payment",icon:"💰",label:"Payment"},
    {key:"whatsapp",icon:<svg viewBox="0 0 24 24" width="15" height="15" style={{verticalAlign:"middle",marginRight:2}}><path d="M12 2C6.48 2 2 6.48 2 12c0 1.8.5 3.5 1.35 4.95L2 22l5.25-1.35C8.6 21.55 10.25 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" fill="#25D366"/><path d="M16.75 14.05c-.25-.12-1.4-.69-1.62-.77-.21-.08-.37-.12-.52.12-.16.25-.6.77-.74.92-.14.16-.27.17-.52.06-.25-.12-1.04-.38-1.97-1.21-.73-.64-1.22-1.44-1.37-1.68-.14-.25 0-.38.11-.5.1-.11.25-.27.37-.41.12-.14.16-.25.25-.41.08-.16.04-.29-.02-.41-.06-.12-.52-1.25-.71-1.71-.19-.45-.38-.38-.52-.38-.14 0-.29-.02-.45-.02s-.41.06-.62.29c-.21.23-.81.79-.81 1.93s.83 2.24.95 2.39c.12.16 1.63 2.49 3.95 3.49.55.24 .98.38 1.32.48.55.17 1.05.15 1.45.09.44-.07 1.37-.56 1.56-1.1.19-.54.19-1.01.14-1.1-.06-.1-.21-.16-.46-.27z" fill="#fff"/></svg>,label:"WhatsApp",unread:2},
    {key:"sell",icon:"➕",label:"Becho"},
  ];

  return(
    <>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-logo">
          <div className="nav-logo-icon">🧄</div>
          <div className="nav-logo-text">Mandsaur<em>Garlic</em></div>
        </div>
        <div className="nav-tabs">
          {TABS.map(t=>(
            <button key={t.key} className={`ntab ${tab===t.key?"on":""}`} onClick={()=>setTab(t.key)}>
              {t.icon} <span className="label">{t.label}</span>
              {t.unread&&<span className="badge">{t.unread}</span>}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <div className="live-pill"><div className="lpulse"/>Live</div>
        </div>
      </nav>

      {/* TICKER */}
      <div className="ticker">
        <div className="tlabel">BHAV</div>
        <div className="ttrack">
          <div className="tinner">
            {[...MANDI,...MANDI].map((m,i)=>(
              <div key={i} className="ti">
                <b>{m.name}</b>
                <span>₹{m.min.toLocaleString()}–{m.max.toLocaleString()}/q</span>
                <span className={m.ch>0?"tup":"tdn"}>{m.ch>0?"▲+":"▼"}{Math.abs(m.ch)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HERO — only on dashboard/listings */}
      {(tab==="dashboard"||tab==="listings")&&(
        <div className="hero">
          <div className="hero-garlic-bg">🧄</div>
          <div className="hero-inner">
            <div>
              <div className="hero-eyebrow">🇮🇳 India Ka #1 Garlic B2B Platform</div>
              <h1>Mandsaur Ki <i>Garlic</i><br/>Seedha Khet Se</h1>
              <p className="hero-sub">Middlemen hatao. Export karo. Sahi daam pao. Dashboard, live bhav, export inquiry, logistics, payments — sab ek jagah.</p>
              <div className="hero-ctas">
                <button className="btn-G" onClick={()=>setTab("listings")}>🛒 Garlic Kharido</button>
                <button className="btn-O" onClick={()=>setTab("export")}>🌍 Export Karo</button>
                <button className="btn-N" onClick={()=>window.open(waGeneral,'_blank')}>💬 WhatsApp</button>
              </div>
              <div className="hero-kpis">
                {[["2,400+","Farmers"],["14","Countries"],["₹0","Listing Fee"],["850T","Daily Stock"]].map(([n,l],i)=>(
                  <div key={i} className="hkpi"><span className="hkpi-n">{n}</span><span className="hkpi-l">{l}</span></div>
                ))}
              </div>
            </div>
            <div className="hero-snapshot">
              <div className="snap-title">⚡ Aaj Ka Snapshot — 31 May 2026</div>
              {[["Mandsaur Super","₹8,200–12,800/q",true,"+12.4%"],["Export FOB Avg","₹9,400/q",true,"+15.3%"],["Organic Premium","₹11,500–14,000/q",true,"+22.1%"],["Neemuch A Grade","₹6,500–9,800/q",true,"+8.1%"],["B Grade / Processing","₹3,800–5,700/q",false,"-1.8%"]].map(([k,v,up,pct],i)=>(
                <div key={i} className="snap-row">
                  <span className="snap-label"><span className="snap-dot"/>  {k}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{v}</div>
                    <div className="snap-pct" style={{color:up?C.green:C.red}}>{pct}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="main">

        {/* ══ DASHBOARD ══ */}
        {tab==="dashboard"&&<>
          <div className="sec-h"><div className="sec-title">📊 Business Dashboard</div><div className="sec-sub">Aapka complete business overview — real-time data</div></div>
          <div className="dash-grid">
            {[
              {icon:"💰",val:"₹2.14 Cr",label:"Total Revenue (May)",delta:"+31% vs Apr",acc:C.gold,dc:C.gold},
              {icon:"🧄",val:"4,820q",label:"Total Deals (May)",delta:"+38% vs Apr",acc:C.green,dc:C.green},
              {icon:"🌍",val:"₹1.62 Cr",label:"Export Revenue",delta:"+52% vs Apr",acc:C.blue,dc:C.blue},
              {icon:"👤",val:"124",label:"Active Buyers",delta:"+18 new this month",acc:C.purple,dc:C.purple},
              {icon:"📦",val:"6",label:"Pending Orders",delta:"2 export, 4 domestic",acc:C.gold,dc:C.gold},
              {icon:"🚛",val:"9",label:"Active Shipments",delta:"3 en route to port",acc:C.green,dc:C.green},
              {icon:"💬",val:"2",label:"Unread Messages",delta:"WhatsApp inquiries",acc:C.red,dc:C.red},
              {icon:"⭐",val:"4.8",label:"Buyer Rating",delta:"From 89 reviews",acc:C.gold,dc:C.gold},
            ].map((d,i)=>(
              <div key={i} className="dcard">
                <div className="dcard-accent" style={{background:d.acc}}/>
                <div className="dcard-icon">{d.icon}</div>
                <div className="dcard-val">{d.val}</div>
                <div className="dcard-label">{d.label}</div>
                <div className="dcard-delta" style={{color:d.dc}}>{d.delta}</div>
              </div>
            ))}
          </div>

          <div className="chart-row">
            <div className="chart-card">
              <div className="chart-title">📈 Price Trend 2026</div>
              <div className="chart-sub">Grade-wise price movement (₹/quintal)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={PRICE_TREND}>
                  <defs>
                    <linearGradient id="gs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.green} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.green} stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="gg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.gold} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={C.gold} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                  <XAxis dataKey="m" tick={{fill:C.textD,fontSize:11}} axisLine={false} tickLine={false}/>
                  <YAxis tick={{fill:C.textD,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                  <Tooltip content={<CTooltip/>}/>
                  <Area type="monotone" dataKey="super" name="Super" stroke={C.green} strokeWidth={2} fill="url(#gs)"/>
                  <Area type="monotone" dataKey="agrade" name="A Grade" stroke={C.gold} strokeWidth={2} fill="url(#gg)"/>
                  <Area type="monotone" dataKey="bgrade" name="B Grade" stroke={C.creamD} strokeWidth={1.5} fill="none" strokeDasharray="4 2"/>
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-card">
              <div className="chart-title">🌍 Export Distribution</div>
              <div className="chart-sub">Country-wise share</div>
              {EXPORT_DIST.map((e,i)=>(
                <div key={i} style={{marginBottom:10}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                    <span style={{fontSize:12,color:C.text}}>{e.country}</span>
                    <span style={{fontSize:12,fontWeight:700,color:e.color}}>{e.pct}%</span>
                  </div>
                  <div style={{background:C.border,borderRadius:4,height:5,overflow:"hidden"}}>
                    <div style={{width:`${e.pct}%`,height:"100%",background:e.color,borderRadius:4,transition:"width .5s"}}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="chart-card" style={{marginBottom:22}}>
            <div className="chart-title">📦 Monthly Deals & Revenue</div>
            <div className="chart-sub">Deals count & value (₹ Crore)</div>
            <ResponsiveContainer width="100%" height={170}>
              <BarChart data={MONTHLY_DEALS} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="m" tick={{fill:C.textD,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="l" tick={{fill:C.textD,fontSize:10}} axisLine={false} tickLine={false}/>
                <YAxis yAxisId="r" orientation="right" tick={{fill:C.textD,fontSize:10}} axisLine={false} tickLine={false}/>
                <Tooltip content={<DTooltip/>}/>
                <Bar yAxisId="l" dataKey="deals" name="Deals" fill={C.green} fillOpacity={0.7} radius={[4,4,0,0]}/>
                <Bar yAxisId="r" dataKey="val" name="val" fill={C.gold} fillOpacity={0.7} radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="activity">
            <div className="activity-hd"><h3>⚡ Recent Activity</h3><span style={{fontSize:11,color:C.textD}}>Last 24 hours</span></div>
            {[
              {icon:"🌍",bg:"rgba(64,160,232,.15)",title:"Export inquiry — Al Baraka, Dubai",sub:"500 MT Super Grade • Waiting for FOB quote",time:"9:14 AM"},
              {icon:"💰",bg:"rgba(60,200,106,.15)",title:"Payment received — ₹47.2 Lakh",sub:"Al Baraka Trading • TXN-2841 • SWIFT",time:"8:50 AM"},
              {icon:"🚛",bg:"rgba(232,160,32,.15)",title:"Shipment dispatched — 200q to Delhi",sub:"Truck MH-04-AB-1234 • Chouhan Logistics",time:"Yesterday"},
              {icon:"🧄",bg:"rgba(144,96,232,.15)",title:"New listing posted — Jagdish Malviya",sub:"1000q Super Grade • Garoth, Mandsaur",time:"Yesterday"},
              {icon:"💬",bg:"rgba(232,64,64,.15)",title:"2 unread WhatsApp messages",sub:"BD Food Imports + Ramesh Broker",time:"Yesterday"},
            ].map((a,i)=>(
              <div key={i} className="aitem">
                <div className="aicon" style={{background:a.bg}}>{a.icon}</div>
                <div style={{flex:1}}>
                  <div className="ainfo-title">{a.title}</div>
                  <div className="ainfo-sub">{a.sub}</div>
                </div>
                <div className="atime">{a.time}</div>
              </div>
            ))}
          </div>
        </>}

        {/* ══ LISTINGS ══ */}
        {tab==="listings"&&<>
          <div className="sec-h"><div className="sec-title">🧄 Available Lots</div><div className="sec-sub">Verified farmers se fresh stock — directly connect karo</div></div>
          <div className="filters">
            <div className="search-box">
              <span style={{color:C.textD}}>🔍</span>
              <input placeholder="Search farmer, location, grade..." value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            {["All","Super","A Grade","B Grade","Organic"].map(g=>(
              <button key={g} className={`chip ${gradeF===g?"on":""}`} onClick={()=>setGradeF(g)}>{g}</button>
            ))}
          </div>
          <div className="lgrid">
            {filtered.map(l=>(
              <div key={l.id} className="lcard" onClick={()=>{setModal(l);setMTab("inquiry")}}>
                <div className="lc-top">
                  <div className="lc-grade">🧄 {l.grade}{l.phyto&&<span style={{fontSize:10,color:C.blue}}>✈ Export</span>}</div>
                  <span className={`lc-badge b-${l.badge}`}>{l.badge}</span>
                </div>
                <div className="lc-body">
                  <div className="lc-farmer">👨‍🌾 <b>{l.farmer}</b> · 📍 {l.village}, {l.dist}</div>
                  <div className="lc-name">{l.name}</div>
                  <div className="lc-chips">
                    <span className="lc-chip">📦 {l.qty}q</span>
                    <span className="lc-chip">📏 {l.size}</span>
                    <span className="lc-chip">💧 {l.moisture}</span>
                    {l.cured&&<span className="lc-chip ok">✅ Cured</span>}
                    {l.phyto&&<span className="lc-chip ok">✈ Phyto</span>}
                    <span className="lc-chip">🕐 {l.avail}</span>
                  </div>
                  <div className="lc-foot">
                    <div>
                      <div className="lc-price">₹{l.price.toLocaleString()}<sub>/q</sub></div>
                      <div style={{fontSize:10,color:C.textD}}>Total: ₹{(l.price*l.qty).toLocaleString()}</div>
                    </div>
                    <button className="lc-btn" onClick={e=>{e.stopPropagation();setModal(l);setMTab("inquiry")}}>Inquiry →</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>}

        {/* ══ MANDI PRICES ══ */}
        {tab==="prices"&&<>
          <div className="sec-h"><div className="sec-title">📈 Live Mandi Bhav</div><div className="sec-sub">31 May 2026 · Mandsaur region · Real-time rates</div></div>
          <div className="stat-row">
            {[{l:"Top Price",v:"₹14,500/q",s:"Indore Super",c:C.gold},{l:"Export FOB",v:"₹9,400/q",s:"Nhava Sheva",c:C.blue},{l:"Aaj Aawak",v:"~78,000q",s:"All mandis",c:C.green},{l:"YoY Export Growth",v:"+245%",s:"vs 2025",c:C.green}].map((s,i)=>(
              <div key={i} className="stat-card"><div className="sc-label">{s.l}</div><div className="sc-val" style={{color:s.c}}>{s.v}</div><div className="sc-sub">{s.s}</div></div>
            ))}
          </div>
          <div className="mtable-wrap">
            <div className="mtable-hd"><h3>🌾 Aaj Ke Rates</h3><span>Updated 9:30 AM · 31 May 2026</span></div>
            <table>
              <thead><tr><th>Mandi</th><th>Best Grade</th><th>Min ₹/q</th><th>Max ₹/q</th><th>Aawak</th><th>Change</th></tr></thead>
              <tbody>
                {MANDI.map((m,i)=>(
                  <tr key={i}>
                    <td><span className="mn">{m.name}</span></td>
                    <td style={{color:C.textD}}>{m.grade}</td>
                    <td>₹{m.min.toLocaleString()}</td>
                    <td style={{fontWeight:700}}>₹{m.max.toLocaleString()}</td>
                    <td><span className="marr">{m.arr} katte</span></td>
                    <td><span className={m.ch>0?"mup":"mdn"}>{m.ch>0?"▲ +":"▼ "}{Math.abs(m.ch)}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="chart-card">
            <div className="chart-title">📊 Price Trend Jan–Jun 2026</div>
            <div className="chart-sub">Super vs A Grade vs B Grade (₹/quintal)</div>
            <ResponsiveContainer width="100%" height={210}>
              <LineChart data={PRICE_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false}/>
                <XAxis dataKey="m" tick={{fill:C.textD,fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.textD,fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${(v/1000).toFixed(0)}k`}/>
                <Tooltip content={<CTooltip/>}/>
                <Line type="monotone" dataKey="super" name="Super" stroke={C.green} strokeWidth={2.5} dot={{r:3,fill:C.green}}/>
                <Line type="monotone" dataKey="agrade" name="A Grade" stroke={C.gold} strokeWidth={2} dot={{r:3,fill:C.gold}}/>
                <Line type="monotone" dataKey="bgrade" name="B Grade" stroke={C.creamD} strokeWidth={1.5} strokeDasharray="5 3" dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>}

        {/* ══ EXPORT ══ */}
        {tab==="export"&&<>
          <div className="sec-h"><div className="sec-title">🌍 Export Inquiry</div><div className="sec-sub">Bangladesh, UAE, Malaysia, USA — 14 countries mein export. 24 hrs response guaranteed.</div></div>
          <div className="form-wrap">
            <form onSubmit={submitExp}>
              <div className="sec-sep">📋 Company Information</div>
              <div className="form-grid" style={{marginBottom:20}}>
                <div className="fg"><label className="fl">Company Name *</label><input className="fi" placeholder="Aapki company" required value={expF.company} onChange={e=>setExpF({...expF,company:e.target.value})}/></div>
                <div className="fg"><label className="fl">Import Country *</label><select className="fsel" value={expF.country} onChange={e=>setExpF({...expF,country:e.target.value})}>{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
                <div className="fg"><label className="fl">Contact Person *</label><input className="fi" placeholder="Aapka naam" required value={expF.name} onChange={e=>setExpF({...expF,name:e.target.value})}/></div>
                <div className="fg"><label className="fl">WhatsApp / Phone *</label><input className="fi" placeholder="+country code" required value={expF.phone} onChange={e=>setExpF({...expF,phone:e.target.value})}/></div>
                <div className="fg" style={{gridColumn:"1/-1"}}><label className="fl">Email</label><input className="fi" type="email" placeholder="business@email.com" value={expF.email} onChange={e=>setExpF({...expF,email:e.target.value})}/></div>
              </div>
              <div className="sec-sep">🧄 Order Requirements</div>
              <div className="form-grid" style={{marginBottom:20}}>
                <div className="fg"><label className="fl">Quantity (Metric Tonnes) *</label><input className="fi" type="number" placeholder="MT mein" required value={expF.qty} onChange={e=>setExpF({...expF,qty:e.target.value})}/></div>
                <div className="fg"><label className="fl">Grade</label><select className="fsel" value={expF.grade} onChange={e=>setExpF({...expF,grade:e.target.value})}>{"Super (55mm+),A Grade (45-55mm),B Grade (35-45mm),Organic Certified".split(",").map(g=><option key={g}>{g}</option>)}</select></div>
                <div className="fg"><label className="fl">Preferred Port</label><select className="fsel" value={expF.port} onChange={e=>setExpF({...expF,port:e.target.value})}>{"Nhava Sheva (Mumbai),Mundra (Gujarat),Kandla (Gujarat),Chennai Port,Air Cargo — Delhi IGI".split(",").map(p=><option key={p}>{p}</option>)}</select></div>
                <div className="fg"><label className="fl">Incoterms</label><select className="fsel" value={expF.incoterm} onChange={e=>setExpF({...expF,incoterm:e.target.value})}>{"FOB,CIF,CFR,EXW,DDP".split(",").map(t=><option key={t}>{t}</option>)}</select></div>
              </div>
              <div className="sec-sep" style={{marginBottom:10}}>📄 Required Certificates</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
                {CERTS.map(c=>(
                  <label key={c} className="fcheck">
                    <input type="checkbox" checked={expF.certs.includes(c)} onChange={()=>toggleCert(c)}/>
                    <span className="fcheck-label">{c}</span>
                  </label>
                ))}
              </div>
              <div className="fg" style={{marginBottom:20}}><label className="fl">Message / Special Requirements</label><textarea className="fta" placeholder="Size, packaging, monthly requirement, sample request..." value={expF.message} onChange={e=>setExpF({...expF,message:e.target.value})}/></div>
              <button type="submit" className="btn-O" style={{width:"100%",padding:13,fontSize:15}}>🌍 Export Inquiry Submit Karo</button>
              <div style={{marginTop:14,background:"rgba(60,200,106,.06)",border:"1px solid rgba(60,200,106,.18)",borderRadius:10,padding:"12px 16px",fontSize:12,color:C.textD,lineHeight:1.7}}>
                📌 <b style={{color:C.green}}>Aapko milega:</b> FOB quote, phytosanitary guide, container schedule, aur nearest verified exporter contact — 24 hrs mein.
              </div>
            </form>
          </div>
        </>}

        {/* ══ LOGISTICS ══ */}
        {tab==="logistics"&&<>
          <div className="sec-h"><div className="sec-title">🚛 Logistics & Transport</div><div className="sec-sub">Verified transporters, GPS tracking, refrigerated trucks. Farm se port tak.</div></div>
          {bookStep>0&&(
            <div className="tracker">
              <div style={{fontFamily:"'Fraunces',serif",fontSize:17,color:C.cream,marginBottom:3}}>Booking Status</div>
              <div style={{fontSize:12,color:C.textD,marginBottom:18}}>
                {bookStep===1?"Processing..."
                :bookStep===2?"Transporter ko notify kar rahe hain..."
                :"✅ Confirmed! Transporter 30 min mein call karega."}
              </div>
              <div className="track-steps">
                {["Submitted","Processing","Notified","Confirmed"].map((s,i)=>(
                  <div key={i} className="tstep">
                    <div className={`tdot ${i<bookStep?"done":i===bookStep?"cur":""}`}>{i<bookStep?"✓":i+1}</div>
                    <span className={`tlabel ${i<bookStep?"done":""}`}>{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{fontSize:12,color:C.textD,fontWeight:700,marginBottom:12}}>VERIFIED TRANSPORTERS — {TRANSPORTERS.length} Available</div>
          <div className="tgrid">
            {TRANSPORTERS.map(t=>(
              <div key={t.id} className={`tcard ${selTrans?.id===t.id?"sel":""}`} onClick={()=>setSelTrans(t)}>
                <div className="tc-top"><div className="tc-name">{t.name}</div><div className="tc-rating">⭐ {t.rating}</div></div>
                <div className="tc-loc">📍 {t.loc} · 🚛 {t.trucks} trucks · {t.rate}</div>
                {t.routes.map((r,i)=><div key={i} className="tc-route">{r}</div>)}
                <div className="tc-spec">✅ {t.special}</div>
                {selTrans?.id===t.id&&<div style={{marginTop:8,fontSize:11,color:C.green,textAlign:"center",fontWeight:700}}>✓ Selected</div>}
              </div>
            ))}
          </div>
          {selTrans&&(
            <div className="form-wrap">
              <div style={{fontFamily:"'Fraunces',serif",fontSize:20,color:C.cream,marginBottom:18}}>🚛 Book: {selTrans.name}</div>
              <form onSubmit={submitLog}>
                <div className="form-grid" style={{marginBottom:14}}>
                  <div className="fg"><label className="fl">Pickup Location *</label><input className="fi" placeholder="Farm ya mandi address" required value={logF.from} onChange={e=>setLogF({...logF,from:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Delivery Location *</label><input className="fi" placeholder="City, state ya port" required value={logF.to} onChange={e=>setLogF({...logF,to:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Quantity (Quintal) *</label><input className="fi" type="number" placeholder="Load kitna hai?" required value={logF.qty} onChange={e=>setLogF({...logF,qty:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Pickup Date *</label><input className="fi" type="date" required value={logF.date} onChange={e=>setLogF({...logF,date:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Truck Type</label><select className="fsel" value={logF.type} onChange={e=>setLogF({...logF,type:e.target.value})}>{"Normal Truck,Refrigerated (Reefer),Container 20ft,Container 40ft,Mini Truck (5T)".split(",").map(t=><option key={t}>{t}</option>)}</select></div>
                  <div className="fg"><label className="fl">Aapka Naam *</label><input className="fi" placeholder="Contact person" required value={logF.name} onChange={e=>setLogF({...logF,name:e.target.value})}/></div>
                  <div className="fg" style={{gridColumn:"1/-1"}}><label className="fl">Mobile *</label><input className="fi" placeholder="10-digit" required value={logF.contact} onChange={e=>setLogF({...logF,contact:e.target.value})}/></div>
                </div>
                <button type="submit" className="btn-G" style={{width:"100%",padding:13,fontSize:14}}>🚛 Booking Confirm Karo</button>
              </form>
            </div>
          )}
        </>}

        {/* ══ PAYMENT ══ */}
        {tab==="payment"&&<>
          <div className="sec-h"><div className="sec-title">💰 Payment Center</div><div className="sec-sub">UPI, NEFT, RTGS, SWIFT, Letter of Credit — sab payment modes ek jagah</div></div>
          <div className="pay-row">
            <div className="pay-table-wrap">
              <div className="pay-hd"><h3>📋 Payment History</h3><span style={{fontSize:11,color:C.textD}}>Last 30 days</span></div>
              <table className="ptable">
                <thead><tr><th>TXN ID</th><th>Party</th><th>Amount</th><th>Method</th><th>Status</th></tr></thead>
                <tbody>
                  {PAYMENT_HISTORY.map((p,i)=>(
                    <tr key={i}>
                      <td style={{fontSize:11,fontFamily:"monospace",color:C.textD}}>{p.id}</td>
                      <td>
                        <div style={{fontSize:12,fontWeight:600,color:C.text}}>{p.party}</div>
                        <div style={{fontSize:10,color:C.textD}}>{p.date} · {p.type}</div>
                      </td>
                      <td style={{fontFamily:"'Fraunces',serif",color:C.gold}}>₹{(p.amt/100000).toFixed(2)}L</td>
                      <td style={{fontSize:11,color:C.textD}}>{p.method}</td>
                      <td><span className={`pstatus ps-${p.status}`}>● {p.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="pay-card">
              <div style={{fontFamily:"'Fraunces',serif",fontSize:18,color:C.cream,marginBottom:16}}>💳 Send / Receive Payment</div>
              <div style={{fontSize:10,color:C.textD,fontWeight:700,textTransform:"uppercase",letterSpacing:".5px",marginBottom:10}}>Select Method</div>
              {[
                {id:"upi",icon:"📱",name:"UPI / QR Code",sub:"Instant · Free · Up to ₹1L"},
                {id:"neft",icon:"🏦",name:"NEFT / RTGS",sub:"2-4 hrs · Bank charges"},
                {id:"swift",icon:"🌍",name:"SWIFT Wire Transfer",sub:"Export payments · USD/EUR/AED"},
                {id:"lc",icon:"📄",name:"Letter of Credit (LC)",sub:"Export · Bank guarantee"},
              ].map(m=>(
                <div key={m.id} className={`pay-method ${payMethod===m.id?"sel":""}`} onClick={()=>setPayMethod(m.id)}>
                  <div className="pm-icon">{m.icon}</div>
                  <div className="pm-info"><div className="pm-name">{m.name}</div><div className="pm-sub">{m.sub}</div></div>
                  <input type="radio" className="pm-radio" checked={payMethod===m.id} onChange={()=>setPayMethod(m.id)}/>
                </div>
              ))}
              <div className="pay-detail-box">
                {payMethod==="upi"&&<>UPI ID: <b>mandsaurgarlic@upi</b><br/>Scan QR ya ID se send karo<br/>Limit: <b>₹1 Lakh/transaction</b></>}
                {payMethod==="neft"&&<>Bank: <b>State Bank of India</b><br/>A/C: <b>XXXXXXXX1234</b><br/>IFSC: <b>SBIN0001234</b><br/>Name: <b>MandsaurGarlic Pvt Ltd</b></>}
                {payMethod==="swift"&&<>Bank: <b>HDFC Bank</b><br/>SWIFT: <b>HDFCINBB001</b><br/>Currency: USD / EUR / AED accepted<br/>Correspondent: <b>CITIBANK NA</b></>}
                {payMethod==="lc"&&<>LC Type: <b>Irrevocable SBLC / DLC</b><br/>Currency: USD preferred<br/>Issuing Bank: Buyer's bank<br/>Contact us for LC draft terms</>}
              </div>
              <form onSubmit={submitPay} style={{display:"flex",flexDirection:"column",gap:10}}>
                <div className="fg"><label className="fl">Amount (₹) *</label><input className="fi" type="number" placeholder="Amount enter karo" required value={payForm.amount} onChange={e=>setPayForm({...payForm,amount:e.target.value})}/></div>
                <div className="fg"><label className="fl">Recipient / Party</label><input className="fi" placeholder="Farmer/buyer naam" value={payForm.to} onChange={e=>setPayForm({...payForm,to:e.target.value})}/></div>
                <div className="fg"><label className="fl">Reference (Order / TXN)</label><input className="fi" placeholder="Order ID ya note" value={payForm.ref} onChange={e=>setPayForm({...payForm,ref:e.target.value})}/></div>
                <button type="submit" className="btn-G" style={{padding:12,fontSize:14}}>💰 Payment Initiate Karo</button>
              </form>
            </div>
          </div>
        </>}

        {/* ══ WHATSAPP ══ */}
        {tab==="whatsapp"&&<>
          <div className="sec-h"><div className="sec-title">💬 WhatsApp Business</div><div className="sec-sub">Buyers se directly baat karo • Templates use karo • Automated responses</div></div>
          <div className="wa-layout">
            <div className="wa-sidebar">
              <div className="wa-sidebar-hd"><h3>💬 Conversations</h3><span>{WA_MESSAGES.filter(m=>m.unread).length} unread</span></div>
              {WA_MESSAGES.map(m=>(
                <div key={m.id} className={`wa-contact ${selWA?.id===m.id?"sel":""}`} onClick={()=>setSelWA(m)}>
                  <div className="wa-avatar">{m.country}</div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:2}}>
                      <span className="wa-cname">{m.from}</span>
                      <span className="wa-ctime">{m.time}</span>
                    </div>
                    <div className="wa-cpreview">{m.msg}</div>
                  </div>
                  {m.unread&&<div className="wa-unread">1</div>}
                </div>
              ))}
            </div>
            {selWA?(
              <div className="wa-chat">
                <div className="wa-chat-hd">
                  <div className="wa-avatar" style={{width:36,height:36,fontSize:18}}>{selWA.country}</div>
                  <div>
                    <div className="wa-chat-hd-name">{selWA.from}</div>
                    <div className="wa-chat-hd-sub">{selWA.phone} · Online</div>
                  </div>
                </div>
                <div className="wa-msgs">
                  {getChatMsgs(selWA.id).map((msg,i)=>(
                    <div key={i}>
                      <div className={`wa-bubble ${msg.role}`}>{msg.text}</div>
                      <div className="wa-bubble-time" style={{textAlign:msg.role==="sent"?"right":"left"}}>{msg.time}</div>
                    </div>
                  ))}
                </div>
                <div className="wa-tmpl-list">
                  <div className="wa-tmpl-title">⚡ Quick Templates</div>
                  <div className="wa-tmpl-btns">
                    {WA_TEMPLATES.map((t,i)=>(
                      <button key={i} className="wa-tmpl-btn" onClick={()=>useTemplate(t)}>{t.name}</button>
                    ))}
                  </div>
                </div>
                <div className="wa-input-area">
                  <textarea className="wa-input" rows={2} placeholder="Message likho..." value={waInput} onChange={e=>setWaInput(e.target.value)}
                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();sendWA()}}}/>
                  <button className="wa-send" onClick={sendWA}>➤</button>
                </div>
              </div>
            ):(
              <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:C.textD,fontSize:13}}>
                Koi conversation select karo
              </div>
            )}
          </div>
          <div className="form-wrap">
            <div style={{fontFamily:"'Fraunces',serif",fontSize:18,color:C.cream,marginBottom:16}}>🤖 WhatsApp Bot — Auto Responses</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              {[
                {trigger:"Price puchha",response:"Auto price quote bhejta hai",status:"Active",color:C.green},
                {trigger:"Export inquiry",response:"Export form ka link bhejta hai",status:"Active",color:C.green},
                {trigger:"Transport",response:"Logistics booking link bhejta hai",status:"Active",color:C.green},
                {trigger:"Hello / Hi",response:"Welcome message + menu bhejta hai",status:"Active",color:C.green},
                {trigger:"Payment",response:"Payment details + QR code",status:"Active",color:C.green},
                {trigger:"Sample request",response:"Sample form ka link",status:"Inactive",color:C.textD},
              ].map((bot,i)=>(
                <div key={i} style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:12,fontWeight:700,color:C.text,marginBottom:3}}>"{bot.trigger}"</div>
                    <div style={{fontSize:11,color:C.textD}}>{bot.response}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:700,color:bot.color,background:`${bot.color}18`,border:`1px solid ${bot.color}30`,padding:"2px 8px",borderRadius:5}}>{bot.status}</span>
                </div>
              ))}
            </div>
          </div>
        </>}

        {/* ══ SELL ══ */}
        {tab==="sell"&&<>
          <div className="sec-h"><div className="sec-title">➕ Apni Garlic Becho</div><div className="sec-sub">Free listing · 2,400+ buyers tak seedha pahuncho · Export buyers bhi dekhte hain</div></div>
          <div className="form-wrap">
            <div className="step-bar">
              {["Farmer Details","Garlic Info","Pricing & Publish"].map((s,i)=>(
                <div key={i} className={`step ${sellStep===i?"on":""}`} onClick={()=>setSellStep(i)}>
                  <span className="step-n">{sellStep>i?"✓":i+1}</span>{s}
                </div>
              ))}
            </div>
            <form onSubmit={submitSell}>
              {sellStep===0&&(
                <div className="form-grid">
                  <div className="fg"><label className="fl">Poora Naam *</label><input className="fi" placeholder="Jaise: Ramesh Patidar" required value={sellF.name} onChange={e=>setSellF({...sellF,name:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Mobile *</label><input className="fi" placeholder="10-digit" required value={sellF.phone} onChange={e=>setSellF({...sellF,phone:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Gaon / Village *</label><input className="fi" placeholder="Jaise: Malhargarh" required value={sellF.village} onChange={e=>setSellF({...sellF,village:e.target.value})}/></div>
                  <div className="fg"><label className="fl">District</label><select className="fsel" value={sellF.dist} onChange={e=>setSellF({...sellF,dist:e.target.value})}>{"Mandsaur,Neemuch,Ratlam,Ujjain,Other".split(",").map(d=><option key={d}>{d}</option>)}</select></div>
                  <div style={{gridColumn:"1/-1"}}>
                    <button type="button" className="btn-G" onClick={()=>setSellStep(1)}>Aage Badho →</button>
                  </div>
                </div>
              )}
              {sellStep===1&&(
                <div className="form-grid">
                  <div className="fg"><label className="fl">Grade *</label><select className="fsel" value={sellF.grade} onChange={e=>setSellF({...sellF,grade:e.target.value})}>{"Super,A Grade,B Grade,Organic".split(",").map(g=><option key={g}>{g}</option>)}</select></div>
                  <div className="fg"><label className="fl">Quantity (Quintal) *</label><input className="fi" type="number" placeholder="Kitna hai?" required value={sellF.qty} onChange={e=>setSellF({...sellF,qty:e.target.value})}/></div>
                  <div className="fg"><label className="fl">Bulb Size (mm)</label><input className="fi" placeholder="Jaise: 40-55mm" value={sellF.size} onChange={e=>setSellF({...sellF,size:e.target.value})}/></div>
                  <div className="fg" style={{gridColumn:"1/-1"}}><label className="fl">Description</label><textarea className="fta" placeholder="Quality ke baare mein batao..." value={sellF.desc} onChange={e=>setSellF({...sellF,desc:e.target.value})}/></div>
                  <label className="fcheck"><input type="checkbox" checked={sellF.cured} onChange={e=>setSellF({...sellF,cured:e.target.checked})}/><span className="fcheck-label">✅ Properly Cured</span></label>
                  <label className="fcheck"><input type="checkbox" checked={sellF.phyto} onChange={e=>setSellF({...sellF,phyto:e.target.checked})}/><span className="fcheck-label">✈️ Phyto Certificate Done</span></label>
                  <div style={{gridColumn:"1/-1",display:"flex",gap:10}}>
                    <button type="button" className="btn-N" onClick={()=>setSellStep(0)}>← Wapas</button>
                    <button type="button" className="btn-G" onClick={()=>setSellStep(2)}>Aage →</button>
                  </div>
                </div>
              )}
              {sellStep===2&&(
                <div className="form-grid">
                  <div className="fg" style={{gridColumn:"1/-1"}}>
                    <label className="fl">Price (₹/quintal) *</label>
                    <input className="fi" type="number" placeholder="Aap kya rate chahte ho?" required value={sellF.price} onChange={e=>setSellF({...sellF,price:e.target.value})}/>
                    <div style={{fontSize:11,color:C.textD,marginTop:5}}>💡 Aaj: Super ₹8,200–12,800 · A Grade ₹6,500–9,800 · B Grade ₹3,800–5,700</div>
                  </div>
                  {sellF.price&&sellF.qty&&(
                    <div style={{gridColumn:"1/-1",background:"rgba(232,160,32,.08)",border:"1px solid rgba(232,160,32,.22)",borderRadius:11,padding:"14px 18px"}}>
                      <div style={{fontSize:10,color:C.textD,marginBottom:6,fontWeight:700,textTransform:"uppercase"}}>Estimated Total Value</div>
                      <div style={{fontFamily:"'Fraunces',serif",fontSize:32,color:C.gold}}>₹{((parseInt(sellF.price)||0)*(parseInt(sellF.qty)||0)).toLocaleString()}</div>
                      <div style={{fontSize:11,color:C.textD,marginTop:3}}>{sellF.qty}q × ₹{parseInt(sellF.price)||0}/q</div>
                    </div>
                  )}
                  <div style={{gridColumn:"1/-1",display:"flex",gap:10}}>
                    <button type="button" className="btn-N" onClick={()=>setSellStep(1)}>← Wapas</button>
                    <button type="submit" className="btn-O" style={{flex:1,padding:13,fontSize:14}}>🚀 Listing Publish Karo — FREE</button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </>}

      </div>

      {/* ══ LISTING MODAL ══ */}
      {modal&&(
        <div className="overlay" onClick={e=>e.target===e.currentTarget&&setModal(null)}>
          <div className="modal">
            <div className="m-hd">
              <div><h2>{modal.name}</h2><p>👨‍🌾 {modal.farmer} · 📍 {modal.village}, {modal.dist}</p></div>
              <button className="mclose" onClick={()=>setModal(null)}>✕</button>
            </div>
            <div className="m-body">
              <div className="m-price">
                <div>
                  <div style={{fontSize:11,color:C.textD,marginBottom:3}}>Asking Price</div>
                  <div className="m-price-big">₹{modal.price.toLocaleString()}</div>
                  <div className="m-price-sub">per quintal · {modal.qty}q · Total ₹{(modal.price*modal.qty).toLocaleString()}</div>
                </div>
                <div style={{fontSize:42}}>🧄</div>
              </div>
              <div className="m-info-grid">
                {[["Grade",modal.grade],["Size",modal.size],["Quantity",modal.qty+"q"],["Moisture",modal.moisture],["Cured",modal.cured?"Yes ✅":"No"],["Phyto",modal.phyto?"Yes ✅":"No"],["Avail",modal.avail],["Dist",modal.dist]].map(([l,v],i)=>(
                  <div key={i} className="m-info"><label>{l}</label><span>{v}</span></div>
                ))}
              </div>
              <div className="m-desc">💬 {modal.desc}</div>
              <div className="m-tabs">
                {[["inquiry","📩 Inquiry"],["export","🌍 Export"],["logistics","🚛 Transport"],["whatsapp","💬 WhatsApp"]].map(([k,l])=>(
                  <button key={k} className={`mtab ${mTab===k?"on":""}`} onClick={()=>setMTab(k)}>{l}</button>
                ))}
              </div>
              {mTab==="inquiry"&&(
                <form onSubmit={submitIq} style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div className="form-grid" style={{gap:10}}>
                    <div className="fg"><label className="fl">Naam *</label><input className="fi" placeholder="Aapka naam" required value={iqF.name} onChange={e=>setIqF({...iqF,name:e.target.value})}/></div>
                    <div className="fg"><label className="fl">Phone *</label><input className="fi" placeholder="Mobile" required value={iqF.phone} onChange={e=>setIqF({...iqF,phone:e.target.value})}/></div>
                    <div className="fg"><label className="fl">Company</label><input className="fi" placeholder="Firm naam" value={iqF.company} onChange={e=>setIqF({...iqF,company:e.target.value})}/></div>
                    <div className="fg"><label className="fl">Qty (Quintal)</label><input className="fi" type="number" value={iqF.qty} onChange={e=>setIqF({...iqF,qty:e.target.value})}/></div>
                  </div>
                  <div className="fg"><label className="fl">Message</label><textarea className="fta" placeholder="Special requirements..." value={iqF.message} onChange={e=>setIqF({...iqF,message:e.target.value})}/></div>
                  <button type="submit" className="btn-O" style={{padding:12,fontSize:14}}>📩 Inquiry Bhejo</button>
                  <button type="button" className="btn-G" style={{padding:11,fontSize:13}} onClick={()=>window.open(waLink(`Namaskar! 🧄 Listing inquiry: *${modal?.name}*\nPrice: ₹${modal?.price}/q | Qty: ${modal?.qty}q\nKya yeh available hai? Mujhe quote chahiye.`),'_blank')}>💬 WhatsApp Pe Direct Baat Karo</button>
                </form>
              )}
              {mTab==="export"&&(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{background:"rgba(64,160,232,.08)",border:"1px solid rgba(64,160,232,.2)",borderRadius:9,padding:"11px 14px",fontSize:12,color:C.textD,lineHeight:1.7}}>
                    🌍 Is lot ke liye export inquiry. {modal.phyto?"✅ Phyto ready.":"Phyto ke baad export-ready ho sakta hai."}
                  </div>
                  <div className="form-grid" style={{gap:10}}>
                    <div className="fg"><label className="fl">Destination</label><select className="fsel">{COUNTRIES.map(c=><option key={c}>{c}</option>)}</select></div>
                    <div className="fg"><label className="fl">Qty (MT)</label><input className="fi" type="number" placeholder="Metric tonnes"/></div>
                  </div>
                  <button className="btn-O" style={{padding:11}} onClick={()=>{flash("🌍 Export quote request bhej di!");setModal(null)}}>🌍 Export Quote Request</button>
                  <button className="btn-N" style={{padding:10,width:"100%"}} onClick={()=>{setModal(null);setTab("export")}}>📋 Detailed Export Form</button>
                </div>
              )}
              {mTab==="logistics"&&(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:12,color:C.textD,marginBottom:4}}>Is lot ke liye transport book karo:</div>
                  {TRANSPORTERS.slice(0,2).map(t=>(
                    <div key={t.id} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 14px",cursor:"pointer"}}
                      onClick={()=>{setModal(null);setTab("logistics");setSelTrans(t)}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                        <span style={{fontWeight:700,color:C.cream,fontSize:13}}>{t.name}</span>
                        <span style={{color:C.gold,fontSize:11}}>⭐ {t.rating}</span>
                      </div>
                      <div style={{fontSize:11,color:C.textD}}>{t.routes[0]} · {t.rate}</div>
                    </div>
                  ))}
                  <button className="btn-G" style={{padding:11}} onClick={()=>{setModal(null);setTab("logistics")}}>🚛 Sab Transporters Dekho</button>
                </div>
              )}
              {mTab==="whatsapp"&&(
                <div style={{display:"flex",flexDirection:"column",gap:10}}>
                  <div style={{fontSize:12,color:C.textD,lineHeight:1.7}}>Seedha WhatsApp pe message bhejo — ek click mein:</div>
                  <div style={{background:C.surface,border:`1px solid ${C.border}`,borderRadius:9,padding:"14px",fontSize:13,lineHeight:1.7,color:C.textD}}>
                    Namaskar! 🧄<br/><br/>
                    Aapki listing dekhne ke baad inquiry kar raha/rahi hoon:<br/><br/>
                    <b style={{color:C.cream}}>Lot:</b> {modal.name}<br/>
                    <b style={{color:C.cream}}>Price:</b> ₹{modal.price}/q<br/>
                    <b style={{color:C.cream}}>Qty:</b> {modal.qty}q<br/><br/>
                    Kya aap price discuss kar sakte hain?
                  </div>
                  <a href={waLink(`Namaskar! 🧄 MandsaurGarlic.com pe aapki listing dekhi:\n\n*${modal.name}*\nPrice: ₹${modal.price}/q\nQty: ${modal.qty}q\n\nKya yeh available hai? Price discuss kar sakte hain?`)}
                    target="_blank" rel="noopener noreferrer"
                    style={{textDecoration:"none"}}>
                    <button className="btn-G" style={{padding:11,fontSize:13,width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>
                      💬 WhatsApp Pe Seedha Message Bhejo
                    </button>
                  </a>
                  <a href={waGeneral} target="_blank" rel="noopener noreferrer" style={{textDecoration:"none"}}>
                    <button className="btn-N" style={{padding:10,width:"100%"}}>📱 General Inquiry — +91-7772993222</button>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div className="footer">
        <div className="footer-logo">Mandsaur<em>Garlic</em>.com</div>
        <div className="footer-sub">India Ka #1 Garlic B2B Platform · Mandsaur · Neemuch · Ratlam · Dalauda<br/>
          <span style={{fontSize:12,color:C.green,marginTop:6,display:"inline-block"}}>
            📱 WhatsApp: +91-7772993222 &nbsp;|&nbsp;
            <a href={waGeneral} target="_blank" rel="noopener noreferrer"
              style={{color:C.green,textDecoration:"none",fontWeight:700}}>
              💬 Click to Chat
            </a>
          </span><br/>
          <span style={{fontSize:11,marginTop:4,display:"block",color:C.textD}}>© 2026 · Free Listings · 1-3% Commission on Export Deals</span>
        </div>
      </div>

      {/* WHATSAPP FLOATING BUTTON */}
      <a href={waGeneral} target="_blank" rel="noopener noreferrer" style={{
        position:"fixed",bottom:28,right:28,zIndex:400,
        width:62,height:62,borderRadius:"50%",
        background:"#25D366",
        display:"flex",alignItems:"center",justifyContent:"center",
        boxShadow:"0 6px 24px rgba(37,211,102,0.55)",
        textDecoration:"none",
        animation:"waPulse 2.2s infinite",
      }}>
        <svg viewBox="0 0 48 48" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17.2 43 20.5 44 24 44c11 0 20-9 20-20S35 4 24 4z" fill="#fff"/>
          <path d="M24 7.2C14.8 7.2 7.2 14.8 7.2 24c0 3.3.9 6.4 2.6 9.1l.4.6-1.7 6.2 6.4-1.7.6.3c2.6 1.5 5.5 2.3 8.5 2.3 9.2 0 16.8-7.6 16.8-16.8S33.2 7.2 24 7.2z" fill="#25D366"/>
          <path d="M33.5 28.1c-.5-.2-2.8-1.4-3.2-1.5-.4-.2-.7-.2-1 .2-.3.5-1.2 1.5-1.4 1.8-.3.3-.5.3-1 .1-.5-.2-2-.7-3.8-2.3-1.4-1.2-2.3-2.8-2.6-3.2-.3-.5 0-.7.2-.9.2-.2.5-.5.7-.8.2-.3.3-.5.4-.8.1-.3 0-.6-.1-.8-.1-.2-1-2.4-1.3-3.3-.3-.8-.7-.7-1-.7h-.8c-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.2 5 7.8 6.8 1.1.5 2 .7 2.6.9 1.1.3 2.1.3 2.9.2.9-.1 2.8-1.1 3.2-2.2.4-1.1.4-2 .3-2.2-.1-.2-.4-.3-.9-.5z" fill="#fff"/>
        </svg>
      </a>
      <style>{`
        @keyframes waPulse {
          0%{box-shadow:0 6px 24px rgba(37,211,102,0.55),0 0 0 0 rgba(37,211,102,0.4)}
          50%{box-shadow:0 6px 32px rgba(37,211,102,0.7),0 0 0 10px rgba(37,211,102,0.0)}
          100%{box-shadow:0 6px 24px rgba(37,211,102,0.55),0 0 0 0 rgba(37,211,102,0)}
        }
      `}</style>

      {/* TOAST */}
      {toast&&<div className="toast">{toast}</div>}
    </>
  );
}

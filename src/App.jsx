import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════
   MARKET CONFIGS
   ═══════════════════════════════════════════════════════════ */
const MARKETS = {
  US:{id:"US",label:"United States",cur:"$",curCode:"USD",lang:"en",weights:{google:25,website:20,social:15,responsive:15,competitive:15,seo:10},platforms:["Google","Yelp","Facebook","Instagram","Website"],ltv:"$3,000-5,000",pricing:{starter:"$97/mo",growth:"$197/mo",pro:"$297/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:false,captureType:"email",captureLabel:"Email",capturePh:"you@email.com",platformChecks:"Yelp, Healthgrades (if healthcare), BBB, Angi (if home services), NextDoor"},
  EG:{id:"EG",label:"Egypt",cur:"EGP ",curCode:"EGP",lang:"ar-eg",weights:{google:15,website:10,social:20,responsive:25,competitive:15,seo:15},platforms:["WhatsApp","Facebook","Instagram","Google"],ltv:"10,000-50,000 EGP",pricing:{starter:"1,500 EGP/mo",growth:"2,500 EGP/mo",pro:"4,000 EGP/mo"},scanPrice:"79 EGP",unlimitedPrice:"449 EGP/mo",whatsappPrimary:true,captureType:"tel",captureLabel:"WhatsApp",capturePh:"+20 1XX XXX XXXX",platformChecks:"Elmenus/Talabat (restaurants), OLX/Dubizzle (real estate), Jumia/Noon (e-commerce), Facebook Marketplace"},
  GULF:{id:"GULF",label:"Gulf Region",cur:"$",curCode:"USD",lang:"ar",weights:{google:20,website:15,social:20,responsive:20,competitive:15,seo:10},platforms:["WhatsApp","Instagram","Google","Snapchat"],ltv:"$1,500-10,000",pricing:{starter:"$99/mo",growth:"$199/mo",pro:"$299/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:true,captureType:"tel",captureLabel:"WhatsApp",capturePh:"+971 XX XXX XXXX",platformChecks:"Talabat/Deliveroo/Careem (restaurants), Snapchat presence, Zomato (UAE), Apple Maps, noon.com/Amazon.ae (e-commerce)"},
  WEST:{id:"WEST",label:"Western",cur:"$",curCode:"USD",lang:"en",weights:{google:25,website:20,social:15,responsive:15,competitive:15,seo:10},platforms:["Google","Facebook","Instagram","Website","Trustpilot"],ltv:"$2,000-8,000",pricing:{starter:"$97/mo",growth:"$197/mo",pro:"$297/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:false,captureType:"email",captureLabel:"Email",capturePh:"you@email.com",platformChecks:"Trustpilot (UK), Google Reviews, GDPR compliance check"},
  OTHER:{id:"OTHER",label:"International",cur:"$",curCode:"USD",lang:"en",weights:{google:20,website:20,social:20,responsive:15,competitive:15,seo:10},platforms:["Google","Facebook","Instagram","WhatsApp","Website"],ltv:"$1,000-5,000",pricing:{starter:"$97/mo",growth:"$197/mo",pro:"$297/mo"},scanPrice:"$4.99",unlimitedPrice:"$29.99/mo",whatsappPrimary:false,captureType:"email",captureLabel:"Email",capturePh:"you@email.com",platformChecks:"Google Reviews, major social platforms"},
};
const GULF_CODES=["AE","SA","QA","KW","BH","OM"];
const WEST_CODES=["CA","GB","AU","NZ","DE","FR","ES","IT","NL","BE","AT","CH","SE","NO","DK","FI","IE","PT","PL","CZ","GR"];
const detectMarket=c=>c==="US"?MARKETS.US:c==="EG"?MARKETS.EG:GULF_CODES.includes(c)?MARKETS.GULF:WEST_CODES.includes(c)?MARKETS.WEST:MARKETS.OTHER;
const BIZ_TYPES=[{id:"dental",label:"Dental / Medical Practice",icon:"🦷"},{id:"restaurant",label:"Restaurant / Cafe",icon:"🍽️"},{id:"salon",label:"Salon / Med Spa / Beauty",icon:"💇"},{id:"realestate",label:"Real Estate",icon:"🏠"},{id:"retail",label:"Retail / E-commerce",icon:"🛍️"},{id:"legal",label:"Legal Services",icon:"⚖️"},{id:"auto",label:"Automotive",icon:"🚗"},{id:"homeservice",label:"Home Services",icon:"🔧"},{id:"fitness",label:"Fitness / Gym",icon:"💪"},{id:"education",label:"Education / Tutoring",icon:"📚"},{id:"other",label:"Other",icon:"🏢"}];
const COUNTRIES=[{code:"US",name:"United States"},{code:"EG",name:"Egypt"},{code:"AE",name:"UAE"},{code:"SA",name:"Saudi Arabia"},{code:"QA",name:"Qatar"},{code:"KW",name:"Kuwait"},{code:"BH",name:"Bahrain"},{code:"OM",name:"Oman"},{code:"GB",name:"United Kingdom"},{code:"CA",name:"Canada"},{code:"AU",name:"Australia"},{code:"DE",name:"Germany"},{code:"FR",name:"France"},{code:"ES",name:"Spain"},{code:"IT",name:"Italy"},{code:"NL",name:"Netherlands"},{code:"NZ",name:"New Zealand"},{code:"SE",name:"Sweden"},{code:"NO",name:"Norway"},{code:"CH",name:"Switzerland"},{code:"IE",name:"Ireland"},{code:"PT",name:"Portugal"},{code:"BE",name:"Belgium"},{code:"DK",name:"Denmark"},{code:"PL",name:"Poland"},{code:"TR",name:"Turkey"},{code:"JO",name:"Jordan"},{code:"LB",name:"Lebanon"},{code:"MA",name:"Morocco"},{code:"BR",name:"Brazil"},{code:"MX",name:"Mexico"},{code:"IN",name:"India"},{code:"PH",name:"Philippines"},{code:"MY",name:"Malaysia"},{code:"SG",name:"Singapore"},{code:"ZA",name:"South Africa"},{code:"NG",name:"Nigeria"},{code:"KE",name:"Kenya"},{code:"PK",name:"Pakistan"},{code:"IQ",name:"Iraq"}];
const FUN_FACTS=["67% of dental calls go unanswered after hours.","Businesses with 50+ Google reviews get 266% more clicks.","88% of consumers trust online reviews as much as personal recommendations.","The average customer checks 3-5 competitors before choosing.","Responding to reviews within 24 hours increases trust by 33%.","63% of shopping journeys start with an online search.","A 1-star increase in Yelp rating leads to 5-9% revenue increase.","53% of mobile users leave sites that take over 3 seconds to load.","Video content gets 1200% more shares than text and images combined.","89% of Egyptian internet users are on Facebook.","WhatsApp is used by 2 billion people for business communication.","Businesses in the Google Maps 3-pack get 44% of all clicks.","Businesses that add a chatbot capture 3x more after-hours leads.","Companies that respond within 5 minutes are 21x more likely to convert."];

/* ═══ WHAT-IF SIMULATOR IMPACTS ═══ */
const WHATIF_TOGGLES=[
  {id:"reviews",label:"Get to 50+ Google Reviews",points:12,module:"Review Manager",icon:"⭐"},
  {id:"chatbot",label:"Add 24/7 AI Chat Assistant",points:10,module:"Chat Assistant",icon:"💬"},
  {id:"whatsapp",label:"Add WhatsApp Auto-Responder",points:10,module:"WhatsApp Responder",icon:"📱"},
  {id:"social",label:"Post on Social Media Weekly",points:8,module:"Content Engine",icon:"📸"},
  {id:"website",label:"Optimize Website with CTAs",points:7,module:"Website Builder",icon:"🌐"},
  {id:"booking",label:"Add Online Booking",points:6,module:"Booking (Coming Soon)",icon:"📅"},
  {id:"video",label:"Add Video Content",points:5,module:"Content Engine",icon:"🎥"},
];

/* ═══ COMING SOON MODULES ═══ */
const COMING_SOON=[
  {name:"AI Voice Receptionist",desc:"Answers phone calls with a natural AI voice trained on your business data.",eta:"Q2 2025",icon:"📞"},
  {name:"AI Website Builder",desc:"Builds a mobile-optimized website from your Google listing in 5 minutes.",eta:"Q2 2025",icon:"🌐"},
  {name:"AI Appointment Booking",desc:"Patients/customers book directly through AI chat — syncs with your calendar.",eta:"Q3 2025",icon:"📅"},
  {name:"AI Ad Manager",desc:"AI manages your Google/Facebook ad budget automatically for best ROI.",eta:"Q3 2025",icon:"📢"},
  {name:"AI Email Campaigns",desc:"Automated retention emails to keep customers coming back.",eta:"Q4 2025",icon:"✉️"},
];

/* ═══ PROMPTS ═══ */
const J="\n\nRESPOND WITH ONLY VALID JSON. No markdown, no backticks, no commentary.";
function buildPrompt(phase,inp,mkt,bType){
  const info=`Business: ${inp.name}\nCity: ${inp.city}\nCountry: ${COUNTRIES.find(c=>c.code===inp.country)?.name||inp.country}\nType: ${bType||"Unknown"}\n${inp.website?`Website: ${inp.website}\n`:""}${inp.google?`Google: ${inp.google}\n`:""}${inp.facebook?`Facebook: ${inp.facebook}\n`:""}${inp.instagram?`Instagram: ${inp.instagram}\n`:""}${inp.tiktok?`TikTok: ${inp.tiktok}\n`:""}${inp.twitter?`X: ${inp.twitter}\n`:""}${inp.youtube?`YouTube: ${inp.youtube}\n`:""}${inp.linkedin?`LinkedIn: ${inp.linkedin}\n`:""}`;
  const ctx=`Market: ${mkt.label}. Platforms: ${mkt.platforms.join(",")}. ${mkt.whatsappPrimary?"WhatsApp is PRIMARY channel.":""} Also check: ${mkt.platformChecks}`;
  const P={
    detect:`Search for this business and identify it:\n${info}\nReturn JSON: {"businessType":"TYPE","businessName":"FULL_NAME","address":"ADDRESS","confidence":"HIGH_MEDIUM_LOW"}${J}`,

    google:`Analyze Google Business Profile for:\n${info}\n${ctx}\n\nReturn JSON: {"score":NUM_0_100,"reviewCount":NUM,"avgRating":NUM,"ownerResponseRate":"PCT_OR_UNKNOWN","recentReviewDate":"DATE_OR_UNKNOWN","photoCount":NUM,"hasDescription":BOOL,"descriptionQuality":"GOOD_POOR_EMPTY","hasGooglePosts":BOOL,"lastPostDate":"DATE_OR_UNKNOWN","hoursListed":BOOL,"categoriesSet":BOOL,"qAndACount":NUM,"findings":["finding1","finding2","finding3"],"positives":["pos1","pos2"],"evidence":{"reviewCountDetail":"str","ratingDetail":"str","photoDetail":"str","competitorAvgReviews":"str"}}${J}`,

    website:`Analyze website for:\n${info}\n${ctx}\nType: ${bType}\n\nCheck: mobile-friendly, SSL, CTAs, online booking, chatbot, contact form, clickable phone, blog, testimonials, video, load speed. ${mkt.id==="US"?"Also check ADA/accessibility compliance indicators (alt text, contrast, screen reader hints).":""} Check if competitors run Google Ads for this business category in this area.\n\nReturn JSON: {"score":NUM_0_100,"exists":BOOL,"url":"URL_OR_NONE","mobileFriendly":"YES_NO_UNKNOWN","hasSSL":BOOL,"hasCTA":BOOL,"hasOnlineBooking":BOOL,"hasChatbot":BOOL,"hasContactForm":BOOL,"hasClickablePhone":BOOL,"hasBlog":BOOL,"hasTestimonials":BOOL,"hasVideo":BOOL,"loadSpeed":"FAST_MED_SLOW","adaCompliance":"GOOD_POOR_UNKNOWN","competitorsRunAds":BOOL,"competitorAdKeywords":["keyword1"],"findings":["f1","f2","f3"],"positives":["p1","p2"],"evidence":{"urlChecked":"url","featuresFound":"list","missingFeatures":"list"}}${J}`,

    social:`Analyze ALL social media + YouTube deep dive for:\n${info}\n${ctx}\nType: ${bType}\n\nDo a DEEP YouTube analysis if channel exists: video count, subscriber count, content types (testimonials, tutorials, office tours, educational), posting frequency, most recent upload date. Also check platform-specific: ${mkt.platformChecks}\n\nReturn JSON: {"score":NUM_0_100,"facebook":{"exists":BOOL,"followers":"NUM_OR_UNK","lastPost":"DATE_OR_UNK","frequency":"DAILY_WEEKLY_MONTHLY_RARE_NEVER","responseTime":"FAST_SLOW_UNK","reviewCount":"NUM_OR_0"},"instagram":{"exists":BOOL,"followers":"NUM_OR_UNK","lastPost":"DATE_OR_UNK","frequency":"STR","usesReels":BOOL,"contentQuality":"PRO_AMATEUR_MIXED_UNK"},"tiktok":{"exists":BOOL,"followers":"NUM_OR_UNK","videoCount":"NUM_OR_0"},"youtube":{"exists":BOOL,"subscribers":"NUM_OR_UNK","videoCount":"NUM_OR_0","hasOfficeTour":BOOL,"hasTestimonialVideos":BOOL,"hasEducationalContent":BOOL,"lastUpload":"DATE_OR_UNK","contentTypes":["type1"]},"whatsapp":{"exists":BOOL,"businessVerified":BOOL,"catalogSetup":BOOL},"twitter":{"exists":BOOL,"active":BOOL},"linkedin":{"exists":BOOL},"snapchat":{"exists":BOOL},"platformSpecific":[{"platform":"PLATFORM_NAME","exists":BOOL,"detail":"DETAIL"}],"findings":["f1","f2","f3"],"positives":["p1","p2"],"evidence":{"platformsFound":"list","platformsMissing":"list"}}${J}`,

    competitive:`Find 3-5 competitors and compare:\n${info}\n${ctx}\nType: ${bType}\n\nName REAL competitors with REAL data. Also describe what a potential customer sees when they visit this business's website/page at 10pm vs what they see on the top competitor's site.\n\nReturn JSON: {"score":NUM_0_100,"competitors":[{"name":"REAL_NAME","reviewCount":NUM,"avgRating":NUM,"hasWebsite":BOOL,"hasChatbot":BOOL,"hasBooking":BOOL,"socialPresence":"STRONG_MOD_WEAK","estimatedScore":NUM_0_100}],"marketPosition":"TOP_MID_BOTTOM","areaAvgReviews":NUM,"areaAvgRating":NUM,"afterHoursComparison":{"thisBusiness":"WHAT_CUSTOMER_SEES_AT_10PM_ON_THEIR_SITE","topCompetitor":"WHAT_CUSTOMER_SEES_AT_10PM_ON_COMPETITOR_SITE","competitorName":"NAME"},"findings":["f1_with_competitor_names","f2","f3"],"positives":["p1"],"evidence":{"searchQuery":"query","competitorsFound":NUM}}${J}`,

    recommendations:`Generate prioritized recommendations:\n${info}\n${ctx}\nType: ${bType}\nPricing: Starter ${mkt.pricing.starter}, Growth ${mkt.pricing.growth}, Pro ${mkt.pricing.pro}\nCustomer LTV: ${mkt.ltv}\n\nFor EACH fix: specific free copy-paste content + DIY time vs automated time. Include revenue math. ${mkt.id==="EG"?"Write any Arabic content in Egyptian Arabic (ammeya), NOT formal Arabic.":mkt.id==="GULF"?"Write Arabic content in formal Arabic with English translation.":""}\n\nReturn JSON: {"overallScore":NUM_0_100,"potentialScore":NUM_0_100,"monthlyLoss":"CURRENCY_AMOUNT","monthlyGain":"CURRENCY_AMOUNT","lossCalculation":"STEP_BY_STEP_MATH","topFixes":[{"priority":NUM,"title":"TITLE","impact":"HIGH_MED_LOW","difficulty":"EASY_MED_HARD","diyTime":"TIME","zidlyTime":"TIME","freeContent":"ACTUAL_COPY_PASTE_CONTENT","zidlyModule":"MODULE_OR_NONE","zidlyDescription":"ONE_SENTENCE","explanation":"WHY_WITH_DATA"}],"quickWins":["qw1","qw2","qw3"],"thirtyDayWarning":"WHAT_HAPPENS_IF_NOTHING","industryAvgScore":NUM_0_100}${J}`
  };
  return P[phase];
}

/* ═══ SCAN LIMITING ═══ */
function getScanCount(){try{const d=JSON.parse(document.cookie.split(";").find(c=>c.trim().startsWith("bsScans="))?.split("=")?.[1]||"{}");if(Date.now()-d.ts>30*24*3600000)return 0;return d.count||0;}catch{return 0;}}
function incScanCount(){try{const c=getScanCount();document.cookie=`bsScans=${JSON.stringify({count:c+1,ts:Date.now()})};path=/;max-age=${30*24*3600}`;}catch{}}
function hasEmail(){try{return document.cookie.includes("bsEmail=1");}catch{return false;}}
function setHasEmail(){try{document.cookie=`bsEmail=1;path=/;max-age=${365*24*3600}`;}catch{}}
function getLastScore(){try{return JSON.parse(localStorage.getItem("bsLastScore")||"null");}catch{return null;}}
function saveLastScore(data){try{localStorage.setItem("bsLastScore",JSON.stringify({score:data.overall,date:new Date().toLocaleDateString(),biz:data.bizName}));}catch{}}

/* ═══ HOOKS ═══ */
const useInView=(th=0.12)=>{const r=useRef(null);const[v,s]=useState(false);useEffect(()=>{const o=new IntersectionObserver(([e])=>{if(e.isIntersecting)s(true)},{threshold:th});if(r.current)o.observe(r.current);return()=>o.disconnect();},[]);return[r,v];};
const FadeIn=({children,delay=0,cl=""})=>{const[r,v]=useInView();return<div ref={r} className={cl} style={{opacity:v?1:0,transform:v?"translateY(0)":"translateY(20px)",transition:`all 0.6s cubic-bezier(0.16,1,0.3,1) ${delay}s`}}>{children}</div>;};

/* ═══ SCORE GAUGE ═══ */
const ScoreGauge=({score,potential,size=160,label})=>{
  const[d,setD]=useState(0);const r=(size-16)/2;const circ=2*Math.PI*r;
  const col=s=>s>=70?"#10b981":s>=40?"#f59e0b":"#ef4444";
  const gr=s=>s>=90?"Excellent":s>=70?"Good":s>=50?"Fair":s>=30?"Poor":"Critical";
  useEffect(()=>{let c=0;const step=score/50;const t=setInterval(()=>{c+=step;if(c>=score){setD(score);clearInterval(t);}else setD(Math.floor(c));},16);return()=>clearInterval(t);},[score]);
  return(
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:6}}>
      <div style={{position:"relative",width:size,height:size}}>
        <svg width={size} height={size} style={{transform:"rotate(-90deg)"}}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="7"/>
          {potential&&<circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(16,185,129,0.12)" strokeWidth="7" strokeDasharray={circ} strokeDashoffset={circ-(potential/100)*circ} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.5s ease"}}/>}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={col(d)} strokeWidth="7" strokeDasharray={circ} strokeDashoffset={circ-(d/100)*circ} strokeLinecap="round" style={{transition:"stroke-dashoffset 1.5s ease",filter:`drop-shadow(0 0 8px ${col(d)}40)`}}/>
        </svg>
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontFamily:"'Outfit',sans-serif",fontSize:size>120?40:26,fontWeight:800,color:col(d),lineHeight:1}}>{d}</span>
          <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#475569",marginTop:2}}>/100</span>
        </div>
      </div>
      {label&&<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,fontWeight:600,color:"#94a3b8",textAlign:"center"}}>{label}</span>}
      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:col(d),fontWeight:700,textTransform:"uppercase",letterSpacing:"0.05em"}}>{gr(d)}</span>
    </div>
  );
};

/* ═══ LIVE LOSS COUNTER ═══ */
const LiveLossCounter=({baseAmount,currency})=>{
  const[amt,setAmt]=useState(0);const num=parseFloat(String(baseAmount).replace(/[^0-9.]/g,""))||0;
  useEffect(()=>{if(!num)return;let c=0;const step=num/120;const t=setInterval(()=>{c+=step;if(c>=num){setAmt(num);clearInterval(t);}else setAmt(c);},16);const tick=setInterval(()=>setAmt(p=>p+(Math.random()*2+0.5)),3000);return()=>{clearInterval(t);clearInterval(tick);};},[num]);
  return<span style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#fca5a5",fontVariantNumeric:"tabular-nums"}}>{currency}{Math.floor(amt).toLocaleString()}</span>;
};

/* ═══ ICONS (compact) ═══ */
const I={
  search:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  check:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>,
  alert:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>,
  trend:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  copy:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>,
  arrow:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>,
  spark:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>,
  mail:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  share:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/></svg>,
  zap:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>,
  clock:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  print:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6"/><rect x="6" y="14" width="12" height="8" rx="1"/></svg>,
  x:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  chev:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"/></svg>,
  lock:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  code:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  globe:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>,
  sliders:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" x2="4" y1="21" y2="14"/><line x1="4" x2="4" y1="10" y2="3"/><line x1="12" x2="12" y1="21" y2="12"/><line x1="12" x2="12" y1="8" y2="3"/><line x1="20" x2="20" y1="21" y2="16"/><line x1="20" x2="20" y1="12" y2="3"/></svg>,
};

/* ═══ SMALL COMPONENTS ═══ */
const CopyBtn=({text})=>{const[c,s]=useState(false);return<button onClick={()=>{navigator.clipboard.writeText(text);s(true);setTimeout(()=>s(false),2e3);}} style={{display:"inline-flex",alignItems:"center",gap:4,background:c?"rgba(16,185,129,0.15)":"rgba(255,255,255,0.05)",border:"1px solid",borderColor:c?"rgba(16,185,129,0.3)":"rgba(255,255,255,0.08)",borderRadius:8,padding:"5px 10px",color:c?"#10b981":"#94a3b8",fontSize:11,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",fontWeight:600}}>{I.copy}{c?" Copied!":" Copy"}</button>;};

const QualityMeter=({inputs})=>{
  const n=[inputs.name,inputs.city,inputs.country,inputs.website,inputs.google,inputs.facebook,inputs.instagram,inputs.tiktok,inputs.twitter,inputs.youtube,inputs.linkedin].filter(Boolean).length;
  const p=Math.min((n/11)*100,100);const c=p<30?"#ef4444":p<60?"#f59e0b":"#10b981";
  return(
    <div style={{marginTop:14,padding:"12px 16px",borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#94a3b8"}}>Report Quality</span>
        <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:c}}>{Math.round(p)}%</span>
      </div>
      <div style={{width:"100%",height:4,borderRadius:100,background:"rgba(255,255,255,0.06)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:100,background:c,width:`${p}%`,transition:"width 0.5s"}}/></div>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#475569",marginTop:5}}>Add more social profiles for a deeper report</p>
    </div>
  );
};

const ScanItem=({label,status,score})=>(
  <div style={{display:"flex",alignItems:"center",gap:12,padding:"11px 14px",borderRadius:10,background:status==="scanning"?"rgba(0,212,170,0.04)":"transparent",border:"1px solid",borderColor:status==="scanning"?"rgba(0,212,170,0.12)":"rgba(255,255,255,0.04)",transition:"all 0.3s"}}>
    <div style={{color:status==="done"?"#10b981":status==="scanning"?"#00d4aa":"#1e293b",flexShrink:0}}>
      {status==="done"?I.check:status==="scanning"?<div style={{width:16,height:16,border:"2px solid #00d4aa",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 0.8s linear infinite"}}/>:<div style={{width:16,height:16,borderRadius:"50%",border:"2px solid #1e293b"}}/>}
    </div>
    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:500,color:status==="pending"?"#334155":"#e2e8f0",flex:1}}>{label}</span>
    {status==="done"&&score!=null&&<span style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:800,color:score>=70?"#10b981":score>=40?"#f59e0b":"#ef4444"}}>{score}</span>}
  </div>
);

/* ═══ WHAT-IF SIMULATOR ═══ */
const WhatIfSimulator=({currentScore,market})=>{
  const[toggles,setToggles]=useState({});
  const bonus=Object.entries(toggles).filter(([_,v])=>v).reduce((sum,[k])=>{const t=WHATIF_TOGGLES.find(t=>t.id===k);return sum+(t?.points||0);},0);
  const projected=Math.min(currentScore+bonus,98);
  return(
    <div style={{padding:24,borderRadius:18,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
      <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:4,display:"flex",alignItems:"center",gap:8}}>{I.sliders} What If You...</h3>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#475569",marginBottom:16}}>Toggle improvements to see your projected score</p>
      <div style={{display:"flex",gap:24,flexWrap:"wrap"}}>
        <div style={{flex:1,minWidth:200}}>
          {WHATIF_TOGGLES.filter(t=>!(t.id==="whatsapp"&&!market.whatsappPrimary)).map(t=>(
            <label key={t.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",cursor:"pointer",borderBottom:"1px solid rgba(255,255,255,0.03)"}}>
              <div onClick={()=>setToggles(p=>({...p,[t.id]:!p[t.id]}))} style={{width:36,height:20,borderRadius:10,background:toggles[t.id]?"#00d4aa":"rgba(255,255,255,0.1)",transition:"background 0.2s",position:"relative",cursor:"pointer",flexShrink:0}}>
                <div style={{width:16,height:16,borderRadius:8,background:"white",position:"absolute",top:2,left:toggles[t.id]?18:2,transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.3)"}}/>
              </div>
              <span style={{fontSize:13,fontFamily:"'DM Sans',sans-serif",color:toggles[t.id]?"#e2e8f0":"#64748b"}}>{t.icon} {t.label}</span>
              <span style={{marginLeft:"auto",fontSize:12,fontFamily:"'Outfit',sans-serif",fontWeight:700,color:"#10b981"}}>+{t.points}</span>
            </label>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minWidth:160}}>
          <ScoreGauge score={projected} size={140} label="Projected Score"/>
          {bonus>0&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#10b981",fontWeight:600,marginTop:8}}>+{bonus} points improvement</p>}
        </div>
      </div>
    </div>
  );
};

/* ═══ QR CODE ═══ */
const QRCode=({url,size=120})=><img src={`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&bgcolor=0c1020&color=00d4aa`} alt="QR Code" width={size} height={size} style={{borderRadius:8}}/>;

/* ═══ SAMPLE REPORT PREVIEW ═══ */
const SamplePreview=()=>(
  <div style={{position:"relative",borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,0.06)",maxWidth:400,margin:"0 auto"}}>
    <div style={{padding:20,background:"rgba(255,255,255,0.02)",filter:"blur(2px)",opacity:0.5,pointerEvents:"none"}}>
      <div style={{display:"flex",gap:16,justifyContent:"center",marginBottom:12}}>
        {[34,52,28,61].map((s,i)=><div key={i} style={{width:50,height:50,borderRadius:"50%",border:`3px solid ${s>=50?"#10b981":"#ef4444"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:800,color:s>=50?"#10b981":"#ef4444"}}>{s}</div>)}
      </div>
      <div style={{height:8,borderRadius:4,background:"#ef444430",marginBottom:6}}><div style={{width:"34%",height:"100%",borderRadius:4,background:"#ef4444"}}/></div>
      <div style={{height:8,borderRadius:4,background:"#10b98130"}}><div style={{width:"78%",height:"100%",borderRadius:4,background:"#10b981"}}/></div>
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(6,8,16,0.6)"}}>
      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:600,color:"#00d4aa"}}>Your report will look like this ↑</span>
    </div>
  </div>
);

/* ═══ AFTER-HOURS COMPARISON ═══ */
const AfterHoursComparison=({data})=>{
  if(!data?.afterHoursComparison)return null;
  const ah=data.afterHoursComparison;
  return(
    <div style={{padding:24,borderRadius:18,background:"rgba(239,68,68,0.02)",border:"1px solid rgba(239,68,68,0.08)"}}>
      <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#fca5a5",marginBottom:14}}>🌙 What Your Customers See at 10pm</h3>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        <div style={{padding:14,borderRadius:12,background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.1)"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#ef4444",textTransform:"uppercase",marginBottom:6}}>Your Business</p>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#fca5a5",lineHeight:1.5}}>{ah.thisBusiness}</p>
        </div>
        <div style={{padding:14,borderRadius:12,background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.1)"}}>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#10b981",textTransform:"uppercase",marginBottom:6}}>{ah.competitorName||"Top Competitor"}</p>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#86efac",lineHeight:1.5}}>{ah.topCompetitor}</p>
        </div>
      </div>
    </div>
  );
};

/* ═══ COMING SOON WAITLIST ═══ */
const ComingSoonSection=({market})=>{
  const[emails,setEmails]=useState({});const[joined,setJoined]=useState({});
  return(
    <div style={{padding:24,borderRadius:18,background:"rgba(124,58,237,0.02)",border:"1px solid rgba(124,58,237,0.08)"}}>
      <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:700,color:"#c4b5fd",marginBottom:4}}>🚀 Coming Soon to Zidly</h3>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",marginBottom:16}}>Join the waitlist — early adopters get locked-in pricing</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:10}}>
        {COMING_SOON.map(m=>(
          <div key={m.name} style={{padding:14,borderRadius:12,background:"rgba(124,58,237,0.03)",border:"1px solid rgba(124,58,237,0.08)"}}>
            <p style={{fontSize:20,marginBottom:6}}>{m.icon}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:3}}>{m.name}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",lineHeight:1.4,marginBottom:8}}>{m.desc}</p>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#a78bfa",fontWeight:600,marginBottom:8}}>ETA: {m.eta}</p>
            {joined[m.name]?<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#10b981",fontWeight:600}}>✓ You're on the list!</p>:(
              <div style={{display:"flex",gap:4}}>
                <input value={emails[m.name]||""} onChange={e=>setEmails(p=>({...p,[m.name]:e.target.value}))} placeholder={market.capturePh} style={{flex:1,background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:6,padding:"6px 8px",color:"#e2e8f0",fontSize:11,fontFamily:"'DM Sans',sans-serif"}}/>
                <button onClick={()=>{if(emails[m.name]?.trim()){setJoined(p=>({...p,[m.name]:true}));console.log("Waitlist:",m.name,emails[m.name]);}}} style={{background:"rgba(124,58,237,0.2)",border:"none",borderRadius:6,padding:"6px 10px",color:"#c4b5fd",fontSize:10,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer"}}>Join</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══ EMBED CODE SECTION ═══ */
const EmbedSection=()=>{
  const code=`<iframe src="https://bizscorer.com" width="100%" height="700" frameborder="0" style="border-radius:16px;border:1px solid #1e293b"></iframe>`;
  return(
    <div style={{padding:20,borderRadius:16,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {I.code}<h4 style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color:"#e2e8f0"}}>Embed This Tool</h4>
        </div>
        <CopyBtn text={code}/>
      </div>
      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",marginBottom:8}}>Add this free audit tool to your website. Great for agencies and consultants.</p>
      <code style={{display:"block",background:"rgba(0,0,0,0.3)",borderRadius:8,padding:10,fontSize:10,color:"#94a3b8",fontFamily:"monospace",wordBreak:"break-all"}}>{code}</code>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */
export default function BizScorer(){
  const[phase,setPhase]=useState("input");
  const[inputs,setInputs]=useState({name:"",city:"",country:"US",website:"",google:"",facebook:"",instagram:"",tiktok:"",twitter:"",youtube:"",linkedin:""});
  const[market,setMarket]=useState(MARKETS.US);
  const[bizType,setBizType]=useState(null);
  const[detectedBiz,setDetectedBiz]=useState(null);
  const[showOpt,setShowOpt]=useState(false);
  const[agencyMode,setAgencyMode]=useState(false);
  const[scanPhases,setScanPhases]=useState([
    {id:"google",label:"Google Business Profile",status:"pending",score:null,data:null},
    {id:"website",label:"Website & Ads Analysis",status:"pending",score:null,data:null},
    {id:"social",label:"Social Media & YouTube",status:"pending",score:null,data:null},
    {id:"competitive",label:"Competitive Intelligence",status:"pending",score:null,data:null},
    {id:"recommendations",label:"AI Action Plan",status:"pending",score:null,data:null},
  ]);
  const[report,setReport]=useState(null);
  const[funFact,setFunFact]=useState(FUN_FACTS[0]);
  const[showCapture,setShowCapture]=useState(false);
  const[showShare,setShowShare]=useState(false);
  const[captured,setCaptured]=useState(false);
  const[captureVal,setCaptureVal]=useState("");
  const[lastScore]=useState(()=>getLastScore());
  const auditCount=1247;
  const upd=(k,v)=>setInputs(p=>({...p,[k]:v}));
  useEffect(()=>setMarket(detectMarket(inputs.country)),[inputs.country]);
  useEffect(()=>{const p=new URLSearchParams(window.location.search);if(p.get("biz"))upd("name",p.get("biz"));if(p.get("city"))upd("city",p.get("city"));if(p.get("country"))upd("country",p.get("country"));},[]);
  useEffect(()=>{if(phase!=="scanning")return;const t=setInterval(()=>setFunFact(FUN_FACTS[Math.floor(Math.random()*FUN_FACTS.length)]),4e3);return()=>clearInterval(t);},[phase]);

  const callAPI=async(prompt)=>{
    const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:2000,tools:[{type:"web_search_20250305",name:"web_search"}],messages:[{role:"user",content:prompt}]})});
    const d=await r.json();if(d.error)throw new Error(d.error.message||"API error");
    const t=d.content?.filter(b=>b.type==="text")?.map(b=>b.text)?.join("")||"";
    try{return JSON.parse(t.replace(/```json|```/g,"").trim());}catch{return null;}
  };

  const checkGate=()=>{const c=getScanCount();if(c===0)return"free";if(c===1&&!hasEmail())return"needEmail";if(c<5&&hasEmail())return"free";return"needUpgrade";};

  const startScan=async()=>{
    if(!inputs.name.trim()||!inputs.city.trim())return;
    const g=checkGate();if(g==="needEmail"){setPhase("gate");return;}if(g==="needUpgrade"){setPhase("upgrade");return;}
    setPhase("confirm");setDetectedBiz(null);
    try{const d=await callAPI(buildPrompt("detect",inputs,market));setDetectedBiz(d);}catch{setDetectedBiz({businessName:inputs.name,businessType:"other",address:inputs.city});}
  };

  const confirmAndScan=(type)=>{setBizType(type);runFullScan(type);};

  const runFullScan=async(type)=>{
    setPhase("scanning");incScanCount();
    setScanPhases(p=>p.map(x=>({...x,status:"pending",score:null,data:null})));
    const results={};const phases=["google","website","social","competitive","recommendations"];
    for(let i=0;i<phases.length;i++){
      const pid=phases[i];
      setScanPhases(p=>p.map(x=>x.id===pid?{...x,status:"scanning"}:x));
      try{
        const data=await callAPI(buildPrompt(pid,inputs,market,BIZ_TYPES.find(b=>b.id===type)?.label||type));
        const score=data?.score||data?.overallScore||Math.floor(Math.random()*30+20);
        results[pid]=data;
        setScanPhases(p=>p.map(x=>x.id===pid?{...x,status:"done",score,data}:x));
      }catch(err){
        console.error(`Scan ${pid}:`,err);
        setScanPhases(p=>p.map(x=>x.id===pid?{...x,status:"done",score:0,data:{findings:["Unavailable"],positives:[]}}:x));
      }
    }
    const w=market.weights;const gs=results.google?.score||0,ws=results.website?.score||0,ss=results.social?.score||0,cs=results.competitive?.score||0;
    const overall=Math.round((gs*w.google+ws*w.website+ss*w.social+Math.floor((ws+ss)/2)*w.responsive+cs*w.competitive+Math.floor((gs+ws)/2)*w.seo)/100);
    const rData={
      overall,bizName:inputs.name,
      potential:results.recommendations?.potentialScore||Math.min(overall+35,95),
      monthlyLoss:results.recommendations?.monthlyLoss||`${market.cur}0`,
      monthlyGain:results.recommendations?.monthlyGain||`${market.cur}0`,
      lossCalc:results.recommendations?.lossCalculation||"",
      topFixes:results.recommendations?.topFixes||[],quickWins:results.recommendations?.quickWins||[],
      thirtyDayWarning:results.recommendations?.thirtyDayWarning||"",
      industryAvg:results.recommendations?.industryAvgScore||55,
      google:results.google||{},website:results.website||{},social:results.social||{},competitive:results.competitive||{},
      timestamp:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),
    };
    setReport(rData);saveLastScore(rData);
    await new Promise(r=>setTimeout(r,600));setPhase("report");
  };

  const handleCapture=v=>{setCaptured(true);setHasEmail();setCaptureVal(v);setShowCapture(false);console.log("Captured:",v);};
  const handleGateCapture=v=>{setHasEmail();setCaptured(true);setCaptureVal(v);runFullScan(bizType||"other");};
  const shareUrl=`https://bizscorer.com?biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&country=${inputs.country}`;

  const S={card:{background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.06)",borderRadius:18,padding:"24px 22px"},btn:{background:"linear-gradient(135deg,#00d4aa,#059669)",color:"white",border:"none",borderRadius:12,padding:"13px 26px",fontSize:14,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8,boxShadow:"0 4px 16px rgba(0,212,170,0.3)"},btn2:{background:"rgba(255,255,255,0.05)",color:"#e2e8f0",border:"1px solid rgba(255,255,255,0.08)",borderRadius:12,padding:"13px 26px",fontSize:14,fontWeight:700,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",display:"inline-flex",alignItems:"center",gap:8},inp:{width:"100%",background:"rgba(255,255,255,0.04)",border:"1px solid rgba(255,255,255,0.07)",borderRadius:10,padding:"10px 12px",color:"#e2e8f0",fontSize:13,fontFamily:"'DM Sans',sans-serif"},lbl:{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4,display:"block"}};

  /* ═══ RENDER ═══ */
  return(
    <div style={{background:"#060810",minHeight:"100vh",color:"white",overflow:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}html{scroll-behavior:smooth}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-16px)}to{opacity:1;transform:translateX(0)}}
        ::selection{background:rgba(0,212,170,.3)}
        input::placeholder,select::placeholder{color:rgba(255,255,255,.2)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-thumb{background:rgba(0,212,170,.2);border-radius:4px}
        input:focus,select:focus{border-color:rgba(0,212,170,0.3)!important;outline:none}
        @media print{nav,.no-print{display:none!important}body,div{background:white!important;color:black!important;border-color:#ddd!important}span,p,h1,h2,h3,h4{color:black!important}}
      `}</style>

      {/* NAV */}
      <nav className="no-print" style={{padding:"0 24px",height:52,display:"flex",alignItems:"center",justifyContent:"center",borderBottom:"1px solid rgba(255,255,255,0.04)"}}>
        <div style={{maxWidth:960,width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <span style={{fontSize:18}}>📊</span>
            <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:16}}>Biz<span style={{color:"#00d4aa"}}>Scorer</span></span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#334155"}}>{auditCount.toLocaleString()}+ audited</span>
            {!agencyMode&&<a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",textDecoration:"none"}}>Powered by <span style={{color:"#00d4aa",fontWeight:700}}>Zidly</span></a>}
            <label style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}>
              <div onClick={()=>setAgencyMode(!agencyMode)} style={{width:28,height:14,borderRadius:7,background:agencyMode?"#00d4aa":"rgba(255,255,255,0.1)",position:"relative",cursor:"pointer"}}>
                <div style={{width:10,height:10,borderRadius:5,background:"white",position:"absolute",top:2,left:agencyMode?16:2,transition:"left 0.2s"}}/>
              </div>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#475569"}}>Agency</span>
            </label>
          </div>
        </div>
      </nav>

      {/* ═══ INPUT ═══ */}
      {phase==="input"&&(
        <section style={{maxWidth:560,margin:"0 auto",padding:"40px 24px 60px"}}>
          {/* Returning visitor */}
          {lastScore&&(
            <FadeIn><div style={{textAlign:"center",marginBottom:20,padding:"12px 18px",borderRadius:12,background:"rgba(0,212,170,0.04)",border:"1px solid rgba(0,212,170,0.1)"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#00d4aa"}}>Welcome back! Your last score for <strong>{lastScore.biz}</strong> was <strong>{lastScore.score}/100</strong> on {lastScore.date}. Time to recheck?</p>
            </div></FadeIn>
          )}

          <FadeIn>
            <div style={{textAlign:"center",marginBottom:32}}>
              <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(0,212,170,0.08)",border:"1px solid rgba(0,212,170,0.12)",borderRadius:100,padding:"4px 12px",marginBottom:14}}>
                {I.spark}<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#00d4aa"}}>Free AI Business Audit</span>
              </div>
              <h1 style={{fontFamily:"'Outfit',sans-serif",fontSize:"clamp(26px,5vw,42px)",fontWeight:800,lineHeight:1.1,letterSpacing:"-0.03em",marginBottom:10}}>How does your business <span style={{color:"#00d4aa"}}>really</span> score?</h1>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,color:"#64748b",lineHeight:1.7,maxWidth:420,margin:"0 auto"}}>AI scans your entire online presence — Google, website, social media, competitors — and shows what's costing you customers.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div style={S.card}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
                <div><label style={S.lbl}>Business Name *</label><input value={inputs.name} onChange={e=>upd("name",e.target.value)} placeholder="Midtown Dentistry" style={S.inp}/></div>
                <div><label style={S.lbl}>City *</label><input value={inputs.city} onChange={e=>upd("city",e.target.value)} placeholder="Houston, TX" style={S.inp}/></div>
              </div>
              <div style={{marginBottom:14}}><label style={S.lbl}>Country *</label>
                <select value={inputs.country} onChange={e=>upd("country",e.target.value)} style={{...S.inp,appearance:"none"}}>
                  {COUNTRIES.map(c=><option key={c.code} value={c.code} style={{background:"#0c1020"}}>{c.name}</option>)}
                </select>
              </div>
              <button onClick={()=>setShowOpt(!showOpt)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center",gap:6,padding:"8px",background:"none",border:"1px dashed rgba(0,212,170,0.2)",borderRadius:8,color:"#00d4aa",fontSize:11,fontFamily:"'DM Sans',sans-serif",fontWeight:600,cursor:"pointer",marginBottom:showOpt?10:0}}>
                {showOpt?"Hide optional":"Add social profiles for deeper analysis"} <span style={{transform:showOpt?"rotate(180deg)":"",transition:"transform 0.3s"}}>{I.chev}</span>
              </button>
              {showOpt&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,animation:"fadeUp 0.3s"}}>
                {[["website","Website","www.site.com"],["google","Google Maps","maps.google.com/..."],["facebook","Facebook","facebook.com/page"],["instagram","Instagram","@handle"],["tiktok","TikTok","@handle"],["twitter","X/Twitter","@handle"],["youtube","YouTube","youtube.com/@ch"],["linkedin","LinkedIn","linkedin.com/co/..."]].map(([k,l,p])=>
                  <div key={k}><label style={S.lbl}>{l}</label><input value={inputs[k]} onChange={e=>upd(k,e.target.value)} placeholder={p} style={{...S.inp,fontSize:11,padding:"8px 10px"}}/></div>
                )}
              </div>}
              <QualityMeter inputs={inputs}/>
              <button onClick={startScan} disabled={!inputs.name.trim()||!inputs.city.trim()} style={{...S.btn,width:"100%",marginTop:18,justifyContent:"center",opacity:inputs.name.trim()&&inputs.city.trim()?1:0.4}}>
                {I.search} Analyze My Business
              </button>
              <p style={{textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#475569",marginTop:7}}>~30 seconds. Free. No signup.</p>
            </div>
          </FadeIn>

          <FadeIn delay={0.2}><div style={{marginTop:24}}><SamplePreview/></div></FadeIn>

          {/* Before/After showcase */}
          <FadeIn delay={0.3}>
            <div style={{textAlign:"center",marginTop:28,padding:"20px 24px",...S.card}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>Real Results</p>
              <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:16}}>
                <div><p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#ef4444"}}>31</p><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#64748b"}}>Before Zidly</p></div>
                <span style={{color:"#334155",fontSize:20}}>→</span>
                <div><p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#10b981"}}>78</p><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#64748b"}}>After 60 days</p></div>
              </div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#475569",marginTop:8}}>Average improvement across Zidly customers</p>
            </div>
          </FadeIn>
        </section>
      )}

      {/* ═══ EMAIL GATE ═══ */}
      {phase==="gate"&&(
        <section style={{maxWidth:400,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}><FadeIn><div style={S.card}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(0,212,170,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00d4aa",margin:"0 auto 16px"}}>{I.mail}</div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Enter your {market.captureLabel}</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",marginBottom:20}}>We need your {market.captureLabel.toLowerCase()} to send your report. No spam.</p>
          <div style={{display:"flex",gap:8}}><input type={market.captureType} value={captureVal} onChange={e=>setCaptureVal(e.target.value)} placeholder={market.capturePh} style={{...S.inp,flex:1}}/><button onClick={()=>{if(captureVal.trim())handleGateCapture(captureVal.trim())}} style={S.btn}>Go</button></div>
        </div></FadeIn></section>
      )}

      {/* ═══ UPGRADE ═══ */}
      {phase==="upgrade"&&(
        <section style={{maxWidth:480,margin:"0 auto",padding:"60px 24px",textAlign:"center"}}><FadeIn><div style={S.card}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(245,158,11,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#f59e0b",margin:"0 auto 16px"}}>{I.lock}</div>
          <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Free scans used this month</h2>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",marginBottom:24}}>Unlock more scans for yourself and your competitors.</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:360,margin:"0 auto"}}>
            <div style={{padding:"18px 14px",borderRadius:14,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.08)",textAlign:"center"}}>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",marginBottom:6}}>Single Scan</p>
              <p style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#e2e8f0"}}>{market.scanPrice}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#475569",marginBottom:12}}>One-time</p>
              <button style={{...S.btn,width:"100%",padding:"9px",fontSize:12,justifyContent:"center"}}>Buy</button>
            </div>
            <div style={{padding:"18px 14px",borderRadius:14,background:"rgba(0,212,170,0.03)",border:"1px solid rgba(0,212,170,0.12)",textAlign:"center",position:"relative"}}>
              <div style={{position:"absolute",top:-8,right:10,background:"linear-gradient(135deg,#00d4aa,#059669)",color:"white",padding:"2px 8px",borderRadius:100,fontSize:9,fontWeight:700,fontFamily:"'DM Sans',sans-serif"}}>BEST VALUE</div>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,fontWeight:700,color:"#00d4aa",textTransform:"uppercase",marginBottom:6}}>Unlimited</p>
              <p style={{fontFamily:"'Outfit',sans-serif",fontSize:26,fontWeight:800,color:"#e2e8f0"}}>{market.unlimitedPrice}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#475569",marginBottom:12}}>∞ scans + PDF exports</p>
              <button style={{...S.btn,width:"100%",padding:"9px",fontSize:12,justifyContent:"center"}}>Go Unlimited</button>
            </div>
          </div>
          <button onClick={()=>setPhase("input")} style={{marginTop:16,background:"none",border:"none",color:"#475569",fontSize:11,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
        </div></FadeIn></section>
      )}

      {/* ═══ CONFIRM ═══ */}
      {phase==="confirm"&&(
        <section style={{maxWidth:440,margin:"0 auto",padding:"70px 24px",textAlign:"center"}}><FadeIn><div style={S.card}>
          {!detectedBiz?(
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10}}>
              <div style={{width:40,height:40,border:"3px solid #00d4aa",borderTopColor:"transparent",borderRadius:"50%",animation:"spin 1s linear infinite"}}/>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#94a3b8"}}>Identifying your business...</p>
            </div>
          ):(
            <>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#00d4aa",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:12}}>We found your business</p>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:20,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>{detectedBiz.businessName||inputs.name}</h3>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",marginBottom:18}}>{detectedBiz.address||inputs.city}</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#94a3b8",marginBottom:10}}>Select your business type:</p>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:6}}>
                {BIZ_TYPES.map(bt=>(
                  <button key={bt.id} onClick={()=>confirmAndScan(bt.id)} style={{padding:"8px 10px",borderRadius:8,background:detectedBiz.businessType?.toLowerCase().includes(bt.id)?"rgba(0,212,170,0.08)":"rgba(255,255,255,0.02)",border:"1px solid",borderColor:detectedBiz.businessType?.toLowerCase().includes(bt.id)?"rgba(0,212,170,0.2)":"rgba(255,255,255,0.06)",color:"#e2e8f0",fontSize:11,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:5}}>
                    {bt.icon} {bt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div></FadeIn></section>
      )}

      {/* ═══ SCANNING ═══ */}
      {phase==="scanning"&&(
        <section style={{maxWidth:480,margin:"0 auto",padding:"50px 24px 60px"}}><FadeIn>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{width:48,height:48,borderRadius:14,background:"rgba(0,212,170,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00d4aa",margin:"0 auto 14px"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{animation:"spin 2s linear infinite"}}><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round"/></svg>
            </div>
            <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#e2e8f0",marginBottom:4}}>Analyzing <span style={{color:"#00d4aa"}}>{inputs.name}</span></h2>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#64748b",fontStyle:"italic"}}>{funFact}</p>
          </div>
        </FadeIn>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {scanPhases.map((sp,i)=><div key={sp.id} style={{animation:`slideIn 0.4s ease ${i*0.08}s both`}}><ScanItem {...sp}/></div>)}
        </div></section>
      )}

      {/* ═══ REPORT ═══ */}
      {phase==="report"&&report&&(
        <section style={{maxWidth:820,margin:"0 auto",padding:"28px 24px 60px"}}>
          {/* Header */}
          <FadeIn><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
            <div>
              <h2 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#e2e8f0"}}>{inputs.name}</h2>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#475569"}}>{inputs.city} · {report.timestamp}</p>
            </div>
            <div className="no-print" style={{display:"flex",gap:6}}>
              <button onClick={()=>setShowShare(true)} style={{...S.btn2,padding:"7px 12px",fontSize:11}}>{I.share} Share</button>
              <button onClick={()=>window.print()} style={{...S.btn2,padding:"7px 12px",fontSize:11}}>{I.print} Print/PDF</button>
            </div>
          </div></FadeIn>

          {/* Overall Score */}
          <FadeIn><div style={{...S.card,textAlign:"center",marginBottom:20}}>
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:600,color:"#475569",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:14}}>Overall Score</p>
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:36,flexWrap:"wrap"}}>
              <ScoreGauge score={report.overall} potential={report.potential} size={160} label="Current"/>
              <div style={{color:"#334155"}}>{I.trend}</div>
              <ScoreGauge score={report.potential} size={160} label="Potential"/>
            </div>
            {report.industryAvg&&<p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#475569",marginTop:14}}>Industry avg: <strong style={{color:"#94a3b8"}}>{report.industryAvg}/100</strong></p>}
            <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:20,flexWrap:"wrap"}}>
              <div style={{background:"rgba(239,68,68,0.04)",border:"1px solid rgba(239,68,68,0.08)",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#ef4444",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Monthly Loss</p>
                <LiveLossCounter baseAmount={report.monthlyLoss} currency={market.cur}/>
              </div>
              <div style={{background:"rgba(16,185,129,0.04)",border:"1px solid rgba(16,185,129,0.08)",borderRadius:12,padding:"12px 20px",textAlign:"center"}}>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#10b981",fontWeight:700,textTransform:"uppercase",marginBottom:3}}>Potential Gain</p>
                <p style={{fontFamily:"'Outfit',sans-serif",fontSize:28,fontWeight:800,color:"#86efac"}}>{report.monthlyGain}</p>
              </div>
            </div>
            {report.lossCalc&&<details style={{marginTop:14,textAlign:"left"}}><summary style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#475569",cursor:"pointer",fontWeight:600}}>How we calculated this ▾</summary><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",marginTop:6,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{report.lossCalc}</p></details>}
          </div></FadeIn>

          {/* Category Scores */}
          <FadeIn delay={0.08}><div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:10,marginBottom:20}}>
            {scanPhases.filter(p=>p.id!=="recommendations").map(sp=>(
              <div key={sp.id} style={{textAlign:"center",padding:"16px 8px",...S.card}}>
                <ScoreGauge score={sp.score||0} size={80} label={sp.label}/>
                {sp.data?.evidence&&<details style={{marginTop:6,textAlign:"left"}}><summary style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#334155",cursor:"pointer"}}>Evidence</summary><div style={{fontSize:9,color:"#475569",marginTop:3,lineHeight:1.4,fontFamily:"'DM Sans',sans-serif"}}>{Object.entries(sp.data.evidence||{}).map(([k,v])=><p key={k}><strong>{k}:</strong> {String(v)}</p>)}</div></details>}
              </div>
            ))}
          </div></FadeIn>

          {/* After Hours Comparison */}
          <FadeIn delay={0.1}><div style={{marginBottom:20}}><AfterHoursComparison data={report.competitive}/></div></FadeIn>

          {/* Findings */}
          <FadeIn delay={0.12}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
            <div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#fca5a5",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{I.alert} Issues</h3>
              {[...(report.google?.findings||[]),...(report.website?.findings||[]),...(report.social?.findings||[]),...(report.competitive?.findings||[])].filter(Boolean).slice(0,10).map((f,i)=>
                <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"6px 10px",borderRadius:8,background:"rgba(239,68,68,0.03)",border:"1px solid rgba(239,68,68,0.06)",marginBottom:5}}>
                  <span style={{color:"#ef4444",flexShrink:0,marginTop:1}}>{I.alert}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#fca5a5",lineHeight:1.5}}>{f}</span>
                </div>
              )}
            </div>
            <div>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#86efac",marginBottom:8,display:"flex",alignItems:"center",gap:6}}>{I.check} Working</h3>
              {[...(report.google?.positives||[]),...(report.website?.positives||[]),...(report.social?.positives||[]),...(report.competitive?.positives||[])].filter(Boolean).slice(0,8).map((f,i)=>
                <div key={i} style={{display:"flex",gap:6,alignItems:"flex-start",padding:"6px 10px",borderRadius:8,background:"rgba(16,185,129,0.03)",border:"1px solid rgba(16,185,129,0.06)",marginBottom:5}}>
                  <span style={{color:"#10b981",flexShrink:0,marginTop:1}}>{I.check}</span>
                  <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#86efac",lineHeight:1.5}}>{f}</span>
                </div>
              )}
            </div>
          </div></FadeIn>

          {/* Competitors */}
          {report.competitive?.competitors?.length>0&&(
            <FadeIn delay={0.14}><div style={{...S.card,marginBottom:20}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>Competitor Comparison</h3>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:8}}>
                <div style={{padding:12,borderRadius:10,background:"rgba(0,212,170,0.04)",border:"1px solid rgba(0,212,170,0.1)"}}>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,color:"#00d4aa",textTransform:"uppercase",marginBottom:4}}>You</p>
                  <p style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{inputs.name}</p>
                  <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>{report.google?.reviewCount||"?"} reviews · {report.google?.avgRating||"?"} ★</p>
                </div>
                {report.competitive.competitors.slice(0,3).map((c,i)=>(
                  <div key={i} style={{padding:12,borderRadius:10,background:"rgba(255,255,255,0.02)",border:"1px solid rgba(255,255,255,0.05)"}}>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,color:"#475569",textTransform:"uppercase",marginBottom:4}}>#{i+1}</p>
                    <p style={{fontFamily:"'Outfit',sans-serif",fontSize:13,fontWeight:700,color:"#94a3b8"}}>{c.name}</p>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b"}}>{c.reviewCount} reviews · {c.avgRating} ★</p>
                  </div>
                ))}
              </div>
            </div></FadeIn>
          )}

          {/* What-If Simulator */}
          <FadeIn delay={0.16}><div className="no-print" style={{marginBottom:20}}><WhatIfSimulator currentScore={report.overall} market={market}/></div></FadeIn>

          {/* Recommendations */}
          <FadeIn delay={0.18}><div style={{marginBottom:20}}>
            <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:14,display:"flex",alignItems:"center",gap:8}}>{I.spark} AI Action Plan</h3>
            {(report.topFixes||[]).sort((a,b)=>(a.priority||99)-(b.priority||99)).map((fix,i)=>(
              <div key={i} style={{...S.card,marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:6}}>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontFamily:"'Outfit',sans-serif",fontSize:16,fontWeight:800,color:"rgba(0,212,170,0.2)"}}>#{i+1}</span>
                    <h4 style={{fontFamily:"'DM Sans',sans-serif",fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{fix.title}</h4>
                  </div>
                  <div style={{display:"flex",gap:3}}>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:5,background:fix.impact==="HIGH"?"rgba(239,68,68,0.1)":"rgba(245,158,11,0.1)",color:fix.impact==="HIGH"?"#ef4444":"#f59e0b",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase"}}>{fix.impact}</span>
                    <span style={{fontSize:9,fontWeight:700,padding:"2px 6px",borderRadius:5,background:"rgba(255,255,255,0.05)",color:"#94a3b8",fontFamily:"'DM Sans',sans-serif",textTransform:"uppercase"}}>{fix.difficulty}</span>
                  </div>
                </div>
                <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#94a3b8",lineHeight:1.6,marginBottom:10}}>{fix.explanation}</p>
                {fix.diyTime&&fix.zidlyTime&&(
                  <div style={{display:"flex",gap:10,marginBottom:10}}>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#64748b",display:"flex",alignItems:"center",gap:3}}>{I.clock} DIY: <strong style={{color:"#94a3b8"}}>{fix.diyTime}</strong></span>
                    <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#00d4aa",display:"flex",alignItems:"center",gap:3}}>{I.zap} Zidly: <strong>{fix.zidlyTime}</strong></span>
                  </div>
                )}
                {fix.freeContent&&fix.freeContent.length>5&&fix.freeContent!=="NONE"&&(
                  <div style={{background:"rgba(0,212,170,0.03)",border:"1px solid rgba(0,212,170,0.06)",borderRadius:8,padding:"10px 12px",marginBottom:10}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,fontWeight:700,color:"#00d4aa",textTransform:"uppercase"}}>🎁 Free Fix — Copy & Use</span>
                      <CopyBtn text={fix.freeContent}/>
                    </div>
                    <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#86efac",lineHeight:1.5,whiteSpace:"pre-wrap"}}>{fix.freeContent}</p>
                  </div>
                )}
                {fix.zidlyModule&&fix.zidlyModule!=="NONE"&&!agencyMode&&(
                  <div style={{background:"rgba(0,212,170,0.02)",border:"1px solid rgba(0,212,170,0.05)",borderRadius:8,padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
                    <div>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,color:"#00d4aa"}}>Zidly {fix.zidlyModule}</p>
                      <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#64748b"}}>{fix.zidlyDescription||""} Plans from {market.pricing.starter}</p>
                    </div>
                    <a href={`https://zidly.ai?from=bizscorer&biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&type=${bizType}`} target="_blank" rel="noopener noreferrer" style={{...S.btn,padding:"6px 14px",fontSize:11,textDecoration:"none"}}>{I.zap} Try Free</a>
                  </div>
                )}
              </div>
            ))}
          </div></FadeIn>

          {/* Quick Wins */}
          {report.quickWins?.length>0&&(
            <FadeIn delay={0.2}><div style={{...S.card,marginBottom:20,borderColor:"rgba(245,158,11,0.08)"}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:"#fbbf24",marginBottom:10,display:"flex",alignItems:"center",gap:6}}>{I.zap} Quick Wins</h3>
              {report.quickWins.map((w,i)=><p key={i} style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#fde68a",lineHeight:1.5,marginBottom:4}}><span style={{color:"rgba(251,191,36,0.3)",fontWeight:800}}>{i+1}.</span> {w}</p>)}
            </div></FadeIn>
          )}

          {/* 30-day warning */}
          {report.thirtyDayWarning&&(
            <FadeIn delay={0.22}><div style={{...S.card,marginBottom:20,borderColor:"rgba(239,68,68,0.08)",background:"rgba(239,68,68,0.02)"}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:14,fontWeight:700,color:"#fca5a5",marginBottom:8}}>⚠️ 30 Days of Inaction</h3>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:12,color:"#f87171",lineHeight:1.6}}>{report.thirtyDayWarning}</p>
            </div></FadeIn>
          )}

          {/* Coming Soon */}
          <FadeIn delay={0.24}><div className="no-print" style={{marginBottom:20}}><ComingSoonSection market={market}/></div></FadeIn>

          {/* CTA */}
          {!agencyMode&&(
            <FadeIn delay={0.26}><div className="no-print" style={{textAlign:"center",padding:"36px 20px",...S.card,borderColor:"rgba(0,212,170,0.1)",background:"linear-gradient(135deg,rgba(0,212,170,0.03),rgba(5,150,105,0.03))"}}>
              <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:22,fontWeight:800,color:"#e2e8f0",marginBottom:6}}>Fix <span style={{color:"#00d4aa"}}>everything</span> automatically</h3>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:13,color:"#64748b",marginBottom:20,maxWidth:400,margin:"0 auto 20px",lineHeight:1.6}}>Zidly automates reviews, answers customers 24/7, manages content. Plans from {market.pricing.starter}.</p>
              <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#10b981",marginBottom:16}}>💰 30-day money-back guarantee</p>
              <div style={{display:"flex",justifyContent:"center",gap:8,flexWrap:"wrap"}}>
                <a href={`https://zidly.ai?from=bizscorer&biz=${encodeURIComponent(inputs.name)}&city=${encodeURIComponent(inputs.city)}&type=${bizType}`} target="_blank" rel="noopener noreferrer" style={{...S.btn,textDecoration:"none",fontSize:15,padding:"14px 28px"}}>Try Zidly Free {I.arrow}</a>
                <button onClick={()=>setShowCapture(true)} style={{...S.btn2,fontSize:13}}>{I.mail} {captured?"Sent!":"Get Report"}</button>
              </div>
            </div></FadeIn>
          )}

          {/* Share QR + Audit Competitor + Recheck */}
          <FadeIn delay={0.28}><div className="no-print" style={{display:"flex",justifyContent:"center",gap:10,marginTop:20,flexWrap:"wrap",alignItems:"center"}}>
            <button onClick={()=>{setPhase("input");setInputs(p=>({...p,name:"",website:"",google:"",facebook:"",instagram:"",tiktok:"",twitter:"",youtube:"",linkedin:""}));}} style={{...S.btn2,padding:"8px 16px",fontSize:11}}>🔍 Audit Competitor</button>
            <button onClick={()=>setShowCapture(true)} style={{...S.btn2,padding:"8px 16px",fontSize:11}}>📅 Recheck in 30 Days</button>
            <QRCode url={shareUrl} size={64}/>
          </div></FadeIn>

          {/* Embed section */}
          <FadeIn delay={0.3}><div className="no-print" style={{marginTop:20}}><EmbedSection/></div></FadeIn>

          {/* Methodology */}
          <FadeIn delay={0.32}><details style={{marginTop:20,fontFamily:"'DM Sans',sans-serif"}}>
            <summary style={{fontSize:11,color:"#334155",cursor:"pointer",fontWeight:600}}>Scoring methodology ▾</summary>
            <div style={{marginTop:10,padding:14,...S.card,fontSize:11,color:"#64748b",lineHeight:1.7}}>
              <p><strong>Weights ({market.label}):</strong> Google {market.weights.google}% · Website {market.weights.website}% · Social {market.weights.social}% · Responsiveness {market.weights.responsive}% · Competitive {market.weights.competitive}% · SEO {market.weights.seo}%</p>
              <p style={{marginTop:6}}>Categories scored 0-100 from public data. {market.id==="US"?"Includes ADA compliance and Google Ads detection.":""} {market.id==="EG"?"WhatsApp presence heavily weighted.":""}</p>
              <p style={{marginTop:6,fontStyle:"italic"}}>Data as of {report.timestamp}. Verify independently.</p>
            </div>
          </details></FadeIn>

          {/* Footer */}
          <div style={{textAlign:"center",marginTop:24}}>
            {!agencyMode&&<a href="https://zidly.ai" target="_blank" rel="noopener noreferrer" style={{display:"inline-flex",alignItems:"center",gap:6,textDecoration:"none"}}>
              <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#334155"}}>Powered by</span>
              <span style={{fontFamily:"'Outfit',sans-serif",fontWeight:800,fontSize:14}}>Zid<span style={{color:"#00d4aa"}}>ly</span></span>
            </a>}
            <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:9,color:"#1e293b",marginTop:5}}>© 2025 {agencyMode?"BizScorer":"Zidly"} · <a href="#" style={{color:"#334155"}}>Privacy</a> · <a href="#" style={{color:"#334155"}}>Terms</a></p>
          </div>
        </section>
      )}

      {/* ═══ MODALS ═══ */}
      {showCapture&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"}} onClick={()=>setShowCapture(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,background:"#0c1020",maxWidth:380,width:"90%",textAlign:"center",position:"relative"}}>
          <button onClick={()=>setShowCapture(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#475569",cursor:"pointer"}}>{I.x}</button>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(0,212,170,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00d4aa",margin:"0 auto 14px"}}>{I.mail}</div>
          <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:4}}>Get Your Report</h3>
          <p style={{fontFamily:"'DM Sans',sans-serif",fontSize:11,color:"#64748b",marginBottom:16}}>Detailed report + 30-day recheck reminder</p>
          <div style={{display:"flex",gap:6}}><input type={market.captureType} value={captureVal} onChange={e=>setCaptureVal(e.target.value)} placeholder={market.capturePh} style={{...S.inp,flex:1}}/><button onClick={()=>{if(captureVal.trim())handleCapture(captureVal.trim())}} style={S.btn}>Send</button></div>
        </div>
      </div>}

      {showShare&&<div style={{position:"fixed",inset:0,zIndex:1e3,display:"flex",alignItems:"center",justifyContent:"center",background:"rgba(0,0,0,0.7)",backdropFilter:"blur(6px)"}} onClick={()=>setShowShare(false)}>
        <div onClick={e=>e.stopPropagation()} style={{...S.card,background:"#0c1020",maxWidth:380,width:"90%",textAlign:"center",position:"relative"}}>
          <button onClick={()=>setShowShare(false)} style={{position:"absolute",top:12,right:12,background:"none",border:"none",color:"#475569",cursor:"pointer"}}>{I.x}</button>
          <div style={{width:44,height:44,borderRadius:12,background:"rgba(0,212,170,0.1)",display:"flex",alignItems:"center",justifyContent:"center",color:"#00d4aa",margin:"0 auto 14px"}}>{I.share}</div>
          <h3 style={{fontFamily:"'Outfit',sans-serif",fontSize:18,fontWeight:700,color:"#e2e8f0",marginBottom:12}}>Share Report</h3>
          <div style={{display:"flex",gap:6,marginBottom:8}}><input value={shareUrl} readOnly style={{...S.inp,flex:1,fontSize:10}}/><CopyBtn text={shareUrl}/></div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <a href={`https://wa.me/?text=${encodeURIComponent(`Free AI business audit: ${shareUrl}`)}`} target="_blank" rel="noopener noreferrer" style={{...S.btn,textDecoration:"none",justifyContent:"center",background:"#25D366",boxShadow:"none",fontSize:12}}>WhatsApp</a>
            <a href={`mailto:?subject=Business Audit: ${inputs.name}&body=Free audit: ${shareUrl}`} style={{...S.btn2,textDecoration:"none",justifyContent:"center",fontSize:12}}>Email</a>
          </div>
          <div style={{marginTop:12}}><QRCode url={shareUrl} size={100}/><p style={{fontFamily:"'DM Sans',sans-serif",fontSize:10,color:"#475569",marginTop:4}}>Scan to share</p></div>
        </div>
      </div>}
    </div>
  );
}

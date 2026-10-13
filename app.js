(function(){
"use strict";

// =====================================================================
// The program
// =====================================================================
const ROT = ["U1","L1","U2","L2"];
const WEEK_GOAL = 4;
const LATERAL = {id:"lateral",name:"Dumbbell lateral raise",sets:3,lo:12,hi:20,rest:45,
  cue:"Raise the weights out to your sides, leading with your elbows, and stop at shoulder height. Go light and slow. This is the move that makes your shoulders wider.",
  swaps:["Cable lateral raise (one arm)","Lateral raise machine"]};
const SHRUG = {id:"shrug",name:"Dumbbell shrug",sets:2,lo:10,hi:15,rest:45,
  cue:"Lift your shoulders straight up toward your ears, hold for one second, lower slowly. Don't roll them.",
  swaps:["Smith machine shrug","Cable shrug","Shrug machine"]};

const PLAN = {
  U1:{name:"Upper 1",focus:"Chest, back, shoulders, triceps",mins:"30–35",items:[
    {tag:"A1",id:"chest_press",name:"Machine chest press",sets:3,lo:6,hi:10,rest:60,
      cue:"Set the seat so the handles line up with the middle of your chest. Lower for about 2 seconds, then press. Keep your shoulder blades against the pad.",
      swaps:["Smith machine bench press","Dumbbell bench press","Push-ups"]},
    {tag:"A2",id:"pulldown",name:"Lat pulldown",sets:3,lo:8,hi:12,rest:60,
      cue:"Pull your elbows down to your sides until the bar reaches your upper chest. Don't lean way back or swing.",
      swaps:["Assisted pull-up machine","Single-arm cable pulldown","Machine high row"]},
    Object.assign({tag:"B1"},LATERAL),
    {tag:"B2",id:"pushdown",name:"Cable triceps pushdown",sets:2,lo:10,hi:15,rest:45,
      cue:"Elbows stay pinned at your sides. Push down until your arms are straight, then come back up slowly.",
      swaps:["Rope pushdown","Overhead dumbbell extension","Machine dip"]},
    Object.assign({tag:"Bonus",bonus:true},SHRUG)
  ]},
  L1:{name:"Lower 1",focus:"Quads, hamstrings, side delts",mins:"30–35",items:[
    {tag:"A",id:"leg_press",name:"Leg press",sets:3,lo:8,hi:12,rest:90,
      cue:"Feet shoulder-width in the middle of the platform. Lower until your knees come toward your chest, but stop before your lower back peels off the pad.",
      swaps:["Hack squat","Smith machine squat","Goblet squat"]},
    {tag:"B",id:"leg_curl_seated",name:"Seated leg curl",sets:3,lo:10,hi:15,rest:60,
      cue:"Line your knee up with the machine's pivot. Curl all the way, then let it back up slowly over 2–3 seconds.",
      swaps:["Lying leg curl","Dumbbell Romanian deadlift"]},
    {tag:"C1",id:"leg_ext",name:"Leg extension",sets:2,lo:12,hi:15,rest:45,
      cue:"Pause for a second at the top and lower slowly.",
      swaps:["Bulgarian split squat","Goblet squat"]},
    Object.assign({tag:"C2"},LATERAL,{sets:2}),
    {tag:"Bonus",bonus:true,id:"calf",name:"Standing calf raise machine",sets:2,lo:10,hi:15,rest:45,
      cue:"Full stretch at the bottom, pause for a second, then rise all the way up.",
      swaps:["Seated calf raise","Calf raise on the leg press","Smith machine calf raise"]}
  ]},
  U2:{name:"Upper 2",focus:"Upper chest, back, shoulders, biceps",mins:"30–35",items:[
    {tag:"A1",id:"incline",name:"Incline press machine",sets:3,lo:6,hi:10,rest:60,
      cue:"Same as the chest press but angled up. Lower until your hands are just above chest level.",
      swaps:["Smith machine incline press","Incline dumbbell press","Machine chest press"]},
    {tag:"A2",id:"row",name:"Seated cable row",sets:3,lo:8,hi:12,rest:60,
      cue:"Sit tall. Pull the handle to your stomach and squeeze your shoulder blades together, then let it go forward slowly.",
      swaps:["Chest-supported row machine","Single-arm dumbbell row","Machine row"]},
    {tag:"B1",id:"shoulder_press",name:"Machine shoulder press",sets:2,lo:8,hi:12,rest:60,
      cue:"Start with the handles around chin height. Press up without arching your lower back off the pad.",
      swaps:["Seated dumbbell shoulder press","Smith machine overhead press"]},
    Object.assign({tag:"B2"},LATERAL),
    {tag:"C",id:"curl",name:"Cable curl",sets:2,lo:10,hi:15,rest:45,
      cue:"Elbows stay at your sides. Curl up, squeeze, lower slowly.",
      swaps:["Dumbbell curl","Machine preacher curl","EZ-bar curl"]},
    Object.assign({tag:"Bonus",bonus:true},SHRUG)
  ]},
  L2:{name:"Lower 2",focus:"Hamstrings, glutes, quads, side delts",mins:"30–35",items:[
    {tag:"A",id:"rdl",name:"Dumbbell Romanian deadlift",sets:3,lo:6,hi:10,rest:90,
      cue:"Knees slightly bent. Push your hips back and slide the weights down your thighs until you feel a stretch in your hamstrings. Keep your back flat, then stand by driving your hips forward.",
      swaps:["Barbell Romanian deadlift","Smith machine Romanian deadlift","45° back extension"]},
    {tag:"B",id:"hack",name:"Hack squat",sets:3,lo:8,hi:12,rest:90,
      cue:"Feet in the middle of the platform. Go as deep as you can while your heels stay down and your lower back stays on the pad.",
      swaps:["Leg press","Smith machine squat","Goblet squat"]},
    {tag:"C1",id:"leg_curl_lying",name:"Lying leg curl",sets:2,lo:10,hi:15,rest:45,
      cue:"Hips stay pressed into the pad. Curl up, then lower slowly over 2–3 seconds.",
      swaps:["Seated leg curl","Single-leg curl"]},
    Object.assign({tag:"C2"},LATERAL,{sets:2}),
    {tag:"Bonus",bonus:true,id:"rear_delt",name:"Reverse pec deck",sets:2,lo:12,hi:20,rest:45,
      cue:"Face the pad, arms nearly straight. Sweep your arms back until they're in line with your body, then return slowly. This works the back of your shoulders.",
      swaps:["Cable rear-delt fly","Bent-over dumbbell rear-delt raise"]}
  ]}
};

// Common foods. Protein per portion, rounded, from USDA FoodData Central (FDC id) or the brand label.
const FOODS = [
  {name:"Chicken breast", portion:"4 oz cooked", g:35},   // FDC 171477
  {name:"Whey protein", portion:"1 scoop", g:24},          // ON Gold Standard label (FDC 2463685); most brands 20–25
  {name:"Egg", portion:"1 large", g:6},                    // FDC 171287
  {name:"Greek yogurt", portion:"5.3 oz cup, plain", g:15},// FDC 170894
  {name:"Milk", portion:"1 cup", g:8},                     // FDC 171267 (2%); whole is the same
  {name:"Tuna", portion:"5 oz can, drained", g:20},        // FDC 334194; StarKist label
  {name:"Ground beef 90%", portion:"4 oz cooked", g:29},   // FDC 174031
  {name:"Premier Protein", portion:"11.5 oz shake", g:30}, // FDC 2622654
  {name:"Core Power", portion:"14 oz bottle", g:26},       // FDC 2663963
  {name:"Deli turkey", portion:"2 oz", g:12},              // FDC 174572; labels 10–14
  {name:"String cheese", portion:"1 stick", g:7},          // FDC 171244
  {name:"Cottage cheese", portion:"½ cup", g:12},          // FDC 173417 (2%)
  {name:"Salmon", portion:"4 oz cooked", g:25},            // FDC 175168
  {name:"Beef jerky", portion:"1 oz", g:12},               // Jack Link's label (FDC 1852296); labels 9–16
  {name:"Peanut butter", portion:"2 tbsp", g:7},           // FDC 172470
  {name:"Black beans", portion:"½ cup cooked", g:8},       // FDC 173735
  {name:"Firm tofu", portion:"½ cup", g:11}                // store labels (FDC 2027663); varies by brand
];

// =====================================================================
// Storage: everything lives on this phone, in localStorage
// =====================================================================
const KEY = "rr.v1", DKEY = "rr.draft", UIKEY = "rr.ui";
function blank(){ return {v:1, sessions:[], checkins:[], protein:{}, foods:[], myFoods:[], usage:{}, water:{}, cardio:[], badges:{}, bestStreak:0,
  settings:{bodyweight:null, sound:true, waterGoal:null, pushSub:null}, lastBackup:null}; }
function lsGet(k){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }catch(e){ return null; } }
function lsSet(k,v){ try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
let DB = (function(){
  const d = lsGet(KEY), b = blank();
  if(!d || d.v!==1) return b;
  const out = Object.assign(b, d, {settings:Object.assign(b.settings, d.settings||{})});
  ["sessions","checkins","foods","myFoods","cardio"].forEach(k=>{ if(!Array.isArray(out[k])) out[k] = []; });
  ["usage","protein","water","badges"].forEach(k=>{ if(!out[k] || typeof out[k]!=="object" || Array.isArray(out[k])) out[k] = {}; });
  out.sessions.sort((a,b)=>b.at-a.at); out.checkins.sort((a,b)=>b.at-a.at);   // newest first, everywhere
  return out;
})();
let askedPersist = false;
function persist(){
  DB.sessions.sort((a,b)=>b.at-a.at);
  DB.checkins.sort((a,b)=>b.at-a.at);
  if(!lsSet(KEY, DB)){ toast("Couldn't save on this phone. Export a backup from Progress."); return false; }
  if(!askedPersist){ askedPersist = true; try{ navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(()=>{}); }catch(e){} }
  return true;
}
const UI = Object.assign({tab:"train", skipInstall:false}, lsGet(UIKEY)||{});
if(!["train","protein","water","progress"].includes(UI.tab)) UI.tab = "train";
function saveUI(){ lsSet(UIKEY, UI); }

// A workout in progress survives the app being closed.
let draft = lsGet(DKEY);
if(draft && (!draft.startedAt || Date.now() - draft.startedAt > 5*3600e3 || !PLAN[draft.workout])){ draft = null; lsSet(DKEY,null); }
function saveDraft(){ lsSet(DKEY, draft); }

const S = {chosen:null, sheet:null, edit:null, confirm:null, error:null, finish:null, typing:null, showAll:false, guideTab:"plan"};

// =====================================================================
// Helpers
// =====================================================================
const $ = (s,el=document)=>el.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate = ms => new Date(ms).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
const dayKey = (d=new Date()) => { const x = new Date(d); return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0"); };
const num = v => { if(v==null) return null; const n = parseFloat(String(v).replace(",",".")); return isFinite(n) ? n : null; };
const r1 = n => Math.round(n*10)/10;
const plural = (n, w) => n+" "+w+(n===1?"":"s");
const isStandalone = () => window.navigator.standalone === true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);
const short = n => { const x = n.replace(/^(Machine|Dumbbell|Cable|Seated|Lying|Standing|Smith machine) /,"").replace(/\s*\(.*\)$/,""); return x.charAt(0).toUpperCase()+x.slice(1); };

const CITE = {};
$("#why-src").content.querySelectorAll("#sources > li").forEach((li,i)=>{ CITE[li.id] = i+1; });
function numberCites(root){
  root.querySelectorAll("a.cite").forEach(a=>{ const n = CITE[a.getAttribute("href").slice(1)] || "?"; a.textContent = n; a.setAttribute("aria-label","Source "+n); });
}

let toastT = null;
function toast(msg, action){
  let t = $(".toast"); if(!t){ t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); document.body.appendChild(t); }
  t.innerHTML = "<span></span>"; t.firstChild.textContent = msg;
  if(action){ const b = document.createElement("button"); b.textContent = action.label; b.onclick = ()=>{ t.remove(); action.fn(); }; t.appendChild(b); }
  clearTimeout(toastT); toastT = setTimeout(()=>t.remove(), action ? 5000 : 3000);
}

// =====================================================================
// Workout engine
// =====================================================================
function itemOf(W, id){ return W.items.find(x=>x.id===id); }
// Exercises tagged A1/A2 (same letter, a digit) are a pair: their sets alternate.
function groupsOf(W){
  const groups = [];
  for(const it of W.items.filter(x=>!x.bonus)){
    const m = /^([A-Z])(\d)$/.exec(it.tag);
    const g = m && groups.find(x=>x.letter===m[1]);
    if(g) g.items.push(it); else groups.push({letter: m ? m[1] : it.tag, items:[it]});
  }
  return groups;
}
function partnerOf(W, id){ const g = groupsOf(W).find(x=>x.items.some(i=>i.id===id)); return g && g.items.length>1 ? g.items.find(i=>i.id!==id) : null; }
function seqOf(W, withBonus){
  const seq = [];
  for(const g of groupsOf(W)){
    const max = Math.max(...g.items.map(x=>x.sets));
    for(let i=0;i<max;i++) for(const it of g.items) if(i<it.sets) seq.push({ex:it.id, i});
  }
  if(withBonus) W.items.filter(x=>x.bonus).forEach(it=>{ for(let i=0;i<it.sets;i++) seq.push({ex:it.id, i}); });
  return seq;
}
function entry(item){
  if(!draft.entries[item.id]) draft.entries[item.id] = {variant:item.name, sets:Array.from({length:item.sets},()=>({w:null, r:null, done:false}))};
  return draft.entries[item.id];
}
function normalizeDraft(){
  draft.entries = draft.entries || {};
  Object.values(draft.entries).forEach(en=>{ en.sets = (en.sets||[]).map(s=>({w:num(s.w), r:s.r===""||s.r==null?null:parseInt(s.r,10), done:!!s.done})); });
  draft.skipped = draft.skipped || {};
  if(draft.cur===undefined){ draft.restEnd = null; draft.cur = nextCur(); }
}
function nextCur(){
  const W = PLAN[draft.workout];
  for(const st of seqOf(W, draft.bonus===true)){
    if(draft.skipped[st.ex]) continue;
    const en = draft.entries[st.ex];
    if(!en || !en.sets[st.i] || !en.sets[st.i].done) return st;
  }
  return null;
}
function lastFor(exId, variant){
  for(const s of DB.sessions){
    const e = (s.entries||[]).find(x=>x.ex===exId && x.variant===variant);
    if(e && e.sets && e.sets.length) return {at:s.at, sets:e.sets};
  }
  return null;
}
function allTop(item, sets){ return sets.length >= item.sets && sets.slice(0,item.sets).every(s=>s.r >= item.hi); }
// What to show (and log on one tap) for a set: what you typed, else last time's numbers, else this session's previous set.
function vals(item, i){
  const en = entry(item), s = en.sets[i];
  const last = lastFor(item.id, en.variant);
  let w = s.w, r = s.r, note = "";
  if(last){
    const ls = last.sets[i] || last.sets[last.sets.length-1];
    if(allTop(item, last.sets)){
      if(w==null) w = ls.w + 5;
      if(r==null) r = item.lo;
      note = "You hit "+item.hi+" on every set last time. Up 5 lb today.";
    } else {
      if(w==null) w = ls.w;
      if(r==null) r = ls.r;
      note = "Last time "+ls.w+" × "+ls.r+" on this set. Beat it.";
    }
  } else {
    const prev = en.sets.slice(0,i).reverse().find(x=>x.done);
    if(prev){ if(w==null) w = prev.w; if(r==null) r = prev.r; note = "Aim for "+item.lo+"–"+item.hi+" reps with 1–2 left in the tank."; }
    else { if(r==null) r = item.lo; note = "First time: pick a weight you can lift "+item.lo+"–"+item.hi+" times with 1–2 reps left in the tank."; }
  }
  return {w, r, note};
}
function weekStart(){ const d = new Date(); d.setHours(0,0,0,0); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return d.getTime(); }
function weekCount(){ const ws = weekStart(); return DB.sessions.filter(s=>s.at>=ws).length; }
function nextWorkout(){
  const last = DB.sessions[0];
  if(!last) return "U1";
  return ROT[(ROT.indexOf(last.workout)+1) % ROT.length] || "U1";
}
function topSet(sets){ return sets.reduce((a,b)=> (b.w>a.w || (b.w===a.w && b.r>a.r)) ? b : a); }

// ---------- streak: weeks in a row with 3+ workouts ----------
// Weekly, not daily, because the plan is 3–4 days a week. One free pass per 6 weeks covers an exam or
// sick week: broken streaks make people quit, especially when they blame themselves (Silverman & Barasch 2023).
const STREAK_MIN = 3;
function weekKeyOf(ts){ const d = new Date(ts); d.setHours(0,0,0,0); d.setDate(d.getDate() - ((d.getDay()+6)%7)); return d.getTime(); }
function prevWeek(k){ const d = new Date(k); d.setDate(d.getDate()-7); return d.getTime(); }
function streakInfo(){
  const counts = {};
  DB.sessions.forEach(s=>{ const k = weekKeyOf(s.at); counts[k] = (counts[k]||0)+1; });
  const thisWeek = weekKeyOf(Date.now()), cur = counts[thisWeek]||0;
  const oldest = DB.sessions.length ? weekKeyOf(Math.min(...DB.sessions.map(s=>s.at))) : thisWeek;
  let n = 0, w = prevWeek(thisWeek), i = 0, lastPass = -99, passLastWeek = false;
  while(w >= oldest){
    if((counts[w]||0) >= STREAK_MIN) n++;
    else if(i - lastPass >= 6 && (counts[prevWeek(w)]||0) >= STREAK_MIN){ lastPass = i; if(i===0) passLastWeek = true; }
    else break;
    w = prevWeek(w); i++;
  }
  const total = n + (cur >= STREAK_MIN ? 1 : 0), need = Math.max(0, STREAK_MIN - cur);
  let text;
  if(cur >= STREAK_MIN) text = total+"-week streak";
  else if(n > 0) text = n+"-week streak · "+need+" more this week keeps it";
  else text = need===STREAK_MIN ? "3 workouts this week starts a streak" : need+" more this week starts a streak";
  return {total, n, cur, need, text, passLastWeek};
}

// ---------- badges: a few real milestones, nothing for just opening the app ----------
const BADGES = [
  {id:"first", name:"First workout", how:"Finish your first workout", test:()=>DB.sessions.length>=1},
  {id:"loop", name:"Full loop", how:"Do all four workouts", test:()=>ROT.every(k=>DB.sessions.some(s=>s.workout===k))},
  {id:"best", name:"New best", how:"Beat a lift you've done before", test:()=>anyBest()},
  {id:"w10", name:"10 workouts", how:"Finish 10 workouts", test:()=>DB.sessions.length>=10},
  {id:"under40", name:"In and out", how:"Finish 10 workouts in 40 minutes or less", test:()=>DB.sessions.filter(s=>s.minutes && s.minutes<=40).length>=10},
  {id:"streak4", name:"4-week streak", how:"3+ workouts a week, 4 weeks in a row", test:()=>(DB.bestStreak||0)>=4},
  {id:"protein", name:"Protein week", how:"Hit your protein minimum 5 days in one week", test:()=>proteinWeek()},
  {id:"w25", name:"25 workouts", how:"Finish 25 workouts", test:()=>DB.sessions.length>=25},
  {id:"plus25", name:"+25 lb", how:"Add 25 lb to any lift since your first time", test:()=>Object.values(seriesByVariant()).some(a=>Math.max(...a.map(x=>x.w)) - a[0].w >= 25)},
  {id:"streak12", name:"12-week streak", how:"3+ workouts a week, 12 weeks in a row", test:()=>(DB.bestStreak||0)>=12},
  {id:"w50", name:"50 workouts", how:"Finish 50 workouts", test:()=>DB.sessions.length>=50}
];
function anyBest(){
  return Object.values(seriesByVariant()).some(a=>{ let m = a[0]; for(let i=1;i<a.length;i++){ const x = a[i]; if(x.w>m.w || (x.w===m.w && x.r>m.r)) return true; } return false; });
}
function proteinWeek(){
  const t = target(); if(!t) return false;
  const wk = {};
  Object.keys(DB.protein).forEach(k=>{ if(dayTotal(k) >= t.min){ const [y,m,d] = k.split("-").map(Number); const key = weekKeyOf(new Date(y,m-1,d).getTime()); wk[key] = (wk[key]||0)+1; } });
  return Object.values(wk).some(n=>n>=5);
}
// Awards any badges just earned and returns them. Called after workouts and protein logs, and once at start.
function checkBadges(){
  const s = streakInfo().total;
  let changed = false;
  if(s > (DB.bestStreak||0)){ DB.bestStreak = s; changed = true; }
  const fresh = [];
  BADGES.forEach(b=>{ if(!DB.badges[b.id] && b.test()){ DB.badges[b.id] = Date.now(); fresh.push(b); } });
  if(fresh.length || changed) persist();
  return fresh;
}
function lifted(entries){ return Math.round(entries.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+(s.w||0)*(s.r||0),0),0)); }
function heavyThing(lb){ return lb>=12000 ? "an elephant" : lb>=5500 ? "a pickup truck" : lb>=4000 ? "a car" : lb>=1000 ? "a horse" : ""; }
const FLAME = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2c1 3.5-1.5 5-1.5 7.5 0 1.4 1 2.5 2.3 2.5 1.6 0 2.4-1.5 2-3.3 2.4 1.6 4.2 4.3 4.2 7.3A7 7 0 0 1 12 23a7 7 0 0 1-7-7c0-4.7 3.6-7.4 5.2-10 .7-1.2 1.3-2.5 1.8-4z"/></svg>';

function startWorkout(){
  const key = S.chosen || nextWorkout();
  draft = {workout:key, startedAt:Date.now(), restEnd:null, restFor:0, entries:{}, skipped:{}, last:null};
  draft.cur = nextCur();
  saveDraft(); audio(); requestWake(); startTicker();
  S.chosen = null; S.finish = null;
}
function curItem(){ return draft && draft.cur ? itemOf(PLAN[draft.workout], draft.cur.ex) : null; }
function logSet(){
  const item = curItem(); if(!item) return;
  const i = draft.cur.i, v = vals(item, i);
  if(v.w==null){ S.typing = "w"; render(); focusTyping(); toast("Enter the weight first (0 for bodyweight)."); return; }
  const s = entry(item).sets[i];
  s.w = v.w; s.r = v.r; s.done = true;
  draft.last = {ex:item.id, i};
  draft.cur = nextCur();
  if(draft.cur){ draft.restEnd = Date.now() + item.rest*1000; draft.restFor = item.rest; scheduleBeep(item.rest); }
  else { draft.restEnd = null; cancelBeep(); }
  requestWake(); saveDraft(); render();
}
function undoLast(){
  if(!draft || !draft.last) return;
  const s = draft.entries[draft.last.ex].sets[draft.last.i];
  s.done = false;
  draft.cur = draft.last; draft.last = null; draft.restEnd = null; cancelBeep();
  saveDraft(); render();
}
function adjust(k, d){
  const item = curItem(); if(!item) return;
  const s = entry(item).sets[draft.cur.i], v = vals(item, draft.cur.i);
  if(k==="w"){ if(v.w==null){ S.typing = "w"; render(); focusTyping(); return; } s.w = Math.max(0, r1(v.w + d)); s.r = v.r; }
  else { s.r = Math.max(0, (v.r||0) + d); s.w = v.w; }
  saveDraft(); render();
}
function endSession(){
  draft = null; lsSet(DKEY,null); S.confirm = null; S.typing = null;
  stopTicker(); cancelBeep();
  try{ wake && wake.release(); }catch(e){}
}
function finishWorkout(){
  if(!draft) return;
  const W = PLAN[draft.workout], entries = [];
  for(const item of W.items){
    const en = draft.entries[item.id]; if(!en) continue;
    const sets = en.sets.filter(s=>s.done).map(s=>({w:num(s.w)||0, r:s.r||0})).filter(s=>s.r>0);
    if(sets.length) entries.push({ex:item.id, variant:en.variant, sets});
  }
  if(!entries.length){ endSession(); render(); toast("Nothing logged, so nothing saved."); return; }
  const at = Date.now();
  const doc = {id:"s-"+at, at, workout:draft.workout, minutes:Math.max(1, Math.round((at-draft.startedAt)/60000)), entries};
  const summary = summarize(doc);
  DB.sessions.push(doc);
  if(!persist()){ DB.sessions = DB.sessions.filter(x=>x!==doc); toast("Couldn't save on this phone. Your sets are still here."); return; }
  endSession();
  summary.badges = checkBadges();
  summary.lifted = lifted(doc.entries);
  S.finish = summary;
  window.scrollTo(0,0); render();
}
function summarize(doc){
  const W = PLAN[doc.workout], bests = [], heavier = [], starts = [];
  for(const e of doc.entries){
    let prev = null;
    for(const s of DB.sessions){ const pe = (s.entries||[]).find(x=>x.ex===e.ex && x.variant===e.variant); if(pe && pe.sets.length){ const t = topSet(pe.sets); if(!prev || t.w>prev.w || (t.w===prev.w && t.r>prev.r)) prev = t; } }
    const top = topSet(e.sets);
    if(!prev) starts.push({name:e.variant, top});
    else if(top.w>prev.w) bests.push({name:e.variant, top, gain:"+"+r1(top.w-prev.w)+" lb"});
    else if(top.w===prev.w && top.r>prev.r) bests.push({name:e.variant, top, gain:"+"+plural(top.r-prev.r,"rep")});
    const item = itemOf(W, e.ex);
    if(item && allTop(item, e.sets)) heavier.push(e.variant);
  }
  const sets = doc.entries.reduce((a,e)=>a+e.sets.length,0);
  return {workout:doc.workout, minutes:doc.minutes, sets, bests, heavier, starts};
}

// =====================================================================
// Rest alert: a beep scheduled ahead on Web Audio, so it fires without another tap.
// "transient" mixes with the user's music; like all iPhone web audio it follows the silent switch.
// =====================================================================
const AUDIO_SESSION_TYPE = "transient";
let actx = null, beeps = [];
function audio(){
  try{
    if(!actx){ const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return null; actx = new AC(); }
    if(navigator.audioSession){ try{ navigator.audioSession.type = AUDIO_SESSION_TYPE; }catch(e){} }
    if(actx.state === "suspended" || actx.state === "interrupted") actx.resume();
    return actx;
  }catch(e){ return null; }
}
function scheduleBeep(secs){
  cancelBeep();
  if(!DB.settings.sound) return;
  const c = audio(); if(!c) return;
  const t0 = c.currentTime + Math.max(0.05, secs);
  [0, 0.28, 0.56].forEach(off=>{
    const o = c.createOscillator(), g = c.createGain();
    o.type = "sine"; o.frequency.value = off===0.56 ? 1175 : 880;
    g.gain.setValueAtTime(0.0001, t0+off);
    g.gain.exponentialRampToValueAtTime(0.5, t0+off+0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+off+0.2);
    o.connect(g); g.connect(c.destination);
    o.start(t0+off); o.stop(t0+off+0.22);
    beeps.push(o);
  });
}
function cancelBeep(){ beeps.forEach(o=>{ try{ o.stop(); }catch(e){} }); beeps = []; }

let wake = null;
async function requestWake(){ try{ if(navigator.wakeLock && !wake && document.visibilityState==="visible"){ wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release",()=>{ wake = null; }); } }catch(e){ wake = null; } }

// =====================================================================
// Rendering
// =====================================================================
const SHARE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg>';
function showInstall(){ return (isIOS && !isStandalone() && !UI.skipInstall) || /[?&]install\b/.test(location.search); }
function render(){
  const v = $("#view");
  const install = showInstall();
  document.body.classList.toggle("notabs", install);
  document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected", String(b.dataset.tab===UI.tab)));
  if(install) v.innerHTML = viewInstall();
  else if(UI.tab==="protein") v.innerHTML = viewProtein();
  else if(UI.tab==="water") v.innerHTML = viewWater();
  else if(UI.tab==="progress") v.innerHTML = viewProgress();
  else if(S.finish) v.innerHTML = viewFinish();
  else if(draft) v.innerHTML = viewSession();
  else v.innerHTML = viewHome();
  numberCites(v);
  tick();
  writeSwState();
}
// A small summary the service worker reads when a reminder arrives, so the notification can say what's next.
let lastSwState = "";
function writeSwState(){
  if(!("caches" in window)) return;
  const k = dayKey(), t = target(), si = streakInfo();
  const st = {next:PLAN[nextWorkout()].name, week:weekCount(), goal:WEEK_GOAL, streak: si.total ? si.total+"-week streak" : "",
    today: DB.sessions.some(s=>dayKey(s.at)===k), protein: Math.round(dayTotal(k)), proteinMin: t ? t.min : null};
  const json = JSON.stringify(st); if(json===lastSwState) return; lastSwState = json;
  caches.open("rotation-state").then(c=>c.put("./__state", new Response(json, {headers:{"content-type":"application/json"}}))).catch(()=>{});
}
function renderSafe(){
  const a = document.activeElement;
  if(a && $("#view").contains(a) && (a.tagName==="INPUT" || a.tagName==="TEXTAREA" || a.tagName==="SELECT")) return;
  render();
}
function weekDots(n){
  let h = '<div class="week">';
  for(let i=0;i<WEEK_GOAL;i++) h += '<span class="dot'+(i<n?" on":"")+'"></span>';
  return h + '<span>'+n+' of '+WEEK_GOAL+' this week</span></div>';
}

function viewInstall(){
  return '<section style="display:grid;gap:22px;padding-top:6vh">'+
    '<div style="display:grid;gap:10px"><div class="hero-num">40</div><h1>Lift for 40 minutes.<br>See it working.</h1><p class="sub">Four short workouts in a loop. It tells you what to lift, times your rest, and tracks your protein.</p></div>'+
    '<div class="install-steps">'+
      '<div class="stp"><em>1</em><span>Tap <span class="share">'+SHARE_SVG+'</span> Share in Safari</span></div>'+
      '<div class="stp"><em>2</em><span>Choose <b>Add to Home Screen</b></span></div>'+
      '<div class="stp"><em>3</em><span>Open Rotation from your Home Screen</span></div>'+
    '</div>'+
    '<p class="small muted">Your log is stored inside the installed app, separate from Safari, so install it before your first workout.</p>'+
    '<button class="link" data-act="skip-install">Use it in Safari anyway</button>'+
  '</section>';
}

function viewHome(){
  const key = S.chosen || nextWorkout(), W = PLAN[key], nxt = nextWorkout();
  const first = !DB.sessions.length, doneBefore = DB.sessions.some(s=>s.workout===key);
  let h = '<section style="display:grid;gap:18px">';
  h += '<div class="headrow">'+weekDots(weekCount())+'<button class="x" data-act="guide" aria-label="Guide: the plan and the research">?</button></div>';
  if(DB.sessions.length){ const si = streakInfo(); h += '<div class="streak'+(si.total?" on":"")+'">'+FLAME+'<span>'+esc(si.text)+(si.passLastWeek ? ' <span class="muted">(free pass used last week)</span>' : '')+'</span></div>'; }
  h += '<div><h1>'+esc(W.name)+'</h1><p class="sub">'+(first ? "Your first workout" : (doneBefore ? esc(W.focus) : "First time doing this one"))+' · about '+W.mins+' min</p>';
  if(key!==nxt) h += '<p class="small muted" style="margin-top:4px">The loop says '+PLAN[nxt].name+' is next.</p>';
  h += '</div><div class="list">';
  for(const it of W.items.filter(x=>!x.bonus)){
    const last = lastFor(it.id, it.name);
    h += '<div class="li"><span>'+esc(it.name)+'<small>'+plural(it.sets,"set")+' · '+it.lo+'–'+it.hi+' reps</small></span><span class="r">'+(last ? esc(topSet(last.sets).w)+' lb' : 'new')+'</span></div>';
  }
  const bonus = W.items.find(x=>x.bonus);
  h += '</div>';
  if(bonus) h += '<p class="small muted">Bonus if there\'s time: '+esc(bonus.name)+'</p>';
  if(first) h += '<div class="nudge">First time on a machine? Start light. The app learns your weights over your first couple of workouts.</div>';
  h += '<div class="cta"><button class="btn" data-act="start">Start workout</button><div class="row" style="justify-content:center;gap:4px"><button class="link" data-act="pick">Do a different workout</button><span class="muted">·</span><button class="link" data-act="cardio">Log cardio</button></div></div>';
  return h + '</section>';
}

function sessionTop(label){
  return '<div class="headrow"><button class="x" data-act="end" aria-label="End workout">✕</button>'+label+'<span class="clock" id="clk"></span></div><div class="bar40"><span id="b40"></span></div>';
}
function viewSession(){
  const W = PLAN[draft.workout], now = Date.now();
  if(draft.restEnd && draft.restEnd > now) return viewRest(W);
  const item = curItem();
  if(!item) return viewWrap(W);
  const mainItems = W.items.filter(x=>!x.bonus), idx = mainItems.indexOf(item);
  const en = entry(item), i = draft.cur.i, v = vals(item, i), partner = partnerOf(W, item.id);
  const mins = (now - draft.startedAt)/60000;
  let h = '<section style="display:grid;gap:16px">';
  h += sessionTop('<button class="chip" data-act="overview">'+esc(short(en.variant))+' · '+(idx>=0 ? (idx+1)+' of '+mainItems.length : 'bonus')+' ▾</button>');
  if(mins>=40) h += '<div class="warn"><span>40 minutes. That\'s a full workout.</span><button data-act="finish">Finish now</button></div>';
  else if(mins>=33 && !item.bonus) h += '<div class="warn"><span>About 7 minutes left. Skip the bonus today.</span></div>';
  h += '<div><h2>'+esc(en.variant)+'</h2>'+(partner ? '<p class="small muted" style="margin-top:2px">Paired with '+esc(short(entry(partner).variant))+'</p>' : '')+'</div>';
  h += '<div class="setchips">';
  en.sets.forEach((s,k)=>{
    const cls = s.done ? "done" : (k===i ? "cur" : "");
    h += '<button class="'+cls+'" data-act="goset" data-ex="'+item.id+'" data-i="'+k+'">'+(s.done ? esc(s.w)+' × '+esc(s.r) : 'Set '+(k+1))+'</button>';
  });
  h += '</div><div class="steppers">';
  h += '<div class="step"><span class="lab">lb · tap to type</span>'+(S.typing==="w"
      ? '<input class="val" id="typing" inputmode="decimal" value="'+esc(v.w==null?"":v.w)+'" aria-label="Weight in pounds">'
      : '<button class="val'+(v.w==null?" empty":"")+'" data-act="type" data-k="w" aria-label="Weight, tap to type">'+(v.w==null ? "tap" : esc(v.w))+'</button>')+
    '<div class="ctl"><button data-act="adj" data-k="w" data-d="-5" aria-label="5 pounds less">−5</button><button data-act="adj" data-k="w" data-d="5" aria-label="5 pounds more">+5</button></div></div>';
  h += '<div class="step"><span class="lab">reps</span>'+(S.typing==="r"
      ? '<input class="val" id="typing" inputmode="numeric" value="'+esc(v.r==null?"":v.r)+'" aria-label="Reps">'
      : '<button class="val" data-act="type" data-k="r" aria-label="Reps, tap to type">'+esc(v.r==null?"–":v.r)+'</button>')+
    '<div class="ctl"><button data-act="adj" data-k="r" data-d="-1" aria-label="One rep less">−</button><button data-act="adj" data-k="r" data-d="1" aria-label="One rep more">+</button></div></div>';
  h += '</div><p class="coach">'+esc(v.note)+'</p>';
  h += '<div class="cta"><button class="btn" data-act="log">✓  Log set '+(i+1)+' of '+en.sets.length+'</button><div class="minor"><button data-act="howto">How to</button><button data-act="swap">Machine taken?</button><button data-act="skip-ex">Skip</button></div></div>';
  return h + '</section>';
}
function viewRest(W){
  const nx = curItem(), en = nx && entry(nx), v = nx && vals(nx, draft.cur.i);
  const lastEn = draft.last && draft.entries[draft.last.ex], ls = lastEn && lastEn.sets[draft.last.i];
  const paired = draft.last && nx && partnerOf(W, draft.last.ex) && partnerOf(W, draft.last.ex).id===nx.id;
  let h = '<section style="display:grid;gap:16px">';
  h += sessionTop('<span class="chip">Resting</span>');
  if(ls) h += '<div class="undo"><span>Logged <b>'+esc(ls.w)+' × '+esc(ls.r)+'</b></span><button data-act="undo">Undo</button></div>';
  h += '<div class="ring"><svg viewBox="0 0 100 100"><circle class="track" cx="50" cy="50" r="45"/><circle class="prog" id="ringp" cx="50" cy="50" r="45" stroke-dasharray="282.74" stroke-dashoffset="0"/></svg><div class="t"><b id="ringt"></b></div></div>';
  if(nx) h += '<div class="card"><small>Up next'+(paired?" · paired":"")+'</small><b style="font-size:17px">'+esc(en.variant)+' · set '+(draft.cur.i+1)+'</b><span class="muted small">'+(v.w!=null ? esc(v.w)+' lb × '+esc(v.r) : 'First time on this one')+'</span></div>';
  h += '<div class="two"><button class="btn ghost sm" data-act="rest-add">+30 s</button><button class="btn ghost sm" data-act="rest-skip">Skip rest</button></div>';
  return h + '</section>';
}
function viewWrap(W){
  const bonus = W.items.find(x=>x.bonus), mins = Math.round((Date.now()-draft.startedAt)/60000);
  const offer = bonus && draft.bonus===undefined && !draft.skipped[bonus.id];
  let h = '<section style="display:grid;gap:18px">';
  h += sessionTop('<span class="chip">All sets done</span>');
  h += '<div><h1>Main work done</h1><p class="sub">'+mins+' minutes</p></div>';
  if(offer){
    h += '<div class="card"><small>Bonus · about 4 min</small><b style="font-size:17px">'+esc(bonus.name)+'</b><span class="muted small">'+plural(bonus.sets,"set")+' × '+bonus.lo+'–'+bonus.hi+' reps</span></div>';
    h += mins>=36 ? '<p class="small muted">You\'re close to 40 minutes. Finishing now is the plan working.</p>' : '';
    h += '<div class="cta"><button class="btn" data-act="finish">Finish workout</button><button class="btn ghost" data-act="bonus">Do the bonus</button></div>';
  } else {
    h += '<div class="cta"><button class="btn" data-act="finish">Finish workout</button></div>';
  }
  return h + '</section>';
}
function viewFinish(){
  const f = S.finish, t = target(), total = Math.round(dayTotal(dayKey()));
  let h = '<section style="display:grid;gap:18px">';
  h += '<div style="margin-top:8px"><p class="eyebrow">'+f.minutes+' min · '+plural(f.sets,"set")+'</p><h1>'+esc(PLAN[f.workout].name)+' done</h1>'+
    (f.lifted ? '<p class="sub">You moved <b class="num">'+f.lifted.toLocaleString()+' lb</b> today'+(heavyThing(f.lifted) ? ', about the weight of '+heavyThing(f.lifted) : '')+'.</p>' : '')+'</div>';
  h += weekDots(weekCount());
  const si = streakInfo();
  if(si.total) h += '<div class="streak on">'+FLAME+'<span>'+esc(si.text)+'</span></div>';
  if(f.badges && f.badges.length) f.badges.forEach(b=>{ h += '<div class="badge-new"><span class="medal">★</span><span><small>New badge</small><b>'+esc(b.name)+'</b></span></div>'; });
  if(f.bests.length){
    h += '<div><p class="sec">New bests</p>';
    f.bests.forEach(b=>{ h += '<div class="best"><span class="badge">↑</span><span>'+esc(b.name)+'<small>'+esc(b.top.w)+' × '+esc(b.top.r)+'</small></span><span class="up">'+esc(b.gain)+'</span></div>'; });
    h += '</div>';
  }
  if(f.starts.length){
    h += '<div><p class="sec">'+(f.bests.length ? "First time" : "Your starting numbers")+'</p>';
    f.starts.forEach(b=>{ h += '<div class="best"><span class="badge plain">•</span><span>'+esc(b.name)+'</span><span class="num muted">'+esc(b.top.w)+' × '+esc(b.top.r)+'</span></div>'; });
    h += '</div>';
  }
  if(!f.bests.length && !f.starts.length) h += '<p class="muted">Same numbers as last time. Holding steady on a rough day still counts. Beat one rep next time.</p>';
  if(f.heavier.length) h += '<div class="card"><small>Next time, go heavier on</small><b style="font-size:16px">'+esc(f.heavier.join(", "))+'</b><span class="muted small">You hit the top of the rep range on every set</span></div>';
  if(t) h += '<button class="nudge" data-tab="protein"><span>Protein today</span><b>'+total+' of '+t.min+' g ›</b></button>';
  const cardioToday = DB.cardio.filter(c=>dayKey(c.at)===dayKey());
  if(cardioToday.length) h += '<p class="small muted">Cardio today: '+cardioToday.map(c=>c.min+' min '+c.type.toLowerCase()).join(", ")+'.</p>';
  else h += '<button class="btn ghost sm" data-act="cardio">Biking after? Log cardio</button>';
  if(!DB.lastBackup || Date.now() - DB.lastBackup > 7*864e5)
    h += '<div class="card"><small>Back up your log</small><b style="font-size:16px">Last backup: '+(DB.lastBackup ? fmtDate(DB.lastBackup) : "never")+'</b><span class="muted small">Tap Save backup, then Save to Files → iCloud Drive. It keeps your log safe if something happens to your phone.</span><button class="btn ghost sm" style="margin-top:8px" data-act="export">Save backup</button></div>';
  h += '<div class="card"><small>Next time</small><b style="font-size:16px">'+esc(PLAN[nextWorkout()].name)+'</b><span class="muted small">'+esc(PLAN[nextWorkout()].focus)+'</span></div>';
  h += '<button class="btn" data-act="finish-done">Done</button>';
  return h + '</section>';
}

// ---------- protein ----------
function target(){
  let bw = num(DB.settings.bodyweight);
  if(!bw){ const c = DB.checkins.find(x=>x.weight); if(c) bw = c.weight; }
  if(!bw || bw < 60 || bw > 600) return null;
  return {bw, min:Math.round(bw*0.7), max:Math.round(bw*1.0)};
}
function dayTotal(k){ return (DB.protein[k]||[]).reduce((a,e)=>a+(e.g||0),0); }
function addProtein(g, label, key){
  g = r1(g); if(!(g>0)) return;
  const k = dayKey(), e = {t:Date.now(), g, label:String(label||"").slice(0,80)};
  (DB.protein[k] = DB.protein[k] || []).push(e);
  if(key){ const u = DB.usage[key] || {n:0, last:0}; u.n++; u.last = e.t; DB.usage[key] = u; }
  // Edge foods remember which meal you had them at, so the Edge list can show this meal's usuals first.
  const edgeOpen = S.sheet && S.sheet.kind==="edge";
  let bumped = null;
  if(key && key.startsWith("my:")){
    const f = DB.myFoods.find(x=>"my:"+x.id===key);
    if(isEdge(f)){ const m = edgeOpen ? S.sheet.meal : mealNow(); f.meals = f.meals || {}; f.meals[m] = (f.meals[m]||0)+1; bumped = {f, m}; }
  }
  if(edgeOpen){ S.sheet.added = (S.sheet.added||0) + g; refreshEdge(); }
  persist();
  const fresh = checkBadges();
  toast("Added "+Math.round(g)+" g"+(fresh.length ? " · New badge: "+fresh.map(b=>b.name).join(", ") : ""), {label:"Undo", fn:()=>{
    const list = DB.protein[k] || []; const ix = list.findIndex(x=>x.t===e.t);
    if(ix>=0) list.splice(ix,1);
    if(!list.length) delete DB.protein[k];
    if(key && DB.usage[key]) DB.usage[key].n = Math.max(0, DB.usage[key].n-1);
    if(bumped) bumped.f.meals[bumped.m] = Math.max(0, bumped.f.meals[bumped.m]-1);
    if(S.sheet && S.sheet.kind==="edge"){ S.sheet.added = Math.max(0, (S.sheet.added||0) - g); refreshEdge(); }
    persist(); render();
  }});
}
const isEdge = f => !!(f && f.where && /edge/i.test(f.where) && !(f.items && f.items.length));
const MEALS = [["breakfast","Breakfast"],["lunch","Lunch"],["dinner","Dinner"]];
function mealNow(){ const d = new Date(), m = d.getHours()*60 + d.getMinutes(); return m < 630 ? "breakfast" : m < 960 ? "lunch" : "dinner"; }
// Everything you can tap to log: your own foods and plates, scanned products, and common foods.
function foodRows(){
  const rows = [];
  DB.myFoods.forEach(f=>rows.push({key:"my:"+f.id, id:f.id, name:f.name, g:f.g, mine:true, plate:!!(f.items && f.items.length),
    sub: f.items && f.items.length ? f.items.map(x=>x.name).join(", ")+" · "+plural(f.items.length,"item") : [f.where || "Your food", f.portion].filter(Boolean).join(" · ")}));
  DB.foods.filter(f=>f.pServing!=null).forEach(f=>rows.push({key:"scan:"+f.code, code:f.code, name:f.name||"Scanned item", g:f.pServing, sub:(f.brand ? f.brand+" · " : "")+"scanned"}));
  FOODS.forEach(f=>rows.push({key:"common:"+f.name, name:f.name, g:f.g, sub:f.portion, common:true}));
  rows.forEach(r=>{ const u = DB.usage[r.key]; r.n = u ? u.n : 0; r.last = u ? u.last : 0; });
  return rows;
}
function foodRow(r, editable){
  return '<div class="food" style="grid-template-columns:48px 1fr auto auto"><span class="g">'+Math.round(r.g)+'</span><span>'+esc(r.name)+'<small>'+esc(r.sub)+'</small></span>'+
    (editable && r.mine ? '<button class="edit" data-act="editfood" data-id="'+esc(r.id)+'">Edit</button>' : '<span></span>')+
    '<button class="plus" data-log="'+esc(r.key)+'" aria-label="Add '+esc(r.name)+', '+Math.round(r.g)+' grams">+</button></div>';
}
function viewProtein(){
  const t = target(), k = dayKey(), total = Math.round(dayTotal(k)), list = DB.protein[k] || [];
  let h = '<section style="display:grid;gap:16px">';
  h += '<div><p class="eyebrow">Protein today</p><div class="headrow" style="align-items:flex-end"><div class="big">'+total+'<small>'+(t ? 'of '+t.min+' g' : 'g')+'</small></div><button class="link" style="text-decoration:none" data-act="todaylog">'+list.length+(list.length===1?" entry":" entries")+' ›</button></div></div>';
  if(t){
    const scale = Math.max(t.max, total) * 1.12;
    h += '<div class="meter" role="img" aria-label="'+total+' of '+t.min+' to '+t.max+' grams"><div class="f" style="width:'+Math.min(100,total/scale*100).toFixed(1)+'%"></div>'+
      '<div class="tick" style="left:'+(t.min/scale*100).toFixed(1)+'%"><span>'+t.min+'</span></div><div class="tick" style="left:'+(t.max/scale*100).toFixed(1)+'%"><span>'+t.max+'</span></div></div>';
  } else {
    h += '<form id="bw-form" class="row" style="flex-wrap:nowrap"><label class="field grow"><input id="bw-in" class="inp" inputmode="decimal" placeholder="Your bodyweight" aria-label="Your bodyweight in pounds"><i>lb</i></label><button class="btn sm" style="width:auto" type="submit">Set goal</button></form><p class="small muted">Your goal is 0.7–1 g of protein per pound of bodyweight.</p>';
  }
  h += '<div class="addrow"><button class="btn sm" data-act="edge">The Edge</button><button class="btn ghost sm" data-act="lookup">Search</button><button class="btn ghost sm" data-act="scan">Scan</button></div>';

  const rows = foodRows();
  const yours = rows.filter(r=>r.mine || r.n>0).sort((a,b)=> (b.n-a.n) || (b.last-a.last) || ((b.mine?1:0)-(a.mine?1:0)));
  if(!S.showAll){
    const top = yours.slice(0,6);
    if(top.length){ h += '<div><p class="sec">Your foods</p>'; top.forEach(r=>{ h += foodRow(r); }); h += '</div>'; }
    else { h += '<div><p class="sec">Common foods</p>'; rows.filter(r=>r.common).slice(0,6).forEach(r=>{ h += foodRow(r); }); h += '<p class="small muted" style="margin-top:6px">Foods you log or save move up here. Add your dining hall favorites with + Add food.</p></div>'; }
    h += '<div class="row" style="justify-content:center;gap:4px"><button class="link" data-act="showall">Show all foods</button><span class="muted">·</span><button class="link" data-act="plate">Make a plate</button></div>';
  } else {
    const mine = rows.filter(r=>r.mine || r.code);
    h += '<div><p class="sec"><span>Your foods and plates</span><button class="link" style="padding:0" data-act="showall">Done</button></p>';
    if(mine.length) mine.forEach(r=>{ h += foodRow(r, true); }); else h += '<p class="small muted">None yet. Use + Add food for dining hall items, or Make a plate for meals you repeat.</p>';
    h += '</div><div><p class="sec">Common foods</p>'; rows.filter(r=>r.common).forEach(r=>{ h += foodRow(r); });
    h += '<p class="small muted" style="margin-top:6px">Typical amounts. The label on your food beats these numbers.</p></div>';
    h += '<button class="link" data-act="plate">Make a plate</button>';
  }

  // last 7 days
  const days = [];
  for(let j=6;j>=0;j--){ const d = new Date(); d.setDate(d.getDate()-j); days.push({k:dayKey(d), d}); }
  const vs = days.map(x=>Math.round(dayTotal(x.k)));
  const top = Math.max(t ? t.max : 0, ...vs, 1) * 1.1;
  h += '<div><p class="sec">Last 7 days</p><div class="week7" style="margin-top:8px">';
  if(t) h += '<div class="goal" style="bottom:'+(18 + t.min/top*90).toFixed(0)+'px" aria-hidden="true"></div>';
  days.forEach((x,j)=>{ const val = vs[j]; h += '<div class="col"><span class="v">'+(val||"")+'</span><div class="b'+(t && val>=t.min ? " hit" : "")+'" style="height:'+Math.max(val?3:0, val/top*90).toFixed(0)+'px"></div><span class="d">'+x.d.toLocaleDateString(undefined,{weekday:"narrow"})+'</span></div>'; });
  h += '</div>'+(t ? '<p class="small muted">Red days hit your '+t.min+' g minimum (dashed line).</p>' : '')+'</div>';
  h += $("#protein-notes").innerHTML;
  return h + '</section>';
}

// ---------- water ----------
const WATER_PRESETS = [
  {oz:101, label:"About 101 oz", note:"National Academies guideline for men, from drinks"},
  {oz:74, label:"About 74 oz", note:"National Academies guideline for women, from drinks"}
];
function waterTotal(k){ return (DB.water[k]||[]).reduce((a,e)=>a+(e.oz||0),0); }
function addWater(oz){
  oz = r1(oz); if(!(oz>0)) return;
  const k = dayKey(), e = {t:Date.now(), oz};
  (DB.water[k] = DB.water[k] || []).push(e);
  persist(); render();
  toast("Added "+oz+" oz", {label:"Undo", fn:()=>{ const list = DB.water[k]||[]; const i = list.findIndex(x=>x.t===e.t); if(i>=0) list.splice(i,1); if(!list.length) delete DB.water[k]; persist(); render(); }});
}
function viewWater(){
  const goal = num(DB.settings.waterGoal), k = dayKey(), total = Math.round(waterTotal(k)), list = DB.water[k] || [];
  let h = '<section style="display:grid;gap:16px">';
  h += '<div><p class="eyebrow">Water today</p><div class="big">'+total+'<small>'+(goal ? 'of '+goal+' oz' : 'oz')+'</small></div></div>';
  if(goal){
    const scale = Math.max(goal, total) * 1.08;
    h += '<div class="meter" role="img" aria-label="'+total+' of '+goal+' ounces"><div class="f water" style="width:'+Math.min(100,total/scale*100).toFixed(1)+'%"></div><div class="tick" style="left:'+(goal/scale*100).toFixed(1)+'%"><span>'+goal+'</span></div></div>';
  } else {
    h += '<div class="panel"><p class="sec">Pick a daily goal</p>';
    WATER_PRESETS.forEach(p=>{ h += '<button class="opt" data-act="water-goal" data-oz="'+p.oz+'"><span>'+esc(p.label)+'<br><span class="small muted">'+esc(p.note)+'</span></span><b class="num">'+p.oz+' oz</b></button>'; });
    h += '<form id="wgoal-form" class="row" style="flex-wrap:nowrap"><label class="field grow"><input id="wg-oz" class="inp" inputmode="decimal" placeholder="Or your own goal"><i>oz</i></label><button class="btn ghost sm" style="width:auto" type="submit">Set</button></form></div>';
  }
  const bottle = num(DB.settings.bottleOz) || 20;
  h += '<div class="waters"><button class="btn sm" data-act="water" data-oz="'+bottle+'">+'+bottle+' oz<small>my bottle</small></button><button class="btn ghost sm" data-act="water" data-oz="8">+8 oz<small>glass</small></button><button class="btn ghost sm" data-act="water" data-oz="32">+32 oz<small>big bottle</small></button></div>';
  h += S.editBottle
    ? '<form id="bottle-form" class="row" style="flex-wrap:nowrap"><label class="field grow"><input id="bt-oz" class="inp" inputmode="decimal" value="'+bottle+'" aria-label="How much your bottle holds"><i>oz</i></label><button class="btn ghost sm" style="width:auto" type="submit">Save</button></form>'
    : '<button class="link" style="justify-self:start;padding:0" data-act="bottle-edit">My bottle holds '+bottle+' oz · Change</button>';
  h += '<form id="water-form" class="row" style="flex-wrap:nowrap"><label class="field grow"><input id="w-oz" class="inp" inputmode="decimal" placeholder="Other amount"><i>oz</i></label><button class="btn ghost sm" style="width:auto" type="submit">Add</button></form>';
  if(list.length){
    h += '<div><p class="sec">Today</p>';
    list.slice().reverse().forEach((e,ri)=>{ const i = list.length-1-ri; h += '<div class="entry"><span class="g">'+esc(e.oz)+' oz</span><span class="small muted">'+new Date(e.t).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})+'</span><button class="x" data-wrm="'+i+'" aria-label="Remove '+esc(e.oz)+' oz">×</button></div>'; });
    h += '</div>';
  }
  const days = [];
  for(let j=6;j>=0;j--){ const d = new Date(); d.setDate(d.getDate()-j); days.push({k:dayKey(d), d}); }
  const vs = days.map(x=>Math.round(waterTotal(x.k)));
  const top = Math.max(goal||0, ...vs, 1) * 1.1;
  h += '<div><p class="sec">Last 7 days</p><div class="week7" style="margin-top:8px">';
  if(goal) h += '<div class="goal" style="bottom:'+(18 + goal/top*90).toFixed(0)+'px" aria-hidden="true"></div>';
  days.forEach((x,j)=>{ const val = vs[j]; h += '<div class="col"><span class="v">'+(val||"")+'</span><div class="b'+(goal && val>=goal ? " hit water" : "")+'" style="height:'+Math.max(val?3:0, val/top*90).toFixed(0)+'px"></div><span class="d">'+x.d.toLocaleDateString(undefined,{weekday:"narrow"})+'</span></div>'; });
  h += '</div></div>';
  if(goal) h += '<button class="link" data-act="water-goal-reset">Change goal ('+goal+' oz)</button>';
  h += $("#water-notes").innerHTML;
  return h + '</section>';
}

// ---------- cardio ----------
const CARDIO_TYPES = ["Bike","Treadmill","Elliptical","Other"];
function sheetCardio(){
  const sh = S.sheet;
  let h = head("Log cardio", "Cancel");
  h += '<div class="seg" style="grid-template-columns:repeat(4,1fr)">'+CARDIO_TYPES.map(t=>'<button aria-pressed="'+(sh.type===t)+'" data-act="cardio-type" data-t="'+t+'">'+t+'</button>').join("")+'</div>';
  h += '<p class="sec">Minutes</p><div class="stepper"><button data-act="cardio-min" data-d="-5" aria-label="5 minutes less">−</button><output class="num" style="font-size:28px;font-weight:700">'+sh.min+'</output><button data-act="cardio-min" data-d="5" aria-label="5 minutes more">+</button></div>';
  h += '<button class="btn" data-act="cardio-save">Save '+sh.min+' min '+esc(sh.type.toLowerCase())+'</button>';
  h += '<p class="small muted">Do it after lifting, not before, so your lifts get your best effort. A 5-minute easy warm-up on the bike before lifting is fine.</p>';
  return h;
}

// ---------- check-in prompt: a baseline on first open, then every 4 weeks ----------
function checkinDue(){ const last = DB.checkins[0]; return !last || Date.now() - last.at > 27*864e5; }
function snoozeCheckin(){ const d = new Date(); d.setDate(d.getDate()+1); d.setHours(5,0,0,0); UI.ciSnooze = d.getTime(); saveUI(); }
function maybePromptCheckin(){
  if(showInstall() || draft || S.sheet || S.finish || !checkinDue()) return;
  if(UI.ciSnooze && Date.now() < UI.ciSnooze) return;
  openSheet("checkin", {baseline: !DB.checkins.length});
}
function sheetCheckin(){
  const sh = S.sheet, last = DB.checkins[0] || {};
  let h = '<div class="headrow"><h2>'+(sh.baseline ? "Your starting point" : "Monthly check-in")+'</h2><button class="link" style="text-decoration:none" data-act="close">Later</button></div>';
  h += '<p class="muted">'+(sh.baseline
    ? "Measure once now so in a month you can see what changed. Slow change is hard to spot in the mirror, but a tape measure catches it."
    : "It's been 4 weeks since your last one. Same tape, same spots. Last time's numbers are shown faintly in each box.")+'</p>';
  h += $("#checkin-help").innerHTML;
  const f = (k, label, unit) => '<label for="cs-'+k+'">'+label+'<span class="field"><input id="cs-'+k+'" class="inp" inputmode="decimal" placeholder="'+(last[k]!=null ? esc(last[k]) : "")+'"><i>'+unit+'</i></span></label>';
  h += '<form id="cs-form" style="display:grid;gap:12px"><div class="ci">'+f("weight","Bodyweight","lb")+f("waist","Waist at navel","in")+f("neck","Neck","in")+f("shoulders","Shoulders","in")+f("arm","Upper arm, flexed","in")+'</div>'+
    '<p class="small muted">No tape measure? Just enter your weight now and add the rest next time. Every box is optional.</p>'+
    '<button class="btn" type="submit">Save check-in</button></form>';
  h += '<p class="small muted">Not a good time? Tap Later and it comes back tomorrow morning, the best time to measure.</p>';
  return h;
}

// ---------- reminders (web push) ----------
const VAPID_PUBLIC = "BFPUvKQVWbxez_lPrl4iI93uml_Ig89SnC-KKq98cQqmgJ8wz2nVDPrkqg-Yijo4zmAWapQNbFcDpd_yl02uEog";
function b64ToU8(s){ const p = "=".repeat((4 - s.length % 4) % 4); const b = atob((s + p).replace(/-/g,"+").replace(/_/g,"/")); return Uint8Array.from(b, c=>c.charCodeAt(0)); }
function pushSupported(){ return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window; }
async function remindersOn(){
  if(!pushSupported()){ toast("Notifications need the installed app on iOS 16.4 or newer."); return; }
  if(isIOS && !isStandalone()){ toast("Open Rotation from your Home Screen first."); return; }
  try{
    const perm = await Notification.requestPermission();
    if(perm!=="granted"){ toast("Notifications are off for Rotation. Turn them on in Settings → Notifications → Rotation."); return; }
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if(!sub) sub = await reg.pushManager.subscribe({userVisibleOnly:true, applicationServerKey:b64ToU8(VAPID_PUBLIC)});
    DB.settings.pushSub = sub.toJSON(); persist(); render();
    toast("Reminders are on for this phone");
  }catch(e){ toast("Couldn't turn on reminders: "+(e && e.message ? e.message : "unknown error")); }
}
async function remindersOff(){
  try{ const reg = await navigator.serviceWorker.ready; const sub = await reg.pushManager.getSubscription(); if(sub) await sub.unsubscribe(); }catch(e){}
  DB.settings.pushSub = null; persist(); render(); toast("Reminders are off");
}
function remindersHtml(){
  let h = '<p class="sec" style="margin-top:6px">Workout reminders</p>';
  if(!pushSupported()) return h + '<p class="small muted">Reminders need the installed app on iOS 16.4 or newer.</p>';
  if(isIOS && !isStandalone()) return h + '<p class="small muted">Open Rotation from your Home Screen to turn on reminders.</p>';
  const on = DB.settings.pushSub && Notification.permission==="granted";
  if(!on) return h + '<p class="small muted">Mon, Tue, Thu and Fri around 2:40 pm, right after lunch. The reminder says which workout is next, and on days you already trained it checks your protein instead.</p><button class="btn sm" style="width:auto;justify-self:start" data-act="push-on">Turn on reminders</button>';
  return h + '<p class="small">On for this phone: Mon, Tue, Thu, Fri around 2:40 pm.</p>'+
    '<p class="small muted">One-time step: copy this phone\'s reminder code and paste it to Claude, which connects it to the reminder schedule. You only need to do it again if you turn reminders off and on.</p>'+
    '<div class="row"><button class="btn sm" style="width:auto" data-act="copy-push">Copy reminder code</button><button class="btn ghost sm" style="width:auto" data-act="push-off">Turn off</button></div>';
}

// ---------- progress ----------
function spark(vals){
  if(vals.length<2) return '<svg viewBox="0 0 112 34" aria-hidden="true"></svg>';
  const w=112,hgt=34,p=3,min=Math.min(...vals),max=Math.max(...vals),span=(max-min)||1;
  const pts = vals.map((v,i)=>[p+i*(w-2*p)/(vals.length-1), hgt-p-(v-min)*(hgt-2*p)/span]);
  const L = pts[pts.length-1];
  return '<svg viewBox="0 0 '+w+' '+hgt+'" aria-hidden="true"><polyline points="'+pts.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ")+'" fill="none" stroke="var(--muted)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+L[0].toFixed(1)+'" cy="'+L[1].toFixed(1)+'" r="3" fill="var(--accent)"/></svg>';
}
function seriesByVariant(){
  const series = {};
  for(const s of DB.sessions.slice().reverse()){
    for(const e of (s.entries||[])){
      if(!e.sets || !e.sets.length) continue;
      (series[e.variant] = series[e.variant] || []).push(Object.assign({at:s.at, sid:s.id}, topSet(e.sets)));
    }
  }
  return series;
}
function viewProgress(){
  let h = '<section style="display:grid;gap:22px"><h1>Progress</h1>';
  const avgMin = DB.sessions.length ? Math.round(DB.sessions.reduce((a,s)=>a+(s.minutes||0),0)/DB.sessions.length) : 0;
  h += '<div class="stats"><div class="stat"><b class="num">'+weekCount()+'</b><span>this week (goal '+WEEK_GOAL+')</span></div><div class="stat"><b class="num">'+DB.sessions.length+'</b><span>workouts total</span></div><div class="stat"><b class="num">'+(avgMin||"–")+'</b><span>average minutes</span></div></div>';

  const si = streakInfo();
  h += '<div class="panel"><div class="headrow"><p class="sec">Streak and badges</p><span class="small muted">best streak: '+plural(DB.bestStreak||0,"week")+'</span></div>';
  h += '<div class="streak'+(si.total?" on":"")+'">'+FLAME+'<span>'+esc(si.text)+'</span></div><div class="badges">';
  BADGES.forEach(b=>{ const got = DB.badges[b.id]; h += '<div class="bdg'+(got?" got":"")+'"><span class="medal">'+(got?"★":"☆")+'</span><span><b>'+esc(b.name)+'</b><small>'+(got ? "Earned "+fmtDate(got) : esc(b.how))+'</small></span></div>'; });
  h += '</div></div>';

  const series = seriesByVariant(), names = Object.keys(series);
  h += '<div class="panel"><p class="sec">Strength</p>';
  if(!names.length) h += '<p class="muted">Finish your first workout and each exercise shows up here with its trend. Rising numbers are the earliest sign you\'re building muscle, weeks before the mirror shows it.</p>';
  else {
    h += '<div>';
    for(const n of names){
      const arr = series[n], f = arr[0], l = arr[arr.length-1], diff = r1(l.w - f.w);
      h += '<button class="prog" data-exhist="'+esc(n)+'"><span class="nm">'+esc(n)+'</span>'+spark(arr.slice(-12).map(x=>x.w))+'<span class="ch">'+(arr.length===1 ? esc(f.w)+'×'+esc(f.r)+' · first workout' : esc(f.w)+'×'+esc(f.r)+' → '+esc(l.w)+'×'+esc(l.r)+(diff>0?' <b>+'+diff+' lb</b>':''))+'</span></button>';
    }
    h += '</div>';
  }
  h += '</div>';

  const ws = weekStart(), cw = DB.cardio.filter(c=>c.at>=ws);
  h += '<div class="panel"><div class="headrow"><p class="sec">Cardio</p><button class="link" style="padding:0" data-act="cardio">+ Log cardio</button></div>';
  h += '<p class="small">This week: <b class="num">'+cw.reduce((a,c)=>a+c.min,0)+' min</b> in '+plural(cw.length,"session")+'</p>';
  DB.cardio.slice().sort((a,b)=>b.at-a.at).slice(0,5).forEach(c=>{ h += '<div class="entry"><span class="g">'+c.min+' min</span><span>'+esc(c.type)+' <span class="small muted">'+fmtDate(c.at)+'</span></span><button class="x" data-crm="'+esc(c.id)+'" aria-label="Delete this cardio entry">×</button></div>'; });
  h += '</div>';

  h += '<div class="panel"><p class="sec">History</p>';
  if(!DB.sessions.length) h += '<p class="muted">Saved workouts appear here. Tap one to fix a number.</p>';
  else { h += '<div>'; for(const s of DB.sessions.slice(0,60)){ const sets = (s.entries||[]).reduce((a,e)=>a+(e.sets?e.sets.length:0),0); h += '<button class="hist" data-edit="'+esc(s.id)+'"><span><b>'+esc((PLAN[s.workout]||{name:s.workout}).name)+'</b> <span class="muted small">· '+plural(sets,"set")+' · '+(s.minutes||"?")+' min</span></span><span class="chev" aria-hidden="true">›</span><span class="when">'+fmtDate(s.at)+'</span></button>'; } h += '</div>'; }
  h += '</div>';

  const lastCi = DB.checkins[0], due = !lastCi || Date.now() - lastCi.at > 27*864e5;
  h += '<div class="panel"><details'+(due && DB.sessions.length ? " open" : "")+'><summary>Monthly check-in'+(due ? ' · due' : ' · next '+fmtDate(lastCi.at+28*864e5))+'</summary><div style="display:grid;gap:12px;margin-top:12px">'+$("#checkin-help").innerHTML+
    '<form id="ci-form" style="display:grid;gap:12px"><div class="ci">'+
    '<label for="ci-weight">Bodyweight (lb)<input id="ci-weight" class="inp" inputmode="decimal"></label>'+
    '<label for="ci-waist">Waist at navel (in)<input id="ci-waist" class="inp" inputmode="decimal"></label>'+
    '<label for="ci-neck">Neck (in)<input id="ci-neck" class="inp" inputmode="decimal"></label>'+
    '<label for="ci-shoulders">Shoulders (in)<input id="ci-shoulders" class="inp" inputmode="decimal"></label>'+
    '<label for="ci-arm">Upper arm, flexed (in)<input id="ci-arm" class="inp" inputmode="decimal"></label>'+
    '</div><button class="btn sm" type="submit">Save check-in</button></form>';
  if(DB.checkins.length){
    const cols = [["weight","Weight"],["waist","Waist"],["neck","Neck"],["shoulders","Shoulders"],["arm","Arm"]];
    h += '<div class="tbl-wrap"><table><thead><tr><th>Date</th>'+cols.map(c=>'<th class="num">'+c[1]+'</th>').join("")+'<th></th></tr></thead><tbody>';
    for(const c of DB.checkins) h += '<tr><td>'+fmtDate(c.at)+'</td>'+cols.map(k=>'<td class="num">'+(c[k[0]]!=null?esc(c[k[0]]):"–")+'</td>').join("")+'<td><button class="link" style="padding:0" data-delci="'+esc(c.id)+'" aria-label="Delete this check-in">×</button></td></tr>';
    if(DB.checkins.length>1){
      const a = DB.checkins[DB.checkins.length-1], b = DB.checkins[0];
      h += '<tr><td><b>Change</b></td>'+cols.map(k=>{ const x=a[k[0]], y=b[k[0]]; if(x==null||y==null) return '<td class="num">–</td>'; const d=r1(y-x); return '<td class="num"><b>'+(d>0?"+":"")+d+'</b></td>'; }).join("")+'<td></td></tr>';
    }
    h += '</tbody></table></div>';
  }
  h += '</div></details></div>';

  const lb = DB.lastBackup ? fmtDate(DB.lastBackup) : "never";
  const stale = !DB.lastBackup || Date.now() - DB.lastBackup > 7*864e5;
  h += '<div class="panel"><p class="sec">Settings and backup</p>'+
    '<label class="switch" for="set-bw"><span>Bodyweight for your protein goal</span><span class="field" style="max-width:120px"><input id="set-bw" class="inp" inputmode="decimal" value="'+esc(DB.settings.bodyweight||"")+'" placeholder="150"><i>lb</i></span></label>'+
    '<label class="switch" for="set-sound"><span>Beep when rest is over<br><span class="small muted">The silent switch has to be on ring</span></span><input type="checkbox" id="set-sound"'+(DB.settings.sound?" checked":"")+'></label>'+
    '<button class="btn ghost sm" style="width:auto;justify-self:start" data-act="test-sound">Test the beep</button>'+
    '<label class="small muted" for="set-fdc">Your USDA food search key (optional). The shared key allows about 10 searches an hour; a free personal key allows 1,000. <a href="https://fdc.nal.usda.gov/api-key-signup" target="_blank" rel="noopener">Get one free</a>, then paste it here. It stays on this phone.</label>'+
    '<input id="set-fdc" class="inp" autocomplete="off" autocapitalize="off" spellcheck="false" value="'+esc(DB.settings.fdcKey||"")+'" placeholder="Paste your key">'+
    remindersHtml()+
    '<p class="sec" style="margin-top:6px">Backup</p>'+
    '<p class="small muted">Your log is stored only on this phone. Export a backup every couple of weeks so a lost or reset phone doesn\'t take it with it.</p>'+
    (stale && (DB.sessions.length || DB.checkins.length) ? '<p class="note err">Last backup: '+lb+'.</p>' : '<p class="small muted">Last backup: '+lb+'.</p>')+
    '<div class="row"><button class="btn sm" style="width:auto" data-act="export">Export backup</button><label class="btn ghost sm" style="width:auto" for="imp-file">Import</label><input id="imp-file" type="file" hidden><button class="btn ghost sm" style="width:auto" data-act="copy-backup">Copy as text</button></div>'+
    '<details><summary>Paste a backup instead (or your log from the claude.ai page)</summary><form id="paste-form" style="display:grid;gap:10px;margin-top:10px"><textarea id="paste-in" class="inp" rows="4" aria-label="Backup text" placeholder="Paste here"></textarea><button class="btn ghost sm" style="width:auto;justify-self:start" type="submit">Import pasted text</button></form></details>'+
    '<button class="link" style="justify-self:start;padding-left:0" data-act="guide">Open the guide: the plan and the research</button>'+
    '</div>';
  return h + '</section>';
}

// =====================================================================
// Sheets
// =====================================================================
function openSheet(kind, data){ S.sheet = Object.assign({kind}, data||{}); document.body.classList.add("locked"); renderSheet(); }
function closeSheet(){
  if(S.sheet && S.sheet.kind==="scan") parkCamera();
  if(S.sheet && S.sheet.kind==="checkin" && !S.sheet.saved) snoozeCheckin();
  S.sheet = null; S.edit = null; S.confirm = null;
  document.body.classList.remove("locked");
  $("#sheet-root").innerHTML = "";
}
function renderSheet(){
  const root = $("#sheet-root"), sh = S.sheet;
  if(!sh){ root.innerHTML = ""; return; }
  const fn = {overview:sheetOverview, end:sheetEnd, howto:sheetHowto, swap:sheetSwap, pick:sheetPick, guide:sheetGuide,
    addfood:sheetAddFood, plate:sheetPlate, editfood:sheetEditFood, todaylog:sheetTodayLog, edge:sheetEdge,
    lookup:sheetLookup, portion:sheetPortion, cardio:sheetCardio, checkin:sheetCheckin,
    edit:sheetEdit, exhist:()=>sheetExHist(sh.variant), scan:sheetScan, food:sheetFood}[sh.kind];
  const full = ["scan","guide","edge","lookup"].includes(sh.kind);
  root.innerHTML = '<div class="sheet" data-scrim="1"><div class="sheet-in'+(full?" full":"")+'" role="dialog" aria-modal="true">'+fn()+'</div></div>';
  numberCites(root);
  if(sh.kind==="scan") attachCamera();
}
const head = (title, btn) => '<div class="headrow"><h2>'+title+'</h2><button class="link" style="text-decoration:none" data-act="close">'+(btn||"Close")+'</button></div>';

function sheetOverview(){
  const W = PLAN[draft.workout];
  let h = head(esc(W.name));
  const items = W.items.filter(x=>!x.bonus || draft.bonus===true);
  items.forEach(it=>{
    const en = entry(it), done = en.sets.filter(s=>s.done).length, cur = draft.cur && draft.cur.ex===it.id;
    h += '<button class="ov'+(cur?" cur":"")+'" data-act="jump" data-ex="'+it.id+'"><span>'+esc(en.variant)+'<br><small>'+(draft.skipped[it.id] ? "skipped" : done+" of "+en.sets.length+" sets")+(it.bonus?" · bonus":"")+'</small></span><span class="dots">'+en.sets.map(s=>'<i class="'+(s.done?"on":"")+'"></i>').join("")+'</span></button>';
  });
  h += '<button class="btn ghost" data-act="end">Finish or end workout</button>';
  return h;
}
function sheetEnd(){
  const n = Object.values(draft.entries).reduce((a,en)=>a+en.sets.filter(s=>s.done).length,0);
  let h = head("End workout?", "Keep going");
  if(n){
    h += '<p class="muted">'+plural(n,"set")+' logged so far.</p><button class="btn" data-act="finish">Finish and save</button>';
  } else h += '<p class="muted">Nothing logged yet.</p>';
  if(S.confirm==="discard") h += '<div class="confirm"><b>Throw away this workout?</b><span class="small">Logged sets will be lost.</span><div class="two"><button class="btn sm" data-act="discard-yes">Discard</button><button class="btn ghost sm" data-act="cancel-confirm">Keep it</button></div></div>';
  else h += '<button class="btn danger" data-act="discard">Discard workout</button>';
  h += '<button class="btn ghost" data-act="close">Keep going</button>';
  return h;
}
function sheetHowto(){
  const it = curItem(), en = entry(it), last = lastFor(it.id, en.variant);
  return head(esc(en.variant))+'<p>'+esc(it.cue)+'</p><p class="small muted">'+plural(it.sets,"set")+' × '+it.lo+'–'+it.hi+' reps · rest '+it.rest+' s. End each set with 0–2 reps left in you. When you hit '+it.hi+' on every set, go up one pin next time.</p>'+
    (last ? '<p class="small muted">Last time ('+fmtDate(last.at)+'): '+last.sets.map(s=>esc(s.w)+'×'+esc(s.r)).join(", ")+'</p>' : '');
}
function sheetSwap(){
  const it = curItem(), en = entry(it);
  let h = head("Machine taken?")+'<p class="small muted">Pick what\'s free. Your numbers are tracked separately for each version.</p>';
  [it.name].concat(it.swaps).forEach(n=>{ h += '<button class="opt'+(n===en.variant?" on":"")+'" data-act="setvariant" data-name="'+esc(n)+'"><span>'+esc(n)+'</span><span class="muted small">'+(lastFor(it.id,n) ? "logged before" : "")+'</span></button>'; });
  return h;
}
function sheetPick(){
  const nxt = nextWorkout();
  let h = head("Pick a workout");
  ROT.forEach(k=>{ h += '<button class="opt'+(k===(S.chosen||nxt)?" on":"")+'" data-act="pickw" data-k="'+k+'"><span>'+esc(PLAN[k].name)+'<br><span class="small muted">'+esc(PLAN[k].focus)+'</span></span><span class="small muted">'+(k===nxt?"next up":"")+'</span></button>'; });
  return h + '<p class="small muted">Switching is fine when a machine you need is packed. The loop continues from whatever you do.</p>';
}
function sheetGuide(){
  let h = head("Guide", "Done");
  h += '<div class="seg"><button aria-pressed="'+(S.guideTab==="plan")+'" data-act="gtab" data-t="plan">The plan</button><button aria-pressed="'+(S.guideTab==="why")+'" data-act="gtab" data-t="why">Why it works</button></div>';
  return h + '<div class="guide">'+(S.guideTab==="plan" ? guidePlan() : $("#why-src").innerHTML)+'</div>';
}
function guidePlan(){
  let h = '<section class="guide-sec"><h2>How it works</h2><ul class="rules">'+
    '<li><b>Go 3–4 times a week and do the next workout in the loop:</b> Upper 1 → Lower 1 → Upper 2 → Lower 2 → repeat. No fixed days, so a missed day never breaks the plan.</li>'+
    '<li><b>About 35 minutes, hard cap at 40.</b> At 40, finish. That counts as a full workout. The bonus is the only thing you\'re allowed to skip.</li>'+
    '<li><b>Effort:</b> end each set with 0–2 more reps left in you. Going all the way to failure adds almost nothing and leaves you sorer for longer.</li>'+
    '<li><b>Getting stronger:</b> when you hit the top of the rep range on every set, go up one pin next time. The app fills that in for you.</li>'+
    '<li><b>Paired exercises</b> alternate automatically with short rests, which saves about 40% of the time. If the rec is packed, use Skip and come back, or swap machines.</li>'+
    '<li><b>Rest beep:</b> plays over your music, but only with the silent switch on ring. Keep the app open; the screen stays on.</li>'+
    '<li><b>Cardio:</b> ride the bike <i>after</i> lifting, not before. 20 minutes 3–4 times a week won\'t cost you muscle, and lifting first keeps your best effort for the weights. A 5-minute easy spin as a warm-up is fine. It\'s optional and doesn\'t count against the 40 minutes.</li>'+
    '</ul></section>';
  h += '<section class="guide-sec"><h2>When the rec is packed</h2><ul class="rules">'+
    '<li>Tap <b>Machine taken?</b> and pick a free swap. Don\'t wait more than about 2 minutes.</li>'+
    '<li>Asking "how many sets do you have left?" or "mind if I work in?" is normal gym etiquette.</li>'+
    '<li>College recs are usually busiest late afternoon into the evening. Early mornings and early afternoons are quieter.</li>'+
    '</ul></section>';
  h += '<section class="guide-sec"><h2>The four workouts</h2>';
  for(const k of ROT){
    const W = PLAN[k];
    h += '<div class="wk"><h3 style="margin-top:6px">'+esc(W.name)+'</h3>';
    for(const it of W.items) h += '<div class="wk-row"><span class="t">'+esc(it.bonus?"+":it.tag)+'</span><span>'+esc(it.name)+(it.bonus?' <span class="muted small">(bonus)</span>':'')+'</span><span class="d">'+it.sets+'×'+it.lo+'–'+it.hi+'</span></div>';
    h += '</div>';
  }
  h += '</section>';
  return h + $("#plan-extra").innerHTML;
}

// ---------- foods ----------
function sheetAddFood(){
  const sh = S.sheet;
  return head("Add food", "Cancel")+
    '<form id="addfood-form" style="display:grid;gap:12px">'+
    '<label class="small muted" for="af-name">Name</label><input id="af-name" class="inp" placeholder="e.g. Al pastor pork loin" value="'+esc(sh.name||"")+'">'+
    '<label class="small muted" for="af-g">Protein per serving</label><label class="field"><input id="af-g" class="inp" inputmode="decimal" placeholder="e.g. 15" value="'+esc(sh.g||"")+'"><i>g</i></label>'+
    '<label class="small muted" for="af-where">Where it\'s from (optional)</label><input id="af-where" class="inp" placeholder="e.g. The Edge" value="'+esc(sh.where==null?"The Edge":sh.where)+'">'+
    '<button class="btn" type="submit">Save to your foods and add</button>'+
    '<button class="btn ghost" type="button" data-act="af-once">Just add it once</button>'+
    '</form><p class="small muted">For dining hall dishes, the Edge button is faster: search, and add new dishes right there. Scanning works for packaged food.</p>';
}
// The Edge: your saved Edge dishes, this meal's usuals first, with search and add-as-you-go.
// (Auburn's menu feed is locked to their own site and their terms forbid copying it, so the list is built from what you log.)
function edgeListHtml(){
  const sh = S.sheet, q = (sh.q||"").trim().toLowerCase(), meal = sh.meal;
  const label = MEALS.find(x=>x[0]===meal)[1].toLowerCase();
  const all = DB.myFoods.filter(isEdge);
  const had = f => (f.meals && f.meals[meal]) || 0;
  let foods = q ? all.filter(f=>f.name.toLowerCase().includes(q)) : all.slice();
  foods.sort((a,b)=> (had(b)-had(a)) || a.name.localeCompare(b.name));
  const row = f => '<div class="food" style="grid-template-columns:48px 1fr auto auto"><span class="g">'+Math.round(f.g)+'</span><span>'+esc(f.name)+'<small>'+(had(f) ? "had at "+label+" "+plural(had(f),"time") : "The Edge")+'</small></span><span></span><button class="plus" data-log="my:'+esc(f.id)+'" aria-label="Add '+esc(f.name)+', '+Math.round(f.g)+' grams">+</button></div>';
  let h = "";
  const usual = foods.filter(f=>had(f)>0), rest = foods.filter(f=>!had(f));
  if(!q && usual.length){
    h += '<p class="sec">Your '+label+' usuals</p>' + usual.map(row).join("");
    if(rest.length) h += '<p class="sec" style="margin-top:14px">Other Edge dishes</p>' + rest.map(row).join("");
  } else h += foods.map(row).join("");
  if(q && !all.some(f=>f.name.toLowerCase()===q)){
    h += '<form id="edge-add-form" class="card" style="gap:8px;margin-top:10px"><small>Not in your list yet</small><b style="font-size:16px">Add "'+esc(sh.q.trim())+'"</b>'+
      '<div class="row" style="flex-wrap:nowrap"><label class="field grow"><input id="ea-g" class="inp" inputmode="decimal" placeholder="Protein, from the dining site" aria-label="Protein in grams"><i>g</i></label><button class="btn sm" style="width:auto" type="submit">Add</button></div>'+
      '<span class="small muted">On Auburn\'s dining site, tap the dish to see its protein. You only do this once per dish.</span></form>';
  }
  if(!all.length && !q) h += '<p class="muted">No Edge dishes yet. Type what you\'re eating above, like "turkey burger", and add its protein from Auburn\'s dining site. The Edge repeats its menu, so within a cycle or two most of what you eat will be here for one tap.</p>';
  return h;
}
// ---------- food search (USDA FoodData Central: packaged foods, generic foods, and some restaurant chains) ----------
const FDC = "https://api.nal.usda.gov/fdc/v1/";
function fdcKey(){ return (DB.settings.fdcKey||"").trim() || "DEMO_KEY"; }
const titleCase = s => String(s||"").toLowerCase().replace(/(^|[\s\-'(])([a-z])/g, (m,a,b)=>a+b.toUpperCase());
const cap = s => { s = String(s||""); return s.charAt(0).toUpperCase()+s.slice(1); };
function parseHit(f){
  const pn = (f.foodNutrients||[]).find(n=>n.nutrientId===1003 || n.nutrientNumber==="203");
  const p100 = pn && num(pn.value)!=null ? r1(num(pn.value)) : null;
  let name = String(f.description||""), where = "", src = "USDA";
  const chain = /^([A-Z0-9'&.\- ]{3,}),\s*(.+)$/.exec(name);
  if(f.dataType==="Branded"){ name = titleCase(name); where = titleCase(f.brandName || f.brandOwner || ""); src = "package label"; }
  else if(chain && chain[1]===chain[1].toUpperCase() && /[A-Z]/.test(chain[1])){ where = titleCase(chain[1]); name = cap(chain[2]); src = "USDA, restaurant data"; }
  else { name = cap(name); if(/^fast foods?,/i.test(name)){ name = cap(name.replace(/^fast foods?,\s*/i,"")); where = "Fast food"; } src = f.dataType==="Survey (FNDDS)" ? "USDA, typical recipe" : "USDA"; }
  const portions = [];
  const unit = String(f.servingSizeUnit||"").toUpperCase();
  if(num(f.servingSize) && ["GRM","G","MLT","ML"].includes(unit)) portions.push({label:f.householdServingFullText || "1 serving", grams:num(f.servingSize)});
  (f.foodMeasures||[]).forEach(m=>{ const gw = num(m.gramWeight); if(gw && !portions.some(p=>p.grams===gw)) portions.push({label:m.disseminationText || "1 serving", grams:gw}); });
  return {fdcId:f.fdcId, type:f.dataType, name, where, src, p100, portions};
}
async function fdcFetch(url){
  const res = await fetch(url);
  if(res.status===429) throw {code:"limit"};
  if(res.status===403 || res.status===401) throw {code:"key"};
  if(!res.ok) throw {code:"http", status:res.status};
  return res.json();
}
async function fdcSearch(q){
  const base = FDC+"foods/search?api_key="+encodeURIComponent(fdcKey())+"&pageSize=25&query="+encodeURIComponent(q);
  let j;
  try{ j = await fdcFetch(base+"&dataType="+encodeURIComponent("Branded,SR Legacy,Survey (FNDDS),Foundation")); }
  catch(e){ if(e && e.code==="http" && e.status===400) j = await fdcFetch(base); else throw e; }
  return (j.foods||[]).map(parseHit).filter(x=>x.p100!=null);
}
async function fdcPortions(id){
  const j = await fdcFetch(FDC+"food/"+encodeURIComponent(id)+"?api_key="+encodeURIComponent(fdcKey()));
  return (j.foodPortions||[]).map(p=>{
    const unit = p.measureUnit && p.measureUnit.name && p.measureUnit.name!=="undetermined" ? p.measureUnit.name : "";
    const mod = p.modifier && !/^\d+$/.test(p.modifier) ? p.modifier : "";   // FNDDS uses numeric codes here
    const label = p.portionDescription && p.portionDescription!=="Quantity not specified" ? p.portionDescription : [p.amount, unit, mod].filter(Boolean).join(" ");
    return {label: label || "1 serving", grams: num(p.gramWeight)};
  }).filter(p=>p.grams);
}
function fdcError(e){
  if(e && e.code==="limit") return "The free shared USDA limit is used up for this hour. Add your own free key in Progress → Settings (takes a minute) and it goes away.";
  if(e && e.code==="key") return "USDA didn't accept your key. Check it in Progress → Settings, or clear it to use the shared one.";
  return "Couldn't reach the USDA food database. Check your signal and try again.";
}
function lookupLocalHtml(q){
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  if(!words.length) return "";
  const hits = foodRows().filter(r=>{ const t = (r.name+" "+r.sub).toLowerCase(); return words.every(w=>t.includes(w)); }).slice(0,6);
  return hits.length ? '<p class="sec">Already in your app</p>'+hits.map(r=>foodRow(r)).join("") : "";
}
function sheetLookup(){
  const sh = S.sheet;
  let h = head("Search foods", "Done");
  h += '<form id="lookup-form" class="row" style="flex-wrap:nowrap"><input id="lk-q" class="inp grow" type="search" enterkeyhint="search" autocomplete="off" placeholder="e.g. chick-fil-a sandwich" aria-label="Food to search for" value="'+esc(sh.q||"")+'"><button class="btn sm" style="width:auto" type="submit">Search</button></form>';
  h += '<div id="lk-local">'+lookupLocalHtml(sh.q||"")+'</div>';
  if(sh.status) h += '<p class="small muted" role="status">'+esc(sh.status)+'</p>';
  if(sh.results){
    if(!sh.results.length) h += '<p class="muted">No matches in the USDA database. Try fewer words, like "chicken sandwich", or add it yourself below.</p>';
    else {
      h += '<p class="sec">From USDA FoodData Central</p><div>';
      sh.results.forEach((f,i)=>{ h += '<button class="food" style="grid-template-columns:1fr auto" data-act="lk-pick" data-i="'+i+'"><span>'+esc(f.name)+'<small>'+esc([f.where, f.src].filter(Boolean).join(" · "))+'</small></span><span class="small muted num" style="text-align:right">'+esc(f.p100)+' g<br>per 100 g</span></button>'; });
      h += '</div>';
    }
  }
  h += '<button class="link" data-act="lk-manual">Not finding it? Add it yourself</button>';
  h += '<p class="tiny muted">Restaurant entries in USDA\'s database can be a few years old. The restaurant\'s own nutrition page is the most accurate.</p>';
  return h;
}
function portionGrams(){
  const sh = S.sheet; if(!sh || sh.kind!=="portion") return 0;
  const f = sh.food;
  if(sh.pi>=0 && sh.portions[sh.pi]) return f.p100 * sh.portions[sh.pi].grams/100 * sh.servings;
  const g = num(sh.grams); return g ? f.p100*g/100 : 0;
}
function sheetPortion(){
  const sh = S.sheet, f = sh.food;
  let h = head(esc(f.name), "Back");
  h += '<p class="muted">'+esc([f.where, f.src].filter(Boolean).join(" · "))+'</p><p><b class="num">'+esc(f.p100)+' g</b> protein per 100 g</p>';
  if(sh.loading) h += '<p class="small muted">Loading serving sizes…</p>';
  if(sh.portions.length){
    h += '<p class="sec">How much did you have?</p><div style="display:grid;gap:8px">';
    sh.portions.forEach((p,i)=>{ h += '<button class="opt'+(sh.pi===i?" on":"")+'" data-act="pt-pick" data-i="'+i+'"><span>'+esc(p.label)+' <span class="small muted">('+Math.round(p.grams)+' g)</span></span><b class="num">'+Math.round(f.p100*p.grams/100)+' g</b></button>'; });
    h += '</div>';
  }
  h += '<label class="small muted" for="pt-grams">'+(sh.portions.length ? "Or type the grams you ate" : "How many grams did you eat?")+'</label><label class="field"><input id="pt-grams" class="inp" inputmode="decimal" placeholder="e.g. 170" value="'+esc(sh.grams||"")+'"><i>g</i></label>';
  if(sh.pi>=0) h += '<p class="sec">Servings</p><div class="stepper"><button data-act="pt-step" data-d="-0.5" aria-label="Half a serving less">−</button><output>'+sh.servings+'</output><button data-act="pt-step" data-d="0.5" aria-label="Half a serving more">+</button></div>';
  h += '<label class="switch" for="pt-save"><span>Save to your foods for one-tap next time</span><input type="checkbox" id="pt-save"'+(sh.save?" checked":"")+'></label>';
  const g = portionGrams();
  h += '<button class="btn" data-act="pt-add" id="pt-add"'+(g>0?"":" disabled")+'>'+(g>0 ? "Add "+Math.round(g)+" g" : "Pick a serving size")+'</button>';
  return h;
}
async function runLookup(q){
  q = (q||"").trim(); if(!q) return;
  const sh = S.sheet; sh.q = q; sh.status = "Searching…"; sh.results = null; renderSheet();
  try{ const res = await fdcSearch(q); if(S.sheet!==sh) return; sh.results = res; sh.status = ""; }
  catch(e){ if(S.sheet!==sh) return; sh.status = fdcError(e); }
  renderSheet();
}
async function pickLookup(i){
  const prev = S.sheet, f = prev.results[i]; if(!f) return;
  openSheet("portion", {food:f, portions:f.portions.slice(), pi:f.portions.length?0:-1, grams:"", servings:1, save:true, back:prev, loading:!f.portions.length && f.type!=="Branded"});
  if(S.sheet.loading){
    const sh = S.sheet;
    try{ const ps = await fdcPortions(f.fdcId); if(S.sheet!==sh) return; sh.portions = ps; if(ps.length) sh.pi = 0; }
    catch(e){ if(S.sheet!==sh) return; toast(fdcError(e)); }
    sh.loading = false; renderSheet();
  }
}
function addFromPortion(){
  const sh = S.sheet, f = sh.food, g = portionGrams(); if(!(g>0)) return;
  const p = sh.pi>=0 ? sh.portions[sh.pi] : null;
  const label = f.name + (f.where ? " ("+f.where+")" : "");
  if(sh.save){
    const per = p ? f.p100*p.grams/100 : g;
    const food = {id:"f"+Date.now().toString(36), name:f.name, g:r1(per), where:f.where || "USDA", portion: p ? p.label : Math.round(num(sh.grams))+" g"};
    DB.myFoods.push(food);
    addProtein(g, label, "my:"+food.id);
  } else addProtein(g, label);
  closeSheet(); render();
}

function refreshEdge(){
  if(!S.sheet || S.sheet.kind!=="edge") return;
  const l = $("#edge-list"); if(l) l.innerHTML = edgeListHtml();
  const a = $("#edge-added"); if(a){ a.hidden = !S.sheet.added; a.innerHTML = 'Added this meal: <b class="num">'+Math.round(S.sheet.added||0)+' g</b>'; }
}
function sheetEdge(){
  const sh = S.sheet;
  let h = head("The Edge", "Done");
  h += '<div class="seg" style="grid-template-columns:repeat(3,1fr)">'+MEALS.map(([k,l])=>'<button aria-pressed="'+(sh.meal===k)+'" data-act="edge-meal" data-m="'+k+'">'+l+'</button>').join("")+'</div>';
  h += '<input id="edge-q" class="inp" type="search" placeholder="Search or add a dish" aria-label="Search your Edge dishes" autocomplete="off" value="'+esc(sh.q||"")+'">';
  h += '<p class="small muted" id="edge-added"'+(sh.added ? '' : ' hidden')+'>Added this meal: <b class="num">'+Math.round(sh.added||0)+' g</b></p>';
  h += '<div id="edge-list">'+edgeListHtml()+'</div>';
  h += '<details><summary>Lots of new dishes? Enter the Meal Calculator total</summary><div style="display:grid;gap:10px;margin-top:10px"><p class="small muted">On Auburn\'s dining site, open The Edge, tap Add on each dish you ate, and read the protein total from its Meal Calculator.</p>'+
    '<form id="edge-calc-form" class="row" style="flex-wrap:nowrap"><label class="field grow"><input id="ec-g" class="inp" inputmode="decimal" placeholder="Protein total" aria-label="Meal Calculator protein total"><i>g</i></label><button class="btn sm" style="width:auto" type="submit">Add</button></form></div></details>';
  return h;
}
function sheetPlate(){
  const sh = S.sheet, rows = foodRows().filter(r=>!r.plate);
  rows.sort((a,b)=> (b.n-a.n) || ((b.mine?1:0)-(a.mine?1:0)));
  sh.picked = sh.picked || {};
  const total = rows.filter(r=>sh.picked[r.key]).reduce((a,r)=>a+r.g,0);
  let h = head("Make a plate", "Cancel")+'<p class="small muted">A plate is a meal you repeat, like your usual burger plate. Pick its parts and it becomes one tap.</p>'+
    '<form id="plate-form" style="display:grid;gap:12px"><label class="small muted" for="pl-name">Plate name</label><input id="pl-name" class="inp" placeholder="e.g. Burger plate" value="'+esc(sh.name||"")+'"><div>';
  rows.forEach(r=>{ h += '<label class="check"><input type="checkbox" data-pick="'+esc(r.key)+'"'+(sh.picked[r.key]?" checked":"")+'><span>'+esc(r.name)+'<br><span class="small muted">'+esc(r.sub)+'</span></span><b class="num">'+Math.round(r.g)+' g</b></label>'; });
  h += '</div><p class="muted" id="pl-total">Total: <b class="num">'+Math.round(total)+' g</b></p><button class="btn" type="submit">Save plate</button></form>';
  return h + '<p class="small muted">Missing a part? Add it with + Add food first, then make the plate.</p>';
}
function sheetEditFood(){
  const f = DB.myFoods.find(x=>x.id===S.sheet.id); if(!f) return head("Not found");
  let h = head("Edit "+(f.items?"plate":"food"), "Cancel")+'<form id="editfood-form" style="display:grid;gap:12px">'+
    '<label class="small muted" for="ef-name">Name</label><input id="ef-name" class="inp" value="'+esc(f.name)+'">';
  if(f.items){
    h += '<div>'; f.items.forEach((it,k)=>{ h += '<div class="entry"><span class="g">'+Math.round(it.g)+' g</span><span>'+esc(it.name)+'</span><button type="button" class="x" data-act="ef-rmitem" data-k="'+k+'" aria-label="Remove '+esc(it.name)+'">×</button></div>'; }); h += '</div>';
    h += '<p class="muted">Total: <b class="num">'+Math.round(f.items.reduce((a,x)=>a+x.g,0))+' g</b></p>';
  } else {
    h += '<label class="small muted" for="ef-g">Protein per serving</label><label class="field"><input id="ef-g" class="inp" inputmode="decimal" value="'+esc(f.g)+'"><i>g</i></label>'+
      '<label class="small muted" for="ef-where">Where it\'s from</label><input id="ef-where" class="inp" value="'+esc(f.where||"")+'">';
  }
  h += '<button class="btn" type="submit">Save</button></form>';
  h += S.confirm==="delfood" ? '<div class="confirm"><b>Delete '+esc(f.name)+'?</b><div class="two"><button class="btn sm" data-act="ef-del-yes">Delete</button><button class="btn ghost sm" data-act="cancel-confirm">Keep</button></div></div>' : '<button class="btn danger" data-act="ef-del">Delete</button>';
  return h;
}
function sheetTodayLog(){
  const k = dayKey(), list = DB.protein[k] || [];
  let h = head("Today · "+Math.round(dayTotal(k))+" g");
  if(!list.length) return h + '<p class="muted">Nothing logged yet today.</p>';
  h += '<div>';
  list.slice().reverse().forEach((e,ri)=>{ const i = list.length-1-ri; h += '<div class="entry"><span class="g">'+Math.round(e.g)+' g</span><span>'+esc(e.label||"Protein")+' <span class="small muted">'+new Date(e.t).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})+'</span></span><button class="x" data-prm="'+i+'" aria-label="Remove '+Math.round(e.g)+' g">×</button></div>'; });
  return h + '</div>';
}

// ---------- history editing ----------
function sheetEdit(){
  const s = S.edit;
  let h = head(esc((PLAN[s.workout]||{name:s.workout}).name), "Cancel");
  h += '<p class="small muted">'+fmtDate(s.at)+' · '+(s.minutes||"?")+' min. Change any number, then save.</p>';
  s.entries.forEach((e,ei)=>{
    h += '<div class="panel-box"><div class="headrow"><h3>'+esc(e.variant)+'</h3><button class="link" style="padding:0" data-rmex="'+ei+'">Remove</button></div>';
    e.sets.forEach((st,si)=>{
      h += '<div class="row" style="flex-wrap:nowrap"><span class="small muted" style="width:44px">Set '+(si+1)+'</span>'+
        '<label class="field grow"><input class="inp" inputmode="decimal" aria-label="Weight" data-ew="'+ei+'" data-si="'+si+'" value="'+esc(st.w)+'"><i>lb</i></label>'+
        '<label class="field grow"><input class="inp" inputmode="numeric" aria-label="Reps" data-er="'+ei+'" data-si="'+si+'" value="'+esc(st.r)+'"><i>reps</i></label>'+
        '<button class="x" data-rmset="'+ei+':'+si+'" aria-label="Remove set '+(si+1)+'">×</button></div>';
    });
    h += '<button class="btn ghost sm" style="width:auto;justify-self:start" data-addset="'+ei+'">+ Add set</button></div>';
  });
  if(!s.entries.length) h += '<p class="note">No exercises left. Save to keep it empty, or delete the workout.</p>';
  h += '<button class="btn" data-act="edit-save">Save changes</button>';
  if(S.confirm==="edit-del") h += '<div class="confirm"><b>Delete this workout?</b><span class="small">This can\'t be undone unless you have a backup.</span><div class="two"><button class="btn sm" data-act="edit-del-yes">Delete</button><button class="btn ghost sm" data-act="cancel-confirm">Keep it</button></div></div>';
  else h += '<button class="btn danger" data-act="edit-del">Delete this workout</button>';
  return h;
}
function sheetExHist(variant){
  const rows = [];
  for(const s of DB.sessions){ const e = (s.entries||[]).find(x=>x.variant===variant); if(e && e.sets.length) rows.push({s, e}); }
  let h = head(esc(variant));
  if(!rows.length) return h + '<p class="muted">No sets logged for this one yet.</p>';
  const best = rows.reduce((a,x)=>{ const t = topSet(x.e.sets); return (!a || t.w>a.w || (t.w===a.w && t.r>a.r)) ? t : a; }, null);
  h += '<p class="small muted">'+plural(rows.length,"workout")+'. Best set: <b class="num">'+esc(best.w)+' lb × '+esc(best.r)+'</b>. Tap a row to fix it.</p><div>';
  rows.forEach(x=>{ h += '<button class="hist" data-edit="'+esc(x.s.id)+'"><span class="num" style="font-size:15px">'+x.e.sets.map(st=>esc(st.w)+'×'+esc(st.r)).join(', ')+'</span><span class="chev" aria-hidden="true">›</span><span class="when">'+fmtDate(x.s.at)+'</span></button>'; });
  return h + '</div>';
}
function openEdit(id){
  const s = DB.sessions.find(x=>x.id===id); if(!s) return;
  S.edit = JSON.parse(JSON.stringify(s)); S.confirm = null;
  openSheet("edit", {});
}

// ---------- barcode scanning ----------
// iPhone home-screen apps can re-ask for camera permission, so after a scan the stream is kept
// for a minute (camera paused) and reused if you scan again, then released.
let stream = null, scanTimer = null, detector = null, scanBusy = false, parkTimer = null;
function sheetScan(){
  const sh = S.sheet;
  return head("Scan", "Cancel")+
    '<div class="scanbox"><video id="scan-video" playsinline muted autoplay></video><div class="aim" aria-hidden="true"></div></div>'+
    '<p class="small muted" id="scan-status" role="status">'+esc(sh.status || "Starting the camera…")+'</p>'+
    '<form id="code-form" class="row" style="flex-wrap:nowrap"><input id="code-in" class="inp grow" inputmode="numeric" placeholder="Or type the barcode number" aria-label="Barcode number"><button class="btn ghost sm" style="width:auto" type="submit">Look up</button></form>';
}
function scanStatus(msg){ if(S.sheet) S.sheet.status = msg; const el = $("#scan-status"); if(el) el.textContent = msg; }
async function attachCamera(){
  const video = $("#scan-video"); if(!video) return;
  if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){ scanStatus("This browser can't use the camera here. Type the barcode number below instead."); return; }
  clearTimeout(parkTimer);
  try{
    if(stream && !stream.getVideoTracks().some(t=>t.readyState==="live")) stream = null;
    if(!stream){
      stream = await navigator.mediaDevices.getUserMedia({audio:false, video:{facingMode:{ideal:"environment"}, width:{ideal:1920}, height:{ideal:1080}}});
      zoomIn(stream);
    }
    stream.getVideoTracks().forEach(t=>{ t.enabled = true; });
    if(!S.sheet || S.sheet.kind!=="scan"){ parkCamera(); return; }
    video.srcObject = stream;
    await video.play().catch(()=>{});
  }catch(e){
    scanStatus(e && e.name==="NotAllowedError"
      ? "Camera access is off. Allow it when asked (or in Settings), or type the number below."
      : "Couldn't start the camera. Type the barcode number below instead.");
    return;
  }
  scanStatus("Loading the scanner…");
  try{ detector = detector || await makeDetector(); }
  catch(e){ scanStatus("The scanner needs internet the first time. Type the number below instead."); return; }
  scanStatus("Point at the barcode and hold steady.");
  clearInterval(scanTimer);
  scanTimer = setInterval(async ()=>{
    if(scanBusy || video.readyState < 2) return;
    scanBusy = true;
    try{
      const codes = await detector.detect(video);
      const hit = codes && codes.find(c=>/^\d{8,14}$/.test(c.rawValue||""));
      if(hit){ try{ navigator.vibrate && navigator.vibrate(60); }catch(e){} parkCamera(); lookup(hit.rawValue); }
    }catch(e){}
    scanBusy = false;
  }, 150);
}
// Close-up barcodes blur on iPhones that can't focus near; zooming lets you hold the phone farther away.
function zoomIn(s){
  try{
    const t = s.getVideoTracks()[0], caps = t.getCapabilities && t.getCapabilities();
    if(caps && caps.zoom && caps.zoom.max >= 1.5) t.applyConstraints({advanced:[{zoom:Math.min(caps.zoom.max, 2)}]}).catch(()=>{});
  }catch(e){}
}
function parkCamera(){
  clearInterval(scanTimer); scanTimer = null;
  if(!stream) return;
  stream.getVideoTracks().forEach(t=>{ t.enabled = false; });
  clearTimeout(parkTimer);
  parkTimer = setTimeout(stopCamera, 60000);
}
function stopCamera(){
  clearInterval(scanTimer); scanTimer = null; clearTimeout(parkTimer);
  if(stream){ stream.getTracks().forEach(t=>t.stop()); stream = null; }
}
// iPhone Safari has no built-in barcode reader, so this loads ZXing (compiled to WebAssembly)
// behind the standard BarcodeDetector API. Pinned version; the service worker caches it after first use.
const SCANNER_LIB = "https://cdn.jsdelivr.net/npm/barcode-detector@3.2.2/dist/es/ponyfill.min.js";
const FORMATS = ["ean_13","upc_a","ean_8","upc_e"];
async function makeDetector(){
  if("BarcodeDetector" in window){
    try{
      const ok = await window.BarcodeDetector.getSupportedFormats();
      if(FORMATS.some(f=>ok.includes(f))) return new window.BarcodeDetector({formats:FORMATS.filter(f=>ok.includes(f))});
    }catch(e){}
  }
  const mod = await import(SCANNER_LIB);
  if(mod.prepareZXingModule) mod.prepareZXingModule({fireImmediately:true});
  return new mod.BarcodeDetector({formats:FORMATS});
}
// Look a barcode up: this phone's saved foods first, then Open Food Facts, then USDA's branded-food data.
function codeVariants(code){
  const c = String(code).replace(/\D/g,""), out = [c];
  if(c.length===12) out.push("0"+c);
  if(c.length===13 && c[0]==="0") out.push(c.slice(1));
  return out;
}
async function lookup(code){
  code = String(code).replace(/\D/g,"");
  if(code.length<8){ scanStatus("That number looks too short. Check it and try again."); return; }
  const local = DB.foods.find(f=>codeVariants(code).includes(f.code));
  if(local){ openSheet("food", {food:Object.assign({}, local), servings:1}); return; }
  scanStatus("Looking up "+code+"…");
  let food = null, failures = 0;
  try{ food = await lookupOFF(code); }catch(e){ failures++; }
  if(!food){ try{ food = await lookupUSDA(code); }catch(e){ failures++; } }
  if(!S.sheet) return;
  if(food){ openSheet("food", {food, servings:1}); return; }
  openSheet("food", {food:{code, name:"", brand:"", pServing:null, servingLabel:"", p100:null, source:"you"}, servings:1, missing:true, offline:failures===2});
}
// Open Food Facts v2 product API (CORS-open, no key; about 15 product reads a minute per IP).
async function lookupOFF(code){
  const fields = "code,product_name,brands,serving_size,serving_quantity,serving_quantity_unit,nutriments.proteins_100g,nutriments.proteins_serving";
  for(const c of codeVariants(code)){
    const res = await fetch("https://world.openfoodfacts.org/api/v2/product/"+encodeURIComponent(c)+"?fields="+fields);
    if(!res.ok && res.status!==404) throw new Error("http "+res.status);
    const j = await res.json().catch(()=>null);
    if(j && j.status===1 && j.product){
      const p = j.product, n = p.nutriments || {};
      const p100 = num(n.proteins_100g)!=null ? r1(num(n.proteins_100g)) : null;
      let pServing = num(n.proteins_serving)!=null ? r1(num(n.proteins_serving)) : null;
      const sq = num(p.serving_quantity);
      if(pServing==null && p100!=null && sq) pServing = r1(p100*sq/100);
      if(!p.product_name && p100==null && pServing==null) continue;   // empty stub entry
      return {code:c, name:(p.product_name||"").trim(), brand:(p.brands||"").split(",")[0].trim(), pServing, servingLabel:(p.serving_size||"").trim(),
        p100, unit:p.serving_quantity_unit==="ml"?"ml":"g", source:"off"};
    }
  }
  return null;
}
// USDA FoodData Central branded foods. UPCs are stored with inconsistent leading zeros, so search every
// padding and confirm the match. DEMO_KEY is rate-limited per network but enough for occasional misses.
async function lookupUSDA(code){
  const c = String(code).replace(/^0+/,"");
  const q = [c, c.padStart(12,"0"), c.padStart(13,"0"), c.padStart(14,"0")].filter((v,i,a)=>a.indexOf(v)===i).join(" OR ");
  const res = await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?api_key="+encodeURIComponent(fdcKey())+"&dataType=Branded&pageSize=5&query="+encodeURIComponent(q));
  if(!res.ok){ if(res.status===429) return null; throw new Error("http "+res.status); }
  const j = await res.json().catch(()=>null);
  const hit = j && (j.foods||[]).find(f=>String(f.gtinUpc||"").replace(/^0+/,"")===c);
  if(!hit) return null;
  const pn = (hit.foodNutrients||[]).find(n=>n.nutrientId===1003);
  const p100 = pn ? num(pn.value) : null;
  const ss = num(hit.servingSize), unit = String(hit.servingSizeUnit||"").toUpperCase();
  const u = unit==="MLT" || unit==="ML" ? "ml" : "g";
  const pServing = p100!=null && ss && ["GRM","G","MLT","ML"].includes(unit) ? r1(p100*ss/100) : null;
  const name = String(hit.description||"").toLowerCase().replace(/\b\w/g, m=>m.toUpperCase());
  return {code, name, brand:hit.brandName||hit.brandOwner||"", pServing, servingLabel:hit.householdServingFullText || (ss ? ss+" "+u : ""), p100, unit:u, source:"usda"};
}
function sheetFood(){
  const sh = S.sheet, f = sh.food;
  let h = head(sh.missing ? "Not found" : "Add protein", "Cancel");
  if(sh.missing){
    h += '<p class="muted">'+(sh.offline ? "Couldn't reach the food databases (no signal, or they're busy)." : "This barcode isn't in the food databases yet.")+' Read the protein off the label once and the app will remember it for next time.</p>';
  } else {
    h += '<div style="display:grid;gap:6px"><h3 style="font-size:22px">'+esc(f.name || "Unnamed product")+'</h3>'+(f.brand?'<p class="muted">'+esc(f.brand)+'</p>':'');
    if(f.pServing!=null) h += '<p><b class="num">'+esc(f.pServing)+' g</b> protein per serving'+(f.servingLabel?' <span class="muted">('+esc(f.servingLabel)+')</span>':'')+'</p>';
    if(f.p100!=null) h += '<p class="small muted">'+esc(r1(f.p100))+' g per 100 '+(f.unit==="ml"?"ml":"g")+'</p>';
    const src = {off:"From Open Food Facts, a volunteer database.", usda:"From USDA FoodData Central (label data the brand submitted)."}[f.source];
    h += '<p class="small muted">'+(src ? src+" If it doesn't match your label, fix it below." : "Saved on this phone from a previous scan.")+'</p></div>';
  }
  if(f.pServing==null && f.p100!=null && !sh.missing && !sh.fix){
    h += '<label class="small muted" for="food-grams">This product has no serving size listed. How many grams did you eat?</label><label class="field"><input id="food-grams" class="inp" inputmode="decimal" value="'+esc(sh.grams||"")+'" placeholder="e.g. 150"><i>g</i></label>';
  } else {
    if(sh.missing || sh.fix){
      h += '<label class="small muted" for="food-name">Name (optional)</label><input id="food-name" class="inp" value="'+esc(f.name||"")+'" placeholder="e.g. Chocolate protein bar">'+
        '<label class="small muted" for="food-p">Protein per serving, from the label</label><label class="field"><input id="food-p" class="inp" inputmode="decimal" value="'+esc(f.pServing!=null?f.pServing:"")+'" placeholder="g"><i>g</i></label>'+
        '<label class="small muted" for="food-sl">Serving size (optional)</label><input id="food-sl" class="inp" value="'+esc(f.servingLabel||"")+'" placeholder="e.g. 1 bar">';
    }
    h += '<p class="sec">Servings</p><div class="stepper"><button data-step="-0.5" aria-label="Half a serving less">−</button><output id="food-serv">'+sh.servings+'</output><button data-step="0.5" aria-label="Half a serving more">+</button></div>';
  }
  const g = foodGrams();
  h += '<button class="btn" data-act="food-add"'+(g>0?"":" disabled")+'>'+(g>0 ? "Add "+Math.round(g)+" g" : "Enter the protein to add it")+'</button>';
  if(!sh.missing && !sh.fix && f.pServing!=null) h += '<button class="link" data-act="food-fix">The numbers are wrong? Fix them</button>';
  if(!sh.missing) h += '<p class="tiny muted">Barcode '+esc(f.code)+'</p>';
  return h;
}
function foodGrams(){
  const sh = S.sheet; if(!sh || sh.kind!=="food") return 0;
  const f = sh.food;
  if(f.pServing==null && f.p100!=null && !sh.missing && !sh.fix){ const gr = num(sh.grams); return gr ? f.p100*gr/100 : 0; }
  return f.pServing!=null ? f.pServing*sh.servings : 0;
}
function rememberFood(f){
  if(!f.code) return;
  DB.foods = DB.foods.filter(x=>x.code!==f.code);
  DB.foods.unshift({code:f.code, name:f.name||"", brand:f.brand||"", pServing:f.pServing, servingLabel:f.servingLabel||"", p100:f.p100!=null?f.p100:null, unit:f.unit||"g", source:f.source==="you"?"you":f.source});
  DB.foods = DB.foods.slice(0,60);
}
function syncFoodInputs(){
  const sh = S.sheet; if(!sh || sh.kind!=="food") return;
  const n = $("#food-name"), p = $("#food-p"), sl = $("#food-sl"), gr = $("#food-grams");
  if(n) sh.food.name = n.value.trim();
  if(p){ const v = num(p.value); sh.food.pServing = v && v>0 ? v : null; }
  if(sl) sh.food.servingLabel = sl.value.trim();
  if(gr) sh.grams = gr.value.trim();
}

// =====================================================================
// Timer: clock, 40-minute bar, rest ring, and the pill on other tabs
// =====================================================================
let ticker = null;
function startTicker(){ if(!ticker) ticker = setInterval(tick, 500); }
function stopTicker(){ if(ticker){ clearInterval(ticker); ticker = null; } }
function tick(){
  const pill = $("#pill");
  const showPill = !!draft && UI.tab!=="train" && !showInstall();
  pill.hidden = !showPill;
  document.body.classList.toggle("pill", showPill);
  if(!draft){ stopTicker(); return; }
  const now = Date.now(), el = (now - draft.startedAt)/1000;
  const resting = draft.restEnd && draft.restEnd > now;
  if(draft.restEnd && draft.restEnd <= now){
    draft.restEnd = null; saveDraft();
    if(UI.tab==="train" && !S.finish){ render(); const v = $("#view"); v.classList.remove("flash"); void v.offsetWidth; v.classList.add("flash"); setTimeout(()=>v.classList.remove("flash"), 3000); }
    try{ navigator.vibrate && navigator.vibrate([200,100,200]); }catch(e){}
    return;
  }
  const clk = $("#clk"); if(clk) clk.textContent = mmss(el);
  const b = $("#b40"); if(b) b.style.width = Math.min(100, el/2400*100).toFixed(1)+"%";
  if(resting){
    const left = (draft.restEnd - now)/1000, tot = draft.restFor || 60;
    const rp = $("#ringp"); if(rp) rp.setAttribute("stroke-dashoffset", (282.74*(1 - left/tot)).toFixed(1));
    const rt = $("#ringt"); if(rt) rt.textContent = mmss(left);
  }
  if(showPill) pill.innerHTML = '<span>'+esc(PLAN[draft.workout].name)+' · <b>'+mmss(el)+'</b></span><b>'+(resting ? "Rest "+mmss((draft.restEnd-now)/1000) : "Back to workout ›")+'</b>';
}
function focusTyping(){ const t = $("#typing"); if(t){ t.focus(); t.select(); } }
function commitTyping(){
  const t = $("#typing"); if(!t || !S.typing || !draft) { S.typing = null; return; }
  const item = curItem(), s = item && entry(item).sets[draft.cur.i];
  if(s){
    const v = vals(item, draft.cur.i);
    if(S.typing==="w"){ const n = num(t.value); s.w = n!=null && n>=0 ? r1(n) : null; s.r = v.r; }
    else { const n = parseInt(t.value,10); s.r = isFinite(n) && n>=0 ? n : v.r; s.w = v.w; }
    saveDraft();
  }
  S.typing = null;
}

// =====================================================================
// Events (one delegated handler for the page and the sheets)
// =====================================================================
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState==="visible"){ if(draft){ requestWake(); tick(); } renderSafe(); maybePromptCheckin(); }
  else stopCamera();
});
$("#pill").addEventListener("click", ()=>{ UI.tab = "train"; saveUI(); render(); window.scrollTo(0,0); });

document.addEventListener("click", e=>{
  const cite = e.target.closest("a.cite");
  if(cite){
    e.preventDefault();
    const id = cite.getAttribute("href").slice(1);
    if(!S.sheet || S.sheet.kind!=="guide"){ openSheet("guide"); }
    if(S.guideTab!=="why"){ S.guideTab = "why"; renderSheet(); }
    const el = document.getElementById(id);
    if(el){ el.scrollIntoView({block:"center"}); el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"), 1800); }
    return;
  }
  if(e.target.dataset && e.target.dataset.scrim){ closeSheet(); return; }
  const t = e.target.closest("button"); if(!t) return;
  const d = t.dataset;
  if(d.tab){ UI.tab = d.tab; S.confirm = null; if(d.tab!=="train" && S.finish) S.finish = null; saveUI(); closeSheet(); render(); window.scrollTo(0,0); return; }
  if(d.log){ const r = foodRows().find(x=>x.key===d.log); if(r){ addProtein(r.g, r.name, r.key); render(); } return; }
  if(d.exhist){ openSheet("exhist", {variant:d.exhist}); return; }
  if(d.edit){ openEdit(d.edit); return; }
  if(d.delci){ DB.checkins = DB.checkins.filter(x=>x.id!==d.delci); persist(); render(); toast("Check-in deleted"); return; }
  if(d.crm){ DB.cardio = DB.cardio.filter(x=>x.id!==d.crm); persist(); render(); toast("Cardio entry deleted"); return; }
  if(d.wrm){ const k = dayKey(), list = DB.water[k] || []; list.splice(+d.wrm, 1); if(!list.length) delete DB.water[k]; persist(); render(); return; }
  if(d.prm){ const k = dayKey(), list = DB.protein[k] || []; list.splice(+d.prm, 1); if(!list.length) delete DB.protein[k]; persist(); render(); renderSheet(); return; }
  if(d.step && S.sheet){ syncFoodInputs(); S.sheet.servings = Math.max(0.5, Math.min(20, S.sheet.servings + parseFloat(d.step))); renderSheet(); return; }
  if(d.addset && S.edit){ const e2 = S.edit.entries[+d.addset], last = e2.sets[e2.sets.length-1]; e2.sets.push({w:last?last.w:0, r:last?last.r:0}); renderSheet(); return; }
  if(d.rmset && S.edit){ const [ei,si] = d.rmset.split(":").map(Number); S.edit.entries[ei].sets.splice(si,1); if(!S.edit.entries[ei].sets.length) S.edit.entries.splice(ei,1); renderSheet(); return; }
  if(d.rmex && S.edit){ S.edit.entries.splice(+d.rmex,1); renderSheet(); return; }
  if(!d.act) return;
  switch(d.act){
    // install + home
    case "skip-install": UI.skipInstall = true; saveUI(); render(); return;
    case "start": startWorkout(); render(); window.scrollTo(0,0); return;
    case "pick": openSheet("pick"); return;
    case "pickw": S.chosen = d.k===nextWorkout() ? null : d.k; closeSheet(); render(); return;
    case "guide": openSheet("guide"); return;
    case "gtab": S.guideTab = d.t; renderSheet(); $("#sheet-root .sheet-in").scrollTop = 0; return;
    // session
    case "log": if(S.typing) commitTyping(); audio(); logSet(); return;
    case "type": if(S.typing) commitTyping(); S.typing = d.k; render(); focusTyping(); return;
    case "adj": if(S.typing) commitTyping(); adjust(d.k, parseFloat(d.d)); return;
    case "goset": if(S.typing) commitTyping(); draft.cur = {ex:d.ex, i:+d.i}; draft.restEnd = null; cancelBeep(); saveDraft(); render(); return;
    case "undo": undoLast(); return;
    case "rest-add": if(draft.restEnd){ draft.restEnd += 30000; draft.restFor += 30; scheduleBeep((draft.restEnd-Date.now())/1000); saveDraft(); tick(); } return;
    case "rest-skip": draft.restEnd = null; cancelBeep(); saveDraft(); render(); return;
    case "overview": openSheet("overview"); return;
    case "jump": { const W = PLAN[draft.workout], it = itemOf(W, d.ex), en = entry(it); const k = en.sets.findIndex(s=>!s.done); delete draft.skipped[it.id]; if(it.bonus) draft.bonus = true; draft.cur = {ex:it.id, i:k<0?0:k}; draft.restEnd = null; cancelBeep(); saveDraft(); closeSheet(); render(); return; }
    case "howto": openSheet("howto"); return;
    case "swap": openSheet("swap"); return;
    case "setvariant": { const it = curItem(), en = entry(it); en.variant = d.name; en.sets.forEach(s=>{ if(!s.done){ s.w = null; s.r = null; } }); saveDraft(); closeSheet(); render(); return; }
    case "skip-ex": { const it = curItem(); if(it){ draft.skipped[it.id] = true; draft.cur = nextCur(); saveDraft(); render(); toast("Skipped "+short(entry(it).variant), {label:"Undo", fn:()=>{ delete draft.skipped[it.id]; draft.cur = nextCur(); saveDraft(); render(); }}); } return; }
    case "bonus": draft.bonus = true; draft.cur = nextCur(); saveDraft(); render(); return;
    case "end": closeSheet(); openSheet("end"); return;
    case "finish": closeSheet(); finishWorkout(); return;
    case "discard": S.confirm = "discard"; renderSheet(); return;
    case "discard-yes": closeSheet(); endSession(); render(); toast("Workout discarded"); return;
    case "cancel-confirm": S.confirm = null; renderSheet(); return;
    case "finish-done": S.finish = null; render(); window.scrollTo(0,0); return;
    case "close": if(S.sheet && S.sheet.kind==="portion" && S.sheet.back){ const b = S.sheet.back; closeSheet(); S.sheet = b; document.body.classList.add("locked"); renderSheet(); return; } closeSheet(); return;
    // protein
    case "addfood": openSheet("addfood", {}); setTimeout(()=>{ const n = $("#af-name"); n && n.focus(); }, 50); return;
    case "edge": openSheet("edge", {meal:mealNow(), q:"", added:0}); return;
    case "cardio": openSheet("cardio", {type:"Bike", min:20}); return;
    case "cardio-type": S.sheet.type = d.t; renderSheet(); return;
    case "cardio-min": S.sheet.min = Math.max(5, Math.min(180, S.sheet.min + parseInt(d.d,10))); renderSheet(); return;
    case "cardio-save": { const c = {id:"k"+Date.now().toString(36), at:Date.now(), type:S.sheet.type, min:S.sheet.min}; DB.cardio.push(c); persist(); closeSheet(); render();
      toast("Logged "+c.min+" min "+c.type.toLowerCase(), {label:"Undo", fn:()=>{ DB.cardio = DB.cardio.filter(x=>x.id!==c.id); persist(); render(); }}); return; }
    case "water": addWater(parseFloat(d.oz)); return;
    case "water-goal": DB.settings.waterGoal = parseFloat(d.oz); persist(); render(); return;
    case "water-goal-reset": DB.settings.waterGoal = null; persist(); render(); return;
    case "bottle-edit": S.editBottle = true; render(); const bt = $("#bt-oz"); if(bt){ bt.focus(); bt.select(); } return;
    case "push-on": remindersOn(); return;
    case "push-off": remindersOff(); return;
    case "copy-push": navigator.clipboard.writeText(JSON.stringify(DB.settings.pushSub)).then(()=>toast("Copied. Paste it to Claude."), ()=>toast("Couldn't copy. Long-press to select it instead.")); return;
    case "lookup": openSheet("lookup", {q:"", results:null, status:""}); setTimeout(()=>{ const n = $("#lk-q"); n && n.focus(); }, 50); return;
    case "lk-pick": pickLookup(+d.i); return;
    case "lk-manual": { const q = S.sheet && S.sheet.q; closeSheet(); openSheet("addfood", {name:q||"", where:""}); return; }
    case "pt-pick": S.sheet.pi = +d.i; S.sheet.grams = ""; renderSheet(); return;
    case "pt-step": S.sheet.servings = Math.max(0.5, Math.min(20, S.sheet.servings + parseFloat(d.d))); renderSheet(); return;
    case "pt-add": addFromPortion(); return;
    case "edge-meal": S.sheet.meal = d.m; renderSheet(); return;
    case "af-once": { const g = num($("#af-g").value); if(!(g>0)){ toast("Enter the grams of protein."); return; } addProtein(g, $("#af-name").value.trim() || "Custom"); closeSheet(); render(); return; }
    case "scan": openSheet("scan", {}); return;
    case "showall": S.showAll = !S.showAll; render(); return;
    case "plate": openSheet("plate", {picked:{}}); return;
    case "editfood": S.confirm = null; openSheet("editfood", {id:d.id}); return;
    case "ef-rmitem": { const f = DB.myFoods.find(x=>x.id===S.sheet.id); if(f && f.items){ f.items.splice(+d.k,1); f.g = r1(f.items.reduce((a,x)=>a+x.g,0)); persist(); renderSheet(); render(); } return; }
    case "ef-del": S.confirm = "delfood"; renderSheet(); return;
    case "ef-del-yes": DB.myFoods = DB.myFoods.filter(x=>x.id!==S.sheet.id); delete DB.usage["my:"+S.sheet.id]; persist(); closeSheet(); render(); toast("Deleted"); return;
    case "todaylog": openSheet("todaylog"); return;
    case "food-fix": syncFoodInputs(); S.sheet.fix = true; renderSheet(); return;
    case "food-add": {
      syncFoodInputs();
      const sh = S.sheet, f = sh.food, g = foodGrams();
      if(!(g>0)) return;
      const label = (f.name || "Scanned item") + (f.pServing!=null ? (sh.servings!==1 ? " ×"+sh.servings : "") : (sh.grams ? " ("+sh.grams+" g)" : ""));
      if(sh.missing || sh.fix) f.source = "you";
      rememberFood(f);
      addProtein(g, label, "scan:"+f.code);
      closeSheet(); render(); return;
    }
    // history + settings
    case "edit-save": {
      const s = S.edit;
      s.entries.forEach(en=>{ en.sets = en.sets.map(st=>({w:num(st.w)||0, r:parseInt(st.r,10)||0})).filter(st=>st.r>0); });
      s.entries = s.entries.filter(en=>en.sets.length);
      const i = DB.sessions.findIndex(x=>x.id===s.id);
      if(i>=0) DB.sessions[i] = s;
      persist(); closeSheet(); render(); toast("Workout updated"); return;
    }
    case "edit-del": S.confirm = "edit-del"; renderSheet(); return;
    case "edit-del-yes": DB.sessions = DB.sessions.filter(x=>x.id!==S.edit.id); persist(); closeSheet(); render(); toast("Workout deleted"); return;
    case "export": exportBackup(); return;
    case "copy-backup": copyBackup(); return;
    case "test-sound": audio(); scheduleBeep(0.05); if(!DB.settings.sound) toast("The beep is turned off"); return;
  }
});
document.addEventListener("input", e=>{
  const t = e.target, s = S.edit;
  if(t.id==="edge-q" && S.sheet && S.sheet.kind==="edge"){ S.sheet.q = t.value; refreshEdge(); return; }
  if(t.id==="lk-q" && S.sheet && S.sheet.kind==="lookup"){ S.sheet.q = t.value; const l = $("#lk-local"); if(l) l.innerHTML = lookupLocalHtml(t.value); return; }
  if(t.id==="pt-grams" && S.sheet && S.sheet.kind==="portion"){
    S.sheet.grams = t.value;
    if(num(t.value)){ S.sheet.pi = -1; document.querySelectorAll('#sheet-root [data-act="pt-pick"]').forEach(b=>b.classList.remove("on")); }
    const b = $("#pt-add"), g = portionGrams(); if(b){ b.disabled = !(g>0); b.textContent = g>0 ? "Add "+Math.round(g)+" g" : "Pick a serving size"; }
    return;
  }
  if(s && t.dataset.ew!=null){ s.entries[+t.dataset.ew].sets[+t.dataset.si].w = t.value; return; }
  if(s && t.dataset.er!=null){ s.entries[+t.dataset.er].sets[+t.dataset.si].r = t.value; return; }
  if(S.sheet && S.sheet.kind==="food"){
    syncFoodInputs();
    const b = $('#sheet-root [data-act="food-add"]'), g = foodGrams();
    if(b){ b.disabled = !(g>0); b.textContent = g>0 ? "Add "+Math.round(g)+" g" : "Enter the protein to add it"; }
  }
});
document.addEventListener("change", e=>{
  const t = e.target;
  if(t.dataset.pick && S.sheet && S.sheet.kind==="plate"){
    S.sheet.picked[t.dataset.pick] = t.checked;
    const total = foodRows().filter(r=>S.sheet.picked[r.key]).reduce((a,r)=>a+r.g,0);
    const el = $("#pl-total"); if(el) el.innerHTML = 'Total: <b class="num">'+Math.round(total)+' g</b>';
    return;
  }
  if(t.id==="set-bw"){ const v = num(t.value); DB.settings.bodyweight = v && v>=60 && v<=600 ? v : null; persist(); toast(DB.settings.bodyweight ? "Protein goal updated" : "Bodyweight cleared"); return; }
  if(t.id==="set-sound"){ DB.settings.sound = t.checked; persist(); if(t.checked) audio(); return; }
  if(t.id==="set-fdc"){ DB.settings.fdcKey = t.value.trim(); persist(); toast(DB.settings.fdcKey ? "USDA key saved" : "Using the shared USDA key"); return; }
  if(t.id==="pt-save" && S.sheet){ S.sheet.save = t.checked; return; }
  if(t.id==="imp-file" && t.files && t.files[0]){
    const fr = new FileReader();
    fr.onload = ()=>{ importBackup(String(fr.result||"")); t.value = ""; };
    fr.readAsText(t.files[0]);
  }
});
document.addEventListener("focusout", e=>{
  if(e.target.id==="typing"){ setTimeout(()=>{ if(S.typing){ commitTyping(); render(); } }, 0); return; }
});
document.addEventListener("keydown", e=>{ if(e.target.id==="typing" && e.key==="Enter"){ e.preventDefault(); e.target.blur(); } });
document.addEventListener("submit", e=>{
  e.preventDefault();
  const f = e.target;
  if(f.id==="cs-form"){
    const g = k => { const v = num($("#cs-"+k).value); return v && v>0 ? v : null; };
    const at = Date.now();
    const doc = {id:"c-"+at, at, weight:g("weight"), waist:g("waist"), neck:g("neck"), shoulders:g("shoulders"), arm:g("arm")};
    if(["weight","waist","neck","shoulders","arm"].every(k=>doc[k]==null)){ toast("Enter at least one measurement, or tap Later."); return; }
    const baseline = S.sheet.baseline;
    DB.checkins.push(doc);
    if(!DB.settings.bodyweight && doc.weight) DB.settings.bodyweight = doc.weight;   // also sets the protein goal
    S.sheet.saved = true; UI.ciSnooze = 0; saveUI();
    persist(); checkBadges(); closeSheet(); render();
    toast(baseline ? "Starting point saved. Next check-in in 4 weeks." : "Check-in saved. Next one in 4 weeks.");
    return;
  }
  if(f.id==="ci-form"){
    const g = k => { const v = num($("#ci-"+k).value); return v && v>0 ? v : null; };
    const at = Date.now();
    const doc = {id:"c-"+at, at, weight:g("weight"), waist:g("waist"), neck:g("neck"), shoulders:g("shoulders"), arm:g("arm")};
    if(["weight","waist","neck","shoulders","arm"].every(k=>doc[k]==null)){ toast("Enter at least one measurement first."); return; }
    DB.checkins.push(doc); persist(); render(); toast("Check-in saved");
  }
  if(f.id==="bw-form"){ const v = num($("#bw-in").value); if(v && v>=60 && v<=600){ DB.settings.bodyweight = v; persist(); render(); } else toast("Enter your weight in pounds."); }
  if(f.id==="paste-form"){ const v = $("#paste-in").value.trim(); if(v) importBackup(v); else toast("Paste the backup text first."); }
  if(f.id==="code-form"){ const v = $("#code-in").value.replace(/\D/g,""); if(v){ parkCamera(); lookup(v); } }
  if(f.id==="addfood-form"){
    const name = $("#af-name").value.trim(), g = num($("#af-g").value), where = $("#af-where").value.trim();
    if(!(g>0)){ toast("Enter the grams of protein."); return; }
    const food = {id:"f"+Date.now().toString(36), name:name || "My food", g:r1(g), where};
    DB.myFoods.push(food);
    addProtein(food.g, food.name, "my:"+food.id);
    closeSheet(); render();
  }
  if(f.id==="bottle-form"){ const v = num($("#bt-oz").value); if(v && v>=4 && v<=128){ DB.settings.bottleOz = r1(v); S.editBottle = false; persist(); render(); toast("Bottle set to "+r1(v)+" oz"); } else toast("Enter how many ounces your bottle holds."); return; }
  if(f.id==="water-form"){ const v = num($("#w-oz").value); if(v && v>0 && v<200){ addWater(v); } else toast("Enter the ounces."); return; }
  if(f.id==="wgoal-form"){ const v = num($("#wg-oz").value); if(v && v>=16 && v<=300){ DB.settings.waterGoal = Math.round(v); persist(); render(); } else toast("Enter a goal in ounces, like 90."); return; }
  if(f.id==="lookup-form"){ const q = $("#lk-q").value; $("#lk-q").blur(); runLookup(q); return; }
  if(f.id==="edge-add-form"){
    const name = (S.sheet.q||"").trim(), g = num($("#ea-g").value);
    if(!(g>0)){ toast("Enter the grams of protein."); return; }
    const food = {id:"f"+Date.now().toString(36), name:name.charAt(0).toUpperCase()+name.slice(1), g:r1(g), where:"The Edge", meals:{}};
    DB.myFoods.push(food);
    S.sheet.q = "";
    addProtein(food.g, food.name, "my:"+food.id);
    renderSheet(); render(); return;
  }
  if(f.id==="edge-calc-form"){
    const g = num($("#ec-g").value);
    if(!(g>0)){ toast("Enter the protein total."); return; }
    addProtein(g, "The Edge "+S.sheet.meal+" (Meal Calculator)");
    $("#ec-g").value = ""; render(); return;
  }
  if(f.id==="plate-form"){
    const rows = foodRows().filter(r=>S.sheet.picked[r.key]);
    if(!rows.length){ toast("Pick at least one food."); return; }
    const name = $("#pl-name").value.trim() || "My plate";
    const items = rows.map(r=>({name:r.name, g:r1(r.g)}));
    DB.myFoods.push({id:"p"+Date.now().toString(36), name, g:r1(items.reduce((a,x)=>a+x.g,0)), items, where:""});
    persist(); closeSheet(); render(); toast("Saved "+name+". Tap + to log it.");
  }
  if(f.id==="editfood-form"){
    const food = DB.myFoods.find(x=>x.id===S.sheet.id); if(!food) return;
    food.name = $("#ef-name").value.trim() || food.name;
    if(!food.items){ const g = num($("#ef-g").value); if(g>0) food.g = r1(g); food.where = $("#ef-where").value.trim(); }
    persist(); closeSheet(); render(); toast("Saved");
  }
});

// =====================================================================
// Backup and import
// =====================================================================
function backupText(){ return JSON.stringify(Object.assign({app:"rotation", exportedAt:Date.now()}, DB)); }
async function exportBackup(){
  const name = "rotation-backup-"+dayKey(), data = backupText();
  // iPhone's share sheet: try a .json file, then plain text, then a download link.
  const files = [new File([data], name+".json", {type:"application/json"}), new File([data], name+".txt", {type:"text/plain"})];
  for(const file of files){
    try{
      if(navigator.canShare && navigator.canShare({files:[file]})){
        await navigator.share({files:[file], title:"Rotation backup"});
        DB.lastBackup = Date.now(); persist(); render(); return;
      }
    }catch(e){ if(e && e.name==="AbortError") return; }
  }
  const url = URL.createObjectURL(files[0]), a = document.createElement("a");
  a.href = url; a.download = files[0].name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 5000);
  DB.lastBackup = Date.now(); persist(); render();
}
async function copyBackup(){
  try{ await navigator.clipboard.writeText(backupText()); DB.lastBackup = Date.now(); persist(); render(); toast("Backup copied. Paste it into Notes or a message to yourself."); }
  catch(e){ toast("Couldn't copy. Use Export backup instead."); }
}
// Merges a backup into what's on the phone. Also accepts the claude.ai page's export ({sessions, checkins}).
function importBackup(text){
  let d; try{ d = JSON.parse(text); }catch(e){ toast("That isn't a Rotation backup."); return; }
  if(!d || (!Array.isArray(d.sessions) && !Array.isArray(d.checkins))){ toast("That isn't a Rotation backup."); return; }
  let ns = 0, nc = 0;
  (d.sessions||[]).forEach(s=>{
    if(!s || !s.at || !Array.isArray(s.entries)) return;
    const id = s.id || ("s-"+s.at);
    if(DB.sessions.some(x=>x.id===id)) return;
    DB.sessions.push({id, at:s.at, workout:s.workout, minutes:s.minutes||null, entries:s.entries.map(e=>({ex:e.ex, variant:e.variant, sets:(e.sets||[]).map(st=>({w:num(st.w)||0, r:parseInt(st.r,10)||0}))}))});
    ns++;
  });
  (d.checkins||[]).forEach(c=>{
    if(!c || !c.at) return;
    const id = c.id || ("c-"+c.at);
    if(DB.checkins.some(x=>x.id===id)) return;
    DB.checkins.push({id, at:c.at, weight:c.weight??null, waist:c.waist??null, neck:c.neck??null, shoulders:c.shoulders??null, arm:c.arm??null});
    nc++;
  });
  if(d.protein && typeof d.protein==="object"){
    Object.keys(d.protein).forEach(k=>{
      const have = DB.protein[k] || [];
      (d.protein[k]||[]).forEach(e=>{ if(e && e.t && !have.some(x=>x.t===e.t)) have.push({t:e.t, g:num(e.g)||0, label:String(e.label||"")}); });
      if(have.length) DB.protein[k] = have.sort((a,b)=>a.t-b.t);
    });
  }
  (d.foods||[]).forEach(f=>{ if(f && f.code && !DB.foods.some(x=>x.code===f.code)) DB.foods.push(f); });
  (d.myFoods||[]).forEach(f=>{ if(f && f.id && !DB.myFoods.some(x=>x.id===f.id)) DB.myFoods.push(f); });
  (d.cardio||[]).forEach(c=>{ if(c && c.id && !DB.cardio.some(x=>x.id===c.id)) DB.cardio.push(c); });
  if(d.water && typeof d.water==="object") Object.keys(d.water).forEach(k=>{
    const have = DB.water[k] || [];
    (d.water[k]||[]).forEach(e=>{ if(e && e.t && !have.some(x=>x.t===e.t)) have.push({t:e.t, oz:num(e.oz)||0}); });
    if(have.length) DB.water[k] = have.sort((a,b)=>a.t-b.t);
  });
  if(d.badges && typeof d.badges==="object") Object.keys(d.badges).forEach(k=>{ if(!DB.badges[k]) DB.badges[k] = d.badges[k]; });
  if(d.settings && !DB.settings.waterGoal && d.settings.waterGoal) DB.settings.waterGoal = d.settings.waterGoal;
  if(d.usage && typeof d.usage==="object") Object.keys(d.usage).forEach(k=>{ if(!DB.usage[k]) DB.usage[k] = d.usage[k]; });
  if(d.settings && !DB.settings.bodyweight && d.settings.bodyweight) DB.settings.bodyweight = d.settings.bodyweight;
  persist(); checkBadges(); render();
  toast("Imported "+plural(ns,"workout")+" and "+plural(nc,"check-in"));
}

// =====================================================================
// Boot
// =====================================================================
if(draft){ normalizeDraft(); startTicker(); }
checkBadges();
render();
maybePromptCheckin();
if("serviceWorker" in navigator){ window.addEventListener("load", ()=>{ navigator.serviceWorker.register("sw.js").catch(()=>{}); }); }
})();

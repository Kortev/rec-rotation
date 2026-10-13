(function(){
"use strict";

// =====================================================================
// The program
// =====================================================================
const ROT = ["U1","L1","U2","L2"];
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

// Quick-add foods. Protein per portion, rounded, from USDA FoodData Central (FDC id) or the brand label.
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
function blank(){ return {v:1, sessions:[], checkins:[], protein:{}, foods:[], settings:{bodyweight:null, sound:true}, lastBackup:null}; }
function lsGet(k){ try{ const v = localStorage.getItem(k); return v ? JSON.parse(v) : null; }catch(e){ return null; } }
function lsSet(k,v){ try{ if(v==null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); return true; }catch(e){ return false; } }
let DB = (function(){
  const d = lsGet(KEY), b = blank();
  if(!d || d.v!==1) return b;
  return Object.assign(b, d, {settings:Object.assign(b.settings, d.settings||{})});
})();
let askedPersist = false;
function persist(){
  DB.sessions.sort((a,b)=>b.at-a.at);
  DB.checkins.sort((a,b)=>b.at-a.at);
  if(!lsSet(KEY, DB)){ toast("Couldn't save on this phone. Export a backup from Progress."); return false; }
  if(!askedPersist){ askedPersist = true; try{ navigator.storage && navigator.storage.persist && navigator.storage.persist().catch(()=>{}); }catch(e){} }
  return true;
}
const UI = Object.assign({tab:"today", hideInstall:false}, lsGet(UIKEY)||{});
function saveUI(){ lsSet(UIKEY, UI); }

let draft = lsGet(DKEY);
if(draft && (!draft.startedAt || Date.now() - draft.startedAt > 5*3600e3 || !PLAN[draft.workout])){ draft = null; lsSet(DKEY,null); }
function saveDraft(){ lsSet(DKEY, draft); }

const S = {chosen:null, confirm:null, error:null, dirty:false, sheet:null, edit:null};

// =====================================================================
// Helpers
// =====================================================================
const $ = (s,el=document)=>el.querySelector(s);
const esc = s => String(s==null?"":s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmtDate = ms => new Date(ms).toLocaleDateString(undefined,{weekday:"short",month:"short",day:"numeric"});
const mmss = s => { s = Math.max(0, Math.round(s)); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); };
const dayKey = (d=new Date()) => { const x = new Date(d); return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0"); };
const num = v => { const n = parseFloat(String(v==null?"":v).replace(",",".")); return isFinite(n) ? n : null; };
const r1 = n => Math.round(n*10)/10;
const isStandalone = () => window.navigator.standalone === true || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);

const CITE = {};
$("#why-src").content.querySelectorAll("#sources > li").forEach((li,i)=>{ CITE[li.id] = i+1; });

let toastT = null;
function toast(msg){
  let t = $(".toast"); if(!t){ t = document.createElement("div"); t.className = "toast"; t.setAttribute("role","status"); document.body.appendChild(t); }
  t.textContent = msg; clearTimeout(toastT); toastT = setTimeout(()=>t.remove(), 3000);
}

// =====================================================================
// Workout logic
// =====================================================================
function nextWorkout(){
  const last = DB.sessions[0];
  if(!last) return "U1";
  return ROT[(ROT.indexOf(last.workout)+1) % ROT.length] || "U1";
}
function currentKey(){ return draft ? draft.workout : (S.chosen || nextWorkout()); }
function lastFor(exId, variant){
  for(const s of DB.sessions){
    const e = (s.entries||[]).find(x=>x.ex===exId && x.variant===variant);
    if(e && e.sets && e.sets.length) return {at:s.at, sets:e.sets};
  }
  return null;
}
function hintFor(item, last){
  if(!last) return {cls:"new", text:"First time: pick a weight you can lift "+item.lo+"–"+item.hi+" times with 1–2 reps left in the tank."};
  const top = last.sets.length >= item.sets && last.sets.slice(0,item.sets).every(s=>s.r >= item.hi);
  const w = last.sets[0].w;
  if(top) return {cls:"up", text:"You hit "+item.hi+" on every set last time. Go up one pin (or the next dumbbell) today.", add:true, w};
  return {cls:"same", text:"Stay at "+w+" lb and beat at least one rep count from last time.", w};
}
function prefillW(item, variant){
  const h = hintFor(item, lastFor(item.id, variant));
  return (h.w!=null && !h.add) ? String(h.w) : "";
}
function ensureDraft(){
  if(draft) return draft;
  draft = {workout:currentKey(), startedAt:Date.now(), restEnd:null, entries:{}};
  saveDraft(); startTicker(); requestWake();
  return draft;
}
function entryFor(item){
  const d = ensureDraft();
  if(!d.entries[item.id]){
    const w = prefillW(item, item.name);
    d.entries[item.id] = {variant:item.name, sets:Array.from({length:item.sets},()=>({w, r:"", done:false}))};
  }
  return d.entries[item.id];
}
function endSession(){
  draft = null; lsSet(DKEY,null); S.chosen = null; S.confirm = null;
  stopTicker(); cancelBeep();
  try{ wake && wake.release(); }catch(e){}
}

// =====================================================================
// Rest alert: a beep scheduled ahead on Web Audio, so it fires without another tap.
// "transient" mixes with the user's music; like all iPhone web audio it follows the silent switch.
// =====================================================================
let actx = null, beeps = [];
function audio(){
  try{
    if(!actx){ const AC = window.AudioContext || window.webkitAudioContext; if(!AC) return null; actx = new AC(); }
    if(navigator.audioSession){ try{ navigator.audioSession.type = AUDIO_SESSION_TYPE; }catch(e){} }
    if(actx.state === "suspended" || actx.state === "interrupted") actx.resume();
    return actx;
  }catch(e){ return null; }
}
const AUDIO_SESSION_TYPE = "transient";
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

// =====================================================================
// Rendering
// =====================================================================
const TITLES = {today:"Today", protein:"Protein", progress:"Progress", plan:"The plan", why:"Why it works"};
function render(){
  document.querySelectorAll("nav.tabs button").forEach(b=>b.setAttribute("aria-selected", String(b.dataset.tab===UI.tab)));
  $("#title").textContent = TITLES[UI.tab];
  const v = $("#view");
  if(UI.tab==="today") v.innerHTML = viewToday();
  else if(UI.tab==="protein") v.innerHTML = viewProtein();
  else if(UI.tab==="progress") v.innerHTML = viewProgress();
  else if(UI.tab==="plan") v.innerHTML = viewPlan();
  else v.innerHTML = $("#why-src").innerHTML;
  numberCites(v);
  $("#subline").textContent = subline();
  document.body.classList.toggle("running", !!draft);
  $("#bar").hidden = !draft;
  tick();
  S.dirty = false;
}
function subline(){
  if(UI.tab==="protein"){ const t = target(); return t ? ("Goal: "+t.min+"–"+t.max+" g a day") : "Set your bodyweight to get a daily goal."; }
  if(draft) return "In progress: "+PLAN[draft.workout].name;
  return "Next up: "+PLAN[nextWorkout()].name+" · about "+PLAN[nextWorkout()].mins+" min";
}
function numberCites(root){
  root.querySelectorAll("a.cite").forEach(a=>{ const n = CITE[a.getAttribute("href").slice(1)] || "?"; a.textContent = n; a.setAttribute("aria-label","Source "+n); });
}
function renderSafe(){
  const a = document.activeElement;
  if(a && $("#view").contains(a) && (a.tagName==="INPUT" || a.tagName==="SELECT")){ S.dirty = true; return; }
  render();
}

function viewToday(){
  const key = currentKey(), W = PLAN[key], nxt = nextWorkout();
  let h = "";
  if(!isStandalone() && !UI.hideInstall){
    h += '<div class="install"><b>Install it on your phone</b><span>'+(isIOS
      ? "In Safari, tap the Share button, then <b>Add to Home Screen</b>. Then always open it from the icon: the installed app keeps its own log, separate from Safari."
      : "Open your browser menu and choose <b>Install app</b> or <b>Add to Home screen</b>.")+'</span><button class="btn quiet" style="color:inherit;justify-self:start;padding:0" data-act="hide-install">Got it</button></div>';
  }
  h += '<section class="stack"><div class="label">Pick today\'s workout</div><div class="chooser" role="group" aria-label="Workout">';
  for(const k of ROT) h += '<button data-pick="'+k+'" aria-pressed="'+(k===key)+'"'+(draft?" disabled":"")+'><b>'+k+'</b><span>'+(k===nxt?"next up":PLAN[k].name)+'</span></button>';
  h += '</div>';
  if(draft) h += '<p class="small muted">Finish or discard this session to switch workouts.</p>';
  else if(key!==nxt) h += '<p class="small muted">The loop says '+PLAN[nxt].name+' is next. Switching is fine if a machine you need is packed.</p>';
  h += '</section>';

  h += '<section class="panel"><div class="row spread"><h2>'+esc(W.name)+'</h2><span class="dose">≈'+W.mins+' min</span></div><p class="muted">'+esc(W.focus)+'. Paired moves (A1/A2) alternate with about 60 s rest after each. If the rec is packed, do them one after the other instead of holding two machines.</p>';
  if(!draft) h += '<button class="btn wide" data-act="start">Start the 40-minute clock</button>';
  h += '</section>';

  let bonusShown = false;
  for(const item of W.items){
    if(item.bonus && !bonusShown){ h += '<div class="divider">Only if you have time left</div>'; bonusShown = true; }
    const e = draft && draft.entries[item.id];
    const variant = e ? e.variant : item.name;
    const last = lastFor(item.id, variant);
    const hint = hintFor(item, last);
    h += '<article class="ex'+(item.bonus?" bonus":"")+'">';
    h += '<div class="ex-head"><div class="tag">'+esc(item.tag)+'</div><div class="ex-title"><h3>'+esc(variant)+'</h3><div class="dose">'+item.sets+' sets × '+item.lo+'–'+item.hi+' reps · rest '+item.rest+' s</div></div></div>';
    h += '<p class="hint '+hint.cls+'">'+esc(hint.text)+'</p>';
    if(last) h += '<p class="last">Last time ('+fmtDate(last.at)+'): '+last.sets.map(s=>esc(s.w)+'×'+esc(s.r)).join(', ')+'</p>';
    h += '<p class="cue">'+esc(item.cue)+'</p>';
    h += '<div class="swap"><label class="small muted" for="sw-'+item.id+'">Machine taken? Swap to:</label><select id="sw-'+item.id+'" data-swap="'+item.id+'">';
    for(const n of [item.name].concat(item.swaps)) h += '<option'+(n===variant?" selected":"")+'>'+esc(n)+'</option>';
    h += '</select></div><div class="sets">';
    for(let i=0;i<item.sets;i++){
      const s = e ? e.sets[i] : {w:"",r:"",done:false};
      const pw = hint.w!=null ? (hint.add ? "> "+hint.w : String(hint.w)) : "lb";
      const wv = s.w!=="" ? s.w : (hint.w!=null && !hint.add ? hint.w : "");
      const lr = last && last.sets[i] ? String(last.sets[i].r) : (item.lo+"–"+item.hi);
      h += '<div class="set'+(s.done?" is-done":"")+'"><span class="n">Set '+(i+1)+'</span>'+
        '<label class="field"><input id="w-'+item.id+'-'+i+'" inputmode="decimal" aria-label="Set '+(i+1)+' weight in pounds" data-w="'+item.id+'" data-i="'+i+'" value="'+esc(wv)+'" placeholder="'+esc(pw)+'"><i>lb</i></label>'+
        '<label class="field"><input id="r-'+item.id+'-'+i+'" inputmode="numeric" aria-label="Set '+(i+1)+' reps" data-r="'+item.id+'" data-i="'+i+'" value="'+esc(s.r)+'" placeholder="'+esc(lr)+'"><i>reps</i></label>'+
        '<button class="done" data-done="'+item.id+'" data-i="'+i+'" aria-pressed="'+(!!s.done)+'" aria-label="Mark set '+(i+1)+' done and start rest">✓</button></div>';
    }
    h += '</div></article>';
  }
  if(S.error) h += '<p class="note err">'+esc(S.error)+'</p>';
  if(draft){
    h += '<section class="stack"><button class="btn wide" data-act="save">Finish and save</button>';
    if(S.confirm==="discard") h += '<div class="confirm"><b>Discard this session?</b><span class="small">Nothing you typed will be saved.</span><div class="row"><button class="btn" data-act="discard-yes">Discard</button><button class="btn ghost" data-act="cancel">Keep going</button></div></div>';
    else h += '<button class="btn quiet" data-act="discard">Discard session</button>';
    h += '</section>';
  }
  return h;
}

function viewPlan(){
  let h = '<section class="panel"><h2>How it works</h2><ul class="rules">'+
    '<li><b>Go 3–4 times a week and do the next workout in the loop:</b> U1 → L1 → U2 → L2 → back to U1. No fixed days, so a missed day never breaks the plan.</li>'+
    '<li><b>About 35 minutes, hard cap at 40.</b> When the clock hits 40, save and leave. That counts as a full workout. The bonus move is the only thing you\'re allowed to skip.</li>'+
    '<li><b>Effort:</b> end each set when you have 0–2 more reps left in you. Going all the way to failure adds almost nothing and leaves you sorer for longer.</li>'+
    '<li><b>Heavy stuff first, small stuff last.</b> You get your best effort on the moves that build the most, and ending on easier sets makes you remember the workout as less miserable, which makes you more likely to come back.</li>'+
    '<li><b>Getting stronger:</b> once you hit the top of the rep range on every set, go up one pin (or the next dumbbell) next time. The Today tab tells you when.</li>'+
    '<li><b>Warm up</b> with one or two light sets of your first exercise. That\'s enough.</li>'+
    '<li><b>Rest alert:</b> tap ✓ after a set and the app beeps when rest is over. Keep the app open; the screen stays on during a session. The beep plays over your music but follows the ring/silent switch, so flip it to ring at the gym. Turn the beep off in Progress → Settings.</li>'+
    '</ul></section>';
  h += '<section class="panel"><h2>When the rec is packed</h2><ul class="rules">'+
    '<li>Every exercise has swaps in the drop-down. If a machine is taken, use the first free swap. Don\'t wait more than about 2 minutes.</li>'+
    '<li>Paired moves save time but mean using two stations. When it\'s busy, do them one after the other instead.</li>'+
    '<li>Asking "how many sets do you have left?" or "mind if I work in?" is normal gym etiquette.</li>'+
    '<li>Most college recs are busiest from late afternoon into the evening. Many post a live head count online. Early mornings and early afternoons are usually quieter.</li>'+
    '</ul></section>';
  h += '<section class="panel"><h2>The four workouts</h2>';
  for(const k of ROT){
    const W = PLAN[k];
    h += '<div class="wk"><div class="row spread" style="margin-top:6px"><h3>'+k+' · '+esc(W.name)+'</h3><span class="dose">≈'+W.mins+' min</span></div>';
    for(const it of W.items) h += '<div class="wk-row"><span class="t">'+esc(it.bonus?"+":it.tag)+'</span><span>'+esc(it.name)+(it.bonus?' <span class="muted small">(bonus)</span>':'')+'</span><span class="d">'+it.sets+'×'+it.lo+'–'+it.hi+'</span></div>';
    h += '</div>';
  }
  h += '</section>';
  h += $("#plan-extra").innerHTML;
  return h;
}

// ---------- progress ----------
function spark(vals){
  if(vals.length<2) return '<svg viewBox="0 0 112 34" aria-hidden="true"></svg>';
  const w=112,hgt=34,p=3,min=Math.min(...vals),max=Math.max(...vals),span=(max-min)||1;
  const pts = vals.map((v,i)=>[p+i*(w-2*p)/(vals.length-1), hgt-p-(v-min)*(hgt-2*p)/span]);
  const L = pts[pts.length-1];
  return '<svg viewBox="0 0 '+w+' '+hgt+'" aria-hidden="true"><polyline points="'+pts.map(q=>q[0].toFixed(1)+","+q[1].toFixed(1)).join(" ")+'" fill="none" stroke="var(--steel)" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="round"/><circle cx="'+L[0].toFixed(1)+'" cy="'+L[1].toFixed(1)+'" r="3" fill="var(--plate)"/></svg>';
}
function topSet(sets){ return sets.reduce((a,b)=> (b.w>a.w || (b.w===a.w && b.r>a.r)) ? b : a); }
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
  let h = '';
  const weekAgo = Date.now() - 7*864e5;
  const thisWeek = DB.sessions.filter(s=>s.at>=weekAgo).length;
  const avgMin = DB.sessions.length ? Math.round(DB.sessions.reduce((a,s)=>a+(s.minutes||0),0)/DB.sessions.length) : 0;
  h += '<section class="stats"><div class="stat"><b class="num">'+thisWeek+'</b><span>workouts in the last 7 days</span></div><div class="stat"><b class="num">'+DB.sessions.length+'</b><span>workouts total</span></div><div class="stat"><b class="num">'+(avgMin||"–")+'</b><span>average minutes</span></div></section>';

  const series = seriesByVariant(), names = Object.keys(series);
  h += '<section class="panel"><h2>Strength</h2>';
  if(!names.length) h += '<p class="muted">No workouts yet. Finish your first one on the Today tab and each exercise shows up here with its trend. Rising numbers are the earliest sign you\'re building muscle, weeks before the mirror shows it.</p>';
  else {
    h += '<p class="small muted">Heaviest set each workout, first → latest. Tap one for its full history.</p><div>';
    for(const n of names){
      const arr = series[n], f = arr[0], l = arr[arr.length-1], diff = r1(l.w - f.w);
      h += '<button class="prog" data-exhist="'+esc(n)+'"><span class="nm">'+esc(n)+'</span>'+spark(arr.slice(-12).map(x=>x.w))+'<span class="ch">'+(arr.length===1 ? esc(f.w)+'×'+esc(f.r)+' · first workout' : esc(f.w)+'×'+esc(f.r)+' → '+esc(l.w)+'×'+esc(l.r)+(diff>0?' <b>+'+diff+' lb</b>':''))+'</span></button>';
    }
    h += '</div>';
  }
  h += '</section>';

  h += '<section class="panel"><h2>Monthly check-in</h2>'+$("#checkin-help").innerHTML+
    '<form id="ci-form" class="stack"><div class="ci">'+
    '<label for="ci-weight">Bodyweight (lb)<input id="ci-weight" inputmode="decimal"></label>'+
    '<label for="ci-waist">Waist at navel (in)<input id="ci-waist" inputmode="decimal"></label>'+
    '<label for="ci-neck">Neck (in)<input id="ci-neck" inputmode="decimal"></label>'+
    '<label for="ci-shoulders">Shoulders (in)<input id="ci-shoulders" inputmode="decimal"></label>'+
    '<label for="ci-arm">Upper arm, flexed (in)<input id="ci-arm" inputmode="decimal"></label>'+
    '</div><button class="btn" type="submit">Save check-in</button></form>';
  if(DB.checkins.length){
    const cols = [["weight","Weight"],["waist","Waist"],["neck","Neck"],["shoulders","Shoulders"],["arm","Arm"]];
    h += '<div class="tbl-wrap"><table><thead><tr><th>Date</th>'+cols.map(c=>'<th class="num">'+c[1]+'</th>').join("")+'<th></th></tr></thead><tbody>';
    for(const c of DB.checkins) h += '<tr><td>'+fmtDate(c.at)+'</td>'+cols.map(k=>'<td class="num mono">'+(c[k[0]]!=null?esc(c[k[0]]):"–")+'</td>').join("")+'<td><button class="btn quiet" style="padding:0" data-delci="'+esc(c.id)+'" aria-label="Delete this check-in">×</button></td></tr>';
    if(DB.checkins.length>1){
      const a = DB.checkins[DB.checkins.length-1], b = DB.checkins[0];
      h += '<tr><td><b>Change</b></td>'+cols.map(k=>{ const x=a[k[0]], y=b[k[0]]; if(x==null||y==null) return '<td class="num">–</td>'; const d=r1(y-x); return '<td class="num mono"><b>'+(d>0?"+":"")+d+'</b></td>'; }).join("")+'<td></td></tr>';
    }
    h += '</tbody></table></div>';
  }
  h += '</section>';

  h += '<section class="panel"><h2>History</h2>';
  if(!DB.sessions.length) h += '<p class="muted">Saved workouts appear here. Tap one to fix a weight or rep count.</p>';
  else h += '<p class="small muted">Tap a workout to fix a typo or delete it.</p><div>';
  for(const s of DB.sessions.slice(0,60)){
    const sets = (s.entries||[]).reduce((a,e)=>a+(e.sets?e.sets.length:0),0);
    h += '<button class="hist" data-edit="'+esc(s.id)+'"><span><b>'+esc((PLAN[s.workout]||{name:s.workout}).name)+'</b> <span class="muted small">· '+sets+' sets · '+(s.minutes||"?")+' min</span></span><span class="chev" aria-hidden="true">›</span><span class="when">'+fmtDate(s.at)+'</span></button>';
  }
  if(DB.sessions.length) h += '</div>';
  h += '</section>';

  const lb = DB.lastBackup ? fmtDate(DB.lastBackup) : "never";
  const stale = !DB.lastBackup || Date.now() - DB.lastBackup > 14*864e5;
  h += '<section class="panel"><h2>Settings and backup</h2>'+
    '<label class="switch" for="set-bw"><span>Bodyweight for your protein goal (lb)</span><input id="set-bw" class="inp" style="max-width:110px" inputmode="decimal" value="'+esc(DB.settings.bodyweight||"")+'" placeholder="e.g. 150"></label>'+
    '<label class="switch" for="set-sound"><span>Beep when rest is over <span class="small muted">(silent switch must be on ring)</span></span><input type="checkbox" id="set-sound"'+(DB.settings.sound?" checked":"")+'></label>'+
    '<button class="btn ghost sm" style="justify-self:start" data-act="test-sound">Test the beep</button>'+
    '<p class="small muted">Your log is stored only on this phone. Export a backup every couple of weeks (save it to Files or send it to yourself) so a lost or reset phone doesn\'t take your log with it.</p>'+
    (stale && (DB.sessions.length || DB.checkins.length) ? '<p class="note err">Last backup: '+lb+'.</p>' : '<p class="small muted">Last backup: '+lb+'.</p>')+
    '<div class="row"><button class="btn dark sm" data-act="export">Export backup</button><label class="btn ghost sm" for="imp-file" style="display:inline-block">Import backup</label><input id="imp-file" type="file" hidden><button class="btn ghost sm" data-act="copy-backup">Copy as text</button></div>'+
    '<details><summary class="small muted">Paste a backup instead (or your log from the claude.ai page)</summary><form id="paste-form" class="stack" style="margin-top:8px"><textarea id="paste-in" class="inp" rows="4" aria-label="Backup text" placeholder="Paste here"></textarea><button class="btn dark sm" style="justify-self:start" type="submit">Import pasted text</button></form></details>'+
    '</section>';
  return h;
}

// ---------- protein ----------
function target(){
  let bw = num(DB.settings.bodyweight);
  if(!bw){ const c = DB.checkins.find(x=>x.weight); if(c) bw = c.weight; }
  if(!bw || bw < 60 || bw > 600) return null;
  return {bw, min:Math.round(bw*0.7), max:Math.round(bw*1.0)};
}
function dayTotal(k){ return (DB.protein[k]||[]).reduce((a,e)=>a+(e.g||0),0); }
function addProtein(g, label){
  g = r1(g); if(!(g>0)) return;
  const k = dayKey();
  (DB.protein[k] = DB.protein[k] || []).push({t:Date.now(), g, label:String(label||"").slice(0,80)});
  persist(); toast("Added "+Math.round(g)+" g");
}
function viewProtein(){
  const t = target(), k = dayKey(), total = Math.round(dayTotal(k)), list = DB.protein[k] || [];
  let h = '<section class="panel pro-head">';
  h += '<div class="row spread" style="align-items:flex-end"><div class="pro-num num">'+total+'<small> g today</small></div>';
  if(t){
    const left = Math.max(0, t.min - total);
    h += '<div class="small muted" style="text-align:right">'+(left>0 ? left+' g to your minimum' : (total>=t.max ? 'Top of your range. Done for today.' : 'Minimum hit. Anything more is a bonus.'))+'</div></div>';
    const scale = Math.max(t.max, total) * 1.05;
    h += '<div class="meter" role="img" aria-label="'+total+' of '+t.min+' to '+t.max+' grams"><div class="fill" style="width:'+Math.min(100, total/scale*100).toFixed(1)+'%"></div><div class="band" style="left:'+(t.min/scale*100).toFixed(1)+'%;width:'+((t.max-t.min)/scale*100).toFixed(1)+'%"></div></div>';
    h += '<div class="row spread small muted"><span>Goal '+t.min+'–'+t.max+' g (0.7–1 g per lb)</span><span>at '+t.bw+' lb</span></div>';
  } else {
    h += '</div><form id="bw-form" class="row"><label class="small muted" for="bw-in" style="flex:1 1 100%">Your bodyweight sets the goal (0.7–1 g of protein per pound).</label><input id="bw-in" class="inp" inputmode="decimal" placeholder="lb" style="max-width:120px"><button class="btn sm" type="submit">Set goal</button></form>';
  }
  h += '</section>';

  h += '<section class="stack"><button class="btn wide" data-act="scan">Scan a barcode</button>'+
    '<form id="custom-form" class="row" style="flex-wrap:nowrap"><label class="field" style="flex:1"><input id="custom-g" inputmode="decimal" placeholder="Grams of protein" aria-label="Grams of protein"><i>g</i></label><button class="btn dark sm" type="submit">Add</button></form></section>';

  if(DB.foods.length){
    h += '<section class="panel"><h3>Scanned before</h3><div class="foods">';
    DB.foods.slice(0,8).forEach(f=>{ const per = f.pServing!=null ? [Math.round(f.pServing)+' g', f.servingLabel||"per serving"] : (f.p100!=null ? [Math.round(f.p100)+' g', "per 100 g"] : ["?", "tap to set"]); h += '<button class="food" data-recent="'+esc(f.code)+'"><b>'+esc(per[0])+'</b><span>'+esc(f.name||"Scanned item")+'</span><small>'+esc(per[1])+'</small></button>'; });
    h += '</div></section>';
  }

  h += '<section class="panel"><h3>Quick add</h3><div class="foods">';
  FOODS.forEach((f,i)=>{ h += '<button class="food" data-food="'+i+'"><b>'+f.g+' g</b><span>'+esc(f.name)+'</span><small>'+esc(f.portion)+'</small></button>'; });
  h += '</div><p class="small muted">Typical amounts. The label on your actual food beats these numbers.</p></section>';

  h += '<section class="panel"><h3>Today</h3>';
  if(!list.length) h += '<p class="muted">Nothing logged yet today.</p>';
  else list.slice().reverse().forEach((e,ri)=>{
    const i = list.length-1-ri;
    h += '<div class="entry"><span class="g">'+Math.round(e.g)+' g</span><span>'+esc(e.label||"Protein")+' <span class="small muted">'+new Date(e.t).toLocaleTimeString(undefined,{hour:"numeric",minute:"2-digit"})+'</span></span><button class="x" data-prm="'+i+'" aria-label="Remove '+Math.round(e.g)+' g">×</button></div>';
  });
  h += '</section>';

  // last 7 days
  const days = [];
  for(let i=6;i>=0;i--){ const d = new Date(); d.setDate(d.getDate()-i); days.push({k:dayKey(d), d}); }
  const vals = days.map(x=>Math.round(dayTotal(x.k)));
  const top = Math.max(t ? t.max : 0, ...vals, 1) * 1.1;
  h += '<section class="panel"><h3>Last 7 days</h3><div class="week">';
  if(t) h += '<div class="goal" style="bottom:'+(18 + t.min/top*90).toFixed(0)+'px" aria-hidden="true"></div>';
  days.forEach((x,i)=>{
    const v = vals[i], hit = t && v >= t.min;
    h += '<div class="col"><span class="v">'+(v||"")+'</span><div class="b'+(hit?" hit":"")+'" style="height:'+Math.max(v?3:0, v/top*90).toFixed(0)+'px"></div><span class="d">'+x.d.toLocaleDateString(undefined,{weekday:"narrow"})+'</span></div>';
  });
  h += '</div>'+(t?'<p class="small muted">Red bars hit your '+t.min+' g minimum. The dashed line marks it.</p>':'')+'</section>';
  h += $("#protein-notes").innerHTML;
  return h;
}

// =====================================================================
// Sheets: edit a workout, one exercise's history, the barcode scanner
// =====================================================================
function openSheet(kind, data){ S.sheet = Object.assign({kind}, data||{}); document.body.classList.add("locked"); renderSheet(); }
function closeSheet(){
  if(S.sheet && S.sheet.kind==="scan") parkCamera();
  S.sheet = null; S.edit = null; S.confirm = null;
  document.body.classList.remove("locked");
  $("#sheet-root").innerHTML = "";
}
function renderSheet(){
  const root = $("#sheet-root"), sh = S.sheet;
  if(!sh){ root.innerHTML = ""; return; }
  let inner = "";
  if(sh.kind==="edit") inner = sheetEdit();
  else if(sh.kind==="exhist") inner = sheetExHist(sh.variant);
  else if(sh.kind==="scan") inner = sheetScan();
  else if(sh.kind==="food") inner = sheetFood();
  root.innerHTML = '<div class="sheet" data-scrim="1"><div class="sheet-in'+(sh.kind==="scan"?" full":"")+'" role="dialog" aria-modal="true">'+inner+'</div></div>';
  if(sh.kind==="scan") attachCamera();
}

function sheetEdit(){
  const s = S.edit;
  let h = '<div class="sheet-head"><h2>'+esc((PLAN[s.workout]||{name:s.workout}).name)+'</h2><button class="btn quiet" data-act="close">Close</button></div>';
  h += '<p class="small muted">'+fmtDate(s.at)+' · '+(s.minutes||"?")+' min. Change any number, then save.</p>';
  s.entries.forEach((e,ei)=>{
    h += '<div class="panel"><div class="row spread"><h3>'+esc(e.variant)+'</h3><button class="btn quiet" style="padding:0" data-rmex="'+ei+'">Remove</button></div>';
    e.sets.forEach((st,si)=>{
      h += '<div class="edit-set"><span class="mono small muted">Set '+(si+1)+'</span>'+
        '<label class="field"><input inputmode="decimal" aria-label="Weight" data-ew="'+ei+'" data-si="'+si+'" value="'+esc(st.w)+'"><i>lb</i></label>'+
        '<label class="field"><input inputmode="numeric" aria-label="Reps" data-er="'+ei+'" data-si="'+si+'" value="'+esc(st.r)+'"><i>reps</i></label>'+
        '<button class="rm" data-rmset="'+ei+':'+si+'" aria-label="Remove set '+(si+1)+'">×</button></div>';
    });
    h += '<button class="btn ghost sm" style="justify-self:start" data-addset="'+ei+'">+ Add set</button></div>';
  });
  if(!s.entries.length) h += '<p class="note">No exercises left. Save to keep it empty, or delete the workout.</p>';
  h += '<button class="btn wide" data-act="edit-save">Save changes</button>';
  if(S.confirm==="edit-del") h += '<div class="confirm"><b>Delete this workout?</b><span class="small">This can\'t be undone (unless you have a backup).</span><div class="row"><button class="btn" data-act="edit-del-yes">Delete</button><button class="btn ghost" data-act="cancel-sheet">Keep it</button></div></div>';
  else h += '<button class="btn quiet" data-act="edit-del">Delete this workout</button>';
  return h;
}
function sheetExHist(variant){
  const rows = [];
  for(const s of DB.sessions){
    const e = (s.entries||[]).find(x=>x.variant===variant);
    if(e && e.sets.length) rows.push({s, e});
  }
  let h = '<div class="sheet-head"><h2>'+esc(variant)+'</h2><button class="btn quiet" data-act="close">Close</button></div>';
  if(!rows.length) return h + '<p class="muted">No sets logged for this one yet.</p>';
  const best = rows.reduce((a,x)=>{ const t = topSet(x.e.sets); return (!a || t.w>a.w || (t.w===a.w && t.r>a.r)) ? t : a; }, null);
  h += '<p class="small muted">'+rows.length+' workout'+(rows.length===1?'':'s')+'. Best set: <b class="mono">'+esc(best.w)+' lb × '+esc(best.r)+'</b>. Tap a row to fix it.</p><div class="panel" style="padding-block:4px">';
  rows.forEach(x=>{
    h += '<button class="hist" data-edit="'+esc(x.s.id)+'"><span class="mono" style="font-size:14px">'+x.e.sets.map(st=>esc(st.w)+'×'+esc(st.r)).join(', ')+'</span><span class="chev" aria-hidden="true">›</span><span class="when">'+fmtDate(x.s.at)+'</span></button>';
  });
  return h + '</div>';
}

// ---------- barcode scanning ----------
// iPhone home-screen apps can re-ask for camera permission, so after a scan the stream is kept
// for a minute (camera paused) and reused if you scan again, then released.
let stream = null, scanTimer = null, detector = null, scanBusy = false, parkTimer = null;
function sheetScan(){
  const sh = S.sheet;
  let h = '<div class="sheet-head"><h2>Scan</h2><button class="btn quiet" data-act="close">Cancel</button></div>';
  h += '<div class="scanbox"><video id="scan-video" playsinline muted autoplay></video><div class="aim" aria-hidden="true"></div></div>';
  h += '<p class="small muted" id="scan-status" role="status">'+esc(sh.status || "Starting the camera…")+'</p>';
  h += '<form id="code-form" class="row" style="flex-wrap:nowrap"><input id="code-in" class="inp" inputmode="numeric" placeholder="Or type the barcode number" aria-label="Barcode number" style="flex:1"><button class="btn dark sm" type="submit">Look up</button></form>';
  return h;
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
      ? "Camera access is off. Allow it in Settings → Safari → Camera (or for this app), or type the number below."
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
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="hidden") stopCamera(); });

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
  const res = await fetch("https://api.nal.usda.gov/fdc/v1/foods/search?api_key=DEMO_KEY&dataType=Branded&pageSize=5&query="+encodeURIComponent(q));
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
  return {code, name, brand:hit.brandName||hit.brandOwner||"", pServing,
    servingLabel:hit.householdServingFullText || (ss ? ss+" "+u : ""), p100, unit:u, source:"usda"};
}
function sheetFood(){
  const sh = S.sheet, f = sh.food;
  let h = '<div class="sheet-head"><h2>'+(sh.missing ? "Not found" : "Add protein")+'</h2><button class="btn quiet" data-act="close">Cancel</button></div>';
  if(sh.missing){
    h += '<p class="muted">'+(sh.offline ? "Couldn't reach the food databases (no signal, or they're busy)." : "This barcode isn't in the food databases yet.")+' Read the protein off the label once and the app will remember it for next time.</p>';
  } else {
    h += '<div class="result"><h3 style="font-size:24px">'+esc(f.name || "Unnamed product")+'</h3>'+(f.brand?'<p class="muted">'+esc(f.brand)+'</p>':'');
    if(f.pServing!=null) h += '<p><b class="mono">'+esc(f.pServing)+' g</b> protein per serving'+(f.servingLabel?' <span class="muted">('+esc(f.servingLabel)+')</span>':'')+'</p>';
    if(f.p100!=null) h += '<p class="small muted">'+esc(r1(f.p100))+' g per 100 '+(f.unit==="ml"?"ml":"g")+'</p>';
    const src = {off:"From Open Food Facts, a volunteer database.", usda:"From USDA FoodData Central (label data the brand submitted)."}[f.source];
    h += '<p class="small muted">'+(src ? src+" If it doesn't match your label, fix it below." : "Saved on this phone from a previous scan.")+'</p></div>';
  }
  const needServing = f.pServing==null;
  if(needServing && f.p100!=null && !sh.missing){
    h += '<label class="small muted" for="food-grams">This product has no serving size listed. How many grams did you eat?</label><label class="field"><input id="food-grams" inputmode="decimal" value="'+esc(sh.grams||"")+'" placeholder="e.g. 150"><i>g</i></label>';
  } else {
    if(sh.missing || sh.fix){
      h += '<div class="stack"><label class="small muted" for="food-name">Name (optional)</label><input id="food-name" class="inp" value="'+esc(f.name||"")+'" placeholder="e.g. Chocolate protein bar">'+
        '<label class="small muted" for="food-p">Protein per serving, from the label</label><label class="field"><input id="food-p" inputmode="decimal" value="'+esc(f.pServing!=null?f.pServing:"")+'" placeholder="g"><i>g</i></label>'+
        '<label class="small muted" for="food-sl">Serving size (optional)</label><input id="food-sl" class="inp" value="'+esc(f.servingLabel||"")+'" placeholder="e.g. 1 bar"></div>';
    }
    h += '<div class="label">Servings</div><div class="stepper"><button data-step="-0.5" aria-label="Half a serving less">−</button><output id="food-serv">'+sh.servings+'</output><button data-step="0.5" aria-label="Half a serving more">+</button></div>';
  }
  const g = foodGrams();
  h += '<button class="btn wide" data-act="food-add"'+(g>0?"":" disabled")+'>'+(g>0 ? "Add "+Math.round(g)+" g" : "Enter the protein to add it")+'</button>';
  if(!sh.missing && !sh.fix && f.pServing!=null) h += '<button class="btn quiet" data-act="food-fix">The numbers are wrong? Fix them</button>';
  if(!sh.missing) h += '<p class="small muted">Barcode '+esc(f.code)+'</p>';
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
  DB.foods.unshift({code:f.code, name:f.name||"", brand:f.brand||"", pServing:f.pServing, servingLabel:f.servingLabel||"", p100:f.p100!=null?f.p100:null, source:f.source==="off"?"off":"you"});
  DB.foods = DB.foods.slice(0,40);
}

// =====================================================================
// Timer bar
// =====================================================================
let ticker = null, flashed = false;
function startTicker(){ if(!ticker) ticker = setInterval(tick, 1000); }
function stopTicker(){ if(ticker){ clearInterval(ticker); ticker = null; } }
function tick(){
  if(!draft){ stopTicker(); return; }
  const el = (Date.now() - draft.startedAt)/1000, mins = el/60;
  let p = "";
  for(let i=0;i<8;i++){
    const lo = i*5, hi = lo+5;
    if(mins>=hi) p += '<div class="plate full"><span>'+hi+'</span></div>';
    else if(mins>lo) p += '<div class="plate"><div class="fill" style="width:'+((mins-lo)/5*100).toFixed(0)+'%"></div><span>'+hi+'</span></div>';
    else p += '<div class="plate"><span>'+hi+'</span></div>';
  }
  $("#stack").innerHTML = p;
  $("#clock").textContent = mmss(el)+" of 40:00";
  const r = $("#rest"), m = $("#barmsg"), bar = $("#bar");
  if(draft.restEnd){
    const left = (draft.restEnd - Date.now())/1000;
    if(left>0){ r.className = "rest"; r.innerHTML = '<small>Rest · tap to skip</small>'+mmss(left); flashed = false; }
    else {
      r.className = "rest go"; r.innerHTML = '<small>Rest done</small>Go';
      if(!flashed){ flashed = true; bar.classList.remove("flash"); void bar.offsetWidth; bar.classList.add("flash"); try{ navigator.vibrate && navigator.vibrate([200,100,200]); }catch(e){} }
    }
  } else { r.className = "rest"; r.innerHTML = '<small>Rest</small>–'; }
  if(mins>=40){ m.hidden = false; m.textContent = "40 minutes. You're done: tap Finish and save, then go home."; }
  else if(mins>=33){ m.hidden = false; m.textContent = "Under 7 minutes left. Skip the bonus move if you need to."; }
  else m.hidden = true;
}
let wake = null;
async function requestWake(){ try{ if(navigator.wakeLock && !wake && document.visibilityState==="visible"){ wake = await navigator.wakeLock.request("screen"); wake.addEventListener("release",()=>{ wake = null; }); } }catch(e){ wake = null; } }
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible"){ if(draft){ requestWake(); tick(); } if(UI.tab==="protein") renderSafe(); } });

// =====================================================================
// Events
// =====================================================================
document.querySelector("nav.tabs").addEventListener("click", e=>{
  const b = e.target.closest("button[data-tab]"); if(!b) return;
  UI.tab = b.dataset.tab; S.confirm = null; S.error = null; saveUI(); render(); window.scrollTo(0,0);
});
$("#rest").addEventListener("click", ()=>{ if(draft && draft.restEnd){ draft.restEnd = null; saveDraft(); cancelBeep(); tick(); } });

const view = $("#view");
view.addEventListener("click", e=>{
  const c = e.target.closest("a.cite");
  if(c){
    e.preventDefault();
    const id = c.getAttribute("href").slice(1);
    if(UI.tab!=="why"){ UI.tab = "why"; saveUI(); render(); }
    const el = document.getElementById(id);
    if(el){ el.scrollIntoView({block:"center"}); el.classList.add("flash"); setTimeout(()=>el.classList.remove("flash"), 1800); }
    return;
  }
  const t = e.target.closest("button"); if(!t) return;
  const d = t.dataset;
  if(d.pick){ S.chosen = d.pick; S.error = null; render(); return; }
  if(d.done){
    const item = PLAN[currentKey()].items.find(x=>x.id===d.done), i = +d.i;
    const en = entryFor(item), s = en.sets[i];
    const wIn = $("#w-"+item.id+"-"+i);
    if(s.w==="" && wIn && wIn.value) s.w = wIn.value;
    s.done = !s.done;
    if(s.done){ draft.restEnd = Date.now() + item.rest*1000; scheduleBeep(item.rest); requestWake(); }
    else { draft.restEnd = null; cancelBeep(); }
    saveDraft(); render(); return;
  }
  if(d.exhist){ openSheet("exhist", {variant:d.exhist}); return; }
  if(d.edit){ openEdit(d.edit); return; }
  if(d.delci){ DB.checkins = DB.checkins.filter(x=>x.id!==d.delci); persist(); render(); toast("Check-in deleted"); return; }
  if(d.food){ const f = FOODS[+d.food]; if(f){ addProtein(f.g, f.name+" ("+f.portion+")"); render(); } return; }
  if(d.recent){ const f = DB.foods.find(x=>x.code===d.recent); if(f) openSheet("food", {food:Object.assign({}, f), servings:1}); return; }
  if(d.prm){ const k = dayKey(), list = DB.protein[k] || []; list.splice(+d.prm, 1); if(!list.length) delete DB.protein[k]; persist(); render(); return; }
  switch(d.act){
    case "hide-install": UI.hideInstall = true; saveUI(); render(); return;
    case "start": audio(); ensureDraft(); render(); return;
    case "discard": S.confirm = "discard"; render(); return;
    case "cancel": S.confirm = null; render(); return;
    case "discard-yes": endSession(); render(); return;
    case "save": saveSession(); return;
    case "scan": openSheet("scan", {}); return;
    case "export": exportBackup(); return;
    case "copy-backup": copyBackup(); return;
    case "test-sound": audio(); scheduleBeep(0.05); if(!DB.settings.sound) toast("The beep is turned off"); return;
  }
});
view.addEventListener("input", e=>{
  const t = e.target;
  if(t.dataset.w || t.dataset.r){
    const id = t.dataset.w || t.dataset.r, i = +t.dataset.i;
    const item = PLAN[currentKey()].items.find(x=>x.id===id);
    const wasNew = !draft;
    entryFor(item).sets[i][t.dataset.w ? "w" : "r"] = t.value.trim();
    saveDraft();
    if(wasNew){ $("#bar").hidden = false; document.body.classList.add("running"); tick(); S.dirty = true; }
  }
});
view.addEventListener("change", e=>{
  const t = e.target;
  if(t.dataset.swap){
    const item = PLAN[currentKey()].items.find(x=>x.id===t.dataset.swap);
    const en = entryFor(item); en.variant = t.value;
    const w = prefillW(item, t.value);
    en.sets.forEach(s=>{ if(!s.done) s.w = w; });
    saveDraft(); render(); return;
  }
  if(t.id==="set-bw"){ const v = num(t.value); DB.settings.bodyweight = v && v>=60 && v<=600 ? v : null; persist(); toast(DB.settings.bodyweight ? "Protein goal updated" : "Bodyweight cleared"); return; }
  if(t.id==="set-sound"){ DB.settings.sound = t.checked; persist(); if(t.checked){ audio(); } return; }
  if(t.id==="imp-file" && t.files && t.files[0]){
    const fr = new FileReader();
    fr.onload = ()=>{ importBackup(String(fr.result||"")); t.value = ""; };
    fr.readAsText(t.files[0]);
  }
});
view.addEventListener("focusout", ()=>{ setTimeout(()=>{ if(S.dirty) renderSafe(); }, 0); });
view.addEventListener("submit", e=>{
  e.preventDefault();
  const f = e.target;
  if(f.id==="ci-form"){
    const g = k => { const v = num($("#ci-"+k).value); return v && v>0 ? v : null; };
    const at = Date.now();
    const doc = {id:"c-"+at, at, weight:g("weight"), waist:g("waist"), neck:g("neck"), shoulders:g("shoulders"), arm:g("arm")};
    if(["weight","waist","neck","shoulders","arm"].every(k=>doc[k]==null)){ toast("Enter at least one measurement first."); return; }
    DB.checkins.push(doc); persist(); render(); toast("Check-in saved");
  }
  if(f.id==="bw-form"){ const v = num($("#bw-in").value); if(v && v>=60 && v<=600){ DB.settings.bodyweight = v; persist(); render(); } else toast("Enter your weight in pounds."); }
  if(f.id==="paste-form"){ const v = $("#paste-in").value.trim(); if(v) importBackup(v); else toast("Paste the backup text first."); }
  if(f.id==="custom-form"){ const v = num($("#custom-g").value); if(v && v>0 && v<400){ addProtein(v, "Custom"); render(); } else toast("Enter the grams of protein."); }
});

// sheet events
const sroot = $("#sheet-root");
sroot.addEventListener("click", e=>{
  if(e.target.dataset && e.target.dataset.scrim){ closeSheet(); return; }
  const t = e.target.closest("button"); if(!t) return;
  const d = t.dataset;
  if(d.edit){ openEdit(d.edit); return; }
  if(d.step && S.sheet){ S.sheet.servings = Math.max(0.5, Math.min(20, S.sheet.servings + parseFloat(d.step))); syncFoodInputs(); renderSheet(); return; }
  if(d.addset && S.edit){ const e2 = S.edit.entries[+d.addset], last = e2.sets[e2.sets.length-1]; e2.sets.push({w:last?last.w:0, r:last?last.r:0}); renderSheet(); return; }
  if(d.rmset && S.edit){ const [ei,si] = d.rmset.split(":").map(Number); S.edit.entries[ei].sets.splice(si,1); if(!S.edit.entries[ei].sets.length) S.edit.entries.splice(ei,1); renderSheet(); return; }
  if(d.rmex && S.edit){ S.edit.entries.splice(+d.rmex,1); renderSheet(); return; }
  switch(d.act){
    case "close": closeSheet(); return;
    case "cancel-sheet": S.confirm = null; renderSheet(); return;
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
    case "food-fix": syncFoodInputs(); S.sheet.fix = true; renderSheet(); return;
    case "food-add": {
      syncFoodInputs();
      const sh = S.sheet, f = sh.food, g = foodGrams();
      if(!(g>0)) return;
      const label = (f.name || "Scanned item") + (f.pServing!=null ? " ×"+sh.servings : (sh.grams ? " ("+sh.grams+" g)" : ""));
      if(sh.missing || sh.fix) f.source = "you";
      rememberFood(f);
      addProtein(g, label);
      closeSheet(); render(); return;
    }
  }
});
sroot.addEventListener("input", e=>{
  const t = e.target, s = S.edit;
  if(s && t.dataset.ew!=null){ s.entries[+t.dataset.ew].sets[+t.dataset.si].w = t.value; return; }
  if(s && t.dataset.er!=null){ s.entries[+t.dataset.er].sets[+t.dataset.si].r = t.value; return; }
  if(S.sheet && S.sheet.kind==="food"){
    syncFoodInputs();
    const b = sroot.querySelector('[data-act="food-add"]'), g = foodGrams();
    if(b){ b.disabled = !(g>0); b.textContent = g>0 ? "Add "+Math.round(g)+" g" : "Enter the protein to add it"; }
  }
});
sroot.addEventListener("submit", e=>{
  e.preventDefault();
  if(e.target.id==="code-form"){ const v = $("#code-in").value.replace(/\D/g,""); if(v){ stopCamera(); lookup(v); } }
});
function syncFoodInputs(){
  const sh = S.sheet; if(!sh || sh.kind!=="food") return;
  const n = $("#food-name"), p = $("#food-p"), sl = $("#food-sl"), gr = $("#food-grams");
  if(n) sh.food.name = n.value.trim();
  if(p){ const v = num(p.value); sh.food.pServing = v && v>0 ? v : null; }
  if(sl) sh.food.servingLabel = sl.value.trim();
  if(gr) sh.grams = gr.value.trim();
}
function openEdit(id){
  const s = DB.sessions.find(x=>x.id===id); if(!s) return;
  S.edit = JSON.parse(JSON.stringify(s));
  S.confirm = null;
  openSheet("edit", {});
}

// =====================================================================
// Save, backup, import
// =====================================================================
function saveSession(){
  S.error = null;
  if(!draft) return;
  const W = PLAN[draft.workout], entries = [];
  for(const item of W.items){
    const en = draft.entries[item.id]; if(!en) continue;
    const sets = en.sets.map(s=>({w:num(s.w)||0, r:parseInt(s.r,10)||0})).filter(s=>s.r>0);
    if(sets.length) entries.push({ex:item.id, variant:en.variant, sets});
  }
  if(!entries.length){ S.error = "Type the reps for at least one set before saving."; render(); return; }
  const at = Date.now();
  const doc = {id:"s-"+at, at, workout:draft.workout, minutes:Math.max(1, Math.round((at-draft.startedAt)/60000)), entries};
  DB.sessions.push(doc);
  if(!persist()){ DB.sessions = DB.sessions.filter(x=>x!==doc); S.error = "Couldn't save on this phone. Your sets are still here."; render(); return; }
  const done = draft.workout;
  endSession();
  toast("Saved. Next time: "+PLAN[ROT[(ROT.indexOf(done)+1)%ROT.length]].name);
  window.scrollTo(0,0); render();
}
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
  let d; try{ d = JSON.parse(text); }catch(e){ toast("That file isn't a Rotation backup."); return; }
  if(!d || (!Array.isArray(d.sessions) && !Array.isArray(d.checkins))){ toast("That file isn't a Rotation backup."); return; }
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
  if(d.settings && !DB.settings.bodyweight && d.settings.bodyweight) DB.settings.bodyweight = d.settings.bodyweight;
  persist(); render();
  toast("Imported "+ns+" workout"+(ns===1?"":"s")+" and "+nc+" check-in"+(nc===1?"":"s"));
}

// =====================================================================
// Boot
// =====================================================================
if(draft) startTicker();
render();
if("serviceWorker" in navigator){ window.addEventListener("load", ()=>{ navigator.serviceWorker.register("sw.js").catch(()=>{}); }); }
})();

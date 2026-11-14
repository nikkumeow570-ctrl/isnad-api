/* End-to-end smoke test: opens the app in English and Tamil, clicks every control (3 levels deep) and fails on JS errors, sideways scroll, 404s or screens stuck loading.
   Run: serve mobile/ on port 4103 (after tools/pack_data.py), then `node mobile/tools/smoke.js` (needs playwright). */
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const res={errs:new Set(),clicks:0,hscroll:new Set(),broken:new Set(),stuck:new Set()};
for(const lang of ['en','ta']){
const p=await b.newPage({viewport:{width:360,height:740}});
p.on('pageerror',e=>res.errs.add(lang+': '+e.message.slice(0,120)));
p.on('response',r=>{if(r.status()>=400&&!r.url().includes('everyayah'))res.broken.add(r.status()+' '+r.url().replace('http://localhost:4103',''))});
await p.addInitScript((l)=>{localStorage.setItem('thw_settings',JSON.stringify({lang:l,onboarded:true,city:'Coimbatore',lat:11.0168,lng:76.9558,tz:5.5}));window.open=()=>null;window.confirm=()=>true;window.alert=()=>{}},lang);
await p.goto('http://localhost:4103/index.html');await p.waitForTimeout(1200);
const seen=new Set();
async function crawl(depth){
 const acts=await p.$$eval('[data-act]',els=>els.map((e,i)=>({i,act:e.dataset.act,k:e.dataset.act+'|'+(e.dataset.v||e.dataset.id||e.dataset.n||e.dataset.k||'')+'|'+(e.textContent||'').trim().slice(0,20)})));
 for(const a of acts){ if(a.act.match(/^(trk|share|export|import|reset|clear|del|loc|gps|geo|perm|pick)/))continue; if(seen.has(lang+a.k))continue; seen.add(lang+a.k);
  try{const els=await p.$$('[data-act]');const el=els[a.i];if(!el)continue;await el.click({timeout:1500,force:true});res.clicks++;await p.waitForTimeout(250);
   if(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2))res.hscroll.add(lang+' '+a.k);
   if(await p.evaluate(()=>/Loading|ஏற்றப்படுகிறது/.test(document.querySelector('main').innerText.slice(0,200))))res.stuck.add(lang+' '+a.k);
   if(depth<3)await crawl(depth+1);
   // go home via tabs
  }catch(e){}
 }
}
for(const t of ['times','more','set']){await p.evaluate(t=>{tab=t;moreSub=null;setSub=null;praySub=null;duaOpen=null;akSet=null;render()},t);await p.waitForTimeout(300);await crawl(0)}
await p.close()}
console.log('clicks',res.clicks);console.log('errors',[...res.errs]);console.log('hscroll',[...res.hscroll].slice(0,10));console.log('broken',[...res.broken].slice(0,10));console.log('stuck',[...res.stuck].slice(0,10));
if(res.errs.size||res.hscroll.size||res.broken.size||res.stuck.size||res.clicks<50){console.log('SMOKE FAIL');process.exit(1)}console.log('smoke ok');
await b.close()})();

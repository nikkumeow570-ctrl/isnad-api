(function(){
  var h=document.documentElement,k='isnad_site_lang',l='';
  try{l=localStorage.getItem(k)||''}catch(e){}
  if(l!=='ta'&&l!=='en')l=(navigator.language||'').toLowerCase().indexOf('ta')===0?'ta':'en';
  function set(v){h.setAttribute('data-lang',v);h.lang=v;try{localStorage.setItem(k,v)}catch(e){}
    document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===v)})}
  set(l);
  document.addEventListener('click',function(e){var b=e.target.closest('.lang button');if(b)set(b.dataset.l)});
})();

/* numbers: load stats.json, count up once when the section is seen */
(function(){
  var fmt=function(n){return n.toLocaleString('en-US')};
  var names={bukhari:["Sahih al-Bukhari","ஸஹீஹ் புகாரி"],muslim:["Sahih Muslim","ஸஹீஹ் முஸ்லிம்"],quran:["Quran (Arabic and Tamil)","குர்ஆன் (அரபி, தமிழ்)"],articles:["Courses and articles","பாடங்கள், கட்டுரைகள்"],shamail:["Shama'il at-Tirmidhi","ஷமாயில் திர்மிதி"],lulu:["Al-Lu'lu' wal-Marjan","லுஃலுஉ வல் மர்ஜான்"],riyad:["Riyad as-Salihin","ரியாளுஸ் ஸாலிஹீன்"],abudawud:["Abu Dawud (selection)","அபூதாவூத் (தேர்வு)"],dua:["Duas and etiquettes","துஆக்கள், ஒழுக்கங்கள்"]};
  var sec=document.getElementById('numbers');if(!sec)return;
  function build(d){
    var rows=Object.keys(d.sources).sort(function(a,b){return d.sources[b].words-d.sources[a].words}),max=d.sources[rows[0]].words;
    document.getElementById('bars').innerHTML=rows.map(function(k){var s=d.sources[k],n=names[k]||[k,k];
      return '<li><span><span lang="en">'+n[0]+'</span><span lang="ta">'+n[1]+'</span></span><span class="n">'+fmt(s.words)+'</span><span class="t"><i style="--w:'+(s.words/max*100).toFixed(1)+'%"></i></span></li>'}).join('');
    var tg={words:d.total.words,files:d.total.files,hadith:d.hadith,mb:d.total.bytes/1048576};
    sec.querySelectorAll('[data-count]').forEach(function(e){e.dataset.to=tg[e.dataset.count];e.textContent=e.dataset.count==='mb'?tg.mb.toFixed(1):fmt(Math.round(tg[e.dataset.count]))});
  }
  function run(){
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
    document.getElementById('bars').classList.add('on');
    if(reduce)return;
    sec.querySelectorAll('[data-count]').forEach(function(e){var to=+e.dataset.to,mb=e.dataset.count==='mb',t0=null;
      function step(t){if(!t0)t0=t;var p=Math.min(1,(t-t0)/1600),v=to*(1-Math.pow(1-p,3));e.textContent=mb?v.toFixed(1):fmt(Math.round(v));if(p<1)requestAnimationFrame(step)}
      requestAnimationFrame(step)});
  }
  fetch('stats.json').then(function(r){return r.json()}).then(build).catch(function(){}).then(function(){
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en[0].isIntersecting){io.disconnect();run()}},{threshold:.25});io.observe(sec)}else run();
  });
})();

(function(){
  var h=document.documentElement,k='isnad_site_lang',l='';
  try{l=localStorage.getItem(k)||''}catch(e){}
  if(l!=='ta'&&l!=='en')l=(navigator.language||'').toLowerCase().indexOf('ta')===0?'ta':'en';
  function set(v){h.setAttribute('data-lang',v);h.lang=v;try{localStorage.setItem(k,v)}catch(e){}
    document.querySelectorAll('.lang button').forEach(function(b){b.setAttribute('aria-pressed',b.dataset.l===v)})}
  set(l);
  document.addEventListener('click',function(e){var b=e.target.closest('.lang button');if(b)set(b.dataset.l)});
})();

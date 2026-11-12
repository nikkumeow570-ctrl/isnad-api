// Offline: app shell is cached up front; API answers are cached as you read them.
const SHELL='isnad-shell-v1',DATA='isnad-data-v1';
const FILES=['/app/','/app/index.html','/app/manifest.webmanifest','/app/icon.svg','/prayer/prayertimes.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim())});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(u.pathname.startsWith('/api/')){
    e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(DATA).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)));
  }else{
    e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(m=>m||fetch(e.request)));
  }
});

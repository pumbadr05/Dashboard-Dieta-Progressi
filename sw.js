const CACHE='dashboard-alimentare-v16-2-20261015';
const FILES=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
// Installazione: scarica sempre i file dalla rete (ignora la cache HTTP) e li tiene per l'uso offline.
self.addEventListener('install',e=>{
  e.waitUntil(
    caches.open(CACHE)
      .then(c=>Promise.all(FILES.map(u=>fetch(new Request(u,{cache:'reload'})).then(r=>r.ok?c.put(u,r):null).catch(()=>null))))
      .then(()=>self.skipWaiting())
  );
});
self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())
  );
});
// Rete prima, cache solo se sei offline: così ogni aggiornamento pubblicato arriva subito.
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  if(new URL(e.request.url).origin!==location.origin)return;
  e.respondWith(
    fetch(e.request.url,{cache:'no-cache'}).then(resp=>{
      if(resp&&resp.ok){const clone=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,clone));}
      return resp;
    }).catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html')))
  );
});

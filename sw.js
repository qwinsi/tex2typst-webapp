(()=>{function cleanResponse(response){const clonedResponse=response.clone();const bodyPromise="body"in clonedResponse?Promise.resolve(clonedResponse.body):clonedResponse.blob();return bodyPromise.then(body=>{return new Response(body,{headers:clonedResponse.headers,status:clonedResponse.status,statusText:clonedResponse.statusText})})}function setup(version2,precacheResources2){const cacheName="cache-v"+version2;self.addEventListener("install",event=>{console.info(`[Service Worker v${version2}] Caching resources...`);const requests=precacheResources2.map(resource=>new Request(resource,{cache:"reload"}));event.waitUntil(caches.open(cacheName).then(cache=>cache.addAll(requests)).then(()=>{const channel=new BroadcastChannel("SW_MESSAGES");channel.postMessage({title:"APP_UPDATE",version:version2})}))});self.addEventListener("activate",event=>{console.info(`[Service Worker v${version2}] Activated.`);event.waitUntil(caches.keys().then(keyList=>{return Promise.all(keyList.map(key=>{if(key!==cacheName){console.info(`[Service Worker v${version2}] Deleting old cache: ${key}`);return caches.delete(key)}}))}))});self.addEventListener("fetch",event=>{event.respondWith(caches.match(event.request).then(cachedResponse=>{if(cachedResponse){if(cachedResponse.redirected===true&&event.request.url.endsWith("/index.html")){return cleanResponse(cachedResponse)}return cachedResponse}return fetch(event.request)}))})}var version="0.2.29";var SUBDIRECTORY="/tex2typst-webapp";var precacheResources=["/","/index.html","/main.js","/main.css","/manifest.json","/favicon.png","/impl-in-typst.html","/cheat-sheet.html"];var prefixedResources=precacheResources.map(resource=>SUBDIRECTORY+resource);setup(version,prefixedResources);})();

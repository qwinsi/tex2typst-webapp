function cleanResponse(response){const clonedResponse=response.clone();const bodyPromise="body"in clonedResponse?Promise.resolve(clonedResponse.body):clonedResponse.blob();return bodyPromise.then((body)=>{return new Response(body,{headers:clonedResponse.headers,status:clonedResponse.status,statusText:clonedResponse.statusText})})}function setup(version,precacheResources){const cacheName="cache-v"+version;self.addEventListener("install",(event)=>{console.info(`[Service Worker v${version}] Caching resources...`);event.waitUntil(caches.open(cacheName).then((cache)=>cache.addAll(precacheResources)))});self.addEventListener("activate",(event)=>{event.waitUntil(caches.keys().then((keyList)=>{return Promise.all(keyList.map((key)=>{if(key!==cacheName){return caches.delete(key)}}))}));console.info(`[Service Worker v${version}] Activated.`)});self.addEventListener("fetch",(event)=>{event.respondWith(caches.match(event.request).then((cachedResponse)=>{if(cachedResponse){if(cachedResponse.redirected===true&&event.request.url.endsWith("/index.html")){return cleanResponse(cachedResponse)}return cachedResponse}return fetch(event.request)}))})}var SUBDIRECTORY="/tex2typst-webapp";var precacheResources=["/","/index.html","/main.js","/main.css","/manifest.json","/favicon.png","/impl-in-typst.html","/cheat-sheet.html"];var prefixedResources=precacheResources.map((resource)=>SUBDIRECTORY+resource);var appVersion="0.2.8";if(!appVersion){throw new Error("npm_package_version is undefined")}setup(appVersion,prefixedResources);

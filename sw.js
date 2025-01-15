// node_modules/@qwinsi/utilities-js/sw.js
function cleanResponse(response) {
  const clonedResponse = response.clone();
  const bodyPromise = "body" in clonedResponse ? Promise.resolve(clonedResponse.body) : clonedResponse.blob();
  return bodyPromise.then((body) => {
    return new Response(body, {
      headers: clonedResponse.headers,
      status: clonedResponse.status,
      statusText: clonedResponse.statusText
    });
  });
}
function setup(precacheResources) {
  const cacheName = "cache-v1";
  self.addEventListener("install", (event) => {
    console.info("[Service Worker] Caching resources...");
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
  });
  self.addEventListener("fetch", (event) => {
    event.respondWith(caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        if (cachedResponse.redirected === true && event.request.url.endsWith("/index.html")) {
          return cleanResponse(cachedResponse);
        }
        return cachedResponse;
      }
      return fetch(event.request);
    }));
  });
}

// src/sw.js
var SUBDIRECTORY = "/tex2typst-webapp";
var precacheResources = [
  "/",
  "/index.html",
  "/main.js",
  "/main.css",
  "/manifest.json",
  "/favicon.png",
  "/impl-in-typst.html",
  "/cheat-sheet.html"
];
var prefixedResources = precacheResources.map((resource) => SUBDIRECTORY + resource);
setup(prefixedResources);

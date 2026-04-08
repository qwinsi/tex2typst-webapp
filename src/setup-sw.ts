/*
 * Last Modified: 2026-04-08
 * Resources:
 * - Progressive Web Apps: Going Offline https://developers.google.com/codelabs/pwa-training/pwa03--going-offline
 */

// return Promise<Response>
function cleanResponse(response: Response): Promise<Response> {
    const clonedResponse = response.clone();

    // Not all browsers support the Response.body stream, so fall back to reading
    // the entire body into memory as a blob.
    const bodyPromise = clonedResponse.body ?
        Promise.resolve(clonedResponse.body) :
        clonedResponse.blob();

    return bodyPromise.then((body) => {
        // new Response() is happy when passed either a stream or a Blob.
        return new Response(body, {
            headers: clonedResponse.headers,
            status: clonedResponse.status,
            statusText: clonedResponse.statusText,
        });
    });
}

const LAZY_CACHE_RESOURCES: string[] = [];

// precacheResources: string[]
export function setup(version: string, precacheResources: string[], lazyCacheResources: string[] = []) {
    const cacheName = "cache-v" + version;

    LAZY_CACHE_RESOURCES.push(...lazyCacheResources);

    self.addEventListener("install", (event: any) => {
        // Cache all resources for current version.
        // Note that {cache: "reload"} is important here,
        // otherwise we may end up with setting old cached resources as new cache.
        // Ref https://stackoverflow.com/a/64880880
        console.info(`[Service Worker v${version}] Caching resources...`);
        const requests = precacheResources.map((resource) => new Request(resource, {cache: "reload"}) );
        event.waitUntil(
            caches.open(cacheName)
            .then((cache) => cache.addAll(requests))
            .then(() => {
                // Note that this time of loading still uses the old cache.
                // So it's better to propmt the user to update the app.
                /* e.g. display a message like:
                   New version x.y.z is available.
                   To update, close all active tabs of this website and open again.
                   (Simply refreshing this page won't take effect.)
                */
                const channel = new BroadcastChannel("SW_MESSAGES");
                channel.postMessage({title: "APP_UPDATE", version: version});
            })
        );
    });

    self.addEventListener("activate", (event: any) => {
        console.info(`[Service Worker v${version}] Activated.`);

        // Delete old caches
        event.waitUntil(
            caches.keys().then(keyList => {
                return Promise.all(
                    keyList.map(key => {
                        if (key !== cacheName) {
                            console.info(`[Service Worker v${version}] Deleting old cache: ${key}`);
                            return caches.delete(key);
                        }
                    })
                );
            })
        );
    });

    self.addEventListener("fetch", (event: any) => {
        event.respondWith(
            /*
             Make sure to write `caches.open(cacheName).then(...)` instead of simple `caches.match(event.request)`.
             It may somehow fail to delete old cache so that the user will get stuck in old cache.
             Maybe it's because the tab is closed during the execution of the listener function of "activate" event?
             */
            caches.open(cacheName).then(async function(cache) {
                const cachedResponse = await cache.match(event.request);
                if (cachedResponse) {
                    // A cached response of **/index.html may contain a mark of redirected=true,
                    // which will cause browser to block the response due to security concerns.
                    // So we need to somehow remove this mark from the response.
                    // https://stackoverflow.com/questions/45434470/only-in-chrome-service-worker-a-redirected-response-was-used-for-a-reque
                    if (cachedResponse.redirected === true && event.request.url.endsWith("/index.html")) {
                        return cleanResponse(cachedResponse);
                    }
                    return cachedResponse;
                } else {
                    const response = await fetch(event.request);
                    if (LAZY_CACHE_RESOURCES.includes(event.request.url)) {
                        cache.put(event.request.url, response.clone());
                    }
                    return response;
                }
            })
        );
    });
}

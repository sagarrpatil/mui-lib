const CACHE_NAME = "0.0.22";
const STATIC_CACHE_URLS = ["/", "/index.html", "/manifest.json", /* Add other static asset URLs */];

this.self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_CACHE_URLS))
  );
});
this.self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes("/firestore.googleapis.com") ||
    event.request.url.includes("/google.firestore.v1.Firestore") ||  
    event.request.url.includes("https://firestore.googleapis.com") ||  
     event.request.url.includes("firebase")
     
     ||   event.request.url.includes("firestore")
  ) {
    return fetch(event.request);
   } else
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((res) => {
        // Clone the response to add it to the cache and return it
        const clonedResponse = res.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return res;
      });
    }).catch(() => {
      // If offline and not cached, return a fallback response
      return new Response("Offline content goes here.");
    })
  );
});

this.self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key === CACHE_NAME) {
            return null;
          }
          return caches.delete(key);
        })
      );
    })
  );
});
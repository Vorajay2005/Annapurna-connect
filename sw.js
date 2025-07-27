// Service Worker for Annapurna Connect PWA

const CACHE_NAME = "annapurna-connect-v2-no-errors";
const urlsToCache = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/vendor-signup.html",
  "/supplier-signup.html",
  "/css/style.css",
  "/css/dashboard.css",
  "/css/signup.css",
  "/js/main.js",
  "/js/dashboard.js",
  "/js/signup.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css",
  "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap",
];

// Install event
self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log("Opened cache");
      return cache.addAll(urlsToCache);
    })
  );
});

// Fetch event - Network first strategy
self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request)
      .then(function (response) {
        // If network request is successful, update cache and return response
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(function () {
        // If network fails, try cache
        return caches.match(event.request);
      })
  );
});

// Activate event
self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Background sync for offline functionality
self.addEventListener("sync", function (event) {
  if (event.tag === "background-sync") {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  // Handle background sync logic here
  console.log("Background sync triggered");
}

// Push notification handling
self.addEventListener("push", function (event) {
  const options = {
    body: event.data ? event.data.text() : "New update from Annapurna Connect!",
    icon: "/icon-192x192.png",
    badge: "/badge-72x72.png",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
    actions: [
      {
        action: "explore",
        title: "View Orders",
        icon: "/icon-view.png",
      },
      {
        action: "close",
        title: "Close",
        icon: "/icon-close.png",
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification("Annapurna Connect", options)
  );
});

// Notification click handling
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  if (event.action === "explore") {
    event.waitUntil(clients.openWindow("/dashboard.html"));
  } else if (event.action === "close") {
    // Do nothing, notification is already closed
  } else {
    event.waitUntil(clients.openWindow("/"));
  }
});

// Service Worker for Annapurna Connect PWA

const CACHE_NAME = "annapurna-connect-v1";
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

// Fetch event
self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Return cached version or fetch from network
      if (response) {
        return response;
      }
      return fetch(event.request);
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

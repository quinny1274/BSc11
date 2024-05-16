importScripts('/javascripts/indexdb-utility.js');

// Use the install event to pre-cache all initial resources.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing....');
  event.waitUntil((async () => {

    console.log('Service Worker: Caching App Shell at the moment......');
    try {
      const cache = await caches.open("static");
      cache.addAll([
        '/',
        '/explore',
        '/create',
        '/js/bootstrap.min.js',
        '/css/bootstrap.min.css',
        '/manifest.json',
        '/javascripts/index.js',
        '/javascripts/create.js',
        '/javascripts/indexdb-utility.js',
        '/stylesheets/style.css',
        '/images/image_icon.png',
      ]);
      console.log('Service Worker: App Shell Cached');
    } catch {
      console.log("error occured while caching...")
    }

  })());
});

//clear cache on reload
self.addEventListener('activate', event => {
// Remove old caches
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      return keys.map(async (cache) => {
        if (cache !== "static") {
          console.log('Service Worker: Removing old cache: ' + cache);
          return await caches.delete(cache);
        }
      })
    })()
  )
})

// Fetch event to fetch from cache first
self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    try {
      const networkResponse = await fetch(event.request);
      // const clonedResponse = networkResponse.clone();
      // const dynamicCache = await caches.open('dynamic');
      // await dynamicCache.put(event.request, clonedResponse);

      return networkResponse;
    } catch (error) {
      console.log('Service Worker: Fetching from Cache:', event.request.url);
      const staticCache = await caches.open('static');
      const cachedResponse = await staticCache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      } else {
        return new Response('Cached Page Not Found');
      }
    }
  })());
});

// Sync event to sync the plants
self.addEventListener('sync', event => {
  if (event.tag === 'sync-plant') {
    console.log('Service Worker: Syncing new Plants');
    openSyncPlantsIndexDB().then((syncPostDB) => {
      getAllSyncPlants(syncPostDB).then((syncPlants) => {
        for (const syncPlant of syncPlants) {
          console.log('Service Worker: Syncing new Plant: ', syncPlant);
          // Create a FormData object
          const formData = new FormData();

          // Iterate over the properties of the JSON object and append them to FormData
          formData.append("name", syncPlant.name);
          formData.append("enableSuggestions", syncPlant.enableSuggestions);
          formData.append("date", syncPlant.date);
          formData.append("location", syncPlant.location);
          formData.append("description", syncPlant.description);
          formData.append("size", syncPlant.size);
          formData.append("flowers", syncPlant.flowers);
          formData.append("leaves", syncPlant.leaves);
          formData.append("fruit", syncPlant.fruit);
          formData.append("sunExposure", syncPlant.sunExposure);
          formData.append("flowerColour", syncPlant.flowerColour);
          formData.append("img", syncPlant.img);
          formData.append("userId", syncPlant.userId);

          // Fetch with FormData instead of JSON
          fetch('http://localhost:3000/create/add', {
            method: 'POST',
            body: formData,
          }).then(() => {
            console.log('Service Worker: Syncing new Plant: ', syncPlant, ' done');
            deleteSyncPlantFromIndexDB(syncPostDB, syncPlant.id);
            // Send a notification
            // self.registration.showNotification('Plant Synced', {
            //   body: 'Plant synced successfully!',
            // });
          }).catch((err) => {
            console.error('Service Worker: Syncing new Plant: ', syncPlant, ' failed');
          });
        }
      });
    });
  }
});

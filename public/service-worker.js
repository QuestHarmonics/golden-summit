const CACHE_NAME = 'golden-summit-cache-v1';
const STATIC_CACHE_NAME = 'golden-summit-static-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/static/css/',
  '/static/js/',
  '/static/media/'
];

const API_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const STATIC_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      self.skipWaiting()
    ])
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return (
                cacheName.startsWith('golden-summit-') &&
                cacheName !== CACHE_NAME &&
                cacheName !== STATIC_CACHE_NAME
              );
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(handleStaticRequest(request));
  }
});

async function handleApiRequest(request) {
  try {
    // Try to get a fresh response
    const response = await fetch(request);
    if (!response.ok) throw new Error('Network response was not ok');

    // Clone the response before caching it
    const responseToCache = response.clone();
    const cache = await caches.open(CACHE_NAME);
    
    const headers = {
      'Cache-Control': `max-age=${API_CACHE_DURATION}`,
      'Last-Modified': new Date().toUTCString()
    };

    const augmentedResponse = new Response(
      await responseToCache.blob(),
      {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: new Headers({
          ...Object.fromEntries(responseToCache.headers.entries()),
          ...headers
        })
      }
    );

    await cache.put(request, augmentedResponse);
    return response;
  } catch (error) {
    // If network request fails, try to return cached response
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      // Check if cache is still valid
      const lastModified = new Date(cachedResponse.headers.get('Last-Modified'));
      if (Date.now() - lastModified.getTime() < API_CACHE_DURATION) {
        return cachedResponse;
      }
    }
    
    throw error;
  }
}

async function handleStaticRequest(request) {
  // Try to get from cache first
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    // Check if cache is still valid
    const lastModified = new Date(cachedResponse.headers.get('Last-Modified'));
    if (Date.now() - lastModified.getTime() < STATIC_CACHE_DURATION) {
      return cachedResponse;
    }
  }

  try {
    // If not in cache or expired, fetch from network
    const response = await fetch(request);
    if (!response.ok) throw new Error('Network response was not ok');

    // Clone the response before caching it
    const responseToCache = response.clone();
    
    const headers = {
      'Cache-Control': `max-age=${STATIC_CACHE_DURATION}`,
      'Last-Modified': new Date().toUTCString()
    };

    const augmentedResponse = new Response(
      await responseToCache.blob(),
      {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: new Headers({
          ...Object.fromEntries(responseToCache.headers.entries()),
          ...headers
        })
      }
    );

    await cache.put(request, augmentedResponse);
    return response;
  } catch (error) {
    // If network request fails and we have a cached response, return it
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
} 
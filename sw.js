// Offline support. The app's own files are served from the cache and refreshed in the
// background, so the app opens instantly with no signal and picks up updates on the next launch.
// Bump VERSION whenever the list of app files changes.
const VERSION = "rotation-v3";
const RUNTIME = "rotation-runtime";
const SHELL = [
  "./", "./index.html", "./styles.css", "./app.js", "./manifest.webmanifest",
  "./icons/icon-192.png", "./icons/icon-512.png", "./icons/apple-touch-icon.png", "./icons/favicon-32.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== RUNTIME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Food lookups always go to the network; never serve a stale product.
  if (url.hostname.endsWith("openfoodfacts.org") || url.hostname === "api.nal.usda.gov") return;

  if (url.origin === self.location.origin) {
    // The app is one page: opening its folder or index.html both get the cached index.html.
    const scope = new URL(self.registration.scope).pathname;
    const isApp = req.mode === "navigate" && (url.pathname === scope || url.pathname === scope + "index.html");
    if (req.mode === "navigate" && !isApp) return;
    const key = isApp ? "./index.html" : req;
    e.respondWith(caches.open(VERSION).then(async cache => {
      const hit = await cache.match(key, { ignoreSearch: true });
      const refresh = fetch(req, { cache: "no-cache" })
        .then(res => { if (res.ok) cache.put(key, res.clone()); return res; })
        .catch(() => null);
      if (hit) { e.waitUntil(refresh); return hit; }
      return (await refresh) || Response.error();
    }));
    return;
  }

  // Fonts and the barcode scanner (library + WebAssembly file): cache the first copy and reuse it.
  if (/^(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net|fastly\.jsdelivr\.net)$/.test(url.hostname)) {
    e.respondWith(caches.open(RUNTIME).then(async cache => {
      const hit = await cache.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === "opaque") cache.put(req, res.clone());
      return res;
    }));
  }
});

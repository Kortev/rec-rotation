// Offline support. The app's own files are served from the cache and refreshed in the
// background, so the app opens instantly with no signal and picks up updates on the next launch.
// Bump VERSION whenever the list of app files changes.
const VERSION = "rotation-v4";
const RUNTIME = "rotation-runtime";
const STATE = "rotation-state";   // small summary the app writes so reminders can say what's next
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
      .then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== RUNTIME && k !== STATE).map(k => caches.delete(k))))
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

// Workout reminders. The reminder job only wakes the phone; the words come from the app's own
// summary, so the notification can say what's next and skip nagging on days you already trained.
self.addEventListener("push", e => {
  e.waitUntil((async () => {
    let st = {};
    try { const cache = await caches.open(STATE); const r = await cache.match("./__state"); if (r) st = await r.json(); } catch (_) {}
    let title = "Workout day", body = "Your next workout is about 35 minutes.";
    if (st.today) {
      title = "Nice work today";
      body = st.proteinMin ? "Protein so far: " + st.protein + " of " + st.proteinMin + " g." : "Remember to get your protein in.";
    } else if (st.next) {
      title = st.next + " is next";
      body = (st.week || 0) + " of " + (st.goal || 4) + " this week" + (st.streak ? " · " + st.streak : "") + ". About 35 minutes.";
    }
    await self.registration.showNotification(title, {
      body, icon: "icons/icon-192.png", badge: "icons/icon-192.png", tag: "rotation-reminder", data: { url: "./" }
    });
  })());
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
    for (const c of list) { if ("focus" in c) return c.focus(); }
    return self.clients.openWindow("./");
  }));
});

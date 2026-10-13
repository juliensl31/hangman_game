"use strict";

// H6 : fichier HTML, catalogue, polices et illustrations accessibles sans réseau.
// Modifier cette version lors d'un changement majeur des ressources mises en cache.
const CACHE_NAME = "hangman-pwa-h6-v4";
const PRECACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./pwa.js",
  "./manifest.webmanifest",
  "./images/h6-icon-192.webp",
  "./images/h6-ios-icon-180.png",
  "./apple-touch-icon.png",
  "./images/h6-icon-512.webp",
  "./images/hangman-scene-exacte-reference.webp",
  "./images/pendu.png",
  "./images/pendu_1.png",
  "./images/pendu_2.png",
  "./images/pendu_3.png",
  "./images/pendu_4.png",
  "./images/pendu_5.png",
  "./images/pendu_6.png",
  "./images/win.png",
  "./images/gameover.png",
  "./sources/polices/October Crow.ttf",
  "./sources/polices/HappyHalloween.ttf"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // L'installation échoue plutôt que d'annoncer un mode hors ligne incomplet.
    await cache.addAll(PRECACHE);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith("hangman-pwa-") && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      // Network-first pour ne pas figer les mises à jour du jeu.
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await cache.match(request, { ignoreSearch: true });
      if (cached) return cached;
      if (request.mode === "navigate") {
        const fallback = await cache.match(new URL("./index.html", scope));
        if (fallback) return fallback;
      }
      return Response.error();
    }
  })());
});

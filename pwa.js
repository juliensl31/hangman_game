"use strict";

// Installation silencieuse : ne change pas l'interface H5.2.
if ("serviceWorker" in navigator && window.isSecureContext) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js", { scope: "./" })
      .catch((error) => console.warn("Mode hors ligne indisponible :", error));
  });
}

// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";



/**
 * @function
 * @author Andreas Hartung
 * @namespace V0
 * @name Variation 00
 * @description
 */
(function (KEK) {
  "use strict";

  //console.log("Sprint 02 Variante 0 — u0");

  const SELECTOR_NATIVE_BREADCRUMB = '[data-test-id="breadcrumb"]';
  const CHECK_INTERVAL = 300;

  // ----------------------------- Funktion: Styles setzen -----------------------------
  const applyHideStyles = () => {
    const el = document.querySelector(SELECTOR_NATIVE_BREADCRUMB);
    if (!el) return;

    const path = window.location.pathname;
    if (!path.includes("/c/")) {
      // 🚫 Kein /c/ → Breadcrumb verstecken
      if (el.dataset._hiddenApplied !== "true") {
        el.style.height = "0";
        el.style.overflow = "hidden";
        el.dataset._hiddenApplied = "true";
      }
    } else {
      // ✅ /c/ vorhanden → Breadcrumb normal anzeigen
      if (el.dataset._hiddenApplied === "true") {
        el.style.height = "";
        el.style.overflow = "";
        delete el.dataset._hiddenApplied;
      }
    }
  };

  // ----------------------------- SPA URL Change Watcher -----------------------------
  const observeUrlAndDom = () => {
    let lastUrl = window.location.href;

    // Wiederholte Prüfung, um SPA-Änderungen sicher zu erwischen
    setInterval(() => {
      const currentUrl = window.location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        setTimeout(applyHideStyles, 200);
        setTimeout(applyHideStyles, 800);
      }

      // Fallback bei initialem Laden oder verzögertem Rendern
      applyHideStyles();
    }, CHECK_INTERVAL);
  };

  // ----------------------------- Init -----------------------------
  const init = () => {
    applyHideStyles();
    observeUrlAndDom();
  };

  KEK.elem("body", init);
})(new window.KEK());

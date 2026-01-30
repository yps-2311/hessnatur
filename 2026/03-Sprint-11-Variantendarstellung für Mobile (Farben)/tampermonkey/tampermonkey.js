// ==UserScript==
// @name         hessnatur – Sprint 11 Variantendarstellung Mobile (Farben)
// @namespace    https://www.hessnatur.com
// @version      2026-01-30
// @description  A/B-Test: Farbvarianten auf Mobile PLP anzeigen
// @author       Manuel Brückmann
// @match        https://www.hessnatur.com/de/*/c/*
// @match        https://www.hessnatur.com/de/c/*
// @icon         https://www.hessnatur.com/favicon.ico
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.type = 'text/css';
    css.href = 'https://local-dev.konversionskraft.de/hessnatur/2026/03-Sprint-11-Variantendarstellung für Mobile (Farben)/src/variation-01/style.css?v=' + Date.now();
    (document.head || document.documentElement).appendChild(css);

    // Inject test script
    const script = document.createElement('script');
    script.src = 'https://local-dev.konversionskraft.de/hessnatur/2026/03-Sprint-11-Variantendarstellung für Mobile (Farben)/src/variation-01/script.min.js?v=' + Date.now();
    script.type = 'text/javascript';
    script.async = false;

    // Append to head for early execution
    (document.head || document.documentElement).appendChild(script);

    console.log('[Tampermonkey] Test script injected:', script.src);
})();
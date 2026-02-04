// ==UserScript==
// @name         Hessnatur Sprint 12 - Portofrei
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  A/B Test Portofrei (with Debug Logging)
// @author       Antigravity
// @match        https://www.hessnatur.com/*
// @match        https://hessnatur.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      local-dev.konversionskraft.de
// ==/UserScript==

(function () {
    'use strict';
    console.log('[TM Debug] Script started on:', window.location.href);

    const baseUrl = 'https://local-dev.konversionskraft.de/hessnatur/2026/03-Sprint-12-Portofrei/src';
    const cacheBuster = '?v=' + Date.now();

    // Inject CSS
    console.log('[TM Debug] Loading CSS:', baseUrl + '/variation-01/style.css');
    GM_xmlhttpRequest({
        method: 'GET',
        url: baseUrl + '/variation-01/style.css' + cacheBuster,
        onload: function (response) {
            console.log('[TM Debug] CSS response status:', response.status);
            if (response.status === 200) {
                GM_addStyle(response.responseText);
                console.log('[TM Debug] CSS injected.');
            } else {
                console.warn('[TM Debug] CSS failed to load. (Check Codekit/LESS compilation)');
            }
        },
        onerror: function (err) {
            console.error('[TM Debug] CSS request error:', err);
        }
    });

    // Inject JS: First load global.js, then script.js
    console.log('[TM Debug] Loading global.js:', baseUrl + '/global/global.js');
    GM_xmlhttpRequest({
        method: 'GET',
        url: baseUrl + '/global/global.js' + cacheBuster,
        onload: function (globalResponse) {
            console.log('[TM Debug] global.js response status:', globalResponse.status);
            if (globalResponse.status === 200) {
                // Inject global.js first
                const globalScript = document.createElement('script');
                globalScript.textContent = globalResponse.responseText;
                (document.head || document.documentElement).appendChild(globalScript);
                console.log('[TM Debug] global.js injected.');

                // Then load variation script
                console.log('[TM Debug] Loading script.js:', baseUrl + '/variation-01/script.js');
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: baseUrl + '/variation-01/script.js' + cacheBuster,
                    onload: function (response) {
                        console.log('[TM Debug] script.js response status:', response.status);
                        if (response.status === 200) {
                            const script = document.createElement('script');
                            script.textContent = response.responseText;
                            (document.head || document.documentElement).appendChild(script);
                            console.log('[TM Debug] script.js injected.');
                        } else {
                            console.error('[TM Debug] script.js failed to load.');
                        }
                    },
                    onerror: function (err) {
                        console.error('[TM Debug] script.js request error:', err);
                    }
                });
            } else {
                console.error('[TM Debug] global.js failed to load.');
            }
        },
        onerror: function (err) {
            console.error('[TM Debug] global.js request error:', err);
        }
    });
})();

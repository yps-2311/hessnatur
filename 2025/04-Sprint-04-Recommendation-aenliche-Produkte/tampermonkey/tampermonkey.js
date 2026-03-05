// ==UserScript==
// @name         Hessnatur Sprint 04 - Recommendation ähnliche Produkte
// @namespace    http://tampermonkey.net/
// @version      2025-12-08
// @description  Inject Test Script for local development
// @author       Anton Müller
// @match        https://www.hessnatur.com/de
// @match        https://www.hessnatur.com/de/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hessnatur.com
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      local-dev.konversionskraft.de
// ==/UserScript==

(function() {
    'use strict';

    const baseUrl = 'https://local-dev.konversionskraft.de/hessnatur/2025/04-Sprint-04-Recommendation-aenliche-Produkte/src/variation-01';
    const cacheBuster = '?v=' + Date.now();

    // Inject CSS via GM_xmlhttpRequest (bypasses CORS)
    GM_xmlhttpRequest({
        method: 'GET',
        url: baseUrl + '/style.css' + cacheBuster,
        onload: function(response) {
            if (response.status === 200) {
                GM_addStyle(response.responseText);
                console.log('[Tampermonkey] CSS injected successfully');
            } else {
                console.error('[Tampermonkey] Failed to load CSS:', response.status);
            }
        },
        onerror: function(error) {
            console.error('[Tampermonkey] CSS load error:', error);
        }
    });

    // Inject JS via GM_xmlhttpRequest (bypasses CORS)
    GM_xmlhttpRequest({
        method: 'GET',
        url: baseUrl + '/script.js' + cacheBuster,
        onload: function(response) {
            if (response.status === 200) {
                // Execute the script in page context
                const script = document.createElement('script');
                script.textContent = response.responseText;
                (document.head || document.documentElement).appendChild(script);
                console.log('[Tampermonkey] JS injected successfully');
            } else {
                console.error('[Tampermonkey] Failed to load JS:', response.status);
            }
        },
        onerror: function(error) {
            console.error('[Tampermonkey] JS load error:', error);
        }
    });
})();

// ==UserScript==
// @name         hessnatur – Sprint 23 Highlights Material Pflege
// @namespace    https://www.hessnatur.com
// @version      2026-05-06.2
// @description  A/B-Test: Passform, Material und Pflege mobil direkt im Buybox-Kontext sichtbar machen
// @author       Yannick Preuß
// @match        https://www.hessnatur.com/de/*/p/*
// @match        https://www.hessnatur.com/de/p/*
// @noframes
// @icon         https://www.hessnatur.com/favicon.ico
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      local-dev.konversionskraft.de
// ==/UserScript==

(function() {
    "use strict";

    const basePath = "https://local-dev.konversionskraft.de/hessnatur/2026/07-Sprint-23-Highlights-Material-Pflege/src/variation-01";
    const sourceRoot = basePath.slice(0, basePath.lastIndexOf("/"));
    const cacheBust = "?v=" + Date.now();

    function requestText(url, label, onLoad) {
        if (typeof GM_xmlhttpRequest !== "function") {
            console.error("[Tampermonkey] GM_xmlhttpRequest unavailable:", url);
            return;
        }

        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const status = response && typeof response.status === "number" ? response.status : 0;

                if (status >= 200 && status < 300) {
                    console.log("[Tampermonkey] " + label + " loaded:", url);

                    if (typeof onLoad === "function") {
                        onLoad(response.responseText || "", url);
                    }

                    return;
                }

                console.error("[Tampermonkey] " + label + " failed:", url, "status:", status);
            },
            onerror: function(error) {
                console.error("[Tampermonkey] " + label + " failed:", url, error);
            }
        });
    }

    function appendInlineScript(source, url) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.textContent = (source || "") + "\n//# sourceURL=" + url;

        (document.head || document.documentElement).appendChild(script);
        return script;
    }

    const cssUrl = basePath + "/style.css" + cacheBust;
    requestText(cssUrl, "CSS", function(source) {
        if (typeof GM_addStyle !== "function") {
            console.error("[Tampermonkey] GM_addStyle unavailable:", cssUrl);
            return;
        }

        GM_addStyle(source);
        console.log("[Tampermonkey] CSS injected:", cssUrl);
    });

    requestText(sourceRoot + "/vendor/KEK.js" + cacheBust, "KEK.js", function(source, url) {
        appendInlineScript(source, url);
        console.log("[Tampermonkey] KEK.js injected successfully");

        requestText(sourceRoot + "/global/global.js" + cacheBust, "global.js", function(globalSource, globalUrl) {
            appendInlineScript(globalSource, globalUrl);
            console.log("[Tampermonkey] global.js injected successfully");

            requestText(basePath + "/script.js" + cacheBust, "script.js", function(scriptSource, scriptUrl) {
                appendInlineScript(scriptSource, scriptUrl);
                console.log("[Tampermonkey] JS injected:", scriptUrl);
            });
        });
    });
})();

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const scriptPath = path.join(__dirname, "tampermonkey.js");
const scriptSource = fs.readFileSync(scriptPath, "utf8");

function runLoader() {
    const appendedNodes = [];
    const requests = [];
    const injectedStyles = [];
    const logMessages = [];
    const errorMessages = [];

    const parentNode = {
        appendChild(node) {
            appendedNodes.push(node);
            return node;
        }
    };

    const document = {
        head: parentNode,
        documentElement: parentNode,
        createElement(tagName) {
            return {
                tagName: tagName.toUpperCase(),
                textContent: ""
            };
        }
    };

    const context = {
        document,
        console: {
            log(...args) {
                logMessages.push(args.join(" "));
            },
            error(...args) {
                errorMessages.push(args.join(" "));
            }
        },
        GM_addStyle(cssText) {
            injectedStyles.push(cssText);
        },
        GM_xmlhttpRequest(options) {
            requests.push(options);
        },
        Date: {
            now() {
                return 12345;
            }
        }
    };

    vm.runInNewContext(scriptSource, context, { filename: scriptPath });

    return {
        appendedNodes,
        requests,
        injectedStyles,
        logMessages,
        errorMessages
    };
}

test("loader requests CSS through GM_xmlhttpRequest and injects response text", () => {
    const { appendedNodes, requests, injectedStyles, logMessages } = runLoader();
    const cssRequest = requests.find((request) => request.url.includes("/style.css?v=12345"));

    assert.ok(cssRequest);
    assert.equal(appendedNodes.some((node) => node.tagName === "LINK"), false);

    cssRequest.onload({ status: 200, responseText: ".kk-test { display:block; }" });

    assert.deepEqual(injectedStyles, [".kk-test { display:block; }"]);
    assert.ok(logMessages.some((entry) => entry.includes("CSS loaded:")));
    assert.ok(logMessages.some((entry) => entry.includes("CSS injected:")));
});

test("loader requests KEK, global and variation script sequentially and injects them inline", () => {
    const { appendedNodes, requests, logMessages } = runLoader();
    const kekRequest = requests.find((request) => request.url.includes("/vendor/KEK.js?v=12345"));

    assert.ok(kekRequest);

    kekRequest.onload({ status: 200, responseText: "window.__kekLoaded = true;" });

    const globalRequest = requests.find((request) => request.url.includes("/global/global.js?v=12345"));
    assert.ok(globalRequest);
    assert.equal(appendedNodes[0].tagName, "SCRIPT");
    assert.match(appendedNodes[0].textContent, /window\.__kekLoaded = true;/);

    globalRequest.onload({ status: 200, responseText: "window.__globalLoaded = true;" });

    const variationRequest = requests.find((request) => request.url.includes("/variation-01/script.js?v=12345"));
    assert.ok(variationRequest);
    assert.equal(appendedNodes[1].tagName, "SCRIPT");
    assert.match(appendedNodes[1].textContent, /window\.__globalLoaded = true;/);

    variationRequest.onload({ status: 200, responseText: "window.__variationLoaded = true;" });

    assert.equal(appendedNodes[2].tagName, "SCRIPT");
    assert.match(appendedNodes[2].textContent, /window\.__variationLoaded = true;/);
    assert.ok(logMessages.some((entry) => entry.includes("KEK.js injected successfully")));
    assert.ok(logMessages.some((entry) => entry.includes("global.js injected successfully")));
    assert.ok(logMessages.some((entry) => entry.includes("JS injected:")));
});
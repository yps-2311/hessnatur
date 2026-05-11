// @ts-check
/**
 * Playwright Debug-Script
 * Sprint 23 – Highlights Material Pflege (Variation 01)
 *
 * Simuliert exakt das Tampermonkey-Userscript:
 * - Interceptiert Requests an local-dev.konversionskraft.de → lokale Dateien
 * - Injiziert KEK.js → global.js → style.css → script.js
 * - Löst das CORS-Problem durch direktes Lesen vom Dateisystem
 * - Macht Screenshots (vor/nach Injection) für visuelles Debugging
 */
const { test, expect } = require("@playwright/test");
const path = require("path");
const fs = require("fs");

// ---------------------------------------------------------------------------
// Pfade
// ---------------------------------------------------------------------------
const PROJECT_ROOT = __dirname;
const SRC_ROOT = path.join(PROJECT_ROOT, "src");
const ASSETS_ROOT = path.join(PROJECT_ROOT, "assets");
const SCREENSHOTS_DIR = path.join(PROJECT_ROOT, "debug-screenshots");

const PATHS = {
    kek:        path.join(SRC_ROOT, "vendor", "KEK.js"),
    global:     path.join(SRC_ROOT, "global", "global.js"),
    css:        path.join(SRC_ROOT, "variation-01", "style.css"),
    script:     path.join(SRC_ROOT, "variation-01", "script.js"),
    svgPassform: path.join(ASSETS_ROOT, "materialicon_passform.svg"),
    svgPflege:   path.join(ASSETS_ROOT, "materialicon_waschmaschine.svg")
};

// Einstiegs-URL für dynamische Produktsuche (PLP → erster PDP)
const ENTRY_URL = "https://www.hessnatur.com/de/";

// ---------------------------------------------------------------------------
// Hilfs-Funktionen
// ---------------------------------------------------------------------------
function readFile(filePath) {
    return fs.readFileSync(filePath, "utf8");
}

function svgToDataUri(filePath) {
    const raw = readFile(filePath);
    // URL-encode für SVG Data-URI (sicher für src-Attribut)
    const encoded = encodeURIComponent(raw)
        .replace(/%20/g, " ")
        .replace(/%3D/g, "=")
        .replace(/%3A/g, ":")
        .replace(/%2F/g, "/");
    return "data:image/svg+xml," + encoded;
}

function ensureScreenshotsDir() {
    if (!fs.existsSync(SCREENSHOTS_DIR)) {
        fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
    }
}

// ---------------------------------------------------------------------------
// Fixtures / Shared Setup
// ---------------------------------------------------------------------------
let cssSource, kekSource, globalSource, scriptSource, iconRegistry;

test.beforeAll(() => {
    ensureScreenshotsDir();

    cssSource     = readFile(PATHS.css);
    kekSource     = readFile(PATHS.kek);
    globalSource  = readFile(PATHS.global);
    scriptSource  = readFile(PATHS.script);
    iconRegistry = {
        passform: svgToDataUri(PATHS.svgPassform),
        pflege: svgToDataUri(PATHS.svgPflege)
    };
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
test("[V01] PDP via PLP → Produkt debuggen", async ({ page }) => {
    const consoleErrors = [];
    const consoleWarnings = [];

    // Route-Intercept FRÜH setzen (gilt für alle nachfolgenden Navigationen)
    await page.route("**/local-dev.konversionskraft.de/**", async (route) => {
        const url = route.request().url();
        const filename = path.basename(url.split("?")[0]);

        let localPath = null;
        if (filename === "KEK.js")     localPath = PATHS.kek;
        else if (filename === "global.js") localPath = PATHS.global;
        else if (filename === "script.js") localPath = PATHS.script;
        else if (filename === "style.css") localPath = PATHS.css;
        else if (filename === "materialicon_passform.svg")    localPath = PATHS.svgPassform;
        else if (filename === "materialicon_waschmaschine.svg") localPath = PATHS.svgPflege;

        if (localPath && fs.existsSync(localPath)) {
            const body = readFile(localPath);
            const contentType = filename.endsWith(".css") ? "text/css"
                : filename.endsWith(".svg") ? "image/svg+xml"
                : "application/javascript";
            await route.fulfill({ status: 200, contentType, body });
        } else {
            await route.continue();
        }
    });

    page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
        if (msg.type() === "warning") consoleWarnings.push(msg.text());
    });
    page.on("pageerror", (err) => {
        consoleErrors.push("[pageerror] " + err.message);
    });

    // 1. PLP laden – ersten PDP-Link finden
    // Consent-Cookie vorab setzen (verhindert Cookie-Banner)
    await page.context().addCookies([
        { name: "usercentrics-v3", value: "eyJzZXR0aW5ncyI6eyJhY2NlcHRlZCI6dHJ1ZX19", domain: ".hessnatur.com", path: "/" },
        { name: "uc_user_interaction", value: "true", domain: ".hessnatur.com", path: "/" }
    ]);

    console.log("Lade PLP:", ENTRY_URL);
    await page.goto(ENTRY_URL, { waitUntil: "domcontentloaded" });

    // Warten bis Produktkarten gerendert sind (Next.js SPA)
    await page.waitForSelector('a[href*="/p/"]', { timeout: 30000 }).catch(() => {
        console.warn("[DEBUG] Kein Produkt-Link in 30s gefunden – versuche Fallback-Selector");
    });

    await page.screenshot({ path: path.join(SCREENSHOTS_DIR, "plp.png"), fullPage: false });

    const productLink = await page.locator('a[href*="/p/"]').first().getAttribute("href", { timeout: 5000 }).catch(() => null);
    const productUrl = productLink
        ? (productLink.startsWith("http") ? productLink : "https://www.hessnatur.com" + productLink)
        : ENTRY_URL;

    console.log("Gefundene Produkt-URL:", productUrl);

    // 2. PDP laden
    await page.goto(productUrl, { waitUntil: "domcontentloaded" });

    // 3. Auf Buy-Box warten (Next.js muss erst hydratisieren)
    const buyBoxSelector = '[data-testid="buy-box-content"]';
    console.log("Warte auf Buy-Box...");
    await page.waitForSelector(buyBoxSelector, { timeout: 12000 }).catch(() => {
        console.warn("[DEBUG] Buy-Box nicht gefunden – injiziere trotzdem");
    });
    await page.waitForLoadState("networkidle", { timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(600);

    // 4. Screenshot vor Injection
    await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "pdp_before.png"),
        fullPage: false
    });

    // 5. CSS injizieren
    await page.addStyleTag({ content: cssSource });

    await page.evaluate((icons) => {
        window.__KK_PDP_FACT_ICONS__ = icons;
    }, iconRegistry);

    // 6. KEK → global → script sequenziell injizieren
    for (const [src, label] of [[kekSource, "KEK"], [globalSource, "global"], [scriptSource, "script"]]) {
        await page.evaluate((code) => {
            const s = document.createElement("script");
            s.type = "text/javascript";
            s.textContent = code;
            (document.head || document.documentElement).appendChild(s);
        }, src);
        console.log("[inject] " + label + " ✓");
    }

    // 7. Auf Modul warten (inkl. Retry-Zyklen des Scripts ~4s)
    const moduleSelector = ".kk-pdp-facts";
    await page.waitForSelector(moduleSelector, { timeout: 8000 }).catch(() => {
        console.warn("[DEBUG] Modul nach 8 Sekunden nicht gerendert.");
    });

    // 8. Screenshots
    // Consent-Banner wegklicken falls vorhanden
    await page.locator('button:has-text("Ich stimme zu"), button:has-text("Alle akzeptieren")').first().click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(400);

    await page.screenshot({
        path: path.join(SCREENSHOTS_DIR, "pdp_after.png"),
        fullPage: false
    });

    const module = page.locator(moduleSelector).last();
    const moduleVisible = await module.isVisible().catch(() => false);
    if (moduleVisible) {
        await module.scrollIntoViewIfNeeded();
        await page.waitForTimeout(300);
        await module.screenshot({ path: path.join(SCREENSHOTS_DIR, "module.png") });
    }

    // 9. Debug-Ausgabe
    console.log("=".repeat(60));
    console.log("URL:", productUrl);
    console.log("Modul sichtbar:", moduleVisible);

    if (consoleErrors.length) {
        console.log("\n❌ Console-Fehler (" + consoleErrors.length + "):");
        consoleErrors.forEach((e) => console.log("  ", e));
    } else {
        console.log("✓ Keine Console-Fehler");
    }

    const factsDebug = await page.evaluate((sel) => {
        const mod = document.querySelector(sel + ":last-of-type") || document.querySelector(sel);
        if (!mod) return null;
        return {
            productKey: mod.getAttribute("data-product-key"),
            productCode: mod.getAttribute("data-product-code"),
            items: Array.from(mod.querySelectorAll(".kk-pdp-facts__item")).map((item) => ({
                label: item.querySelector(".kk-pdp-facts__label")?.textContent?.trim(),
                text:  item.querySelector(".kk-pdp-facts__text")?.textContent?.trim(),
                description: item.querySelector(".kk-pdp-facts__description")?.textContent?.trim() || null,
                hasIcon: !!item.querySelector(".kk-pdp-facts__icon-image"),
                iconSrc: item.querySelector(".kk-pdp-facts__icon-image")?.getAttribute("src") || ""
            }))
        };
    }, moduleSelector).catch(() => null);

    expect(moduleVisible).toBeTruthy();

    if (factsDebug) {
        expect(factsDebug.items.length).toBeGreaterThan(0);
        expect(factsDebug.items.length).toBeLessThanOrEqual(3);
        expect(factsDebug.items.filter((item) => item.label === "Passform").length).toBeLessThanOrEqual(1);

        factsDebug.items.forEach((item) => {
            if (item.label === "Passform" || item.label === "Pflege") {
                expect(item.iconSrc.startsWith("data:image/svg+xml,")).toBeTruthy();
            }
        });

        console.log("\n📦 Produkt:", factsDebug.productCode);
        factsDebug.items.forEach((item, i) => {
            console.log(`  [${i + 1}] ${item.label}: "${item.text}"${item.description ? " → " + item.description : ""} ${item.hasIcon ? "🖼" : "⬜"}`);
        });
    } else {
        console.log("⚠️  Keine Facts – Modul nicht gerendert");
    }

    if (moduleVisible) {
        const box = await module.boundingBox();
        if (box) {
            console.log(`\n📐 Modul: ${Math.round(box.width)}×${Math.round(box.height)}px`);
        }
        const items = await page.locator(".kk-pdp-facts__item").all();
        for (const [i, itemLoc] of items.entries()) {
            const b = await itemLoc.boundingBox();
            if (b) console.log(`   Item [${i + 1}]: ${Math.round(b.width)}×${Math.round(b.height)}px`);
        }
    }

    console.log("=".repeat(60));
    console.log("Screenshots:", SCREENSHOTS_DIR);
});

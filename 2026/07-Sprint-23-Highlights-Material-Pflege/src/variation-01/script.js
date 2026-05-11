// load core and global js
// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @project 07-Sprint-23-Highlights-Material-Pflege
 * @author Codex
 * @date 23. April 2026
 * @variation 01
 * @description Mobile PDP: Passform, Material und Pflege direkt im Buybox-Kontext
 */
(function(KEK, win, doc) {
    "use strict";

    if (!KEK || !win || !doc) return;

    const MODULE_CLASS = "kk-pdp-facts";
    const EXPERIMENT_NAME = "07-Sprint-23-Highlights-Material-Pflege";
    const STATIC_ICON_URLS = {
        Passform: "data:image/svg+xml,%3C%3Fxml%20version=%221.0%22%20encoding=%22UTF-8%22%3F%3E%0A%3Csvg%20id=%22Passform%22%20xmlns=%22http://www.w3.org/2000/svg%22%20version=%221.1%22%20viewBox=%220%200%2036%2036%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cstyle%3E%0A%20%20%20%20%20%20.st0%20%7B%0A%20%20%20%20%20%20%20%20fill:%20%2324282b%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.st1%2C%20.st2%20%7B%0A%20%20%20%20%20%20%20%20fill:%20none%3B%0A%20%20%20%20%20%20%20%20stroke:%20%2324282b%3B%0A%20%20%20%20%20%20%20%20stroke-miterlimit:%2010%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.st2%20%7B%0A%20%20%20%20%20%20%20%20stroke-linecap:%20round%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C/style%3E%0A%20%20%3C/defs%3E%0A%20%20%3Cpath%20class=%22st0%22%20d=%22M18.08%2C5.92c-.02.51%2C0%2C1.48.66%2C2.18.55.58%2C1.33.8%2C2.16%2C1.02.27.07.56.15.87.25.8.26.88.41.66%2C1.16-.46%2C1.49-1.01%2C3.14-1.38%2C4.19-.17.5-1%2C3.06-.27%2C4.85.47%2C1.14%2C1%2C2.84%2C1.1%2C3.38.1.6.22%2C1.73.22%2C2.52%2C0%2C.11%2C0%2C.23%2C0%2C.36%2C0%2C.28.03.92-.08%2C1.13-.01%2C0-.03%2C0-.06%2C0h-9.12s-.04%2C0-.06%2C0c-.11-.21-.09-.85-.08-1.13%2C0-.13%2C0-.25%2C0-.36%2C0-.79.11-1.92.22-2.52.09-.54.63-2.24%2C1.1-3.38.73-1.79-.1-4.35-.27-4.85-.36-1.04-.92-2.69-1.38-4.19-.23-.75-.14-.9.66-1.16.31-.1.6-.18.87-.25.83-.23%2C1.61-.44%2C2.16-1.02.66-.7.67-1.67.66-2.18h1.37M18.34%2C4.92h-1.88c-.75%2C0-.75.49-.75.78s.12%2C1.19-.38%2C1.71c-.49.52-1.45.64-2.6%2C1.01-1.16.38-1.74.98-1.3%2C2.4.43%2C1.42.98%2C3.07%2C1.39%2C4.23.41%2C1.16.75%2C3.01.29%2C4.14-.46%2C1.13-1.04%2C2.92-1.16%2C3.59s-.23%2C1.85-.23%2C2.69-.23%2C2.49%2C1.13%2C2.49h9.12c1.36%2C0%2C1.13-1.65%2C1.13-2.49s-.12-2.03-.23-2.69-.69-2.46-1.16-3.59c-.46-1.13-.12-2.98.29-4.14.41-1.16.96-2.81%2C1.39-4.23.43-1.42-.14-2.03-1.3-2.4-1.16-.38-2.11-.49-2.6-1.01-.49-.52-.38-1.42-.38-1.71s0-.78-.75-.78h0Z%22/%3E%0A%20%20%3Cpath%20class=%22st0%22%20d=%22M22.61%2C34.26h-10.43c-.36%2C0-.66.3-.66.66v1.08h11.75v-1.08c0-.36-.3-.66-.66-.66h0Z%22/%3E%0A%20%20%3Cline%20class=%22st2%22%20x1=%2217.4%22%20y1=%2230.14%22%20x2=%2217.4%22%20y2=%2234.84%22/%3E%0A%20%20%3Ccircle%20class=%22st0%22%20cx=%2217.4%22%20cy=%221.4%22%20r=%221.4%22%20transform=%22translate%28.61%206.18%29%20rotate%28-20.49%29%22/%3E%0A%20%20%3Cline%20class=%22st1%22%20x1=%2217.4%22%20y1=%222.29%22%20x2=%2217.4%22%20y2=%225.19%22/%3E%0A%3C/svg%3E",
        Pflege: "data:image/svg+xml,%3C%3Fxml%20version=%221.0%22%20encoding=%22UTF-8%22%3F%3E%0A%3Csvg%20id=%22Waschmaschine%22%20xmlns=%22http://www.w3.org/2000/svg%22%20version=%221.1%22%20viewBox=%220%200%2036%2036%22%3E%0A%20%20%3Cdefs%3E%0A%20%20%20%20%3Cstyle%3E%0A%20%20%20%20%20%20.st0%20%7B%0A%20%20%20%20%20%20%20%20stroke-miterlimit:%2010%3B%0A%20%20%20%20%20%20%20%20stroke-width:%20.8px%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.st0%2C%20.st1%20%7B%0A%20%20%20%20%20%20%20%20fill:%20none%3B%0A%20%20%20%20%20%20%20%20stroke:%20%23000%3B%0A%20%20%20%20%20%20%20%20stroke-linecap:%20round%3B%0A%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20.st1%20%7B%0A%20%20%20%20%20%20%20%20stroke-linejoin:%20round%3B%0A%20%20%20%20%20%20%20%20stroke-width:%201.3px%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%3C/style%3E%0A%20%20%3C/defs%3E%0A%20%20%3Cpath%20d=%22M17.95%2C14.8c4.2%2C0%2C7.61%2C3.41%2C7.61%2C7.61s-3.41%2C7.61-7.61%2C7.61-7.61-3.41-7.61-7.61%2C3.41-7.61%2C7.61-7.61M17.95%2C13.5c-4.92%2C0-8.91%2C3.99-8.91%2C8.91s3.99%2C8.91%2C8.91%2C8.91%2C8.91-3.99%2C8.91-8.91-3.99-8.91-8.91-8.91h0Z%22/%3E%0A%20%20%3Crect%20class=%22st1%22%20x=%225.81%22%20y=%222.22%22%20width=%2224.28%22%20height=%2232.08%22%20rx=%22.63%22%20ry=%22.63%22/%3E%0A%20%20%3Cpath%20class=%22st1%22%20d=%22M24.4%2C6.04h2.26%22/%3E%0A%20%20%3Cpath%20class=%22st1%22%20d=%22M9.34%2C6.04h2.26%22/%3E%0A%20%20%3Crect%20class=%22st1%22%20x=%2215.11%22%20y=%224.37%22%20width=%225.78%22%20height=%223.35%22/%3E%0A%20%20%3Cpath%20class=%22st1%22%20d=%22M6.04%2C9.1s4.19%2C1.34%2C11.96%2C1.34c7.78%2C0%2C11.96-1.34%2C11.96-1.34%22/%3E%0A%20%20%3Cpath%20class=%22st0%22%20d=%22M18.36%2C16.76c2.13.16%2C4.08%2C1.51%2C4.89%2C3.64%2C1.11%2C2.93-.36%2C6.2-3.29%2C7.31s-6.2-.36-7.31-3.29c-.29-.77-.41-1.57-.36-2.34%22/%3E%0A%3C/svg%3E"
    };
    const SELECTORS = {
        productPage: '[data-testid="productPage"], main[data-testid="pdp-page"], [data-testid="buy-box"]',
        buyBox: '[data-testid="buy-box"]',
        buyBoxContent: '[data-testid="buy-box-content"]',
        productTitle: "h1",
        badges: '[data-testid="badge"]',
        descriptionBullets: '[data-testid="product-description-bullets"]',
        teaserItems: '[data-testid="product-description-bullets"] li',
        productProperties: '[data-testid="product-properties-wrapper"]',
        addToCartRow: '[data-testid="add-to-cart"]',
        benefitList: '[data-testid="product-benefit-list"]',
        paymentOptions: '[data-testid="product-payment-option"]'
    };
    const PRODUCT_PATH_PATTERN = /\/de\/(?:[^/]+\/)?p\/\d+/i;
    const CARE_PRIORITY_CATEGORIES = ["period", "mattress", "bedding", "footwear"];
    const QUALITY_RULES = [
        { regex: /\bgots\b/i, score: 98, label: "Zertifikat", text: "GOTS zertifiziert" },
        { regex: /chromfrei/i, score: 92, label: "Qualität", text: "Chromfrei gegerbtes Leder" },
        { regex: /made in germany/i, score: 90, label: "Herkunft", text: "Made in Germany" },
        { regex: /leader status/i, score: 84, label: "Sozialstandard", text: "Leader Status in der FWF" },
        { regex: /tencel/i, score: 76, label: "Faser", text: "TENCEL™ Modal" },
        { regex: /hn geprüft/i, score: 36, label: "Qualität", text: "hn geprüft" }
    ];
    const PRIMARY_RULES = [
        { regex: /(auslaufsicher|tag und nacht|saugkern|membran|leichtere bis mittlere tage|sicher und wiederverwendbar)/i, score: 112, label: "Schutz" },
        { regex: /(härtegrad|geeignet|seiten- und rückenschläfer|rückenschläfer|bis ca\.\s*\d+\s*kg|7-zonen)/i, score: 110, label: "Eignung" },
        { regex: /(lieferung bis ins haus|lieferservice|anlieferung erfolgt bis ins haus)/i, score: 106, label: "Lieferung" },
        { regex: /(wind|regen|abperlen|imprägnierung|outdoor|windfang)/i, score: 101, label: "Schutz" },
        { regex: /(temperaturregulierend|klimaregulierend|leicht schwitzen|ganzes jahr|ganzjahr|atmungsaktiv)/i, score: 96, label: "Komfort" },
        { regex: /(chromfrei|schadstofffrei|grip|herausnehmbare decksohle|natürlich atmungsaktiv)/i, score: 94, label: "Qualität" },
        { regex: /(\d+er[- ](?:pack|set)|je zwei|doppelpack)/i, score: 88, label: "Set" },
        { regex: /(straight fit|wide leg|relaxed|fitted|regular|oversize|figurnah|körperbetont|schmal|weit|lang|überlange ärmel|rundhals|reguläre schuhbreite|kapuze|knöchelhoch)/i, score: 72, label: "Passform" },
        { regex: /(waschbar|pflege|maschinenwaschbar|40°c|30°c|kalt auswaschen)/i, score: 70, label: "Pflege" }
    ];
    const PARAGRAPH_EXTRACTORS = [
        {
            regex: /geeignet[^.]*seiten-?\s*oder\s*rückenschläfer/i,
            label: "Eignung",
            score: 112,
            text: "Geeignet für Seiten- und Rückenschläfer"
        },
        {
            regex: /anlieferung erfolgt bis ins haus/i,
            label: "Lieferung",
            score: 104,
            text: "Lieferung bis ins Haus"
        },
        {
            regex: /regen abperlen/i,
            label: "Schutz",
            score: 105,
            text: "Nature Shell lässt Regen abperlen"
        },
        {
            regex: /trotzt dem wind/i,
            label: "Schutz",
            score: 103,
            text: "Dichter Baumwollstoff schützt vor Wind"
        },
        {
            regex: /auslaufsicher[^.]*tag und nacht/i,
            label: "Schutz",
            score: 114,
            text: "Auslaufsicher Tag und Nacht"
        },
        {
            regex: /waschbar bei\s*(\d+)\s*°?\s*c/i,
            label: "Pflege",
            score: 83,
            getText: function(match) {
                return "Waschbar bei " + match[1] + "°C";
            }
        },
        {
            regex: /kühl(?:es|e)s gefühl/i,
            label: "Komfort",
            score: 88,
            text: "Bio-Batist-Inlett mit kühlendem Griff"
        }
    ];
    const CATEGORY_SECTION_PRIORITY = {
        default: ["Hauptmaterial", "Obermaterial", "Füllung", "Bezug", "Versteppung", "Futter", "Laufsohle"],
        jeans: ["Hauptmaterial", "Bezug", "Futter", "Obermaterial", "Füllung", "Versteppung", "Laufsohle"],
        basics: ["Hauptmaterial", "Bezug", "Futter", "Obermaterial", "Füllung", "Versteppung", "Laufsohle"],
        outerwear: ["Hauptmaterial", "Obermaterial", "Futter", "Bezug", "Versteppung", "Füllung", "Laufsohle"],
        period: ["Hauptmaterial", "Futter", "Obermaterial", "Bezug", "Füllung", "Versteppung", "Laufsohle"],
        bedding: ["Füllung", "Bezug", "Versteppung", "Hauptmaterial", "Futter", "Obermaterial", "Laufsohle"],
        mattress: ["Füllung", "Bezug", "Versteppung", "Hauptmaterial", "Futter", "Obermaterial", "Laufsohle"],
        footwear: ["Obermaterial", "Futter", "Bezug", "Hauptmaterial", "Laufsohle", "Füllung", "Versteppung"]
    };
    const MATERIAL_BENEFIT_RULES = [
        {
            regex: /(musselin|crinkle|krepp|gekreppt)/i,
            priority: 150,
            headline: "Musselin",
            text: "Krepp-Struktur sorgt auch an warmen Tagen für ein angenehmes Hautgefühl."
        },
        {
            regex: /(flammgarn|flammstruktur|slub)/i,
            priority: 138,
            headline: "Slub-Garn",
            text: "Flammstruktur bringt lebendige Optik und fühlt sich weich auf der Haut an."
        },
        {
            regex: /nature shell/i,
            priority: 160,
            headline: "Nature Shell",
            text: "Dichter Baumwollstoff schützt vor Wind und lässt Regen abperlen."
        },
        {
            regex: /(betterrecycling|schnittabfäll|schnittabfaell)/i,
            priority: 145,
            headline: "BetterRecycling Denim",
            text: "Schnittreste im Denim sparen neue Rohstoffe und machen den Stoff ressourcenschonender."
        },
        {
            regex: /(lasertechnik|sauerstoffbasis|sandstrahlung|chlorbleiche|bio-denim|nature denim|denim|jeans)/i,
            priority: 140,
            headline: "Bio-Denim",
            text: "Umweltschonende Denim-Waschung spart Wasser und verzichtet auf Sandstrahlung."
        },
        {
            regex: /(bio-?baumwoll-?softfleece|softfleece|beidseitig aufgeraut)/i,
            priority: 136,
            headline: "Softfleece",
            text: "Beidseitig aufgeraut - extra weich, wärmend und atmungsaktiv."
        },
        {
            regex: /(bio-?baumwoll-?wollfleece|wollfleece|bio-?wollfleece|bio-?merino)/i,
            priority: 134,
            headline: "Wollfleece",
            text: "Wärmt natürlich und reguliert Feuchtigkeit für wechselnde Temperaturen."
        },
        {
            regex: /(bio-?baumwoll-?fleece|baumwollfleece|einseitig aufgeraut)/i,
            priority: 132,
            headline: "Baumwollfleece",
            text: "Aufgeraute Struktur bietet atmungsaktiven Komfort und ist pflegeleicht im Alltag."
        },
        {
            regex: /(nature fleece|naturfleece|fleece)/i,
            priority: 130,
            headline: "Nature Fleece",
            text: "Reine Naturfasern wärmen atmungsaktiv und geben beim Waschen kein Mikroplastik ab."
        },
        {
            regex: /leinen/i,
            priority: 126,
            headline: "Leinen",
            text: "Kühlend an heißen Tagen und luftig auf der Haut."
        },
        {
            regex: /(rhönwolle|rhoenwolle)/i,
            priority: 124,
            headline: "Rhönwolle",
            text: "Robust, langlebig und von Natur aus wasserabweisend."
        },
        {
            regex: /(schurwolle|merinowolle|merino)/i,
            priority: 118,
            headline: "Schurwolle",
            text: "Wärmend, atmungsaktiv und durch Lüften schnell wieder frisch."
        },
        {
            regex: /(cashmere|kaschmir)/i,
            priority: 122,
            headline: "Cashmere",
            text: "Leicht, weich und wärmend - ideal für empfindliche Haut."
        },
        {
            regex: /alpaka/i,
            priority: 120,
            headline: "Alpaka",
            text: "Extra leicht und weich mit fließendem Fall auf der Haut."
        },
        {
            regex: /(bio-?baumwolle|biologischem anbau|baumwolle)/i,
            priority: 80,
            text: "Weich, hautfreundlich und atmungsaktiv."
        }
    ];
    const RETRY_DELAYS = [160, 280, 420, 650, 900, 1200];
    const MAX_RETRY_ATTEMPTS = 6;

    let renderTimer = null;
    let routeObserver = null;
    let routePoller = null;
    let buyBoxObserver = null;
    let observedBuyBox = null;
    let historyPatched = false;
    let lastSignature = "";
    let lastKnownHref = win.location.href;
    let lastBuyBoxFingerprint = "";
    let pendingApplyAttempts = 0;
    const trackedPayloads = {};

    function stripHtml(value) {
        const wrapper = doc.createElement("div");
        wrapper.innerHTML = value || "";
        return cleanText(wrapper.textContent || wrapper.innerText || "");
    }

    function cleanText(value) {
        return (value || "")
            .replace(/\u00a0/g, " ")
            .replace(/\s+/g, " ")
            .replace(/\s([,.;:!?])/g, "$1")
            .trim();
    }

    function compactTemperature(value) {
        return cleanText(value || "").replace(/\s*°\s*C/gi, "°C");
    }

    function compactCareText(value) {
        const text = cleanText(value);
        const temperatureMatch = text.match(/(\d+\s*°\s*C)/i);
        const temperature = temperatureMatch ? compactTemperature(temperatureMatch[1]) : "";

        if (/(schonwaschgang|feinwaschgang)/i.test(text) && temperature) {
            return "Maschinenwaschbar bei " + temperature;
        }

        if (/(maschinenwaschbar|waschbar)/i.test(text) && temperature) {
            return "Maschinenwaschbar bei " + temperature;
        }

        if (/nicht im w[aä]schetrockner/i.test(text)) {
            return "Nicht trocknergeeignet";
        }

        if (/form ziehen/i.test(text)) {
            return "Nach der Wäsche in Form ziehen";
        }

        return text;
    }

    function isMachineWashBenefitText(value) {
        const text = cleanText(value);

        if (!text) return false;

        if (/(nicht\s+(?:maschinen)?waschbar|nicht\s+trocknergeeignet|nur\s+handw[aä]sche|handw[aä]sche|trockenreinigung|chemische\s+reinigung|professionelle\s+reinigung)/i.test(text)) {
            return false;
        }

        return /(maschinenwaschbar|waschbar\s+bei|\bwaschbar\b|\d+\s*°\s*c)/i.test(text);
    }

    function isSelectableBenefitCandidate(candidate) {
        if (!candidate) return false;
        if (candidate.label !== "Pflege") return true;

        return isMachineWashBenefitText(candidate.text);
    }

    function compactFitText(values) {
        const sourceValues = Array.isArray(values) ? values : [];
        const normalizedValues = sourceValues.map(cleanText).filter(Boolean);
        const priorities = [
            { regex: /oversize/i, text: "Oversize" },
            { regex: /barrel/i, text: "Barrel Leg" },
            { regex: /culotte/i, text: "Culotte" },
            { regex: /wide leg|weit/i, text: "Wide Leg" },
            { regex: /tapered|schmal zulaufend/i, text: "Tapered Leg" },
            { regex: /mom/i, text: "Mom Fit" },
            { regex: /straight/i, text: "Straight Fit" },
            { regex: /slim/i, text: "Slim Fit" },
            { regex: /skinny/i, text: "Skinny Fit" },
            { regex: /fitted|figurnah/i, text: "Fitted" },
            { regex: /relaxed/i, text: "Relaxed Fit" },
            { regex: /regular/i, text: "Regular Fit" },
            { regex: /v-ausschnitt/i, text: "V-Ausschnitt" },
            { regex: /rundhals/i, text: "Rundhals" },
            { regex: /kurzarm/i, text: "Kurzarm" },
            { regex: /langarm/i, text: "Langarm" },
            { regex: /\blang\b/i, text: "Lang" }
        ];
        const priorityMatch = priorities.find(function(priority) {
            return normalizedValues.some(function(value) {
                return priority.regex.test(value);
            });
        });

        return priorityMatch ? priorityMatch.text : normalizedValues[0] || "";
    }

    function uppercaseFirst(value) {
        const text = cleanText(value);

        return text ? text.charAt(0).toUpperCase() + text.slice(1) : "";
    }

    function ensureSentence(value) {
        const text = cleanText(value);

        if (!text) return "";
        return /[.!?]$/.test(text) ? text : text + ".";
    }

    function getFitDescriptionFromText(value, fitText) {
        const text = stripHtml(value);
        const fitKey = cleanText(fitText).replace(/\s*Fit$/i, "");
        const colonIndex = text.indexOf(":");

        if (colonIndex !== -1 && (!fitKey || normalizeForCompare(text.slice(0, colonIndex)).indexOf(normalizeForCompare(fitKey)) !== -1)) {
            const extractedText = ensureSentence(uppercaseFirst(text.slice(colonIndex + 1)));

            if (extractedText && extractedText.length <= 72) {
                return extractedText;
            }
        }

        if (/oversize/i.test(fitText)) return "Extra locker geschnitten für entspannten Komfort.";
        if (/barrel/i.test(fitText)) return "Voluminös geschnitten mit entspanntem Sitz am Bein.";
        if (/culotte/i.test(fitText)) return "Verkürztes, weites Bein für luftigen Komfort.";
        if (/wide leg/i.test(fitText)) return "Weites Bein für luftigen Tragekomfort.";
        if (/tapered/i.test(fitText)) return "Locker anliegend mit schmal zulaufendem Bein.";
        if (/mom/i.test(fitText)) return "Locker an Hüfte und Oberschenkel für bequemen Sitz.";
        if (/relaxed/i.test(fitText)) return "Locker geschnitten für entspannten Tragekomfort.";
        if (/regular/i.test(fitText)) return "Klassisch geschnitten für bequemen Alltag.";
        if (/straight/i.test(fitText)) return "Gerades Bein für einen klaren, zeitlosen Sitz.";
        if (/wide leg/i.test(fitText)) return "Weites Bein für luftigen Tragekomfort.";
        if (/slim|skinny|fitted/i.test(fitText)) return "Figurnah geschnitten für eine schmale Silhouette.";
        if (/lang/i.test(fitText)) return "Längere Passform für bequeme Bedeckung.";

        return "";
    }

    function getFitDescriptionFromProduct(product, fitText) {
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const details = informationBox.productDetails || {};
        const bullets = details.bullets || [];
        const fitKey = cleanText(fitText).replace(/\s*Fit$/i, "");
        const matchingBullet = bullets
            .map(stripHtml)
            .find(function(bullet) {
                return normalizeForCompare(bullet).indexOf(normalizeForCompare(fitKey)) !== -1 && bullet.indexOf(":") !== -1;
            });

        return getFitDescriptionFromText(matchingBullet || "", fitText) || getFitDescriptionFromText("", fitText);
    }

    function normalizeForCompare(value) {
        return stripHtml(value)
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9äöüß]+/g, " ")
            .replace(/\s+/g, " ")
            .trim();
    }

    function isProductPage() {
        return PRODUCT_PATH_PATTERN.test(win.location.pathname) || !!KEK.qs(SELECTORS.productPage);
    }

    function isDesktopViewport() {
        return win.matchMedia && win.matchMedia("(min-width: 1024px)").matches;
    }

    function scheduleApply(delay) {
        clearTimeout(renderTimer);
        renderTimer = win.setTimeout(applyVariation, typeof delay === "number" ? delay : 120);
    }

    function resetApplyRetry() {
        pendingApplyAttempts = 0;
    }

    function scheduleRetryApply() {
        if (pendingApplyAttempts >= MAX_RETRY_ATTEMPTS) return;

        const delay = RETRY_DELAYS[Math.min(pendingApplyAttempts, RETRY_DELAYS.length - 1)];
        pendingApplyAttempts += 1;
        scheduleApply(delay);
    }

    function buildBuyBoxFingerprint(node) {
        const buyBoxContent = node || KEK.qs(SELECTORS.buyBoxContent);
        if (!buyBoxContent) return "";

        const clone = buyBoxContent.cloneNode(true);
        Array.prototype.forEach.call(clone.querySelectorAll("." + MODULE_CLASS), function(moduleNode) {
            moduleNode.remove();
        });

        return normalizeForCompare(clone.textContent || clone.innerText || "");
    }

    function syncBuyBoxState() {
        const nextFingerprint = buildBuyBoxFingerprint();

        if (!nextFingerprint) {
            const hadFingerprint = !!lastBuyBoxFingerprint;
            lastBuyBoxFingerprint = "";
            return hadFingerprint;
        }

        if (lastBuyBoxFingerprint === nextFingerprint) return false;

        lastBuyBoxFingerprint = nextFingerprint;
        lastSignature = "";
        resetApplyRetry();
        return true;
    }

    function ensureBuyBoxObserver() {
        const buyBoxContent = KEK.qs(SELECTORS.buyBoxContent);

        if (!buyBoxContent) {
            if (buyBoxObserver) {
                buyBoxObserver.disconnect();
                buyBoxObserver = null;
            }

            observedBuyBox = null;
            return;
        }

        if (buyBoxObserver && observedBuyBox === buyBoxContent) return;

        if (buyBoxObserver) {
            buyBoxObserver.disconnect();
        }

        observedBuyBox = buyBoxContent;
        buyBoxObserver = new MutationObserver(function(mutations) {
            const shouldCheck = mutations.some(function(mutation) {
                return mutation.type === "childList" ||
                    mutation.type === "characterData" ||
                    mutation.type === "attributes";
            });

            if (!shouldCheck) return;

            if (syncBuyBoxState()) {
                scheduleApply(80);
            }
        });

        buyBoxObserver.observe(buyBoxContent, {
            childList: true,
            subtree: true,
            characterData: true,
            attributes: true
        });
    }

    function removeModule() {
        KEK.qsa("." + MODULE_CLASS).forEach(function(node) {
            node.remove();
        });
    }

    function isModulePlacedAtTarget(moduleNode, insertTarget) {
        if (!moduleNode || !insertTarget || !insertTarget.node) return false;

        if (insertTarget.position === "beforebegin") {
            return insertTarget.node.previousElementSibling === moduleNode;
        }

        if (insertTarget.position === "afterend") {
            return insertTarget.node.nextElementSibling === moduleNode;
        }

        return false;
    }

    function placeModuleAtTarget(moduleNode, insertTarget) {
        if (!moduleNode || !insertTarget || !insertTarget.node) return false;

        if (!isModulePlacedAtTarget(moduleNode, insertTarget)) {
            insertTarget.node.insertAdjacentElement(insertTarget.position, moduleNode);
        }

        return true;
    }

    function extractProductFromPageProps(source) {
        return source && source.pageProps && source.pageProps.productResult && source.pageProps.productResult.product
            ? source.pageProps.productResult.product
            : null;
    }

    function parseProductData() {
        const router = win.next && win.next.router ? win.next.router : null;
        const route = router && router.route ? router.route : null;
        const routeComponent = route && router && router.components ? router.components[route] : null;
        const routerProduct = routeComponent && routeComponent.props
            ? extractProductFromPageProps(routeComponent.props)
            : null;

        if (routerProduct) {
            return routerProduct;
        }

        const nextDataScript = KEK.qs("#__NEXT_DATA__");
        let nextData = null;

        if (nextDataScript && nextDataScript.textContent) {
            try {
                nextData = JSON.parse(nextDataScript.textContent);
            } catch (error) {
                nextData = null;
            }
        }

        if (!nextData) {
            nextData = win.__NEXT_DATA__ || null;
        }

        return nextData && nextData.props
            ? extractProductFromPageProps(nextData.props)
            : null;
    }

    function getVisibleContext() {
        const visibleTexts = [];
        const title = KEK.qs(SELECTORS.productTitle);

        if (title) {
            visibleTexts.push(cleanText(title.textContent));
        }

        KEK.qsa(SELECTORS.badges).forEach(function(badge) {
            visibleTexts.push(cleanText(badge.textContent));
        });

        KEK.qsa(SELECTORS.teaserItems).forEach(function(item) {
            const text = cleanText(item.textContent);
            if (text && !/mehr\s+produktdetails/i.test(text)) {
                visibleTexts.push(text);
            }
        });

        return visibleTexts
            .map(normalizeForCompare)
            .filter(Boolean);
    }

    function inferCategory(product) {
        const baseText = [
            product && product.name,
            win.location.pathname,
            product && product.informationBox && product.informationBox.productDetails &&
                product.informationBox.productDetails.bullets
                ? product.informationBox.productDetails.bullets.join(" ")
                : ""
        ].join(" ").toLowerCase();

        if (/period|menstru|pure balance/.test(baseText)) return "period";
        if (/matratz/.test(baseText)) return "mattress";
        if (/bettdecke|decke|kissen/.test(baseText)) return "bedding";
        if (/parka|mantel|jacke|shell|outdoor/.test(baseText)) return "outerwear";
        if (/stiefelette|bootie|schuh|sneaker/.test(baseText)) return "footwear";
        if (/jeans/.test(baseText)) return "jeans";
        if (/unterhemd|shirt|slip|panty|body|top|pack/.test(baseText)) return "basics";

        return "default";
    }

    function getCategoryBonus(category, text) {
        const haystack = text.toLowerCase();

        if (category === "mattress" && /(geeignet|härtegrad|lieferung|waschbar|seiten|rücken)/.test(haystack)) return 12;
        if (category === "period" && /(auslaufsicher|tag und nacht|saugkern|membran|wiederverwendbar|kalt auswaschen)/.test(haystack)) return 14;
        if (category === "outerwear" && /(regen|wind|imprägnierung|kapuze|outdoor)/.test(haystack)) return 12;
        if (category === "footwear" && /(chromfrei|schadstofffrei|grip|decksohle|leder)/.test(haystack)) return 11;
        if (category === "bedding" && /(ganzjahr|temperaturregulierend|leicht schwitzen|waschbar|feuchtigkeitsaufnahme)/.test(haystack)) return 10;
        if ((category === "jeans" || category === "basics") && /(straight fit|relaxed|fitted|lang|rundhals|drunterziehen)/.test(haystack)) return 9;

        return 0;
    }

    function createCandidate(slot, label, text, score, meta) {
        return {
            slot: slot,
            label: label,
            text: cleanText(text),
            score: score,
            meta: meta || {}
        };
    }

    function resolveProductImageUrl(url, format) {
        const source = cleanText(url);

        if (!source) return "";

        return source.indexOf("{{format}}") === -1
            ? source
            : source.replace("{{format}}", format || "webshop_product-small");
    }

    function buildIconMeta(iconUrls, iconFit) {
        const urls = (Array.isArray(iconUrls) ? iconUrls : [iconUrls])
            .map(cleanText)
            .filter(function(url) {
                return /^https?:\/\//i.test(url) || /^data:image\//i.test(url);
            })
            .slice(0, 2);

        return urls.length
            ? {
                iconUrls: urls,
                iconFit: iconFit || "contain"
            }
            : {};
    }

    function getCandidateIconUrls(candidate) {
        if (!candidate || !candidate.meta) return [];

        return (Array.isArray(candidate.meta.iconUrls)
            ? candidate.meta.iconUrls
            : candidate.meta.iconUrl
                ? [candidate.meta.iconUrl]
                : [])
            .map(cleanText)
            .filter(Boolean);
    }

    function getStaticIconUrl(label) {
        const iconRegistry = win && win.__KK_PDP_FACT_ICONS__ && typeof win.__KK_PDP_FACT_ICONS__ === "object"
            ? win.__KK_PDP_FACT_ICONS__
            : {};

        if (/^passform$/i.test(cleanText(label))) {
            return cleanText(iconRegistry.passform);
        }

        if (/^pflege$/i.test(cleanText(label))) {
            return cleanText(iconRegistry.pflege);
        }

        return "";
    }

    function getProductThumbnailUrl(product) {
        const images = Array.isArray(product && product.imgs) ? product.imgs : [];
        const productImage = images.find(function(image) {
            return image && image.url && /product-shop/i.test(image.url);
        });

        if (productImage && productImage.url) {
            return resolveProductImageUrl(productImage.url, "webshop_product-small");
        }

        const swatches = Array.isArray(product && product.styleVariants) ? product.styleVariants : [];
        const swatch = swatches.find(function(variant) {
            return variant && variant.url;
        });

        return swatch && swatch.url ? cleanText(swatch.url) : "";
    }

    function getMaterialIconMeta(product, candidate) {
        const sections = product && product.informationBox && product.informationBox.productMaterial
            ? product.informationBox.productMaterial
            : [];
        const matchingSection = sections.find(function(section) {
            const sectionHeader = cleanText(section && section.header);

            if (candidate && candidate.label === "Material" && /^hauptmaterial$/i.test(sectionHeader)) {
                return true;
            }

            return sectionHeader === cleanText(candidate && candidate.label);
        });
        const section = matchingSection || sections[0];
        const iconUrls = section && section.materialDetailData
            ? section.materialDetailData.map(function(item) {
                return item && item.image ? item.image.url : "";
            })
            : [];

        return buildIconMeta(iconUrls, "contain");
    }

    function getCareIconMeta(product, candidate) {
        const careLabels = product && product.informationBox && product.informationBox.productCareLabel &&
            product.informationBox.productCareLabel.careLabelData
            ? product.informationBox.productCareLabel.careLabelData
            : [];
        const exactMatch = careLabels.find(function(item) {
            return compactCareText(item && item.name) === cleanText(candidate && candidate.text) && item && item.imageUrl;
        });
        const fallbackMatch = careLabels.find(function(item) {
            return item && item.imageUrl && isMachineWashBenefitText(compactCareText(item.name));
        });

        return buildIconMeta(exactMatch ? exactMatch.imageUrl : fallbackMatch ? fallbackMatch.imageUrl : "", "contain");
    }

    function getQualityIconMeta(product, candidate) {
        const entries = product && product.informationBox && product.informationBox.productQuality
            ? product.informationBox.productQuality
            : [];
        const matchingEntry = entries.find(function(entry) {
            const header = cleanText(entry && entry.header);
            const candidateText = cleanText(candidate && candidate.text);

            return header === candidateText ||
                normalizeForCompare(header).indexOf(normalizeForCompare(candidateText)) !== -1 ||
                normalizeForCompare(candidateText).indexOf(normalizeForCompare(header)) !== -1;
        });
        const entry = matchingEntry || entries[0];
        const iconUrl = entry && entry.image
            ? entry.image.url || entry.image.imageUrl
            : entry && entry.imageUrl
                ? entry.imageUrl
                : "";

        return buildIconMeta(iconUrl, "contain");
    }

    function getMadeInIconMeta(product) {
        const madeIn = product && product.informationBox ? product.informationBox.productMadeIn : null;
        const iconUrl = madeIn && madeIn.image ? madeIn.image.url : "";

        return buildIconMeta(iconUrl, "contain");
    }

    function getFallbackIconMeta(product) {
        return buildIconMeta(getProductThumbnailUrl(product), "cover");
    }

    function resolveCandidateIconMeta(candidate, product) {
        const staticIconUrl = getStaticIconUrl(candidate && candidate.label);

        if (staticIconUrl) {
            return buildIconMeta(staticIconUrl, "contain");
        }

        if (candidate && STATIC_ICON_URLS[candidate.label]) {
            return buildIconMeta(STATIC_ICON_URLS[candidate.label], "contain");
        }

        const existingIconMeta = buildIconMeta(getCandidateIconUrls(candidate), candidate && candidate.meta ? candidate.meta.iconFit : "contain");

        if (existingIconMeta.iconUrls && existingIconMeta.iconUrls.length) {
            return existingIconMeta;
        }

        if (!candidate) return {};

        if (candidate.slot === "material" || candidate.label === "Material") {
            return getMaterialIconMeta(product, candidate);
        }

        if (candidate.label === "Pflege") {
            return getCareIconMeta(product, candidate);
        }

        if (candidate.label === "Zertifikat" || candidate.label === "Qualität" || candidate.label === "Sozialstandard") {
            return getQualityIconMeta(product, candidate);
        }

        if (candidate.label === "Herkunft") {
            return getMadeInIconMeta(product);
        }

        return getFallbackIconMeta(product);
    }

    function withResolvedCandidateIcon(candidate, product) {
        if (!candidate) return candidate;

        const iconMeta = resolveCandidateIconMeta(candidate, product);

        if (!iconMeta.iconUrls || !iconMeta.iconUrls.length) {
            return candidate;
        }

        return Object.assign({}, candidate, {
            meta: Object.assign({}, candidate.meta || {}, iconMeta)
        });
    }

    function getPrimaryCandidates(product, category) {
        const candidates = [];
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const detailsBullets = informationBox.productDetails && informationBox.productDetails.bullets
            ? informationBox.productDetails.bullets
            : [];
        const detailParagraphs = informationBox.productDetails && informationBox.productDetails.paragraphs
            ? informationBox.productDetails.paragraphs
            : [];
        const fit = informationBox.productFit || {};
        const packMatch = cleanText(product && product.name).match(/(\d+er[- ](?:pack|set))/i);

        detailsBullets.forEach(function(rawBullet) {
            const bullet = stripHtml(rawBullet);
            let bestRule = null;

            PRIMARY_RULES.forEach(function(rule) {
                if (rule.regex.test(bullet) && (!bestRule || rule.score > bestRule.score)) {
                    bestRule = rule;
                }
            });

            if (!bestRule) return;
            if (bestRule.label === "Pflege" && !isMachineWashBenefitText(bullet)) return;

            const candidateText = bestRule.label === "Passform"
                ? compactFitText([bullet]) || bullet
                : bullet;
            const candidateMeta = bestRule.label === "Passform"
                ? {
                    source: "details-bullets",
                    description: getFitDescriptionFromText(bullet, candidateText)
                }
                : { source: "details-bullets" };

            candidates.push(createCandidate(
                "primary",
                bestRule.label,
                candidateText,
                bestRule.score + getCategoryBonus(category, bullet),
                candidateMeta
            ));
        });

        detailParagraphs.forEach(function(rawParagraph) {
            const paragraph = stripHtml(rawParagraph);

            PARAGRAPH_EXTRACTORS.forEach(function(extractor) {
                const match = paragraph.match(extractor.regex);
                if (!match) return;

                const text = extractor.getText ? extractor.getText(match) : extractor.text;
                if (!text) return;

                candidates.push(createCandidate(
                    "primary",
                    extractor.label,
                    text,
                    extractor.score + getCategoryBonus(category, text),
                    { source: "details-paragraphs" }
                ));
            });
        });

        if (packMatch) {
            candidates.push(createCandidate(
                "primary",
                "Set",
                packMatch[1].replace(/\s+/g, "-"),
                86,
                { source: "title-pack" }
            ));
        }

        return uniqueCandidates(candidates);
    }

    function getFitCandidates(product) {
        const fit = product && product.informationBox ? product.informationBox.productFit || {} : {};
        const fitText = compactFitText(fit.passform);

        if (!fitText) return [];

        return [createCandidate(
            "primary",
            "Passform",
            fitText,
            86,
            Object.assign(
                {
                    source: "fit-compact",
                    description: getFitDescriptionFromProduct(product, fitText)
                },
                getFallbackIconMeta(product)
            )
        )];
    }

    function getPreferredMaterialSections(sections, category) {
        const priority = CATEGORY_SECTION_PRIORITY[category] || CATEGORY_SECTION_PRIORITY.default;

        return (sections || [])
            .slice()
            .sort(function(a, b) {
                const aHeader = cleanText(a && a.header);
                const bHeader = cleanText(b && b.header);
                const aIndex = priority.indexOf(aHeader) === -1 ? priority.length : priority.indexOf(aHeader);
                const bIndex = priority.indexOf(bHeader) === -1 ? priority.length : priority.indexOf(bHeader);

                if (aIndex !== bIndex) return aIndex - bIndex;
                return 0;
            });
    }

    function getMaterialParts(section) {
        if (!section || !section.materialDetailData || !section.materialDetailData.length) return [];

        return section.materialDetailData
            .map(function(item) {
                return stripHtml(item && item.header);
            })
            .filter(Boolean);
    }

    function getPrimaryMaterialSection(sections, category) {
        const orderedSections = getPreferredMaterialSections(sections, category);
        const mainSection = orderedSections.find(function(section) {
            return /^hauptmaterial$/i.test(cleanText(section && section.header));
        });

        return mainSection || orderedSections[0] || null;
    }

    function getMaterialSearchText(product, sections) {
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const details = informationBox.productDetails || {};
        const qualityEntries = informationBox.productQuality || [];
        const materialBits = [];

        (sections || []).forEach(function(section) {
            materialBits.push(cleanText(section && section.header));
            (section.materialDetailData || []).forEach(function(item) {
                materialBits.push(stripHtml(item && item.header));
                materialBits.push(stripHtml(item && item.content));
            });
        });

        return [
            product && product.name,
            (details.bullets || []).map(stripHtml).join(" "),
            (details.paragraphs || []).map(stripHtml).join(" "),
            qualityEntries.map(function(entry) { return cleanText(entry && entry.header); }).join(" "),
            materialBits.join(" ")
        ].join(" ");
    }

    function getMaterialBenefitRule(product, sections) {
        const searchText = getMaterialSearchText(product, sections);
        const matches = MATERIAL_BENEFIT_RULES
            .filter(function(rule) {
                return rule.regex.test(searchText);
            })
            .sort(function(a, b) {
                return (b.priority || 0) - (a.priority || 0);
            });

        return matches[0] || null;
    }

    function getMaterialBenefitText(product, sections) {
        const matchingRule = getMaterialBenefitRule(product, sections);

        return matchingRule ? matchingRule.text : "Natürliches Material für angenehmen Tragekomfort.";
    }

    function getHighlightedMaterialText(sections, matchingRule) {
        if (!matchingRule) return "";

        const matchingPart = (sections || [])
            .reduce(function(parts, section) {
                return parts.concat(getMaterialParts(section));
            }, [])
            .find(function(part) {
                return matchingRule.regex.test(part);
            });

        const cleanMatchingPart = cleanText(matchingPart);
        const fallbackHeadline = cleanText(matchingRule.headline);

        if (!cleanMatchingPart) {
            return fallbackHeadline;
        }

        if (
            fallbackHeadline &&
            fallbackHeadline.length > cleanMatchingPart.length &&
            normalizeForCompare(fallbackHeadline).indexOf(normalizeForCompare(cleanMatchingPart)) !== -1
        ) {
            return fallbackHeadline;
        }

        return cleanMatchingPart;
    }

    function buildMaterialHeadlineText(primaryText, matchingRule, highlightText) {
        const cleanPrimaryText = cleanText(primaryText);
        const highlightHeadline = cleanText(highlightText || matchingRule && matchingRule.headline);

        if (!cleanPrimaryText || !highlightHeadline) return cleanPrimaryText;
        if (normalizeForCompare(cleanPrimaryText).indexOf(normalizeForCompare(highlightHeadline)) !== -1) {
            return cleanPrimaryText;
        }

        return highlightHeadline + (/\d+\s*%/.test(highlightHeadline) && /\d+\s*%/.test(cleanPrimaryText) ? " mit " : " aus ") + cleanPrimaryText;
    }

    function buildAdditionalMaterialText(mainSection, sections, mainText, highlightText) {
        const additionalParts = [];
        const excludedTexts = [mainText, highlightText]
            .map(normalizeForCompare)
            .filter(Boolean);

        (sections || []).forEach(function(section) {
            const sectionHeader = cleanText(section && section.header);
            const sectionParts = getMaterialParts(section);

            sectionParts.forEach(function(part) {
                const normalizedPart = normalizeForCompare(part);
                const isMainPart = section === mainSection && normalizeForCompare(part) === normalizeForCompare(mainText);
                const prefix = sectionHeader && !/^hauptmaterial$/i.test(sectionHeader)
                    ? sectionHeader + ": "
                    : "";
                const nextPart = prefix + part;

                if (isMainPart || excludedTexts.indexOf(normalizedPart) !== -1 || additionalParts.indexOf(nextPart) !== -1) return;
                additionalParts.push(nextPart);
            });
        });

        return additionalParts.length ? "Weitere Materialien: " + additionalParts.slice(0, 3).join(", ") : "";
    }

    function buildMaterialDisplay(product, sections, category) {
        const primarySection = getPrimaryMaterialSection(sections, category);
        const primaryParts = getMaterialParts(primarySection);
        const primaryText = primaryParts[0] || "";
        const matchingRule = getMaterialBenefitRule(product, sections);
        const highlightText = getHighlightedMaterialText(sections, matchingRule);

        if (!primaryText) return null;

        return {
            text: buildMaterialHeadlineText(primaryText, matchingRule, highlightText),
            description: matchingRule ? matchingRule.text : getMaterialBenefitText(product, sections),
            detailText: buildAdditionalMaterialText(primarySection, sections, primaryText, highlightText),
            section: cleanText(primarySection && primarySection.header),
            iconMeta: buildIconMeta(
                primarySection && primarySection.materialDetailData
                    ? primarySection.materialDetailData.map(function(item) {
                        return item && item.image ? item.image.url : "";
                    }).slice(0, 1)
                    : [],
                "contain"
            )
        };
    }

    function buildMaterialText(section) {
        const parts = getMaterialParts(section);

        if (!parts.length) return "";

        const sectionHeader = cleanText(section.header);
        const headerPrefix = sectionHeader && !/^hauptmaterial$/i.test(sectionHeader)
            ? sectionHeader + ": "
            : "";

        return headerPrefix + parts.slice(0, 2).join(", ");
    }

    function getMaterialCandidates(product, category) {
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const rawSections = informationBox.productMaterial || [];
        const materialDisplay = buildMaterialDisplay(product, rawSections, category);
        const sections = getPreferredMaterialSections(rawSections, category);
        const candidates = [];

        if (materialDisplay) {
            candidates.push(createCandidate(
                "material",
                "Material",
                materialDisplay.text,
                94,
                Object.assign(
                    {
                        source: "material",
                        section: materialDisplay.section,
                        description: materialDisplay.description,
                        detailText: materialDisplay.detailText
                    },
                    materialDisplay.iconMeta
                )
            ));

            return uniqueCandidates(candidates);
        }

        sections.forEach(function(section) {
            const text = buildMaterialText(section);
            if (!text) return;

            const label = /^hauptmaterial$/i.test(cleanText(section.header))
                ? "Material"
                : cleanText(section.header || "Material");

            candidates.push(createCandidate(
                "material",
                label,
                text,
                90,
                Object.assign(
                    { source: "material", section: cleanText(section.header) },
                    buildIconMeta(
                        section.materialDetailData.map(function(item) {
                            return item && item.image ? item.image.url : "";
                        }),
                        "contain"
                    )
                )
            ));
        });

        return uniqueCandidates(candidates);
    }

    function getQualityCandidates(product) {
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const entries = informationBox.productQuality || [];
        const candidates = [];

        entries.forEach(function(entry) {
            const header = cleanText(entry && entry.header);
            if (!header) return;

            let bestRule = null;
            QUALITY_RULES.forEach(function(rule) {
                if (rule.regex.test(header) && (!bestRule || rule.score > bestRule.score)) {
                    bestRule = rule;
                }
            });

            if (!bestRule) {
                bestRule = {
                    score: 60,
                    label: "Qualität",
                    text: header
                };
            }

            candidates.push(createCandidate(
                "proof",
                bestRule.label,
                bestRule.text || header,
                bestRule.score,
                Object.assign(
                    { source: "quality", header: header },
                    buildIconMeta(entry && entry.image ? entry.image.url || entry.image.imageUrl : entry && entry.imageUrl ? entry.imageUrl : "", "contain")
                )
            ));
        });

        return uniqueCandidates(candidates);
    }

    function getMadeInCandidate(product) {
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const madeIn = informationBox.productMadeIn;
        const content = stripHtml(madeIn && madeIn.content);

        if (!content) return [];

        return [createCandidate(
            "proof",
            "Herkunft",
            content.replace(/^Nachhaltig hergestellt in/i, "Hergestellt in"),
            68,
            Object.assign(
                { source: "made-in" },
                getMadeInIconMeta(product)
            )
        )];
    }

    function getCareDescription(value) {
        if (/maschinenwaschbar|waschbar bei|\d+\s*°\s*c/i.test(value)) {
            return "Pflegeleicht und langlebig - für eine einfache Reinigung im Alltag.";
        }

        return "";
    }

    function getCareDetailText(value) {
        const temperatureMatch = cleanText(value).match(/(\d+)\s*°\s*c/i);
        const temperature = temperatureMatch ? Number(temperatureMatch[1]) : null;

        if (temperature !== null && temperature <= 40) {
            return "Niedrige Temperaturen sparen Energie bei gleicher Reinheit.";
        }

        return "";
    }

    function getCareCandidates(product, category) {
        const informationBox = product && product.informationBox ? product.informationBox : {};
        const care = informationBox.productCareLabel || {};
        const candidates = [];
        const instruction = compactCareText(care.careInstruction);
        const careLabels = care.careLabelData && care.careLabelData.length
            ? care.careLabelData.map(function(item) {
                return compactCareText(item && item.name);
            }).filter(Boolean)
            : [];
        const careScore = CARE_PRIORITY_CATEGORIES.indexOf(category) !== -1 ? 82 : 66;

        careLabels.forEach(function(label, index) {
            if (!isMachineWashBenefitText(label)) return;

            let score = careScore - index;

            if (/maschinenwaschbar/i.test(label)) score += 22;
            if (/nicht trocknergeeignet/i.test(label)) score += 10;

            candidates.push(createCandidate(
                "care",
                "Pflege",
                label,
                score,
                Object.assign(
                    {
                        source: "care-label",
                        index: index,
                        description: getCareDescription(label),
                        detailText: getCareDetailText(label)
                    },
                    buildIconMeta(care.careLabelData[index] && care.careLabelData[index].imageUrl ? care.careLabelData[index].imageUrl : "", "contain")
                )
            ));
        });

        if (instruction && isMachineWashBenefitText(instruction)) {
            candidates.push(createCandidate(
                "care",
                "Pflege",
                instruction,
                careScore - 8,
                {
                    source: "care-instruction",
                    description: getCareDescription(instruction),
                    detailText: getCareDetailText(instruction)
                }
            ));
        }

        return uniqueCandidates(candidates);
    }

    function uniqueCandidates(candidates) {
        const seen = {};

        return candidates.filter(function(candidate) {
            if (!candidate || !candidate.text) return false;

            const key = candidate.label + "::" + normalizeForCompare(candidate.text);
            if (seen[key]) return false;
            seen[key] = true;
            return true;
        });
    }

    function looksDuplicate(candidate, usedTexts) {
        const normalizedCandidate = normalizeForCompare(candidate.text);
        if (!normalizedCandidate) return true;

        return usedTexts.some(function(text) {
            if (!text) return false;
            if (text === normalizedCandidate) return true;
            if (normalizedCandidate.length > 18 && text.indexOf(normalizedCandidate) !== -1) return true;
            if (text.length > 18 && normalizedCandidate.indexOf(text) !== -1) return true;

            return false;
        });
    }

    function pickBestCandidate(candidates, usedTexts, minScore) {
        const threshold = typeof minScore === "number" ? minScore : 0;

        return candidates
            .slice()
            .sort(function(a, b) {
                if (b.score === a.score) {
                    return a.text.length - b.text.length;
                }
                return b.score - a.score;
            })
            .find(function(candidate) {
                return candidate.score >= threshold && !looksDuplicate(candidate, usedTexts);
            }) || null;
    }

    function isConcreteQualityProof(candidate) {
        if (!candidate) return false;

        if (candidate.label === "Zertifikat") return true;
        if (candidate.label === "Qualität" && /chromfrei/i.test(candidate.text)) return true;

        return false;
    }

    function pickProofCandidate(category, primaryCandidates, qualityCandidates, careCandidates, madeInCandidates, usedTexts) {
        const bestQuality = pickBestCandidate(qualityCandidates, usedTexts, 0);
        const bestCare = pickBestCandidate(
            uniqueCandidates(primaryCandidates.filter(function(candidate) {
                return candidate.label === "Pflege";
            }).concat(careCandidates).filter(isSelectableBenefitCandidate)),
            usedTexts,
            0
        );
        const bestMadeIn = pickBestCandidate(madeInCandidates, usedTexts, 0);

        if (CARE_PRIORITY_CATEGORIES.indexOf(category) !== -1) {
            if (isConcreteQualityProof(bestQuality)) {
                return bestQuality || bestCare || bestMadeIn;
            }

            return bestCare || bestQuality || bestMadeIn;
        }

        return bestQuality || bestCare || bestMadeIn;
    }

    function pickCandidateByLabel(candidates, label, usedTexts, minScore) {
        return pickBestCandidate(
            candidates.filter(function(candidate) {
                return candidate.label === label;
            }),
            usedTexts,
            minScore
        );
    }

    function buildFacts(product) {
        const category = inferCategory(product);
        const visibleTexts = getVisibleContext();
        const selectedFacts = [];
        const fitCandidates = getFitCandidates(product);
        const primaryCandidates = getPrimaryCandidates(product, category);
        const materialCandidates = getMaterialCandidates(product, category);
        const careCandidates = getCareCandidates(product, category);

        function addFact(candidate) {
            if (!candidate) return;

            const candidateWithIcon = withResolvedCandidateIcon(candidate, product);

            selectedFacts.push(candidateWithIcon);
            visibleTexts.push(normalizeForCompare(candidateWithIcon.text));
        }

        addFact(pickBestCandidate(
            fitCandidates.concat(primaryCandidates.filter(function(candidate) {
                return candidate.label === "Passform";
            })),
            visibleTexts,
            70
        ));
        addFact(pickBestCandidate(materialCandidates, visibleTexts, 0));
        addFact(pickBestCandidate(careCandidates, visibleTexts, 0));

        return selectedFacts.slice(0, 3);
    }

    function findBuyBoxMediaNode(buyBox) {
        if (!buyBox || !buyBox.children) return null;

        return Array.prototype.slice.call(buyBox.children).find(function(child) {
            return child && typeof child.className === "string" && child.className.indexOf("BuyBox_buyBox__media") !== -1;
        }) || null;
    }

    function findDesktopInsertTarget() {
        if (!isDesktopViewport()) return null;

        const buyBox = KEK.qs(SELECTORS.buyBox);
        const mediaNode = findBuyBoxMediaNode(buyBox);
        const galleryNode = mediaNode ? KEK.qs('[data-testid="product-gallery"]', mediaNode) : null;

        if (galleryNode) {
            return {
                node: galleryNode,
                position: "afterend",
                placement: "media"
            };
        }

        return mediaNode
            ? {
                node: mediaNode,
                position: "afterend",
                placement: "media"
            }
            : null;
    }

    function findInsertTarget() {
        const desktopTarget = findDesktopInsertTarget();
        if (desktopTarget) return desktopTarget;

        const buyBoxContent = KEK.qs(SELECTORS.buyBoxContent);
        if (!buyBoxContent) return null;

        const descriptionBullets = KEK.qs(SELECTORS.descriptionBullets, buyBoxContent);
        if (descriptionBullets) {
            return {
                node: descriptionBullets,
                position: "beforebegin",
                placement: "content"
            };
        }

        const benefitList = KEK.qs(SELECTORS.benefitList, buyBoxContent);
        if (benefitList) {
            return {
                node: benefitList,
                position: "beforebegin",
                placement: "content"
            };
        }

        const paymentOptions = KEK.qs(SELECTORS.paymentOptions, buyBoxContent);
        if (paymentOptions) {
            return {
                node: paymentOptions,
                position: "beforebegin",
                placement: "content"
            };
        }

        const addToCartRow = KEK.qs(SELECTORS.addToCartRow, buyBoxContent);
        if (addToCartRow) {
            return {
                node: addToCartRow,
                position: "afterend",
                placement: "content"
            };
        }

        const properties = KEK.qs(SELECTORS.productProperties, buyBoxContent);
        if (properties) {
            return {
                node: properties,
                position: "afterend",
                placement: "content"
            };
        }

        return null;
    }

    function escapeHtml(value) {
        return (value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function getFactDescription(fact) {
        return cleanText(fact && fact.meta && fact.meta.description);
    }

    function getFactDetailText(fact) {
        return cleanText(fact && fact.meta && fact.meta.detailText);
    }

    function getFactTrackingText(fact) {
        const description = getFactDescription(fact);
        const detailText = getFactDetailText(fact);
        const parts = [cleanText(fact && fact.text), description, detailText].filter(Boolean);

        return parts.join(" | ");
    }

    function buildFactIconHtml(fact) {
        const iconUrls = getCandidateIconUrls(fact);
        const iconFit = fact && fact.meta && fact.meta.iconFit === "cover" ? " cover" : "";

        if (!iconUrls.length) return "";

        return '' +
            '<span class="' + MODULE_CLASS + '__icon' + (iconUrls.length > 1 ? ' ' + MODULE_CLASS + '__icon--stack' : '') + '" aria-hidden="true">' +
                iconUrls.map(function(url, index) {
                    return '<img class="' + MODULE_CLASS + '__icon-image' + iconFit + (index > 0 ? ' ' + MODULE_CLASS + '__icon-image--secondary' : '') + '" src="' + escapeHtml(url) + '" alt="" decoding="async">';
                }).join("") +
            '</span>';
    }

    function getInsertPlacement(insertTarget) {
        return insertTarget && insertTarget.placement ? insertTarget.placement : "content";
    }

    function renderModule(facts, product, signature) {
        const insertTarget = findInsertTarget();
        const existingModule = KEK.qs("." + MODULE_CLASS);

        if (!insertTarget || !facts.length) return false;

        const itemsHtml = facts.map(function(fact) {
            const description = getFactDescription(fact);
            const detailText = getFactDetailText(fact);

            return '' +
                '<li class="' + MODULE_CLASS + '__item">' +
                    buildFactIconHtml(fact) +
                    '<span class="' + MODULE_CLASS + '__content">' +
                        '<span class="' + MODULE_CLASS + '__heading">' +
                            '<span class="' + MODULE_CLASS + '__label">' + escapeHtml(fact.label) + '</span>' +
                            '<span class="' + MODULE_CLASS + '__text">' + escapeHtml(fact.text) + '</span>' +
                        '</span>' +
                        (description ? '<span class="' + MODULE_CLASS + '__description">' + escapeHtml(description) + '</span>' : '') +
                        (detailText ? '<span class="' + MODULE_CLASS + '__detail">' + escapeHtml(detailText) + '</span>' : '') +
                    '</span>' +
                '</li>';
        }).join("");

        if (existingModule) {
            existingModule.setAttribute("data-product-key", signature);
            existingModule.setAttribute("data-product-code", String(product.productCode || ""));
            existingModule.setAttribute("data-placement", getInsertPlacement(insertTarget));
            existingModule.setAttribute("aria-label", "Wichtige Produktinfos");
            existingModule.innerHTML = '<ul class="' + MODULE_CLASS + '__list" aria-label="Wichtige Produktinfos">' + itemsHtml + '</ul>';

            return placeModuleAtTarget(existingModule, insertTarget);
        }

        const moduleHtml = '' +
            '<section class="' + MODULE_CLASS + '" ' +
                'data-product-key="' + escapeHtml(signature) + '" ' +
                'data-product-code="' + escapeHtml(String(product.productCode || "")) + '" ' +
                'data-placement="' + escapeHtml(getInsertPlacement(insertTarget)) + '" ' +
                'aria-label="Wichtige Produktinfos">' +
                '<ul class="' + MODULE_CLASS + '__list" aria-label="Wichtige Produktinfos">' + itemsHtml + '</ul>' +
            '</section>';

        KEK.insert(insertTarget.node, insertTarget.position, moduleHtml);

        return true;
    }

    function trackRender(product, facts, signature) {
        if (!facts.length || trackedPayloads[signature]) return;

        trackedPayloads[signature] = true;
        win.dataLayer = win.dataLayer || [];
        win.dataLayer.push({
            event: "kk_product_info_module_rendered",
            event_name: "kk_product_info_module_rendered",
            experiment_name: EXPERIMENT_NAME,
            product_code: product.productCode || "",
            product_name: product.name || "",
            product_info_facts: facts.map(function(fact) {
                return fact.label + ": " + getFactTrackingText(fact);
            })
        });
    }

    function buildSignature(product, facts) {
        return [
            win.location.pathname,
            product && (product.productCode || product.styleCode || product.name || ""),
            facts.map(function(fact) {
                return fact.label + ":" + getFactTrackingText(fact);
            }).join("|")
        ].join("::");
    }

    function markRouteChange() {
        lastKnownHref = win.location.href;
        lastBuyBoxFingerprint = "";
        lastSignature = "";
        resetApplyRetry();
        if (buyBoxObserver) {
            buyBoxObserver.disconnect();
            buyBoxObserver = null;
        }
        observedBuyBox = null;
        removeModule();
    }

    function syncRouteState() {
        if (lastKnownHref === win.location.href) return false;

        markRouteChange();
        return true;
    }

    function ensureRoutePoller() {
        if (routePoller) return;

        routePoller = win.setInterval(function() {
            if (syncRouteState()) {
                scheduleApply(90);
            }
        }, 400);
    }

    function applyVariation() {
        syncRouteState();

        const existingModule = KEK.qs("." + MODULE_CLASS);

        if (!isProductPage()) {
            removeModule();
            lastSignature = "";
            resetApplyRetry();
            return;
        }

        syncBuyBoxState();
        ensureBuyBoxObserver();

        const product = parseProductData();
        if (!product) {
            if (!existingModule) {
                removeModule();
            }
            lastSignature = "";
            scheduleRetryApply();
            return;
        }

        const facts = buildFacts(product);
        const signature = buildSignature(product, facts);

        if (!facts.length) {
            removeModule();
            lastSignature = "";
            resetApplyRetry();
            return;
        }

        if (existingModule && existingModule.getAttribute("data-product-key") === signature) {
            const insertTarget = findInsertTarget();

            if (insertTarget) {
                existingModule.setAttribute("data-placement", getInsertPlacement(insertTarget));
                placeModuleAtTarget(existingModule, insertTarget);
            }

            lastSignature = signature;
            resetApplyRetry();
            return;
        }

        if (renderModule(facts, product, signature)) {
            lastSignature = signature;
            resetApplyRetry();
            trackRender(product, facts, signature);
            return;
        }

        scheduleRetryApply();
    }

    function initRouteObserver() {
        KEK.elem("body", function(bodies) {
            if (!bodies || routeObserver) return;

            routeObserver = new MutationObserver(function(mutations) {
                const shouldRecheck = mutations.some(function(mutation) {
                    return mutation.type === "childList" &&
                        (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0);
                });

                if (shouldRecheck) scheduleApply();
            });

            routeObserver.observe(bodies[0], {
                childList: true,
                subtree: true
            });
        });
    }

    function patchHistoryApi() {
        if (historyPatched) return;

        ["pushState", "replaceState"].forEach(function(methodName) {
            const original = win.history[methodName];

            if (typeof original !== "function") return;

            win.history[methodName] = function() {
                const previousHref = win.location.href;
                const result = original.apply(this, arguments);

                if (previousHref !== win.location.href) {
                    markRouteChange();
                    scheduleApply(80);
                }

                return result;
            };
        });

        win.addEventListener("popstate", function() {
            if (lastKnownHref !== win.location.href) {
                markRouteChange();
                scheduleApply(80);
            }
        });
        win.addEventListener("resize", scheduleApply);
        historyPatched = true;
    }

    function init() {
        patchHistoryApi();
        initRouteObserver();
        ensureRoutePoller();
        applyVariation();
    }

    init();

})(new window.KEK(), window, document);

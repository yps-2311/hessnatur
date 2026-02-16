/**
 * Test: 04-Sprint-12-Portofrei
 * Variation: 01 (Test)
 * Author: Manuel Brückmann
 * Description: Portofrei Header-Banner + PLP-Teaser mit Copy-Funktion und Tracking
 */

// CodeKit: @codekit-prepend "../global/global.js";

// Anti-Flicker: inject CSS via JS (Kameleoon loads JS before CSS)
if (!document.getElementById('v1-anti-flicker')) {
    const s = document.createElement('style');
    s.id = 'v1-anti-flicker';
    s.textContent = '[data-testid="actionbar"]:not(.v1-portofrei-banner){visibility:hidden!important}[data-testid="product-grid-action-banner-teaser"]:not(.v1-portofrei-teaser){visibility:hidden!important}';
    document.head.appendChild(s);
}

(function (KEK) {
    "use strict";

    const CODE = "PORTO26";
    const HEADER_TEXT = "Portofrei bestellen";
    const LINK_URL = "/de/c/neu-damen-bekleidung";
    const LINK_TEXT = "Neuheiten entdecken";
    const DISCLAIMER = "*Gilt für die nächste Bestellung/Einkauf ab einem Warenwert nach Retoure von 29,- € und nur mit dem Aktionscode \"PORTO26\". Gilt nur für die Lieferung innerhalb Deutschlands. Nicht kombinierbar mit anderen Aktionen. Keine Auszahlung möglich. Gültig bis 15.03.2026";
    const BG_COLOR = "#ECF2D9";
    const TEXT_COLOR = "#24282B";

    console.log('[KEK] Script initialized. Code:', CODE);

    function initHeader(actionbar) {
        if (!actionbar || actionbar.classList.contains('v1-portofrei-banner')) return;

        console.log('[KEK] Initializing Header Bar');
        actionbar.classList.add('v1-portofrei-banner');
        actionbar.style.backgroundColor = BG_COLOR;
        actionbar.style.color = TEXT_COLOR;

        // Replace ENTIRE actionbar innerHTML (flat structure for CSS flex reordering on mobile)
        actionbar.innerHTML = 
            '<span class="Actionbar_actionbar__text__tWGLT v1-header-text">' + HEADER_TEXT + '</span>' +
            '<div class="Actionbar_actionbar__promocode_container__fm3AR v1-header-copy-wrap">' +
                '<button class="Actionbar_actionbar__promocode__zMR9E Actionbar_actionbar-button__gm_b1 Actionbar_actionbar-button--border__nvWzI" id="v1-header-copy">' +
                    '<svg viewBox="0 0 1792 1896.0833" xmlns="http://www.w3.org/2000/svg" width="16"><path fill="' + TEXT_COLOR + '" d="M1696 384q40 0 68 28t28 68v1216q0 40-28 68t-68 28H736q-40 0-68-28t-28-68v-288H96q-40 0-68-28t-28-68V640q0-40 20-88t48-76L476 68q28-28 76-48t88-20h416q40 0 68 28t28 68v328q68-40 128-40h416zm-544 213L853 896h299V597zM512 213L213 512h299V213zm196 647l316-316V128H640v416q0 40-28 68t-68 28H128v640h512v-256q0-40 20-88t48-76zm956 804V512h-384v416q0 40-28 68t-68 28H768v640h896z"></path></svg>' +
                    '<span class="Actionbar_actionbar-button__label__Nw8oa" translate="no">' + CODE + '</span>' +
                '</button>' +
            '</div>' +
            '<div class="Actionbar_actionbar__link__wrapper__uvxXl v1-header-link-wrap">' +
                '<a class="Actionbar_actionbar__link__Itd2h" href="' + LINK_URL + '" style="text-decoration-color: ' + TEXT_COLOR + ';">' + LINK_TEXT + '</a>' +
            '</div>' +
            '<button class="Actionbar_actionbar-button__gm_b1 Actionbar_actionbar-show-flyout-button__TzY4X" id="v1-flyout-toggle">' +
                '<span class="sr-only">Mehr anzeigen</span>' +
                '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-down" class="svg-inline--fa fa-chevron-down fa-fw v1-chevron" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height="14" width="14" style="width: 14px; height: 14px;"><path fill="currentColor" d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"></path></svg>' +
            '</button>';
        
        // Create flyout wrapper outside actionbar
        const container = actionbar.closest('[data-testid="actionbar-container"]') || actionbar.parentElement;
        let flyoutWrapper = container.querySelector('.v1-flyout-wrapper');
        
        if (!flyoutWrapper) {
            flyoutWrapper = document.createElement('div');
            flyoutWrapper.className = 'Actionbar_actionbar-flyout-wrapper__qbxl9 v1-flyout-wrapper';
            flyoutWrapper.innerHTML = 
                '<div class="Actionbar_actionbar-flyout__He_fy" style="background-color: ' + BG_COLOR + '; color: ' + TEXT_COLOR + ';">' +
                    '<span>' + DISCLAIMER + '</span>' +
                '</div>';
            container.appendChild(flyoutWrapper);
        }

        // Copy button handler
        const headerBtn = actionbar.querySelector('#v1-header-copy');
        if (headerBtn) {
            headerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                KEK.copyToClipboard(CODE);
                KEK.trackEvent('header');
                KEK.showToast('Code wurde in deine Zwischenablage kopiert.');
            });
        }
        
        // Link handler
        const headerLink = actionbar.querySelector('.Actionbar_actionbar__link__Itd2h');
        if (headerLink) {
            headerLink.addEventListener('click', (e) => {
                e.preventDefault();
                
                const targetUrl = headerLink.href;
                
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "header_click_cta"
                });
                
                setTimeout(() => {
                    window.location.href = targetUrl;
                }, 100);
            });
        }
        
        // Flyout toggle handler
        const toggleBtn = actionbar.querySelector('#v1-flyout-toggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const isOpen = flyoutWrapper.classList.toggle('Actionbar_actionbar-flyout-wrapper--show__OZhnc');
                const chevron = toggleBtn.querySelector('.v1-chevron');
                const srText = toggleBtn.querySelector('.sr-only');
                
                if (isOpen) {
                    chevron.style.transform = 'rotate(180deg)';
                    srText.textContent = 'Weniger anzeigen';
                } else {
                    chevron.style.transform = 'rotate(0deg)';
                    srText.textContent = 'Mehr anzeigen';
                }
            });
        }
        
        // Remove any existing flyouts from original markup
        const existingFlyouts = container.querySelectorAll('[class*="flyout-wrapper"]:not(.v1-flyout-wrapper)');
        existingFlyouts.forEach((f) => f.remove());
    }

    function initTeaser() {
        // Already initialized?
        if (KEK.qs('.v1-portofrei-teaser')) return;

        // Find existing action banner (React-managed) and replace its content
        const existingBanner = KEK.qs('[data-testid="product-grid-action-banner-teaser"]');
        if (!existingBanner) return;

        console.log('[KEK] Initializing PLP Teaser (replacing existing banner)');
        
        // Mark as initialized
        existingBanner.classList.add('v1-portofrei-teaser');
        
        // Replace inner content (keep the outer container intact for React)
        existingBanner.innerHTML =
            '<div class="v1-teaser-inner" style="background-color: ' + BG_COLOR + '; width: 100%; display: flex; flex-direction: column; justify-content: space-between; padding: 24px; min-height: 100%; box-sizing: border-box;">' +
                '<div class="v1-teaser-headline" style="color: ' + TEXT_COLOR + ';">Portofrei<br>bestellen</div>' +
                '<div class="v1-teaser-bottom">' +
                    '<div class="v1-teaser-subline" style="color: ' + TEXT_COLOR + '; margin-bottom: 8px;">mit dem Code*</div>' +
                    '<button class="Actionbar_actionbar__promocode__zMR9E Actionbar_actionbar-button__gm_b1 Actionbar_actionbar-button--border__nvWzI v1-teaser-btn" id="v1-teaser-copy">' +
                        '<svg viewBox="0 0 1792 1896.0833" xmlns="http://www.w3.org/2000/svg" width="16"><path fill="' + TEXT_COLOR + '" d="M1696 384q40 0 68 28t28 68v1216q0 40-28 68t-68 28H736q-40 0-68-28t-28-68v-288H96q-40 0-68-28t-28-68V640q0-40 20-88t48-76L476 68q28-28 76-48t88-20h416q40 0 68 28t28 68v328q68-40 128-40h416zm-544 213L853 896h299V597zM512 213L213 512h299V213zm196 647l316-316V128H640v416q0 40-28 68t-68 28H128v640h512v-256q0-40 20-88t48-76zm956 804V512h-384v416q0 40-28 68t-68 28H768v640h896z"></path></svg>' +
                        '<span class="Actionbar_actionbar-button__label__Nw8oa" translate="no">' + CODE + '</span>' +
                    '</button>' +
                '</div>' +
            '</div>';

        const teaserBtn = existingBanner.querySelector('#v1-teaser-copy');
        if (teaserBtn) {
            teaserBtn.addEventListener('click', () => {
                KEK.copyToClipboard(CODE);
                KEK.trackEvent('plp-kachel');
                KEK.showToast('Code wurde in deine Zwischenablage kopiert.');
            });
        }
        
        return true; // Signal successful initialization
    }

    // Run with waitForElement
    KEK.waitForElement('[data-testid="actionbar"]', initHeader);

    // Run teaser init with polling until successful (longer interval to reduce React conflicts)
    let teaserInitialized = false;
    let attemptCount = 0;
    const maxAttempts = 50; // 5 seconds total
    
    const teaserInterval = setInterval(() => {
        attemptCount++;
        
        // Stop if already initialized or max attempts reached
        if (teaserInitialized || KEK.qs('.v1-portofrei-teaser') || attemptCount >= maxAttempts) {
            clearInterval(teaserInterval);
            if (attemptCount >= maxAttempts && !KEK.qs('.v1-portofrei-teaser')) {
                console.warn('[KEK] Teaser initialization timeout after', maxAttempts, 'attempts');
            }
            return;
        }
        
        // Try to initialize
        const result = initTeaser();
        if (result === true) {
            teaserInitialized = true;
            clearInterval(teaserInterval);
        }
    }, 100);

    // Re-run on navigation (for SPA)
    let lastUrl = location.href;
    const observer = new MutationObserver(function () {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('[KEK] URL change detected:', lastUrl);
            setTimeout(() => {
                KEK.waitForElement('[data-testid="actionbar"]', initHeader);
                initTeaser();
            }, 800);
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

})(window.KEK);

/**
 * NextJS-kompatibles Injection Script
 * Überwacht DOM-Änderungen und fügt Content ein, wenn er vollständig geladen ist
 */

(function() {
    'use strict';
    
    // Flag um mehrfaches Ausführen zu verhindern
    let contentInjected = false;
    
    // Ziel-Selektor
    const targetSelector = '.cart_cart-page__wrapper__cart-entries-list__mCay5';
    
    /**
     * Funktion die den eigentlichen Content einfügt
     */
    function injectContent() {
        if (contentInjected) {
            console.log('[Injection] Content bereits eingefügt, überspringe...');
            return;
        }
        
        const targetElement = document.querySelector(targetSelector);
        
        if (!targetElement) {
            console.log('[Injection] Ziel-Element noch nicht gefunden');
            return;
        }
        
        // Prüfen ob das Element wirklich vollständig geladen ist
        // (z.B. mindestens ein Kind-Element vorhanden)
        if (targetElement.children.length === 0) {
            console.log('[Injection] Element gefunden, aber noch leer');
            return;
        }
        
        console.log('[Injection] Element vollständig geladen, füge Content ein...');
        
        // HIER DEINEN CODE EINFÜGEN
        // Beispiel: Ein neues Element einfügen
        const newElement = document.createElement('div');
        newElement.className = 'custom-savings-box';
        newElement.innerHTML = `
            <div style="background: #f0f0f0; padding: 15px; margin: 10px 0; border-radius: 5px;">
                <h3>Deine Ersparnisse</h3>
                <p>Hier kommt dein Content hin...</p>
            </div>
        `;
        
        // Am Anfang einfügen
        targetElement.insertBefore(newElement, targetElement.firstChild);
        
        // Oder am Ende einfügen:
        // targetElement.appendChild(newElement);
        
        // Flag setzen
        contentInjected = true;
        console.log('[Injection] Content erfolgreich eingefügt!');
        
        // Optional: Observer stoppen wenn Content eingefügt wurde
        if (window.cartObserver) {
            window.cartObserver.disconnect();
            console.log('[Injection] Observer gestoppt');
        }
    }
    
    /**
     * Prüft ob das Element bereit ist und führt die Injection aus
     */
    function checkAndInject() {
        const targetElement = document.querySelector(targetSelector);
        
        if (targetElement && targetElement.children.length > 0 && !contentInjected) {
            // Kleine Verzögerung um sicherzustellen dass NextJS fertig ist
            setTimeout(injectContent, 100);
        }
    }
    
    /**
     * MutationObserver einrichten
     */
    function setupObserver() {
        // Observer für DOM-Änderungen
        const observer = new MutationObserver(function(mutations) {
            // Bei jeder Änderung prüfen
            checkAndInject();
        });
        
        // Observer starten - überwacht das gesamte Dokument
        observer.observe(document.body, {
            childList: true,     // Überwacht hinzugefügte/entfernte Elemente
            subtree: true,       // Überwacht auch alle Kindelemente
            attributes: false    // Wir brauchen keine Attribut-Änderungen
        });
        
        // Observer global speichern falls wir ihn später stoppen wollen
        window.cartObserver = observer;
        
        console.log('[Injection] Observer gestartet');
    }
    
    /**
     * Initialisierung
     */
    function init() {
        console.log('[Injection] Script initialisiert');
        
        // Sofort prüfen ob Element schon da ist
        checkAndInject();
        
        // Observer einrichten für spätere Änderungen
        setupObserver();
        
        // Zusätzlicher Check nach DOM-Ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', checkAndInject);
        }
        
        // Zusätzlicher Check nach vollständigem Laden
        window.addEventListener('load', checkAndInject);
        
        // Fallback: Regelmäßig prüfen in den ersten 10 Sekunden
        let attempts = 0;
        const maxAttempts = 20; // 20 x 500ms = 10 Sekunden
        
        const intervalCheck = setInterval(function() {
            attempts++;
            checkAndInject();
            
            if (contentInjected || attempts >= maxAttempts) {
                clearInterval(intervalCheck);
                console.log('[Injection] Interval-Check beendet');
            }
        }, 500);
    }
    
    // Script starten
    init();
    
})();

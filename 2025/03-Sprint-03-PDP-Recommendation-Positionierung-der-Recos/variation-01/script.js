// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";

/**
 * @function
 * @author Andreas Hartung
 * @namespace Variante1
 * @name Variation 01 (SP03)
 * @description Reco "Nachhaltige Produkte" nach oben verschieben
 */


(function (KEK) {
  "use strict";
  // console.log("hessantur SP03 Variante1 Update: 3 – DEBUG MODE (H2 polling)");

  // Statt auf Wrapper → direkt auf H2s pollen
  KEK.elem('[data-testid="recommendation-wrapper"] h2', (headlines) => {

    // console.log("📦 Callback erreicht – H2s gefunden:", headlines);

    if (!headlines || headlines.length === 0) {
      // console.log("❌ Keine H2s gefunden – Polling hat gegriffen, aber kein Ergebnis?");
      return;
    }

    let targetReco = null;

    // Jetzt alle Headlines durchgehen
    headlines.forEach((h2, index) => {
      // console.log(`🔍 Prüfe H2 Nr.${index}:`, h2);

      const text = h2.textContent.trim();
      // console.log("   ➤ Headline-Text:", text);

      if (text.includes("Produkte")) {
        // console.log("   🎯 MATCH – diese Reco wollen wir!");
        // Der Wrapper ist das div[data-testid="recommendation-wrapper"]
        const wrapper = h2.closest('[data-testid="recommendation-wrapper"]');
        if (wrapper) {
          targetReco = wrapper;
          // console.log("   ➤ Zuordnung – Wrapper:", wrapper);
        }
      }
    });

    // Keine passende Reco gefunden?
    if (!targetReco) {
      // console.log("❌ Keine passende Reco mit 'Nachhaltige Produkte' gefunden!");
      return;
    }

    // Schon verschoben?
    if (targetReco.classList.contains("kk_sp03")) {
      // console.log("⏩ Reco wurde bereits verschoben (kk_sp03 vorhanden)");
      return;
    }

    targetReco.classList.add("kk_sp03");
    // console.log("🔐 kk_sp03 Klasse gesetzt.");

    // Jetzt auf das Storytelling warten
    KEK.elem('[data-testid="story-telling"]', (storyEl) => {

      // console.log("📦 Storytelling Callback erreicht:", storyEl);

      if (!storyEl || !storyEl[0]) {
        // console.log("❌ Storytelling nicht gefunden!");
        return;
      }

      const storytelling = storyEl[0];
      // console.log("➡️ STORYTELLING ELEMENT:", storytelling);

      // Einfügen
      try {
        KEK.insert(storytelling, "beforebegin", targetReco);
        // console.log("🎉 Reco erfolgreich verschoben!");
      } catch (err) {
        // console.log("💥 ERROR beim Verschieben:", err);
      }

    });

  });

})(new window.KEK());
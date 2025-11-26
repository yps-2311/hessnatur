// @codekit-prepend "../global/global.js";
// @prepros-prepend "../global/global.js";
/**
 * @function
 * @author Andreas Hartung
 * @namespace Variante1
 * @name Variation 01
 * @description
 */
(function (KEK) {
  "use strict";
  //console.log("hessantur SP07 Variante1 Update: 5");

  KEK.elem('[data-testid="add-to-cart"]', (wrapper) => {

    if (!wrapper || !wrapper[0]) return;
    wrapper = wrapper[0];

    if (wrapper.classList.contains("kk_sp07_a2c")) {
      return;
    }

    wrapper.classList.add("kk_sp07_a2c");

    wrapper.addEventListener("click", (e) => {

      // Den tatsächlichen Button finden (egal wie verschachtelt)
      const realBtn = e.target.closest('[data-testid="add-to-cart-button"]');

      if (!realBtn) {
        return;
      }

      // Jetzt prüfen ob der Button disabled ist
      const isDisabled =
        realBtn.matches('[class*="Button_button--disabled"]') ||
        realBtn.getAttribute("aria-disabled") === "true";

      if (!isDisabled) {
        return;
      }


      // Jetzt React-Select öffnen
      const input = KEK.qs("input#ProductSizeSelector");
      if (!input) {
        return;
      }

      // Tastatur verhindern via readonly
      input.setAttribute("readonly", "readonly");

      input.focus();
      input.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "ArrowDown",
          code: "ArrowDown",
          keyCode: 40,
          bubbles: true,
          cancelable: true
        })
      );

      setTimeout(() => {
        input.removeAttribute("readonly");
      }, 100);


    });
  });

})(new window.KEK());


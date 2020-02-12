// load core and global js
// @codekit-prepend "../global/global.js";

/**
 * @function
 * @author Max Mustermann
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";

    console.log("KK: 2020 - Hessnatur - Sprint 09");


    /**
     * CONSTANTEN
     */
    var PATH = window.location.pathname,
        STORAGE = "KK09Skip";


    /**
     * HELPERS
     */
    function setStorage(value) {

        window.sessionStorage.setItem(STORAGE, value);
    }

    function getStorage() {

        return window.sessionStorage.getItem(STORAGE) === "true";
    }

    function checkPATH(value) {

        return PATH.indexOf("/de/checkout/multi/" + value) !== -1;
    }

    function addClass(value, elem) {

        (elem || document.documentElement).classList.add("kk-" + value);
    }

    function removeClass(value, elem) {

        (elem || document.documentElement).classList.remove("kk-" + value);
    }


    /**
     * ROUTING
     */
    // PAGE: LOGIN
    if (PATH === "/de/login/checkout") {

        console.log("PAGE: LOGIN");

        // add css prefix
        addClass("login");

        WATO.elem('#guestRegisterForm .h-offset-bottom-inner', function (newCustomerBullets) {
            if (newCustomerBullets) {
                newCustomerBullets[0].innerHTML =
                    '<li>Bestellübersicht inkl. Sendungsverfolgung</li>' +
                    '<li>Exklusive Aktionen & Angebote</li>' +
                    '<li>Verwaltung der persönlichen Daten</li>';
            }
        });

        WATO.elem('#account_guest .h3', function (guestHeadline) {
            if (guestHeadline) {
                guestHeadline[0].innerHTML = 'Ich möchte als Gast bestellen & verzichte auf die Vorteile eines Kundenkontos';
            }
        });

        WATO.elem('#loginForm', function (loginForm) {
            if (loginForm) {
                loginForm = loginForm[0];
                WATO.qs('.h3', loginForm).innerHTML = 'Ich bin bereits Kunde & möchte mich anmelden';
                loginForm.insertAdjacentHTML('beforeend',
                    '<div class="columns align-self-bottom small-12">' +
                    '<div class="button expanded-small-only" id="kk07_login_toggle">Zum Kundenlogin</div>' +
                    '</div>');
                WATO.qs('#kk07_login_toggle', loginForm).addEventListener('click', function () {
                    addClass('show', loginForm);
                });
            }
        });

        // PAGE: IHRE DATEN (GAST)
    } else if (checkPATH("register/guest-update")) {

        console.log("PAGE: IHRE DATEN - GAST");

        // add css prefix
        addClass("guest");

        // skip next page
        setStorage(true);


        // PAGE: IHRE DATEN (NEUKUNDE)
    } else if (checkPATH("register")) {

        console.log("PAGE: IHRE DATEN - NEUKUNDE");

        // add css prefix
        addClass("register");

        // skip next page
        setStorage(true);


        // PAGE: Adressen
    } else if (checkPATH("addresses/add-delivery-address")) {

        console.log("PAGE: Adressen");

        // skip page
        if (getStorage()) {

            console.log("SHOW LOADER");

            setStorage(false);

            WATO.elem("body", function (body) {

                if (body) {

                    // https://loading.io/css/
                    body[0].insertAdjacentHTML('afterbegin',
                        '<div id="kk-loader">' +
                        '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>' +
                        '</div>'
                    );
                }
            });

            WATO.elem('#addressForm .button[type="submit"]', function (CTA) {

                if (CTA) {

                    // send form
                    CTA[0].click();
                }
            });

            // loader fallback
            window.setTimeout(function () {
                WATO.qs('#kk-loader').remove();
            }, 4000);
        }


        // PAGE: Zahlungsart
    } else if (checkPATH("payment/add-payment-method")) {

        console.log("PAGE: Zahlungsart");


        // PAGE: Zusammenfassung
    } else if (checkPATH("summary")) {

        console.log("PAGE: Zusammenfassung");

    }
})(new window.WATO());

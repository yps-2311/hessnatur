// load core and global js
// @codekit-prepend "../global/global.js";
/*jshint loopfunc: true */
/**
 * @function
 * @author Nguyet Dang/Denis Leno
 * @namespace V1
 * @name Variation 01
 * @description
 */
(function (WATO) {
    "use strict";

    // WATO.AB09_goals();

    /**
     * CONSTANTEN
     */
    var PATH = window.location.pathname,
        STORAGE = "KK09Skip";


    /**
     * HELPERS
     */
    function setStorage(key, value) {
        window.sessionStorage.setItem(key, value);
    }

    function getStorage(key) {

        return window.sessionStorage.getItem(key);
    }
    function removeStorage(key) {

        return window.sessionStorage.removeItem(key);
    }

    function addClass(elem, value) {

        elem.classList.add("kk-" + value);
    }

    function removeClass(elem, value) {
        elem.classList.remove("kk-" + value);
    }

    function makeProgressBarSticky(progressBar) {
        document.addEventListener('scroll', function () {
            if (progressBar.getBoundingClientRect().top <= 0) {
                addClass(progressBar, 'sticky');
            } else {
                removeClass(progressBar, 'sticky');
            }
        });
    }

    function adjustProgressBar() {
        var savedPath = getStorage('KK09PATH') || '',
            isGuest = savedPath.indexOf('guest') !== -1;
        if (isGuest) {
            addClass(document.documentElement, 'guest-checkout');
        }

        if (window.location.href.indexOf("/ch/") !== -1) {
            addClass(document.documentElement, 'kk_kk09ch');
        }


        WATO.elem('.progressTracker', function (progressBar) {
            if (progressBar) {
                progressBar = progressBar[0];

                var steps = WATO.qsa('.progressTracker__Item a', progressBar),
                    stepsAmount = steps.length,
                    progressSteps = ['Anmelden', 'Ihre Daten', 'Zahlungsart', 'Bestätigung'];

                // logged in users only have 3 steps
                if (stepsAmount < 4) {

                    steps[0].parentNode.insertAdjacentHTML('beforebegin',
                        '<li class="column row progressTracker__Item item--done">' +
                        '<a href="#" class="column progressTracker__Item__content h-text-decoration-none">' +
                        '<strong>Anmelden</strong>' +
                        '</a>' +
                        '</li>');

                    // skip first progressStep naming
                    // steps only contains 3 items at this point, so only 3 steps have to be renamed
                    progressSteps.shift();

                    if (PATH.indexOf('addresses') !== -1) {
                        steps[0].parentNode.classList.remove('item--done');
                        steps[0].parentNode.classList.add('item--current');
                    }
                } else {
                    steps[0].href = '#';

                    if (savedPath) {
                        steps[0].parentNode.classList.remove('item--current');
                        steps[0].parentNode.classList.add('item--done');
                        if (savedPath === PATH) {
                            steps[1].parentNode.classList.add('item--current');
                        }
                        if (isGuest) {
                            progressSteps[0] = 'Gast';
                            // } else if (!isGuest && PATH.indexOf('addresses') !== -1) {
                            // steps[0].parentNode.classList.remove('item--done');
                            // steps[0].parentNode.classList.add('item--current');
                        }
                    }
                }

                // rename steps
                for (var i = 0; i < stepsAmount; i++) {
                    steps[i].children[0].innerHTML = progressSteps[i];

                }
                makeProgressBarSticky(progressBar);
                if (progressBar.getBoundingClientRect().top <= 0) {
                    addClass(progressBar, 'sticky');
                }
            }
        });
    }

    function changeButtonText(ctaText) {
        WATO.elem('#registerForm .button.success', function (btn) {
            if (btn) {
                btn[0].textContent = 'weiter zur ' + ctaText;
            }
        });
    }


    /**
     * ROUTING
     */
    // PAGE: LOGIN
    if (PATH.indexOf("/login/checkout") !== -1) {
        removeStorage(STORAGE);

        // add css prefix
        addClass(document.documentElement, "login");

        WATO.elem('.js_backstopWrapper', function (wrapper) {
            if (wrapper) {

                // Add progressbar
                wrapper[0].insertAdjacentHTML('afterbegin', '<div class="progressTracker h-offset-bottom-outer">' +
                    '<div class="row">' +
                    '<div class="small-12 columns">' +
                    '<ul class="row collapse h-text-decoration-none-hover">' +
                    '<li class="column row progressTracker__Item item--current">' +
                    '<a href="#" class="column progressTracker__Item__content h-text-decoration-none">' +
                    '<strong>Anmelden</strong>' +
                    '</a>' +
                    '</li>' +
                    '<li class="column row progressTracker__Item ">' +
                    '<a href="#" class="column progressTracker__Item__content h-text-decoration-none">' +
                    '<span>Ihre Daten</span>' +
                    '</a>' +
                    '</li>' +
                    '<li class="column row progressTracker__Item ">' +
                    '<a href="#" class="column progressTracker__Item__content h-text-decoration-none">' +
                    '<span>Zahlungsart</span>' +
                    '</a>' +
                    '</li>' +
                    '<li class="column row progressTracker__Item ">' +
                    '<a href="#" class="column progressTracker__Item__content h-text-decoration-none">' +
                    '<span>Bestätigung</span>' +
                    '</a>' +
                    '</li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>');

                var progressBar = wrapper[0].firstElementChild;
                makeProgressBarSticky(progressBar);
                if (progressBar.getBoundingClientRect().top <= 0) {
                    addClass(progressBar, 'sticky');
                }
            }
        });

        // Add new uvps for registration
        WATO.elem('#guestRegisterForm', function (registerForm) {
            if (registerForm) {
                WATO.qs('.h-offset-bottom-inner', registerForm[0]).innerHTML =
                    '<li>Bestellübersicht inkl. Sendungsverfolgung</li>' +
                    '<li>Verwaltung der persönlichen Daten</li>' +
                    '<li>Exklusive Aktionen & Angebote</li>';

                WATO.qs('.button', registerForm[0]).innerHTML = 'Neues Kundenkonto anlegen';
            }
        });

        // Change headline of guest order
        WATO.elem('#account_guest .h3', function (guestHeadline) {
            if (guestHeadline) {
                guestHeadline[0].innerHTML = 'Ich möchte als Gast bestellen & verzichte auf die Vorteile eines Kundenkontos';
            }
        });

        WATO.elem('#loginForm', function (loginForm) {
            if (loginForm) {
                loginForm = loginForm[0];

                // Change headline
                WATO.qs('.h3', loginForm).innerHTML = 'Ich bin bereits Kunde & möchte mich anmelden';

                WATO.qs('.button', loginForm).addEventListener('click', function () {
                    setStorage(STORAGE, true);
                });

                // Add toggle
                loginForm.insertAdjacentHTML('beforeend',
                    '<div class="columns align-self-bottom small-12">' +
                    '<div class="button expanded-small-only" id="kk09_login_toggle">Zum Kundenlogin</div>' +
                    '</div>');
                WATO.qs('#kk09_login_toggle', loginForm).addEventListener('click', function () {
                    addClass(loginForm, 'show');
                    // WATO.AB09_sendGoal('kk_ab09_click_login_toggle');
                });
            }
        });

        removeStorage('KK09PATH');

        // PAGE: IHRE DATEN (GAST)
    } else if (WATO.AB09_checkPATH("register")) {


        // add css prefix
        addClass(document.documentElement, "data");
        addClass(document.documentElement, WATO.AB09_checkPATH("register/guest-update") ? "guest" : "register");

        setStorage('KK09PATH', PATH);
        adjustProgressBar();

        WATO.elem('#registerForm fieldset', function (newsletterBox) {
            if (newsletterBox) {

                // console.log('getStorage(STORAGE): ', getStorage(STORAGE));

                // Add checkbox -> skip next page or not?
                newsletterBox[0].insertAdjacentHTML('beforebegin',
                    '<label class="small-12 columns" id="kk09_address_option--wrapper">' +
                    '<div class="row">' +
                    '<div class="column small-12">' +
                    // '<strong>Abweichende Lieferadresse</strong>' +
                    '<div class="h-largeOffset-bottom-inner h-smallOffset-bottom-outer">' + // row
                    // '<div class="column shrink">' +
                    // '<input id="kk09_address_option" name="kk09_address_option" type="checkbox" value="true"' + (getStorage(STORAGE) === 'false' ? ' checked="checked"' : '') + '>'+
                    // '</div>' +
                    '<div class="column">' +
                    '<label for="kk09_address_option">' +
                    // '<p>Ich möchte mein Paket an eine <b>andere Adresse</b> schicken lassen. (Diese kann im nächsten Schritt angeben werden.)</p></label>' +
                    '<b>Meine Lieferadresse und Rechnungsadresse sind identisch.</b>' +
                    '</label>' +
                    '<div class="row">' +
                    '<div class="column small-2">' +
                    '<label for="kk09_address_option">' +
                    '<input id="kk09_address_option" name="kk09_address_option" type="radio" value="true"' + ((getStorage(STORAGE) === 'true' || !getStorage(STORAGE)) ? ' checked="checked"' : '') + '>' +
                    'Ja' +
                    '</label>' +
                    '</div>' +
                    '<div class="column small-4">' +
                    '<label for="kk09_address_option_false">' +
                    '<input id="kk09_address_option_false" name="kk09_address_option" type="radio" value=""' + (getStorage(STORAGE) === 'false' ? ' checked="checked"' : '') + '>' +
                    'Nein' +
                    '</label>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</label>'
                );


                if (getStorage(STORAGE) !== 'false' || !getStorage(STORAGE)) {
                    // skip next page
                    setStorage(STORAGE, true);
                }

                // Ja - Meine Lieferadresse und Rechnungsadresse sind identisch.
                WATO.qs('#kk09_address_option', newsletterBox[0].previousElementSibling).addEventListener('click', function () {
                    setStorage(STORAGE, true);
                    // Change button text depending on checkbox value
                    changeButtonText(!this.checked ? 'Adresseingabe' : 'Zahlungsart');
                    // WATO.AB09_sendGoal('kk_ab09_click_delivery_checkbox');
                });

                // Nein - Meine Lieferadresse und Rechnungsadresse sind nicht identisch.
                WATO.qs('#kk09_address_option_false', newsletterBox[0].previousElementSibling).addEventListener('click', function () {
                    setStorage(STORAGE, false);
                    // Change button text depending on checkbox value
                    changeButtonText(this.checked ? 'Adresseingabe' : 'Zahlungsart');
                    // WATO.AB09_sendGoal('kk_ab09_click_delivery_checkbox');
                });

                // Change button text
                changeButtonText(getStorage(STORAGE) === 'false' ? 'Adresseingabe' : 'Zahlungsart');
            }
        });

        // PAGE: Adressen
    } else if (WATO.AB09_checkPATH("addresses/add-delivery-address") || WATO.AB09_checkPATH("register/guest-update")) {

        // console.log("PAGE: Adressen");

        // console.log('getStorage(STORAGE): ', getStorage(STORAGE));

        // add css prefix
        addClass(document.documentElement, "address");
        // skip page
        if (getStorage(STORAGE) === "true") {
            removeStorage(STORAGE);
            addClass(document.documentElement, "address-hide");

            // setStorage(STORAGE, false);

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

            window.setTimeout(function () {

                WATO.elem('#addressForm .button[type="submit"]', function (CTA) {

                    if (CTA) {
                        // send form
                        CTA[0].click();
                    }
                });

                // loader fallback
                window.setTimeout(function () {
                    WATO.qs('#kk-loader').remove();
                    removeClass(document.documentElement, "address-hide");
                    adjustProgressBar();
                }, 4000);
            }, 500);
        } else {

            setStorage(STORAGE, false);
            adjustProgressBar();
        }


        // PAGE: Zahlungsart
    } else if (WATO.AB09_checkPATH("payment/add-payment-method")) {

        adjustProgressBar();
        removeStorage(STORAGE);

        WATO.elem('#paymentDetailsForm ul li label', function (paymentOptions) {
            if (paymentOptions) {

                for (var i = 0; i < paymentOptions.length; i++) {
                    if (i === 1) {
                        // Paypal
                        paymentOptions[1].innerHTML = '<img src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ab07-mobile-checkout/paypal-icon.png">';
                    } else if (i === 2) {
                        // Kreditkarte
                        paymentOptions[2].innerHTML = 'Kreditkarte <img src="https://kk-ffm.s3.eu-central-1.amazonaws.com/hessnatur/2020/ab07-mobile-checkout/visa-icon.png">';
                    }

                    paymentOptions[i].addEventListener('click', function (e) {
                        var input = e.target;
                        setStorage('KK09PAYMENT', input.innerHTML.trim() + '|' + input.previousElementSibling.getAttribute('id'));
                    });

                }

                var defaultPaymentOption = WATO.qs('[name="paymentModeCode"]:checked');
                setStorage('KK09PAYMENT', defaultPaymentOption.nextElementSibling.innerHTML.trim() + '|' + defaultPaymentOption.getAttribute('id'));
            }
        });


        // PAGE: Zusammenfassung
    } else if (WATO.AB09_checkPATH("summary")) {

        // add css prefix
        addClass(document.documentElement, "summary");
        adjustProgressBar();

        WATO.elem('.cart__productname', function (productNames) {
            if (productNames) {

                var savings = 0;

                // each product
                for (var i = 0; i < productNames.length; i++) {
                    var productWrapper = productNames[i].closest('.large-10'),
                        availability = productNames[i].nextElementSibling.nextElementSibling,
                        productImage = WATO.qs('img', productWrapper),
                        prices = WATO.qsa('.price', productWrapper);

                    addClass(productWrapper, 'product-wrapper');

                    // add delete btn
                    productImage.insertAdjacentHTML('afterend', '<button type="button" class="js-entry-remove button textLink" data-entryNumber="' + i + '"><img src="/_ui/responsive/common/images/icons/garbage.svg" title="Entfernen" class="icon-trash"></button>');
                    var deleteButton = productImage.nextElementSibling;
                    // move availability below the image
                    productImage.insertAdjacentElement('afterend', availability);

                    deleteButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        // WATO.AB09_sendGoal('kk_ab09_delete_product');

                        jQuery.ajax({
                            type: "POST",
                            url: "https://www.hessnatur.com" + PATH.substr(0, 3) + "/cart/update", //"https://www.hessnatur.com/de/cart/update",
                            data: {
                                "entryNumber": e.target.closest('.button').getAttribute('data-entryNumber'),
                                "quantity": "0",
                                "CSRFToken": window.ACC.config.CSRFToken
                            },
                            success: function () {
                                window.location.href = window.location.href;
                            }
                        });
                    });

                    // check if there are 2 prices -> product has a discount
                    addClass(prices[0].parentElement, 'price');
                    if (prices.length > 1) {
                        addClass(prices[0].parentElement, 'sale-price');
                        // calculate savings
                        savings += parseFloat(prices[1].textContent.replace(',', '.').replace('€ ', '').replace('*', '')) - parseFloat(prices[0].textContent.replace(',', '.').replace('€ ', '').replace('*', ''));
                    }

                }

                // total prices at the end of the page
                WATO.elem('.totalPrice', function (totalPrices) {
                    if (totalPrices) {

                        addClass(totalPrices[0].closest('.print-page-break-avoid'), 'sums');

                        // 0 -> Zwischensumme
                        // 1 -> Versandkosten
                        var deliveryCostWrapper = totalPrices[1].closest('.row'),
                            deliveryLink = WATO.qs('.textLink', deliveryCostWrapper.nextElementSibling);
                        addClass(deliveryCostWrapper, 'delivery-cost');
                        // Rearrange items
                        deliveryLink.innerHTML = 'Versand';
                        totalPrices[1].insertAdjacentElement('beforeend', deliveryLink);

                        // Add savings tip if there is any
                        if (savings) {
                            totalPrices[1].parentElement.insertAdjacentHTML('afterend', '<div class="row" id="kk09_sum__savings"><div class="column small-12"><span>Sie sparen mit dieser Bestellung <b>&euro;&nbsp;' + savings.toFixed(2).replace('.', ',') + '</b></span></div></div>');
                        }

                        // 2 -> Gesamtsumme
                        addClass(totalPrices[2].closest('.row'), 'total-sum');


                    }
                });
            }
        });



    }
})(new window.WATO());

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
    function setStorage(key, value) {
        console.log('setStorage', key, value);
        window.sessionStorage.setItem(key, value);
    }

    function getStorage(key) {

        return window.sessionStorage.getItem(key);
    }
    function removeStorage(key) {

        return window.sessionStorage.removeItem(key);
    }

    function checkPATH(value) {

        return PATH.indexOf("/de/checkout/multi/" + value) !== -1;
    }

    function addClass(elem, value) {

        elem.classList.add("kk-" + value);
    }

    function removeClass(elem, value) {
        elem.classList.remove("kk-" + value);
    }

    function adjustProgressBar() {
        WATO.elem('.progressTracker', function (progressBar) {
            if (progressBar) {
                progressBar = progressBar[0];

                var steps = WATO.qsa('.progressTracker__Item a', progressBar),
                    stepsAmount = steps.length,
                    savedPath = getStorage('KK09PATH') || '',
                    progressSteps = ['Anmelden', 'Ihre Daten', 'Zahlungsart', 'Bestätigung'],
                    forStart = 0;

                if (stepsAmount < 4) {
                    steps[0].parentNode.insertAdjacentHTML('beforebegin',
                        '<li class="column row progressTracker__Item item--done">' +
                        '<a href="#" class="column progressTracker__Item__content h-text-decoration-none">' +
                        '<strong>Anmelden</strong>' +
                        '</a>' +
                        '</li>');
                    progressSteps.shift();
                } else {
                    steps[0].href = '#';
                }

                if (savedPath.indexOf('guest') !== -1) {
                    if (savedPath === PATH) {
                        steps[1].parentNode.classList.add('item--current');
                    }
                    steps[0].parentNode.remove();
                    forStart = 1;
                }

                for (var i = forStart; i < stepsAmount; i++) {
                    steps[i].children[0].innerHTML = progressSteps[i];

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

    function resetValueOnFocus(input) {
        input.addEventListener('click', function () {
            if (!this.classList.contains('kk-filled')) {
                addClass(this, 'filled');
                this.value = '';
            }
        });
    }

    function prefillInput(elemToFill, filledElemSelector) {
        WATO.elem(elemToFill, function (elem) {
            if (elem) {
                if (elem[0].value === '') {
                    elem[0].value = WATO.qs(filledElemSelector).value;
                    resetValueOnFocus(elem[0]);
                }
            }
        });
    }

    function editAddressPage() {
        // add css prefix
        addClass(document.documentElement, "address-modified");
        adjustProgressBar();

        WATO.elem('.h1', function (headline) {
            if (headline) {
                headline[0].innerHTML = 'Abweichende Lieferadresse';
            }
        });

        WATO.ready(function () {
            WATO.qs('label[for="additional_address_trigger"]').click();
        });

        prefillInput('#zipAlternative', '#zip');
        prefillInput('#cityAlternative', '#city');
        prefillInput('[name="line1Alternative"]', '[name="line1"]');
        WATO.elem('[name="firstNameAlternative"]', function (firstNameAlternative) {
            if (firstNameAlternative) {
                resetValueOnFocus(firstNameAlternative[0]);
            }
        });
        WATO.elem('[name="lastNameAlternative"]', function (lastNameAlternative) {
            if (lastNameAlternative) {
                resetValueOnFocus(lastNameAlternative[0]);
            }
        });
    }


    /**
     * ROUTING
     */
    // PAGE: LOGIN
    if (PATH === "/de/login/checkout") {

        console.log("PAGE: LOGIN");

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

                // Add toggle
                loginForm.insertAdjacentHTML('beforeend',
                    '<div class="columns align-self-bottom small-12">' +
                    '<div class="button expanded-small-only" id="kk07_login_toggle">Zum Kundenlogin</div>' +
                    '</div>');
                WATO.qs('#kk07_login_toggle', loginForm).addEventListener('click', function () {
                    addClass(loginForm, 'show');
                });
            }
        });

        removeStorage('KK09PATH');

        // PAGE: IHRE DATEN (GAST)
    } else if (checkPATH("register/guest-update") || checkPATH("register")) {

        console.log("PAGE: IHRE DATEN - GAST || NEUKUNDE");

        // add css prefix
        addClass(document.documentElement, "data");
        // skip next page
        setStorage(STORAGE, true);
        setStorage('KK09PATH', PATH);
        adjustProgressBar();

        WATO.elem('#registerForm fieldset', function (newsletterBox) {
            if (newsletterBox) {
                // Add checkbox -> skip next page or not?
                newsletterBox[0].insertAdjacentHTML('beforebegin',
                    '<label class="small-12 columns" id="kk07_address_option--wrapper">' +
                    '<div class="row">' +
                    '<div class="column small-12">' +
                    '<strong>Abweichende Lieferadresse</strong>' +
                    '<div class="row h-largeOffset-bottom-inner h-smallOffset-bottom-outer">' +
                    '<div class="column shrink">' +
                    '<input id="kk07_address_option" name="kk07_address_option" type="checkbox" value="true"></div>' +
                    '<div class="column">' +
                    '<label for="kk07_address_option">' +
                    '<p>Ich möchte mein Paket an eine <b>andere Adresse</b> schicken lassen. (Diese kann im nächsten Schritt angeben werden.)</p></label>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</label>'
                );

                WATO.qs('input', newsletterBox[0].previousElementSibling).addEventListener('change', function () {
                    setStorage(STORAGE, !this.checked);

                    // Change button text depending on checkbox value
                    changeButtonText(this.checked ? 'Adresseingabe' : 'Zahlungsart');
                });
            }
        });

        // Change button text
        changeButtonText('Zahlungart');

        // PAGE: IHRE DATEN (NEUKUNDE)
        // } else if (checkPATH("register")) {

        //     console.log("PAGE: IHRE DATEN - NEUKUNDE");

        //     // add css prefix
        //     addClass(document.documentElement, "register");

        //     // skip next page
        //     setStorage(STORAGE, true);


        // PAGE: Adressen
    } else if (checkPATH("addresses/add-delivery-address")) {

        console.log("PAGE: Adressen");


        // add css prefix
        addClass(document.documentElement, "address");
        // skip page
        if (getStorage(STORAGE) === "true") {
            setStorage(STORAGE, false);
            addClass(document.documentElement, "address-hide");
            console.log("SHOW LOADER");

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
                        console.log('CTA', CTA);
                        // send form
                        CTA[0].click();
                    }
                });

                // loader fallback
                window.setTimeout(function () {
                    WATO.qs('#kk-loader').remove();
                    removeClass(document.documentElement, "address-hide");
                    editAddressPage();
                }, 4000);
            }, 250);
        } else {
            editAddressPage();
        }


        // PAGE: Zahlungsart
    } else if (checkPATH("payment/add-payment-method")) {

        console.log("PAGE: Zahlungsart");
        adjustProgressBar();

        WATO.elem('#paymentDetailsForm ul li label', function (paymentOptions) {
            if (paymentOptions) {

                for (var i = 0; i < paymentOptions.length; i++) {
                    if (i === 1) {
                        // Paypal
                        paymentOptions[1].innerHTML = 'PayPal';
                    } else if (i == 2) {
                        // Kreditkarte
                        paymentOptions[2].innerHTML = 'Kreditkarte';
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
    } else if (checkPATH("summary")) {

        // add css prefix
        addClass(document.documentElement, "summary");
        console.log("PAGE: Zusammenfassung");
        adjustProgressBar();

        WATO.elem('#checkoutContentPanel', function (contentPanel) {
            if (contentPanel) {
                contentPanel = contentPanel[0];

                var addresses = WATO.qsa('.columns.small-12.h-xLargeOffset-bottom-outer:not(.h4)', contentPanel),
                    deliveryAddressWrapper = addresses[1].closest('.align-top');
                if (addresses[0].textContent === addresses[1].textContent) {
                    addresses[0].previousElementSibling.innerHTML = 'Liefer- & Rechnungsadresse';
                    addClass(deliveryAddressWrapper, 'hide');
                }

                var paymentOption = getStorage('KK09PAYMENT').split('|'),
                    paymentWrapper = WATO.qs('.columns.small-12.h-smallOffset-bottom-inner', deliveryAddressWrapper.nextElementSibling);
                addClass(paymentWrapper, 'payment-option');
                addClass(paymentWrapper, paymentOption[1]);
                paymentWrapper.innerHTML = paymentOption[0];

            }
        });

        WATO.elem('.cart__productname', function (productNames) {
            if (productNames) {
                console.log('productname', productNames);

                var savings = 0;

                for (var i = 0; i < productNames.length; i++) {
                    var productWrapper = productNames[i].closest('.large-10'),
                        availability = productNames[i].nextElementSibling.nextElementSibling,
                        productImage = WATO.qs('img', productWrapper),
                        prices = WATO.qsa('.price', productWrapper);

                    console.log(productWrapper);
                    addClass(productWrapper, 'product-wrapper');
                    productImage.insertAdjacentHTML('afterend', '<button type="button" class="js-entry-remove button textLink" data-entryNumber="' + i + '"><img src="/_ui/responsive/common/images/icons/garbage.svg" title="Entfernen" class="icon-trash"></button>');
                    var deleteButton = productImage.nextElementSibling;
                    productImage.insertAdjacentElement('afterend', availability);

                    deleteButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        console.log('click');
                        $.ajax({
                            type: "POST",
                            url: "https://www.hessnatur.com/de/cart/update",
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

                    addClass(prices[0].parentElement, 'price');
                    if (prices.length > 1) {
                        addClass(prices[0].parentElement, 'sale-price');
                        savings += parseFloat(prices[1].textContent.replace(',', '.').replace('€ ', '').replace('*', '')) - parseFloat(prices[0].textContent.replace(',', '.').replace('€ ', '').replace('*', ''));
                    }

                }
                WATO.elem('.totalPrice', function (totalPrices) {
                    if (totalPrices) {
                        console.log(totalPrices);

                        addClass(totalPrices[0].closest('.print-page-break-avoid'), 'sums');

                        // 0 -> Zwischensumme
                        // 1 -> Versandkosten
                        var deliveryCostWrapper = totalPrices[1].closest('.row'),
                            deliveryLink = WATO.qs('.textLink', deliveryCostWrapper.nextElementSibling);
                        addClass(deliveryCostWrapper, 'delivery-cost');
                        deliveryLink.innerHTML = 'Versand';
                        totalPrices[1].insertAdjacentElement('beforeend', deliveryLink);

                        if (savings) {
                            totalPrices[1].parentElement.insertAdjacentHTML('afterend', '<div class="row" id="kk07_sum__savings"><div class="column small-8 small-offset-4"><span>Sie sparen mit dieser Bestellung <b>&euro;&nbsp;' + savings.toFixed(2).replace('.', ',') + '</b></span></div></div>');
                        }
                        // 2 -> Gesamtsumme
                        addClass(totalPrices[2].closest('.row'), 'total-sum');


                    }
                });
            }
        });



    }
})(new window.WATO());

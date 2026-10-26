/**
 * WhatsApp Chat Widget
 * Uses the floating widget UI from the Cleanar/GD Cleaning template.
 */
(function () {
    "use strict";

    var whatsappPhone = "254112587581";
    var whatsappMessage = encodeURIComponent("Hello Kwikshift Movers, I would like help with my move.");
    var whatsappUrl = "https://wa.me/" + whatsappPhone + "?text=" + whatsappMessage;

    function createWhatsAppWidget() {
        var widget;

        if (document.querySelector(".floating-whatsapp")) {
            return;
        }

        widget = document.createElement("a");
        widget.className = "floating-whatsapp";
        widget.setAttribute("data-hover-label", "Talk to us on WhatsApp");
        widget.href = whatsappUrl;
        widget.target = "_blank";
        widget.rel = "noopener noreferrer";
        widget.setAttribute("aria-label", "Talk to Kwikshift Movers on WhatsApp");
        widget.innerHTML = '<span class="floating-whatsapp__icon" aria-hidden="true"><i class="fa-brands fa-whatsapp"></i></span>';

        document.body.appendChild(widget);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", createWhatsAppWidget);
    } else {
        createWhatsAppWidget();
    }
})();

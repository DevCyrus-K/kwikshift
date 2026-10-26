(function (window) {
    "use strict";

    function apiBaseUrl() {
        var base = typeof AppConfig !== "undefined" && AppConfig.apiBase
            ? AppConfig.apiBase
            : "";

        return String(base).replace(/\/+$/, "");
    }

    function report(payload) {
        fetch(apiBaseUrl() + "/client-errors", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(payload)
        }).catch(function () {});
    }

    window.onerror = function (message, source, lineno, colno, error) {
        report({
            message: message,
            file: source,
            line: lineno,
            column: colno,
            stack: error ? error.stack : null,
            url: window.location.href
        });

        return true;
    };

    window.addEventListener("unhandledrejection", function (event) {
        report({
            message: event.reason ? event.reason.toString() : "Unhandled rejection",
            stack: event.reason && event.reason.stack ? event.reason.stack : null,
            url: window.location.href
        });
    });
})(window);

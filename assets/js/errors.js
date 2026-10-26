(function (window) {
    "use strict";

    function report() {
        // Client-side error reporting is intentionally disabled. The previous
        // cross-origin endpoint is unavailable and produced repeated CORS errors.
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

        return false;
    };

    window.addEventListener("unhandledrejection", function (event) {
        report({
            message: event.reason ? event.reason.toString() : "Unhandled rejection",
            stack: event.reason && event.reason.stack ? event.reason.stack : null,
            url: window.location.href
        });
    });
})(window);

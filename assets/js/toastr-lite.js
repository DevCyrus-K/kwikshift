(function (window, document) {
    "use strict";

    var loadingToast = null;

    function clearInlineErrors() {
        Array.prototype.slice.call(document.querySelectorAll(".field-error-message")).forEach(function (node) {
            if (node.parentNode) {
                node.parentNode.removeChild(node);
            }
        });

        Array.prototype.slice.call(document.querySelectorAll(".is-invalid")).forEach(function (node) {
            node.classList.remove("is-invalid");
            node.removeAttribute("aria-invalid");
        });
    }

    function fieldErrorText(error) {
        if (Array.isArray(error)) {
            return error[0] || "";
        }

        return typeof error === "string" ? error : "";
    }

    function showInlineErrors(errors) {
        clearInlineErrors();

        if (!errors || typeof errors !== "object") {
            return;
        }

        Object.keys(errors).forEach(function (name) {
            var field = document.querySelector('[name="' + String(name).replace(/"/g, '\\"') + '"]');
            var message = fieldErrorText(errors[name]);
            var wrapper;
            var errorNode;

            if (!field || !message) {
                return;
            }

            wrapper = field.closest(".form-field") || field.parentElement;
            field.classList.add("is-invalid");
            field.setAttribute("aria-invalid", "true");

            if (!wrapper) {
                return;
            }

            errorNode = document.createElement("div");
            errorNode.className = "field-error-message";
            errorNode.textContent = message;
            wrapper.appendChild(errorNode);
        });
    }

    function exposeToastHelpers() {
        window.showToast = function (type, message) {
            var toastType = type === "loading" ? "info" : type;
            var options = type === "loading" ? { timeOut: 0, extendedTimeOut: 0, tapToDismiss: false } : undefined;

            if (!window.toastr || !window.toastr[toastType]) {
                return null;
            }

            if (type === "loading") {
                window.dismissLoadingToast();
                loadingToast = window.toastr[toastType](message || "Loading...", undefined, options);
                return loadingToast;
            }

            window.toastr.clear();
            return window.toastr[toastType](message || "");
        };

        window.dismissLoadingToast = function () {
            if (window.toastr && window.toastr.clear) {
                window.toastr.clear(loadingToast || undefined);
            }

            loadingToast = null;
        };

        window.showInlineErrors = showInlineErrors;
        window.clearInlineErrors = clearInlineErrors;
    }

    if (window.toastr) {
        exposeToastHelpers();
        return;
    }

    var defaults = {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-right",
        timeOut: 5000,
        newestOnTop: true,
        preventDuplicates: true,
        tapToDismiss: true
    };
    var lastMessage = "";

    function extend(target) {
        var index;
        var key;
        var source;

        target = target || {};

        for (index = 1; index < arguments.length; index += 1) {
            source = arguments[index] || {};

            for (key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    }

    function getContainer(positionClass) {
        var container = document.getElementById("toast-container");

        if (!container) {
            container = document.createElement("div");
            container.id = "toast-container";
            document.body.appendChild(container);
        }

        container.className = positionClass || defaults.positionClass;

        return container;
    }

    function removeToast(toast) {
        if (!toast || toast.dataset.closing === "true") {
            return;
        }

        toast.dataset.closing = "true";
        toast.classList.add("toast-closing");

        window.setTimeout(function () {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 180);
    }

    function clearToasts() {
        var container = document.getElementById("toast-container");

        lastMessage = "";

        if (!container) {
            return;
        }

        Array.prototype.slice.call(container.children).forEach(removeToast);
    }

    function renderToast(type, message, title, options) {
        var settings = extend({}, defaults, window.toastr.options || {}, options || {});
        var duration = parseInt(settings.timeOut, 10) || 0;
        var container;
        var toast;
        var body;
        var closeButton;
        var titleNode;
        var messageNode;
        var progress;
        var progressBar;
        var timeoutId = null;

        if (!message) {
            return null;
        }

        if (settings.preventDuplicates && lastMessage === message) {
            return null;
        }

        lastMessage = message;
        container = getContainer(settings.positionClass);
        toast = document.createElement("div");
        toast.className = "toast toast-" + type;
        toast.setAttribute("role", "alert");
        toast.setAttribute("aria-live", type === "error" ? "assertive" : "polite");

        body = document.createElement("div");
        body.className = "toast__body";

        if (title) {
            titleNode = document.createElement("div");
            titleNode.className = "toast__title";
            titleNode.textContent = title;
            body.appendChild(titleNode);
        }

        messageNode = document.createElement("div");
        messageNode.className = "toast__message";
        messageNode.textContent = message;
        body.appendChild(messageNode);

        if (settings.closeButton) {
            closeButton = document.createElement("button");
            closeButton.type = "button";
            closeButton.className = "toast__close";
            closeButton.setAttribute("aria-label", "Close notification");
            closeButton.textContent = "×";
            closeButton.addEventListener("click", function (event) {
                event.preventDefault();
                removeToast(toast);
            });
            body.appendChild(closeButton);
        }

        toast.appendChild(body);

        if (settings.progressBar && duration > 0) {
            progress = document.createElement("div");
            progress.className = "toast__progress";
            progressBar = document.createElement("span");
            progressBar.style.animationDuration = duration + "ms";
            progress.appendChild(progressBar);
            toast.appendChild(progress);
        }

        if (settings.tapToDismiss) {
            toast.addEventListener("click", function (event) {
                if (event.target === closeButton) {
                    return;
                }

                removeToast(toast);
            });
        }

        if (settings.newestOnTop && container.firstChild) {
            container.insertBefore(toast, container.firstChild);
        } else {
            container.appendChild(toast);
        }

        if (duration > 0) {
            timeoutId = window.setTimeout(function () {
                removeToast(toast);
            }, duration);

            toast.addEventListener("mouseenter", function () {
                if (timeoutId) {
                    window.clearTimeout(timeoutId);
                    timeoutId = null;
                }
            });

            toast.addEventListener("mouseleave", function () {
                if (!timeoutId) {
                    timeoutId = window.setTimeout(function () {
                        removeToast(toast);
                    }, 1200);
                }
            });
        }

        return toast;
    }

    window.toastr = {
        options: extend({}, defaults),
        clear: clearToasts,
        remove: clearToasts,
        success: function (message, title, options) {
            return renderToast("success", message, title, options);
        },
        error: function (message, title, options) {
            return renderToast("error", message, title, options);
        },
        warning: function (message, title, options) {
            return renderToast("warning", message, title, options);
        },
        info: function (message, title, options) {
            return renderToast("info", message, title, options);
        }
    };

    exposeToastHelpers();
})(window, document);

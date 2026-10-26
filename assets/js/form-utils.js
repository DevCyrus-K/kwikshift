(function (window, document) {
    "use strict";

    function apiBaseUrl() {
        var base = typeof AppConfig !== "undefined" && AppConfig.apiBase
            ? AppConfig.apiBase
            : "";

        return String(base).replace(/\/+$/, "");
    }

    function endpointUrl(endpoint) {
        endpoint = String(endpoint || "");

        if (/^(?:[a-z]+:)?\/\//i.test(endpoint)) {
            return endpoint;
        }

        if (endpoint.charAt(0) === "/") {
            return endpoint;
        }

        return apiBaseUrl() + "/" + endpoint.replace(/^\/+/, "");
    }

    function submitButton(form) {
        return form.querySelector('button[type="submit"], input[type="submit"]');
    }

    function buttonText(button) {
        return button.tagName.toLowerCase() === "button" ? button.textContent : button.value;
    }

    function setButtonText(button, text) {
        if (button.tagName.toLowerCase() === "button") {
            button.textContent = text;
            return;
        }

        button.value = text;
    }

    function disableSubmit(button, text) {
        if (!button) {
            return;
        }

        if (!button.dataset.originalText) {
            button.dataset.originalText = buttonText(button);
        }

        button.disabled = true;
        setButtonText(button, text || "Submitting...");
    }

    function enableSubmit(button) {
        if (!button) {
            return;
        }

        button.disabled = false;
        setButtonText(button, button.dataset.originalText || buttonText(button));
    }

    function configureToastr() {
        if (!window.toastr) {
            return;
        }

        window.toastr.options = Object.assign({}, window.toastr.options || {});
    }

    function showSuccess(message) {
        configureToastr();

        if (window.toastr && window.toastr.success) {
            window.toastr.clear();
            window.toastr.success(message || "Submitted successfully.");
        }
    }

    function showError(message) {
        configureToastr();

        if (window.toastr && window.toastr.error) {
            window.toastr.clear();
            window.toastr.error(message || "Something went wrong. Please try again.");
        }
    }

    function parseErrorMessage(payload, fallback) {
        var firstKey;
        var firstError;

        if (!payload) {
            return fallback;
        }

        if (payload.message) {
            return payload.message;
        }

        if (payload.errors && typeof payload.errors === "object") {
            firstKey = Object.keys(payload.errors)[0];
            firstError = firstKey ? payload.errors[firstKey] : null;

            if (Array.isArray(firstError) && firstError[0]) {
                return firstError[0];
            }

            if (typeof firstError === "string" && firstError) {
                return firstError;
            }
        }

        return fallback;
    }

    function postToAPI(endpoint, data) {
        var headers = {
            Accept: "application/json",
            "X-Requested-With": "XMLHttpRequest"
        };
        var body = data;

        if (!(data instanceof FormData)) {
            headers["Content-Type"] = "application/json";
            body = JSON.stringify(data || {});
        }

        return fetch(endpointUrl(endpoint), {
            method: "POST",
            headers: headers,
            body: body
        }).then(function (response) {
            var contentType = response.headers.get("content-type") || "";
            var payloadPromise = contentType.indexOf("application/json") !== -1
                ? response.json()
                : response.text().then(function (text) {
                    return text ? { message: text } : {};
                });

            return payloadPromise.then(function (payload) {
                if (!response.ok) {
                    throw {
                        status: response.status,
                        response: payload,
                        message: parseErrorMessage(payload, response.status >= 500
                            ? "Server error. Please try again later."
                            : "Please review the form and try again.")
                    };
                }

                return payload;
            });
        });
    }

    function applyValidationErrors(form, errors) {
        if (!errors || typeof errors !== "object") {
            return;
        }

        Object.keys(errors).forEach(function (name) {
            var field = form.querySelector('[name="' + String(name).replace(/"/g, '\\"') + '"]');
            var wrapper = field ? field.closest(".form-field") || field.parentElement : null;

            if (!field || !wrapper) {
                return;
            }

            wrapper.classList.add("is-invalid");
            field.setAttribute("aria-invalid", "true");
        });
    }

    function initForm(formId, options) {
        var form = document.getElementById(formId);

        if (!form) {
            return null;
        }

        options = options || {};

        form.addEventListener("submit", function (event) {
            var button = submitButton(form);
            var data;

            event.preventDefault();
            disableSubmit(button, options.loadingText);

            if (typeof options.beforeValidate === "function" && options.beforeValidate(form) === false) {
                enableSubmit(button);
                return;
            }

            if (typeof options.validate === "function" && options.validate(form) === false) {
                enableSubmit(button);
                return;
            }

            data = typeof options.data === "function" ? options.data(form) : new FormData(form);

            if (window.showToast) {
                window.showToast("loading", options.loadingToast || options.loadingText || "Submitting...");
            }

            postToAPI(options.endpoint, data)
                .then(function (response) {
                    if (window.dismissLoadingToast) {
                        window.dismissLoadingToast();
                    }

                    if (!response || (response.ok !== true && response.success !== true)) {
                        throw {
                            status: 422,
                            response: response || {},
                            message: parseErrorMessage(response, options.errorMessage || "Please review the form and try again.")
                        };
                    }

                    if (typeof options.onSuccess === "function") {
                        options.onSuccess(response, form);
                    } else {
                        showSuccess(response.message || options.successMessage);
                    }

                    if (options.resetOnSuccess === true) {
                        form.reset();
                    }

                    enableSubmit(button);
                })
                .catch(function (error) {
                    var response = error && error.response ? error.response : {};

                    if (window.dismissLoadingToast) {
                        window.dismissLoadingToast();
                    }

                    applyValidationErrors(form, response.errors);

                    if (typeof options.onError === "function" && options.onError(error, form) === false) {
                        enableSubmit(button);
                        return;
                    }

                    showError(error && error.message ? error.message : options.errorMessage);
                    enableSubmit(button);
                });
        });

        return form;
    }

    window.KwikshiftFormUtils = {
        initForm: initForm,
        disableSubmit: disableSubmit,
        enableSubmit: enableSubmit,
        showSuccess: showSuccess,
        showError: showError,
        postToAPI: postToAPI,
        endpointUrl: endpointUrl
    };
})(window, document);

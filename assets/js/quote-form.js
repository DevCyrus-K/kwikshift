$(function () {
    "use strict";

    var form = $("#ajax_quote_form");
    var formMessages = $("#q-form-messages");
    var phonePattern = window.KwikshiftFormFeedback ? window.KwikshiftFormFeedback.phonePattern : /^\+?[0-9][0-9\s().-]{6,20}[0-9]$/;
    var allowedMoveTypes = [
        "Residential Relocation",
        "Office Relocation",
        "Long-Distance Move",
        "Packing & Storage",
        "Packing and Storage"
    ];
    var feedback;
    var moveDateField = form.find("#q-move-date");
    var moveTypeField = form.find("#q-freight-type");

    // Conditional field wrappers
    var residentialBedroomsWrapper = form.find("#q-residential-bedrooms-wrapper");
    var residentialBedroomsField = form.find("#q-residential-bedrooms");
    var officeSqftWrapper = form.find("#q-office-sqft-wrapper");
    var officeSqftField = form.find("#q-office-sqft");
    var longDistanceKmWrapper = form.find("#q-long-distance-km-wrapper");
    var longDistanceKmField = form.find("#q-long-distance-km");

    function refreshSelect(field) {
        if ($.fn.niceSelect && field.length && field.next(".nice-select").length) {
            field.niceSelect("update");
        }
    }

    // Handle conditional field visibility based on move type
    function updateConditionalFields() {
        var moveType = moveTypeField.val();

        // Hide all conditional fields first
        residentialBedroomsWrapper.hide();
        residentialBedroomsField.prop("required", false);
        officeSqftWrapper.hide();
        officeSqftField.prop("required", false);
        longDistanceKmWrapper.hide();
        longDistanceKmField.prop("required", false);

        // Show relevant conditional field based on move type
        if (moveType === "Residential Relocation") {
            residentialBedroomsWrapper.show();
            residentialBedroomsField.prop("required", true);
        } else if (moveType === "Office Relocation") {
            officeSqftWrapper.show();
            officeSqftField.prop("required", true);
        } else if (moveType === "Long-Distance Move") {
            longDistanceKmWrapper.show();
            longDistanceKmField.prop("required", true);
        }

        refreshSelect(residentialBedroomsField);
    }

    if (!form.length) {
        return;
    }

    if (moveDateField.length) {
        moveDateField.attr("min", new Date().toISOString().split("T")[0]);
    }

    formMessages.hide();

    feedback = window.KwikshiftFormFeedback.create(form, {
        messageSelector: "#q-form-messages",
        summaryMessage: "Please complete the highlighted moving details before requesting your quote.",
        toastTitle: "Quote Request",
        fields: {
            "q-full-name": {
                requiredMessage: "Please enter your full name."
            },
            "q-phone": {
                requiredMessage: "Please enter your phone number.",
                custom: function (value) {
                    if (value && !phonePattern.test(value)) {
                        return "Please enter a valid phone number so we can reach you quickly.";
                    }

                    return "";
                }
            },
            "q-depature": {
                requiredMessage: "Please enter your pickup location."
            },
            "q-destination": {
                requiredMessage: "Please enter your destination."
            },
            "q-weight": {
                requiredMessage: "Please tell us the house size or office items involved."
            },
            "q-move-date": {
                custom: function (value) {
                    if (!value) {
                        return "";
                    }

                    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        return "Please choose a valid moving date.";
                    }

                    if (value < new Date().toISOString().split("T")[0]) {
                        return "Please choose today or a future moving date.";
                    }

                    return "";
                }
            },
            "q-freight-type": {
                requiredMessage: "Please choose your move type.",
                custom: function (value) {
                    if (value && $.inArray(value, allowedMoveTypes) === -1) {
                        return "Please choose a valid move type for your request.";
                    }

                    return "";
                }
            },
            "q-residential-bedrooms": {
                custom: function (value) {
                    if (residentialBedroomsField.prop("required") && !value) {
                        return "Please select a bedroom type.";
                    }
                    return "";
                }
            },
            "q-office-sqft": {
                custom: function (value) {
                    if (officeSqftField.prop("required")) {
                        if (!value) {
                            return "Please enter the office size in square feet.";
                        }
                        var num = parseInt(value, 10);
                        if (!/^\d+$/.test(value) || isNaN(num) || num < 1 || num > 999999) {
                            return "Please enter a valid office size between 1 and 999999 sq ft.";
                        }
                    }
                    return "";
                }
            },
            "q-long-distance-km": {
                custom: function (value) {
                    if (longDistanceKmField.prop("required")) {
                        if (!value) {
                            return "Please enter the approximate distance.";
                        }
                        var num = parseInt(value, 10);
                        if (!/^\d+$/.test(value) || isNaN(num) || num < 1 || num > 9999) {
                            return "Please enter a valid distance between 1 and 9999 km.";
                        }
                    }
                    return "";
                }
            },
            "q-email": {
                requiredMessage: "Please enter your email address.",
                invalidMessage: "Please enter a valid email address."
            },
            "q-message": {
                requiredMessage: "Please share a few details about your move.",
                minLength: 10,
                minLengthMessage: "Please share a few more details about your move so we can prepare the right quote."
            }
        }
    });

    function applyServerFeedback(source, fallback) {
        var response = window.KwikshiftFormFeedback.getResponseData(source, fallback);

        feedback.clearErrors();
        feedback.applyServerErrors(response.errors);

        if (!$.isEmptyObject(response.errors)) {
            feedback.focusFirstError(response.errors);
        }

        feedback.notify("error", response.message, "Quote Request");
    }

    // Update conditional fields on move type change
    moveTypeField.on("change", function () {
        updateConditionalFields();
        // Clear the conditional fields
        residentialBedroomsField.val("");
        officeSqftField.val("");
        longDistanceKmField.val("");
        refreshSelect(residentialBedroomsField);
    });

    // Initialize conditional fields on page load
    updateConditionalFields();

    window.KwikshiftFormUtils.initForm("ajax_quote_form", {
        endpoint: "/api/quote.php",
        loadingText: "Submitting...",
        loadingToast: "Sending your quote request...",
        beforeValidate: function () {
            if (window.KwikshiftFormSecurity) {
                window.KwikshiftFormSecurity.ready(form);
            }
        },
        validate: function () {
            return feedback.handleSubmitValidation();
        },
        onSuccess: function (response) {
            var reference = response.reference || (response.data && response.data.reference) || "";

            feedback.clearErrors();
            if (window.clearInlineErrors) {
                window.clearInlineErrors();
            }
            feedback.notify("success", reference ? response.message + " Reference: " + reference : response.message);
            form[0].reset();
            updateConditionalFields();
            refreshSelect(moveTypeField);
            refreshSelect(residentialBedroomsField);
        },
        onError: function (error) {
            if (error && error.status === 429) {
                var rateMessage = error && error.response && error.response.message
                    ? error.response.message
                    : (error && error.message ? error.message : "Too many requests. Please wait a moment and try again.");

                if (window.showHttpErrorToast) {
                    window.showHttpErrorToast(429);
                } else {
                    feedback.notify("error", rateMessage);
                }
            } else {
                if (window.showInlineErrors && error && error.response && error.response.errors) {
                    window.showInlineErrors(error.response.errors);
                }
                applyServerFeedback(error && error.response ? error.response : error, "Oops! An error occurred and your quote request could not be sent.");
            }

            return false;
        }
    });
});

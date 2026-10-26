$(function () {
    "use strict";

    var form = $("#ajax_contact");
    var formMessages = $("#form-messages");
    var phonePattern = window.KwikshiftFormFeedback ? window.KwikshiftFormFeedback.phonePattern : /^\+?[0-9][0-9\s().-]{6,20}[0-9]$/;
    var feedback;

    if (!form.length) {
        return;
    }

    formMessages.hide();

    feedback = window.KwikshiftFormFeedback.create(form, {
        messageSelector: "#form-messages",
        summaryMessage: "Please fill in the highlighted contact details before sending your message.",
        toastTitle: "Contact Form",
        fields: {
            firstname: {
                requiredMessage: "Please enter your first name."
            },
            lastname: {
                requiredMessage: "Please enter your last name."
            },
            email: {
                requiredMessage: "Please enter your email address.",
                invalidMessage: "Please enter a valid email address."
            },
            phone: {
                requiredMessage: "Please enter your phone number.",
                custom: function (value) {
                    if (value && !phonePattern.test(value)) {
                        return "Please enter a valid phone number so our team can reach you quickly.";
                    }

                    return "";
                }
            },
            message: {
                requiredMessage: "Please tell us about your move or request.",
                minLength: 10,
                minLengthMessage: "Please share a little more detail in your message."
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

        feedback.notify("error", response.message, "Contact Form");
    }

    window.KwikshiftFormUtils.initForm("ajax_contact", {
        endpoint: "/api/contact.php",
        loadingText: "Submitting...",
        loadingToast: "Sending your message...",
        beforeValidate: function () {
            if (window.KwikshiftFormSecurity) {
                window.KwikshiftFormSecurity.ready(form);
            }
        },
        validate: function () {
            return feedback.handleSubmitValidation();
        },
        onSuccess: function (response) {
            feedback.clearErrors();
            if (window.clearInlineErrors) {
                window.clearInlineErrors();
            }
            feedback.notify("success", response.message);
            form[0].reset();
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
                applyServerFeedback(error && error.response ? error.response : error, "Oops! An error occurred and your message could not be sent.");
            }

            return false;
        }
    });
});

(function ($) {
    "use strict";

    var formSelectors = [
        "#ajax_contact",
        "#ajax_quote_form",
        "#ajax_review_form",
        "#career_application_form"
    ];

    function getSourcePage() {
        return window.location.pathname + window.location.search;
    }

    function ensureHiddenField(form, name) {
        var field = form.find('input[name="' + name + '"]');

        if (!field.length) {
            field = $('<input>', {
                type: "hidden",
                name: name
            });
            form.append(field);
        }

        return field;
    }

    function populateFormSecurity(formElement) {
        var form = $(formElement);

        if (!form.length) {
            return $.Deferred().reject("Form not found.").promise();
        }

        ensureHiddenField(form, "source_page").val(getSourcePage());

        return $.Deferred().resolve({
            ok: true,
            success: true
        }).promise();
    }

    function primeForms() {
        var selector = formSelectors.join(", ");
        var forms = $(selector);

        if (!forms.length) {
            return;
        }

        forms.each(function () {
            populateFormSecurity(this);
        });
    }

    window.KwikshiftFormSecurity = {
        ready: populateFormSecurity,
        refresh: function () {
            return $.Deferred().resolve({
                ok: true,
                success: true
            }).promise();
        }
    };

    $(primeForms);
})(jQuery);

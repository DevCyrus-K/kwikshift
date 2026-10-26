# Resend form delivery

Configure these server-side environment variables in Apache, PHP-FPM, or the hosting control panel; do not put them in JavaScript or commit their values.

```text
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=no-reply@your-verified-resend-domain.example
RESEND_FROM_NAME=Kwikshift Movers
FORM_EMAIL_BRAND=Hydrasoft Technologies
ADMIN_EMAIL=admin@hydrasoft.example
```

`RESEND_FROM_EMAIL` must be a sender verified in Resend. `ADMIN_EMAIL` receives contact, quote, review, and career-application notifications. `FORM_EMAIL_BRAND` controls the notification subject suffix. The submitted email is used only as a Reply-To address for contact, quote, and application messages.

The handlers process submissions in memory and send them to Resend. They do not create or use a submissions database, local submission files, or an internal inbox. Uploaded review photos and CVs are read from PHP's request-temporary upload location only to attach them to the outbound email.

## Rollback

This directory is not a Git repository. Original copies of the changed PHP files were saved before editing at `/tmp/kwikshift-form-resend-backup-20261026/`. To revert the integration, restore `config.php`, `mail.php`, `security.php`, and the four handler files from that directory, then remove this file. If the deployment ZIP is used, update its matching members with `zip -u kwikshift-frontend-production.zip config/config.php helpers/mail.php helpers/security.php handlers/contact.php handlers/quote.php handlers/review.php handlers/apply.php`. Restart PHP/Apache if its environment configuration was changed.

After deploying, submit one controlled entry through each visitor form and confirm that Resend accepts it and the configured admin mailbox receives it. Do not treat a successful HTTP response as proof of inbox delivery.

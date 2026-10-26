<?php

define('ADMIN_API', 'https://dashboard.kwikshiftmovers.co.ke/api/v1');
define('RESEND_API_KEY', (string) getenv('RESEND_API_KEY'));
define('MAIL_FROM', (string) (getenv('RESEND_FROM_EMAIL') ?: ''));
define('MAIL_FROM_NAME', (string) (getenv('RESEND_FROM_NAME') ?: 'Kwikshift Movers'));
define('FORM_EMAIL_BRAND', (string) (getenv('FORM_EMAIL_BRAND') ?: 'Hydrasoft Technologies'));
define('MAIL_INFO', (string) (getenv('ADMIN_EMAIL') ?: ''));
define('MAIL_SALES', (string) (getenv('ADMIN_EMAIL') ?: ''));
define('MAIL_CAREERS', (string) (getenv('ADMIN_EMAIL') ?: ''));
define('SITE_URL', 'https://www.kwikshiftmovers.co.ke');
define('FORCE_HTTPS', true);

if (
    PHP_SAPI !== 'cli'
    && FORCE_HTTPS
    && (empty($_SERVER['HTTPS']) || $_SERVER['HTTPS'] === 'off')
    && (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') !== 'https')
) {
    header('Location: https://'.$_SERVER['HTTP_HOST'].$_SERVER['REQUEST_URI'], true, 301);
    exit;
}

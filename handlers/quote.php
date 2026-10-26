<?php

require_once __DIR__.'/../config/config.php';
require_once __DIR__.'/../helpers/security.php';
require_once __DIR__.'/../helpers/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.');
}

checkHoneypot();

$errors = [];
$name = clean($_POST['q-full-name'] ?? '');
$email = trim((string) ($_POST['q-email'] ?? ''));
$phone = clean($_POST['q-phone'] ?? '');
$from = clean($_POST['q-depature'] ?? '');
$to = clean($_POST['q-destination'] ?? '');
$type = clean($_POST['q-freight-type'] ?? '');
$moveSize = clean($_POST['q-weight'] ?? '');
$date = clean($_POST['q-move-date'] ?? '');
$message = clean($_POST['q-message'] ?? '');
$source = clean($_POST['source_page'] ?? '/get-quote');

if ($name === '') {
    $errors['q-full-name'] = 'Name is required.';
}

if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['q-email'] = 'Valid email is required.';
}

if ($phone === '') {
    $errors['q-phone'] = 'Phone is required.';
}

if ($from === '') {
    $errors['q-depature'] = 'Origin is required.';
}

if ($to === '') {
    $errors['q-destination'] = 'Destination is required.';
}

if ($type === '') {
    $errors['q-freight-type'] = 'Service type is required.';
}

if ($moveSize === '') {
    $errors['q-weight'] = 'Move size or item details are required.';
}

if ($message === '' || strlen($message) < 10) {
    $errors['q-message'] = 'Please share a few more details about your move.';
}

if ($date !== '' && ! preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    $errors['q-move-date'] = 'Please choose a valid moving date.';
}

if ($errors) {
    jsonResponse(false, 'Please fix the errors below.', $errors);
}

$bedrooms = clean($_POST['q-residential-bedrooms'] ?? '');
$officeSize = clean($_POST['q-office-sqft'] ?? '');
$distance = clean($_POST['q-long-distance-km'] ?? '');

if (sendMail(
    MAIL_SALES,
    MAIL_FROM_NAME,
    'New Quote Request | '.FORM_EMAIL_BRAND,
    submissionEmailHtml('New Quote Request', [
        'Name' => $name,
        'Email' => $email,
        'Phone' => $phone,
        'Pickup location' => $from,
        'Destination' => $to,
        'Requested service' => $type,
        'Home size' => $bedrooms,
        'Office size (sq ft)' => $officeSize,
        'Approximate distance (km)' => $distance,
        'Move size / items' => $moveSize,
        'Preferred moving date' => $date,
        'Project details' => $message,
    ], $source),
    MAIL_FROM,
    MAIL_FROM_NAME,
    $email
)) {
    jsonResponse(true, 'Request received! We will contact you within 2 hours.');
}

jsonResponse(false, 'We could not send your quote request right now. Please try again.');

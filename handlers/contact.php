<?php

require_once __DIR__.'/../config/config.php';
require_once __DIR__.'/../helpers/security.php';
require_once __DIR__.'/../helpers/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.');
}

checkHoneypot();

$errors = [];
$first = clean($_POST['firstname'] ?? '');
$last = clean($_POST['lastname'] ?? '');
$email = trim((string) ($_POST['email'] ?? ''));
$phone = clean($_POST['phone'] ?? '');
$message = clean($_POST['message'] ?? '');

if ($first === '') {
    $errors['firstname'] = 'First name is required.';
}

if ($last === '') {
    $errors['lastname'] = 'Last name is required.';
}

if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Valid email is required.';
}

if ($message === '' || strlen($message) < 10) {
    $errors['message'] = 'Please share a little more detail in your message.';
}

if ($errors) {
    jsonResponse(false, 'Please fix the errors below.', $errors);
}

$subject = clean($_POST['subject'] ?? 'Website Contact');
$source = clean($_POST['source_page'] ?? '/contact');

if (sendMail(
    MAIL_INFO,
    MAIL_FROM_NAME,
    'New Contact Enquiry | '.FORM_EMAIL_BRAND,
    submissionEmailHtml('New Contact Enquiry', [
        'Name' => trim($first.' '.$last),
        'Email' => $email,
        'Phone' => $phone,
        'Subject' => $subject,
        'Message' => $message,
    ], $source),
    MAIL_FROM,
    MAIL_FROM_NAME,
    $email
)) {
    jsonResponse(true, 'Message sent! We will respond within 24 hours.');
}

jsonResponse(false, 'We could not send your message right now. Please try again.');

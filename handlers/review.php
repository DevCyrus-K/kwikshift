<?php

require_once __DIR__.'/../config/config.php';
require_once __DIR__.'/../helpers/security.php';
require_once __DIR__.'/../helpers/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.');
}

checkHoneypot();

$errors = [];
$name = clean($_POST['review-name'] ?? '');
$role = clean($_POST['review-role'] ?? '');
$rating = (float) ($_POST['review-rating'] ?? 0);
$message = clean($_POST['review-message'] ?? '');
$attachments = [];

if ($name === '') {
    $errors['review-name'] = 'Name is required.';
}

if ($role === '') {
    $errors['review-role'] = 'Role is required.';
}

if ($message === '' || strlen($message) < 20) {
    $errors['review-message'] = 'Please make your review a little more detailed.';
}

if ($rating < 0.5 || $rating > 5) {
    $errors['review-rating'] = 'Rating must be between 0.5 and 5.';
}

if (! empty($_FILES['review-photo']) && $_FILES['review-photo']['error'] === UPLOAD_ERR_OK) {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string) $finfo->file($_FILES['review-photo']['tmp_name']);
    $allowed = ['image/jpeg', 'image/png', 'image/webp'];

    if (! in_array($mime, $allowed, true)) {
        $errors['review-photo'] = 'Upload a JPG, PNG, or WebP photo.';
    } elseif ($_FILES['review-photo']['size'] > 5 * 1024 * 1024) {
        $errors['review-photo'] = 'Photo must be under 5MB.';
    } else {
        $extension = explode('/', $mime)[1] ?? 'jpg';
        $attachment = uploadAttachment($_FILES['review-photo'], 'review-photo.'.$extension);
        if ($attachment === null) {
            $errors['review-photo'] = 'We could not process the uploaded photo. Please try again.';
        } else {
            $attachments[] = $attachment;
        }
    }
}

if ($errors) {
    jsonResponse(false, 'Please fix the errors below.', $errors);
}

$source = clean($_POST['source_page'] ?? '/review-us');

if (sendMail(
    MAIL_INFO,
    MAIL_FROM_NAME,
    'New Customer Review | '.FORM_EMAIL_BRAND,
    submissionEmailHtml('New Customer Review', [
        'Reviewer name' => $name,
        'Role' => $role,
        'Rating' => $rating.' / 5',
        'Review' => $message,
        'Photo' => $attachments ? 'Attached to this email' : '',
    ], $source),
    MAIL_FROM,
    MAIL_FROM_NAME,
    null,
    $attachments
)) {
    jsonResponse(true, 'Thank you for your review! It has been sent for approval.');
}

jsonResponse(false, 'We could not send your review right now. Please try again.');

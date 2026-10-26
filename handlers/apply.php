<?php

require_once __DIR__.'/../config/config.php';
require_once __DIR__.'/../helpers/security.php';
require_once __DIR__.'/../helpers/mail.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(false, 'Invalid request method.');
}

checkHoneypot();

$errors = [];
$name = clean($_POST['full_name'] ?? '');
$email = trim((string) ($_POST['email'] ?? ''));
$phone = clean($_POST['phone'] ?? '');
$jobId = (int) ($_POST['job_id'] ?? 0);
$letter = clean($_POST['cover_letter'] ?? '');
$cv = $_FILES['cv_file'] ?? null;
$mime = '';

if ($name === '') {
    $errors['full_name'] = 'Name is required.';
}

if (! filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Valid email is required.';
}

if ($phone === '') {
    $errors['phone'] = 'Phone is required.';
}

if ($jobId < 1) {
    $errors['job_id'] = 'Job selection is required.';
}

if ($letter === '' || strlen($letter) < 30) {
    $errors['cover_letter'] = 'Please provide a short cover letter.';
}

if (! $cv || ($cv['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
    $errors['cv_file'] = 'CV file is required.';
} else {
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string) $finfo->file($cv['tmp_name']);

    if ($mime !== 'application/pdf') {
        $errors['cv_file'] = 'CV must be a PDF document.';
    } elseif (($cv['size'] ?? 0) > 5 * 1024 * 1024) {
        $errors['cv_file'] = 'CV must be under 5MB.';
    }
}

if ($errors) {
    jsonResponse(false, 'Please fix the errors below.', $errors);
}

$filename = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($cv['name'])) ?: 'cv.pdf';
$attachment = uploadAttachment($cv, $filename);

if ($attachment === null) {
    jsonResponse(false, 'We could not process your CV. Please try again.');
}

if (sendMail(
    MAIL_CAREERS,
    MAIL_FROM_NAME,
    'New Career Application | '.FORM_EMAIL_BRAND,
    submissionEmailHtml('New Career Application', [
        'Job ID' => (string) $jobId,
        'Applicant name' => $name,
        'Email' => $email,
        'Phone' => $phone,
        'Cover letter' => $letter,
        'CV' => 'Attached to this email',
    ], clean($_POST['source_page'] ?? '/career-application')),
    MAIL_FROM,
    MAIL_FROM_NAME,
    $email,
    [$attachment]
)) {
    jsonResponse(true, 'Application submitted! We will be in touch if shortlisted.');
}

jsonResponse(false, 'We could not send your application right now. Please try again.');

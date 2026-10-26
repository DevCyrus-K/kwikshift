<?php

function csrfToken(): string
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function verifyCsrf(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }

    $token = $_POST['csrf_token'] ?? $_SERVER['HTTP_X_CSRF_TOKEN'] ?? '';

    if (! hash_equals($_SESSION['csrf_token'] ?? '', $token)) {
        jsonResponse(false, 'Invalid request. Please refresh.');
    }
}

function checkHoneypot(): void
{
    if (! empty($_POST['website'])) {
        jsonResponse(true, 'Thank you! We will be in touch.');
    }
}

function rateLimit(string $action, int $max, int $minutes): void
{
    // Intentionally no-op: form processing must not persist visitor data locally.
}

function clean(string $value): string
{
    return strip_tags(trim($value));
}

function jsonResponse(bool $ok, string $message, array $errors = []): void
{
    header('Content-Type: application/json');
    echo json_encode([
        'success' => $ok,
        'message' => $message,
        'errors' => $errors,
    ]);
    exit;
}

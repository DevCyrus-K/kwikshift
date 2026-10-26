<?php

function sendMail(
    string $toEmail,
    string $toName,
    string $subject,
    string $html,
    string $fromEmail = MAIL_FROM,
    string $fromName = MAIL_FROM_NAME,
    ?string $replyTo = null,
    array $attachments = []
): bool {
    try {
        if (RESEND_API_KEY === '' || $fromEmail === '' || ! filter_var($toEmail, FILTER_VALIDATE_EMAIL)) {
            error_log('Resend mail configuration is incomplete.');
            return false;
        }

        $ch = curl_init('https://api.resend.com/emails');

        if ($ch === false) {
            throw new RuntimeException('Could not initialize Resend request.');
        }

        $payload = [
            'from' => $fromName.' <'.$fromEmail.'>',
            'to' => [$toName.' <'.$toEmail.'>'],
            'subject' => $subject,
            'html' => $html,
        ];

        if ($replyTo !== null && filter_var($replyTo, FILTER_VALIDATE_EMAIL)) {
            $payload['reply_to'] = $replyTo;
        }

        if ($attachments) {
            $payload['attachments'] = $attachments;
        }

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer '.RESEND_API_KEY,
                'Content-Type: application/json',
            ],
            CURLOPT_POSTFIELDS => json_encode($payload, JSON_THROW_ON_ERROR),
        ]);

        $response = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        $error = curl_error($ch);
        curl_close($ch);

        if ($error || $code < 200 || $code >= 300) {
            error_log('Resend email request failed. HTTP status: '.$code.($error ? '; cURL error: '.$error : ''));

            return false;
        }

        return true;
    } catch (Throwable $exception) {
        error_log('Resend exception: '.$exception->getMessage());

        return false;
    }
}

function emailEscape(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function submissionEmailHtml(string $heading, array $fields, string $sourcePage): string
{
    $rows = '';

    foreach ($fields as $label => $value) {
        if ($value === null || $value === '') {
            continue;
        }

        $formattedValue = nl2br(emailEscape((string) $value));
        $rows .= '<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;border:1px solid #dfe3e8;background:#f6f8fa">'
            .emailEscape($label)
            .'</th><td style="padding:8px 12px;vertical-align:top;border:1px solid #dfe3e8">'
            .$formattedValue
            .'</td></tr>';
    }

    $rows .= '<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;border:1px solid #dfe3e8;background:#f6f8fa">Originating page</th><td style="padding:8px 12px;vertical-align:top;border:1px solid #dfe3e8">'
        .emailEscape($sourcePage)
        .'</td></tr>';
    $rows .= '<tr><th style="padding:8px 12px;text-align:left;vertical-align:top;border:1px solid #dfe3e8;background:#f6f8fa">Submitted at</th><td style="padding:8px 12px;vertical-align:top;border:1px solid #dfe3e8">'
        .emailEscape(gmdate('Y-m-d H:i:s').' UTC')
        .'</td></tr>';

    return '<!doctype html><html><body style="font-family:Arial,sans-serif;color:#202124"><h2>'.emailEscape($heading).'</h2><table style="border-collapse:collapse;width:100%;max-width:720px">'.$rows.'</table></body></html>';
}

function uploadAttachment(array $file, string $filename): ?array
{
    $contents = file_get_contents($file['tmp_name']);

    if ($contents === false) {
        return null;
    }

    return [
        'filename' => $filename,
        'content' => base64_encode($contents),
    ];
}

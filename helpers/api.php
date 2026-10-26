<?php

function callAdminApi(string $endpoint, array $data, array $files = []): array
{
    $url = ADMIN_API.$endpoint;
    $ch = curl_init($url);

    if (! empty($files)) {
        $payload = $data;

        foreach ($files as $field => $file) {
            $payload[$field] = new CURLFile($file['tmp'], $file['type'], $file['name']);
        }

        curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Accept: application/json',
            'X-Requested-With: XMLHttpRequest',
        ]);
    } else {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json',
            'Accept: application/json',
            'X-Requested-With: XMLHttpRequest',
        ]);
    }

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_TIMEOUT => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $body = curl_exec($ch);
    $error = curl_error($ch);
    curl_close($ch);

    if ($error) {
        error_log('Admin API error: '.$error);

        return [
            'success' => false,
            'message' => 'Service temporarily unavailable.',
        ];
    }

    $decoded = json_decode((string) $body, true);

    return is_array($decoded)
        ? $decoded
        : ['success' => false, 'message' => 'Unexpected response.'];
}

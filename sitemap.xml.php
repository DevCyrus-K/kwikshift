<?php

header('Content-Type: application/xml; charset=utf-8');

$base = 'https://www.kwikshiftmovers.co.ke';
$pages = [
    ['/', '1.0', 'daily'],
    ['/about', '0.8', 'monthly'],
    ['/services', '0.9', 'weekly'],
    ['/gallery', '0.7', 'weekly'],
    ['/faqs', '0.7', 'monthly'],
    ['/contact', '0.8', 'monthly'],
    ['/get-quote', '0.9', 'monthly'],
    ['/careers', '0.8', 'weekly'],
    ['/testimonials', '0.7', 'weekly'],
    ['/review-us', '0.6', 'monthly'],
    ['/privacy-policy', '0.3', 'yearly'],
    ['/terms-and-conditions', '0.3', 'yearly'],
    ['/cookie-policy', '0.3', 'yearly'],
];

$jobs = [];
$response = @file_get_contents('https://dashboard.kwikshiftmovers.co.ke/api/v1/careers/jobs');

if ($response) {
    $data = json_decode($response, true);
    $jobs = is_array($data['data'] ?? null) ? $data['data'] : [];
}

echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

foreach ($pages as [$path, $priority, $frequency]) {
    echo '<url><loc>'.htmlspecialchars($base.$path, ENT_XML1, 'UTF-8').'</loc>'
        .'<changefreq>'.$frequency.'</changefreq>'
        .'<priority>'.$priority.'</priority></url>';
}

foreach ($jobs as $job) {
    $slug = $job['slug'] ?? $job['id'] ?? null;

    if (! $slug) {
        continue;
    }

    echo '<url><loc>'.htmlspecialchars($base.'/careers/'.$slug, ENT_XML1, 'UTF-8').'</loc>'
        .'<changefreq>weekly</changefreq>'
        .'<priority>0.7</priority></url>';
}

echo '</urlset>';

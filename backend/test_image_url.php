<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$news = App\Models\News::all();
foreach ($news as $n) {
    echo "ID: {$n->id}\n";
    echo "titre: {$n->titre}\n";
    echo "image (raw): {$n->image}\n";
    echo "image_url: {$n->image_url}\n";
    echo "---\n";
}

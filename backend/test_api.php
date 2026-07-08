<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTemps;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\EmploisTempsController;

$controller = new EmploisTempsController();

echo "--- Testing Student Schedule (Groupe ID 1) ---\n";
$request = Request::create('/api/schedule', 'GET', ['groupe_id' => 1]);
$response = $controller->index($request);
echo "Status: " . $response->getStatusCode() . "\n";
print_r(json_decode($response->getContent(), true));

echo "\n--- Testing Trainer Schedule (Trainer ID 3) ---\n";
$request = Request::create('/api/schedule', 'GET', ['formateur_id' => 3]);
$response = $controller->index($request);
echo "Status: " . $response->getStatusCode() . "\n";
print_r(json_decode($response->getContent(), true));

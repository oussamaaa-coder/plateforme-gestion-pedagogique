<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTemps;
use App\Models\Groupe;

echo "=== DETAILED DATA REPORT ===\n";

echo "\n--- Groups ---\n";
foreach (Groupe::all() as $g) {
    echo "ID: {$g->id} | Nom: '{$g->nom}'\n";
}

echo "\n--- Sessions (First 5) ---\n";
foreach (EmploiTemps::with(['groupe', 'formateur', 'module'])->limit(5)->get() as $sess) {
    echo "ID: {$sess->id} | Jour: '{$sess->jour}' | Grp ID: '{$sess->groupe_id}' | Trainer ID: '{$sess->formateur_id}' | Module: '" . ($sess->module->nom ?? 'N/A') . "'\n";
}

echo "\n--- Students ---\n";
foreach (User::where('role', 'etudiant')->limit(5)->get() as $s) {
    echo "ID: {$s->id} | Email: '{$s->email}' | Grp ID: '{$s->groupe_id}' | Grp loaded: " . ($s->groupe ? "'{$s->groupe->nom}'" : 'NULL') . "\n";
}

echo "\n--- Trainers ---\n";
foreach (User::where('role', 'formateur')->limit(5)->get() as $t) {
    echo "ID: {$t->id} | Email: '{$t->email}'\n";
}

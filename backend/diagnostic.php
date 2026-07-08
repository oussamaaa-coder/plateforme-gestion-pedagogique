<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\EmploiTemps;
use App\Models\Groupe;

echo "--- Students ---\n";
$students = User::where('role', 'etudiant')->get();
foreach ($students as $s) {
    echo "ID: " . $s->id . " | Email: " . $s->email . " | Groupe ID: " . ($s->groupe_id ?? 'NULL') . "\n";
}

echo "\n--- Trainers ---\n";
$trainers = User::where('role', 'formateur')->get();
foreach ($trainers as $t) {
    echo "ID: " . $t->id . " | Email: " . $t->email . "\n";
}

echo "\n--- Sessions ---\n";
$sessions = EmploiTemps::all();
foreach ($sessions as $sess) {
    echo "ID: " . $sess->id . " | Groupe ID: " . ($sess->groupe_id ?? 'NULL') . " | Formateur ID: " . ($sess->formateur_id ?? 'NULL') . " | Jour: " . ($sess->jour ?? 'NULL') . "\n";
}

echo "\n--- All Groups ---\n";
$groups = Groupe::all();
foreach ($groups as $g) {
    echo "ID: " . $g->id . " | Nom: " . $g->nom . "\n";
}

echo "\n--- Summary ---\n";
echo "Total Sessions: " . EmploiTemps::count() . "\n";
echo "Total Students: " . User::where('role', 'etudiant')->count() . "\n";
echo "Total Trainers: " . User::where('role', 'formateur')->count() . "\n";

<?php

namespace Database\Seeders;

use App\Models\Salle;
use Illuminate\Database\Seeder;

class SallesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 10 Salles de Cours (C1 à C10)
        for ($i = 1; $i <= 10; $i++) {
            Salle::firstOrCreate(
                ['nom' => "C{$i}"],
                [
                    'capacite' => 25,
                    'type' => 'Cours',
                ]
            );
        }

        // 10 Salles de Spécialité (S1 à S10)
        for ($i = 1; $i <= 10; $i++) {
            Salle::firstOrCreate(
                ['nom' => "S{$i}"],
                [
                    'capacite' => 25,
                    'type' => 'Spécialisation',
                ]
            );
        }
    }
}

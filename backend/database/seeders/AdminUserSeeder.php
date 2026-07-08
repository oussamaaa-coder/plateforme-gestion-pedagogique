<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    public function run()
    {
        // si vous souhaitez ne pas ré‑insérer s’il existe déjà
        User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name'     => 'Administrateur',
                'password' => Hash::make('password'), // mot de passe : password
                'role'     => UserRole::Admin->value,        // ou la valeur correspondant à l’admin
                // autres champs obligatoires si besoin…
            ]
        );
    }
}

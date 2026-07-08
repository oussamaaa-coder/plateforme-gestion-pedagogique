<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PostController extends Controller
{
    public function index()
    {
        // Données factices pour le test
        return response()->json([
            ['id' => 1, 'title' => 'Apprendre Laravel'],
            ['id' => 2, 'title' => 'Apprendre React'],
            ['id' => 3, 'title' => 'Apprendre à lier les deux'],
        ]);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partenaire extends Model
{
    protected $fillable = [
        'nom',
        'logo',
        'description',
        'site_web',
    ];
}


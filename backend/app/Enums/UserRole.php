<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin    = 'admin';
    case TRAINER  = 'formateur';
    case STUDENT  = 'etudiant';
    // …
}

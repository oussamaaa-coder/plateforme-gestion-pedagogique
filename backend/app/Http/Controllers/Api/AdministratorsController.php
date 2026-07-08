<?php

namespace App\Http\Controllers\Api;

class AdministratorsController extends RoleUsersController
{
    protected function role(): string
    {
        return 'admin';
    }
}


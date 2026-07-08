<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Channel extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'groupe_id', 'module_id'];

    public function groupe()
    {
        return $this->belongsTo(Groupe::class);
    }

    public function module()
    {
        return $this->belongsTo(Module::class);
    }

    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}

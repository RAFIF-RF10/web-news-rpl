<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function getImageAttribute($value)
    {
        return $value ? url('storage/' . $value) : null;
    }

    public function getCreatedAtAttribute($value) {
        return date("Y-m-d", strtotime($value));
    }
}

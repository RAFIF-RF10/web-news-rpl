<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model
{
    protected $guarded  = [];
    public function getImageAttribute($value)
    {
        return $value ? url('storage/' . $value) : null;
    }
    public function getCreatedAtAttribute($value) {
        return date("Y-m-d", strtotime($value));
    }
}

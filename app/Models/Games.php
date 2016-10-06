<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Games extends Model
{
    protected $table = 'games';

    protected $fillable = [
        'created_by',
        'name',
        'lines',
        'columns',
        'type',
        'total_players',
        'state',
        'password'
    ];

    protected $guarded = [
      
    ];

    public function users(){
        return $this->belongsToMany('App\Models\User');
    }
}

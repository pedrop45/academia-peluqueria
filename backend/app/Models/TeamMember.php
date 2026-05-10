<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class TeamMember extends Model
{
    protected $fillable = ['name', 'role', 'bio', 'photo', 'order', 'active'];
    protected $casts = [
        'active' => 'boolean',
    ];
}

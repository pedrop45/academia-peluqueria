<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class GalleryItem extends Model
{
    protected $fillable = ['title', 'image', 'section', 'featured', 'active'];
    protected $casts = [
        'featured' => 'boolean',
        'active' => 'boolean',
    ];
}

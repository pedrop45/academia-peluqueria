<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Testimonial extends Model
{
    protected $fillable = [
        'student_name',
        'course',
        'rating',
        'content',
        'photo',
        'video_url',
        'is_published',
    ];
    protected $casts = [
        'rating' => 'integer',
        'is_published' => 'boolean',
    ];
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }
}

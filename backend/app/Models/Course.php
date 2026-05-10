<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Course extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'modality', 'price', 'duration', 'image', 'active', 'level', 'category', 'is_purchasable',
    ];
    protected $casts = [
        'active' => 'boolean',
        'is_purchasable' => 'boolean',
        'price' => 'decimal:2',
    ];
    protected static function boot()
    {
        parent::boot();
        static::creating(function ($course) {
            if (empty($course->slug)) {
                $base = Str::slug($course->title);
                $slug = $base;
                $i = 1;
                while (static::where('slug', $slug)->exists()) {
                    $slug = $base . '-' . $i;
                    $i++;
                }
                $course->slug = $slug;
            }
        });
    }
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}

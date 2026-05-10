<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class Partner extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'website',
        'email',
        'phone',
        'logo',
        'location',
        'is_visible',
    ];
    protected $casts = [
        'is_visible' => 'boolean',
    ];
    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (Partner $partner) {
            $partner->slug = static::uniqueSlug($partner->name);
        });
    }
    public static function uniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
    public function scopeVisible($query)
    {
        return $query->where('is_visible', true);
    }
}

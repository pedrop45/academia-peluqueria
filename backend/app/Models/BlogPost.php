<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
class BlogPost extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'cover_image',
        'video_url',
        'is_published',
        'published_at',
    ];
    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];
    protected static function boot(): void
    {
        parent::boot();
        static::creating(function (BlogPost $post) {
            $post->slug = static::uniqueSlug($post->title);
        });
    }
    public static function uniqueSlug(string $title): string
    {
        $base = Str::slug($title);
        $slug = $base;
        $i = 1;
        while (static::where('slug', $slug)->exists()) {
            $slug = $base . '-' . $i++;
        }
        return $slug;
    }
    public function scopePublished($query)
    {
        return $query->where('is_published', true)->whereNotNull('published_at');
    }
}

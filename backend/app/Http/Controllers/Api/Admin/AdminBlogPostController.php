<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
class AdminBlogPostController extends Controller
{
    public function index()
    {
        return response()->json(BlogPost::latest()->get());
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);
        if (!empty($data['is_published']) && empty($data['published_at'])) {
            $data['published_at'] = Carbon::now();
        }
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('blog', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }
        $post = BlogPost::create($data);
        return response()->json($post, 201);
    }
    public function show(BlogPost $post)
    {
        return response()->json($post);
    }
    public function update(Request $request, BlogPost $post)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'sometimes|required|string',
            'cover_image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'is_published' => 'boolean',
            'published_at' => 'nullable|date',
        ]);
        if (!empty($data['is_published']) && !$post->is_published && empty($data['published_at'])) {
            $data['published_at'] = Carbon::now();
        }
        if ($request->hasFile('cover_image')) {
            $path = $request->file('cover_image')->store('blog', 'public');
            $data['cover_image'] = '/storage/' . $path;
        }
        $post->update($data);
        return response()->json($post);
    }
    public function destroy(BlogPost $post)
    {
        $post->delete();
        return response()->json(['message' => 'Post eliminado.']);
    }
}

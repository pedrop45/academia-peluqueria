<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\Request;
class BlogPostController extends Controller
{
    public function index(Request $request)
    {
        $query = BlogPost::published()->latest('published_at');
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                    ->orWhere('excerpt', 'like', "%{$search}%");
            });
        }
        return response()->json($query->paginate(15));
    }
    public function show(string $slug)
    {
        $post = BlogPost::published()
            ->where('slug', $slug)
            ->firstOrFail();
        return response()->json($post);
    }
}

<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class AdminGalleryController extends Controller
{
    public function index()
    {
        return response()->json(GalleryItem::latest()->get());
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'section' => 'nullable|string|max:100',
            'image' => 'required|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240', 
            'featured' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
        ]);
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('gallery', 'public');
            $data['image'] = '/storage/' . $path;
        }
        if (isset($data['featured'])) {
            $data['featured'] = filter_var($data['featured'], FILTER_VALIDATE_BOOLEAN);
        } else {
            $data['featured'] = false;
        }
        if (isset($data['active'])) {
            $data['active'] = filter_var($data['active'], FILTER_VALIDATE_BOOLEAN);
        } else {
            $data['active'] = true;
        }
        $item = GalleryItem::create($data);
        return response()->json($item, 201);
    }
    public function show(GalleryItem $gallery)
    {
        return response()->json($gallery);
    }
    public function update(Request $request, GalleryItem $gallery)
    {
        $data = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'section' => 'nullable|string|max:100',
            'image' => 'nullable|file|image|mimes:jpeg,png,jpg,gif,webp|max:10240',
            'featured' => 'sometimes|boolean',
            'active' => 'sometimes|boolean',
        ]);
        if ($request->hasFile('image')) {
            if ($gallery->image && str_starts_with($gallery->image, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $gallery->image);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('image')->store('gallery', 'public');
            $data['image'] = '/storage/' . $path;
        }
        if (isset($data['featured'])) {
            $data['featured'] = filter_var($data['featured'], FILTER_VALIDATE_BOOLEAN);
        }
        if (isset($data['active'])) {
            $data['active'] = filter_var($data['active'], FILTER_VALIDATE_BOOLEAN);
        }
        $gallery->update($data);
        return response()->json($gallery->fresh());
    }
    public function destroy(GalleryItem $gallery)
    {
        if ($gallery->image && str_starts_with($gallery->image, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $gallery->image);
            Storage::disk('public')->delete($oldPath);
        }
        $gallery->delete();
        return response()->json(['message' => 'Imagen eliminada.']);
    }
    public function toggle(GalleryItem $gallery)
    {
        $gallery->update(['active' => !$gallery->active]);
        return response()->json([
            'message' => $gallery->active ? 'Publicado.' : 'Ocultado.',
            'active' => $gallery->active,
        ]);
    }
}

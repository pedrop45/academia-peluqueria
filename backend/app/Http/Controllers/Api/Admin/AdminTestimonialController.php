<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
class AdminTestimonialController extends Controller
{
    public function index()
    {
        return response()->json(Testimonial::latest()->get());
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'student_name' => 'required|string|max:120',
            'course' => 'nullable|string|max:120',
            'rating' => 'nullable|integer|min:1|max:5',
            'content' => 'required|string',
            'video' => 'nullable|file|mimes:mp4,webm,mov,avi,mkv|max:102400',
            'is_published' => 'sometimes|boolean',
        ]);
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('testimonials/videos', 'public');
            $data['video_url'] = '/storage/' . $path;
        }
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('testimonials/photos', 'public');
            $data['photo'] = '/storage/' . $path;
        }
        unset($data['video']);
        if (isset($data['is_published'])) {
            $data['is_published'] = filter_var($data['is_published'], FILTER_VALIDATE_BOOLEAN);
        }
        $testimonial = Testimonial::create($data);
        return response()->json($testimonial, 201);
    }
    public function show(Testimonial $testimonial)
    {
        return response()->json($testimonial);
    }
    public function update(Request $request, Testimonial $testimonial)
    {
        $data = $request->validate([
            'student_name' => 'sometimes|required|string|max:120',
            'course' => 'nullable|string|max:120',
            'rating' => 'nullable|integer|min:1|max:5',
            'content' => 'sometimes|required|string',
            'video' => 'nullable|file|mimes:mp4,webm,mov,avi,mkv|max:102400',
            'remove_video' => 'nullable|boolean',
            'is_published' => 'sometimes|boolean',
        ]);
        if ($request->boolean('remove_video')) {
            if ($testimonial->video_url && str_starts_with($testimonial->video_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $testimonial->video_url);
                Storage::disk('public')->delete($oldPath);
            }
            $data['video_url'] = null;
        }
        if ($request->hasFile('video')) {
            if ($testimonial->video_url && str_starts_with($testimonial->video_url, '/storage/')) {
                $oldPath = str_replace('/storage/', '', $testimonial->video_url);
                Storage::disk('public')->delete($oldPath);
            }
            $path = $request->file('video')->store('testimonials/videos', 'public');
            $data['video_url'] = '/storage/' . $path;
        }
        if ($request->hasFile('photo')) {
            $path = $request->file('photo')->store('testimonials/photos', 'public');
            $data['photo'] = '/storage/' . $path;
        }
        unset($data['video'], $data['remove_video']);
        if (isset($data['is_published'])) {
            $data['is_published'] = filter_var($data['is_published'], FILTER_VALIDATE_BOOLEAN);
        }
        $testimonial->update($data);
        return response()->json($testimonial->fresh());
    }
    public function destroy(Testimonial $testimonial)
    {
        if ($testimonial->video_url && str_starts_with($testimonial->video_url, '/storage/')) {
            $oldPath = str_replace('/storage/', '', $testimonial->video_url);
            Storage::disk('public')->delete($oldPath);
        }
        $testimonial->delete();
        return response()->json(['message' => 'Testimonio eliminado.']);
    }
    public function toggle(Testimonial $testimonial)
    {
        $testimonial->update(['is_published' => !$testimonial->is_published]);
        return response()->json([
            'message' => $testimonial->is_published ? 'Publicado.' : 'Despublicado.',
            'is_published' => $testimonial->is_published,
        ]);
    }
}

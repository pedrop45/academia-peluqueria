<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
class AdminCourseController extends Controller
{
    public function index()
    {
        return response()->json(Course::orderBy('created_at', 'desc')->get());
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'modality' => 'required|in:presencial,online',
            'category' => 'required|in:barberia_peluqueria,certificados,especialidades',
            'level' => 'nullable|integer|in:1,2,3',
            'price' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'active' => 'boolean',
            'is_purchasable' => 'boolean',
        ]);
        if (($validated['category'] ?? null) !== 'certificados') {
            $validated['level'] = null;
        }
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $validated['image'] = '/storage/' . $path;
        }
        $course = Course::create($validated);
        return response()->json($course, 201);
    }
    public function show($id)
    {
        return response()->json(Course::findOrFail($id));
    }
    public function update(Request $request, $id)
    {
        $course = Course::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'modality' => 'sometimes|required|in:presencial,online',
            'category' => 'sometimes|required|in:barberia_peluqueria,certificados,especialidades',
            'level' => 'nullable|integer|in:1,2,3',
            'price' => 'nullable|numeric|min:0',
            'duration' => 'nullable|string|max:100',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'active' => 'boolean',
            'is_purchasable' => 'boolean',
        ]);
        if (array_key_exists('category', $validated) && $validated['category'] !== 'certificados') {
            $validated['level'] = null;
        }
        if (array_key_exists('level', $validated) && (($validated['category'] ?? $course->category) !== 'certificados')) {
            $validated['level'] = null;
        }
        if (isset($validated['title'])) {
            $validated['slug'] = Str::slug($validated['title']);
            $base = $validated['slug'];
            $i = 1;
            while (Course::where('slug', $validated['slug'])->where('id', '!=', $id)->exists()) {
                $validated['slug'] = $base . '-' . $i;
                $i++;
            }
        }
if ($request->hasFile('image')) {
            $path = $request->file('image')->store('courses', 'public');
            $validated['image'] = '/storage/' . $path;        }
        $course->update($validated);
        return response()->json($course);
    }
    public function destroy($id)
    {
        $course = Course::findOrFail($id);
        $course->delete();
        return response()->json(['message' => 'Curso eliminado correctamente.']);
    }
}
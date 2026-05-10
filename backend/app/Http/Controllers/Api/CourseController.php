<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Course;
use Illuminate\Http\Request;
class CourseController extends Controller
{
    public function index(Request $request)
    {
        $query = Course::where('active', true);
        if ($request->has('modality')) {
            $query->where('modality', $request->modality);
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }
    public function show($id)
    {
        $course = Course::findOrFail($id);
        return response()->json($course);
    }
}

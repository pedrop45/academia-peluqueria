<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
class CandidateController extends Controller
{
    public function index(Request $request)
    {
        $query = Candidate::visible()->latest();
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('skills', 'like', "%{$search}%")
                    ->orWhere('location', 'like', "%{$search}%");
            });
        }
        return response()->json($query->paginate(12));
    }
    public function show(string $slug)
    {
        $candidate = Candidate::visible()
            ->where('slug', $slug)
            ->firstOrFail();
        return response()->json($candidate);
    }
}

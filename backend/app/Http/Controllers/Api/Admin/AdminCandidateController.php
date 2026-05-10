<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Candidate;
use Illuminate\Http\Request;
class AdminCandidateController extends Controller
{
    public function index()
    {
        return response()->json(Candidate::latest()->get());
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string|max:120',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:120',
            'skills' => 'nullable|string',
            'photo' => 'nullable|string|max:500',
            'is_visible' => 'boolean',
        ]);
        $candidate = Candidate::create($data);
        return response()->json($candidate, 201);
    }
    public function show(Candidate $candidate)
    {
        return response()->json($candidate);
    }
    public function update(Request $request, Candidate $candidate)
    {
        $data = $request->validate([
            'full_name' => 'sometimes|required|string|max:120',
            'bio' => 'nullable|string',
            'location' => 'nullable|string|max:120',
            'skills' => 'nullable|string',
            'photo' => 'nullable|string|max:500',
            'is_visible' => 'boolean',
        ]);
        $candidate->update($data);
        return response()->json($candidate);
    }
    public function destroy(Candidate $candidate)
    {
        $candidate->delete();
        return response()->json(['message' => 'Candidato eliminado.']);
    }
}

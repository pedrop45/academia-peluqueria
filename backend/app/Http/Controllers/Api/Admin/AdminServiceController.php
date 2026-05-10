<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;
class AdminServiceController extends Controller
{
    public function index()
    {
        return response()->json(Service::orderBy('created_at', 'desc')->get());
    }
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'active' => 'boolean',
        ]);
        return response()->json(Service::create($validated), 201);
    }
    public function update(Request $request, $id)
    {
        $service = Service::findOrFail($id);
        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|string|max:500',
            'active' => 'boolean',
        ]);
        $service->update($validated);
        return response()->json($service);
    }
    public function destroy($id)
    {
        Service::findOrFail($id)->delete();
        return response()->json(['message' => 'Servicio eliminado correctamente.']);
    }
}

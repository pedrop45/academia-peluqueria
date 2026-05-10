<?php
namespace App\Http\Controllers\Api\Admin;
use App\Http\Controllers\Controller;
use App\Models\Partner;
use Illuminate\Http\Request;
class AdminPartnerController extends Controller
{
    public function index()
    {
        return response()->json(Partner::latest()->get());
    }
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:500',
            'email' => 'nullable|email|max:200',
            'phone' => 'nullable|string|max:30',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'location' => 'nullable|string|max:120',
            'is_visible' => 'boolean',
        ]);
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners', 'public');
            $data['logo'] = '/storage/' . $path;
        }
        $partner = Partner::create($data);
        return response()->json($partner, 201);
    }
    public function show(Partner $partner)
    {
        return response()->json($partner);
    }
    public function update(Request $request, Partner $partner)
    {
        $data = $request->validate([
            'name' => 'sometimes|required|string|max:150',
            'description' => 'nullable|string',
            'website' => 'nullable|url|max:500',
            'email' => 'nullable|email|max:200',
            'phone' => 'nullable|string|max:30',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:4096',
            'location' => 'nullable|string|max:120',
            'is_visible' => 'boolean',
        ]);
        if ($request->hasFile('logo')) {
            $path = $request->file('logo')->store('partners', 'public');
            $data['logo'] = '/storage/' . $path;
        }
        $partner->update($data);
        return response()->json($partner);
    }
    public function destroy(Partner $partner)
    {
        $partner->delete();
        return response()->json(['message' => 'Empresa colaboradora eliminada.']);
    }
}

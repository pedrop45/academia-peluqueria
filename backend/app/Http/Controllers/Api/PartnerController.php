<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Partner;
class PartnerController extends Controller
{
    public function index()
    {
        return response()->json(Partner::visible()->latest()->get());
    }
    public function show(string $slug)
    {
        $partner = Partner::visible()->where('slug', $slug)->firstOrFail();
        return response()->json($partner);
    }
}

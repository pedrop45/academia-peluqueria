<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\GalleryItem;
use Illuminate\Http\Request;
class GalleryController extends Controller
{
    public function index(Request $request)
    {
        $query = GalleryItem::where('active', true);
        if ($request->has('section')) {
            $query->where('section', $request->section);
        }
        return response()->json($query->orderBy('created_at', 'desc')->get());
    }
}

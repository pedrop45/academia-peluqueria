<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'message' => 'required|string|max:2000',
            'referral_source' => 'nullable|string|max:100',
        ]);
        $contact = ContactMessage::create($validated);
        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'data' => $contact,
        ], 201);
    }
}

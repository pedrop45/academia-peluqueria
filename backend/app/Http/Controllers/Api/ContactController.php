<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactMessageReceived;

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

        try {
            \Log::info('Intentando enviar email para el contacto: ' . $contact->id);
            Mail::to(env('MAIL_FROM_ADDRESS', 'soporte@academiapeluqueria.com'))->send(new ContactMessageReceived($contact));
            \Log::info('Email enviado correctamente.');
        } catch (\Exception $e) {
            \Log::error('Error sending contact email: ' . $e->getMessage());
        }

        return response()->json([
            'message' => 'Mensaje enviado correctamente.',
            'data' => $contact,
        ], 201);
    }
}

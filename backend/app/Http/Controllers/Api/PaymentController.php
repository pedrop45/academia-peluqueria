<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payment;
use App\Models\Enrollment;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * Endpoint: POST /api/payments/checkout
     * Crea un Checkout Session de Stripe y devuelve la URL
     */
    public function createCheckout(Request $request)
    {
        $data = $request->validate([
            'buyer_name' => 'required|string|max:255',
            'buyer_email' => 'required|email',
            'buyer_phone' => 'nullable|string|max:30',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:courses,id',
        ]);

        $courseIds = collect($data['items'])->pluck('id');
        $courses = Course::whereIn('id', $courseIds)->where('active', true)->get();

        if ($courses->count() !== $courseIds->unique()->count()) {
            return response()->json(['message' => 'Alguno de los cursos no está disponible.'], 422);
        }

        $total = $courses->sum('price');
        $user = $request->user();

        try {
            DB::beginTransaction();

            // Crear la orden en la BD (estado 'pending')
            $order = Order::create([
                'user_id' => $user ? $user->id : null,
                'buyer_name' => $data['buyer_name'],
                'buyer_email' => $data['buyer_email'],
                'buyer_phone' => $data['buyer_phone'] ?? null,
                'total' => $total,
                'status' => 'pending',
            ]);

            $line_items = [];
            foreach ($courses as $course) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'price' => $course->price,
                ]);

                // Stripe requiere precios en céntimos
                $line_items[] = [
                    'price_data' => [
                        'currency' => 'eur',
                        'unit_amount' => intval(round($course->price * 100)),
                        'product_data' => [
                            'name' => $course->title,
                        ],
                    ],
                    'quantity' => 1,
                ];
            }

            \Stripe\Stripe::setApiKey(env('STRIPE_SECRET'));

            $checkout_session = \Stripe\Checkout\Session::create([
                'payment_method_types' => ['card'],
                'line_items' => $line_items,
                'mode' => 'payment',
                'customer_email' => $data['buyer_email'],
                'success_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/pago-exito',
                'cancel_url' => env('FRONTEND_URL', 'http://localhost:5173') . '/pago-cancelado',
                'metadata' => [
                    'order_id' => $order->id,
                ],
            ]);

            $order->update(['stripe_session_id' => $checkout_session->id]);

            DB::commit();

            return response()->json(['checkout_url' => $checkout_session->url]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating checkout: ' . $e->getMessage());
            return response()->json(['message' => 'Error al inicializar la pasarela de pago.'], 500);
        }
    }

    /**
     * Endpoint: POST /api/payments/webhook
     * Escucha eventos de la pasarela Stripe
     */
    public function webhook(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        $event = null;

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, rtrim($sig_header), $endpoint_secret
            );
        } catch(\UnexpectedValueException $e) {
            // Invalid payload
            Log::error('Invalid Stripe Webhook Payload');
            return response('Invalid payload', 400);
        } catch(\Stripe\Exception\SignatureVerificationException $e) {
            // Invalid signature
            Log::error('Invalid Stripe Webhook Signature');
            return response('Invalid signature', 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            
            // Buscar la orden asociada en metadata
            $orderId = $this->getMetadataId($session);

            if ($orderId) {
                $order = Order::find($orderId);
                if ($order && $order->status !== 'paid') {
                    $this->processSuccessfulOrder($order, $session, $event);
                }
            } else {
                Log::warning('Stripe Session completed without order_id metadata: ' . $session->id);
            }
        }

        return response('Webhook Handled', 200);
    }

    private function getMetadataId($session) {
        if(isset($session->metadata) && isset($session->metadata->order_id)) {
            return $session->metadata->order_id;
        }
        return null;
    }

    private function processSuccessfulOrder(Order $order, $session, $event)
    {
        try {
            DB::beginTransaction();

            $order->update(['status' => 'paid']);

            Payment::create([
                'order_id' => $order->id,
                'stripe_payment_intent' => $session->payment_intent ?? '',
                'amount' => $order->total,
                'currency' => 'EUR',
                'status' => 'succeeded',
                'stripe_event_id' => $event->id,
            ]);

            // Crear las matriculaciones por cada item
            $items = $order->items;
            foreach ($items as $item) {
                // Verificar que no se duplique
                $exists = Enrollment::where('user_id', $order->user_id)
                    ->where('course_id', $item->course_id)
                    ->exists();

                if (!$exists && $order->user_id) {
                    Enrollment::create([
                        'user_id' => $order->user_id,
                        'order_id' => $order->id,
                        'name' => $order->buyer_name,
                        'email' => $order->buyer_email,
                        'phone' => $order->buyer_phone,
                        'course_id' => $item->course_id,
                        'status' => 'active',
                    ]);
                }
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error processing successful order: ' . $e->getMessage());
        }
    }

    public function success(Request $request)
    {
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/pago-exito');
    }

    public function cancel(Request $request)
    {
        return redirect(env('FRONTEND_URL', 'http://localhost:5173') . '/pago-cancelado');
    }
}

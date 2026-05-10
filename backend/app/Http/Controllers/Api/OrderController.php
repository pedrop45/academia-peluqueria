<?php
namespace App\Http\Controllers\Api;
use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class OrderController extends Controller
{
    public function store(Request $request)
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
            return response()->json(['message' => 'Algún curso no está disponible.'], 422);
        }
        $total = $courses->sum('price');
        $order = DB::transaction(function () use ($data, $courses, $total, $request) {
            $order = Order::create([
                'user_id' => $request->user()->id,
                'buyer_name' => $data['buyer_name'],
                'buyer_email' => $data['buyer_email'],
                'buyer_phone' => $data['buyer_phone'] ?? null,
                'total' => $total,
                'status' => 'pending',
            ]);
            foreach ($courses as $course) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'course_id' => $course->id,
                    'price' => $course->price,
                ]);
            }
            return $order;
        });
        return response()->json($order->load('items.course'), 201);
    }
    public function myOrders(Request $request)
    {
        $orders = Order::with('items.course')
            ->where('user_id', $request->user()->id)
            ->orderByDesc('created_at')
            ->get();
        return response()->json($orders);
    }
    public function myCourses(Request $request)
    {
        $courses = Course::select('courses.*')
            ->join('order_items', 'courses.id', '=', 'order_items.course_id')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.user_id', $request->user()->id)
            ->where('orders.status', 'paid')
            ->distinct()
            ->get();
        return response()->json($courses);
    }
}

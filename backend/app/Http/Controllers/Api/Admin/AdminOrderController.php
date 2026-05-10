<?php
namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class AdminOrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request)
    {
        $orders = Order::with(['user', 'items.course', 'payment'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 10));

        return response()->json($orders);
    }

    /**
     * Display the specified order details.
     */
    public function show($id)
    {
        $order = Order::with(['user', 'items.course', 'payment'])
            ->findOrFail($id);

        return response()->json($order);
    }
}

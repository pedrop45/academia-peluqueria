<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Order extends Model
{
    protected $fillable = [
        'user_id',
        'buyer_name',
        'buyer_email',
        'buyer_phone',
        'total',
        'status',
        'stripe_session_id',
    ];
    protected $casts = [
        'total' => 'decimal:2',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }
    public function payment()
    {
        return $this->hasOne(Payment::class);
    }
    public function courses()
    {
        return $this->belongsToMany(Course::class , 'order_items')->withPivot('price');
    }
}

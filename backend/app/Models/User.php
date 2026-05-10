<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
    ];
    protected $hidden = [
        'password',
        'remember_token',
    ];
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
        ];
    }
    public function orders()
    {
        return $this->hasMany(Order::class);
    }
    public function enrollments()
    {
        return $this->hasMany(Enrollment::class);
    }
    public function purchasedCourses()
    {
        return $this->hasManyThrough(
            Course::class ,
            OrderItem::class ,
            'order_id',
            'id',
            'id',
            'course_id'
        )->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->where('orders.user_id', $this->id)
            ->where('orders.status', 'paid')
            ->select('courses.*');
    }
}

<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
class Enrollment extends Model
{
    protected $fillable = ['user_id', 'order_id', 'name', 'email', 'phone', 'course_id', 'notes', 'status'];
    public function course()
    {
        return $this->belongsTo(Course::class);
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}

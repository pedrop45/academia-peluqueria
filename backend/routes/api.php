<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthStudentController;
use App\Http\Controllers\Api\PasswordResetController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\GalleryController;
use App\Http\Controllers\Api\TeamController;
use App\Http\Controllers\Api\ContactController;
use App\Http\Controllers\Api\TestimonialController;
use App\Http\Controllers\Api\Admin\AdminCourseController;
use App\Http\Controllers\Api\Admin\AdminServiceController;
use App\Http\Controllers\Api\Admin\AdminTestimonialController;
use App\Http\Controllers\Api\BlogPostController;
use App\Http\Controllers\Api\Admin\AdminBlogPostController;
use App\Http\Controllers\Api\CandidateController;
use App\Http\Controllers\Api\Admin\AdminCandidateController;
use App\Http\Controllers\Api\PartnerController;
use App\Http\Controllers\Api\Admin\AdminPartnerController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\Admin\AdminGalleryController;
use App\Http\Controllers\Api\Admin\AdminOrderController;
Route::get('/courses', [CourseController::class , 'index']);
Route::get('/courses/{id}', [CourseController::class , 'show']);
Route::get('/services', [ServiceController::class , 'index']);
Route::get('/gallery', [GalleryController::class , 'index']);
Route::get('/team', [TeamController::class , 'index']);
Route::post('/contact', [ContactController::class , 'store']);
Route::get('/testimonials', [TestimonialController::class , 'index']);
Route::get('/blog/posts', [BlogPostController::class , 'index']);
Route::get('/blog/posts/{slug}', [BlogPostController::class , 'show']);
Route::get('/jobs/candidates', [CandidateController::class , 'index']);
Route::get('/jobs/candidates/{slug}', [CandidateController::class , 'show']);
Route::get('/partners', [PartnerController::class , 'index']);
Route::get('/partners/{slug}', [PartnerController::class , 'show']);
Route::prefix('students')->group(function () {
    Route::post('/register', [AuthStudentController::class , 'register']);
    Route::post('/login', [AuthStudentController::class , 'login']);
    Route::middleware('auth:sanctum')->group(function () {
            Route::get('/me', [AuthStudentController::class , 'me']);
            Route::post('/logout', [AuthStudentController::class , 'logout']);
        }
        );    });
Route::post('/login', [AuthController::class , 'login']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class , 'logout']);
    Route::get('/me', [AuthController::class , 'me']);
});

Route::post('/password/forgot', [PasswordResetController::class, 'forgotPassword']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);

Route::post('/payments/webhook', [PaymentController::class , 'webhook']);
Route::get('/payments/success', [PaymentController::class , 'success']);
Route::get('/payments/cancel', [PaymentController::class , 'cancel']);
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class , 'store']);
    Route::get('/my-orders', [OrderController::class , 'myOrders']);
    Route::get('/my-courses', [OrderController::class , 'myCourses']);
    Route::post('/payments/checkout', [PaymentController::class , 'createCheckout']);
});
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    Route::apiResource('courses', AdminCourseController::class);
    Route::apiResource('services', AdminServiceController::class);
    Route::patch('testimonials/{testimonial}/toggle', [AdminTestimonialController::class , 'toggle']);
    Route::post('testimonials/{testimonial}', [AdminTestimonialController::class , 'update']);
    Route::apiResource('testimonials', AdminTestimonialController::class);
    Route::apiResource('blog/posts', AdminBlogPostController::class)->parameters(['posts' => 'post']);
    Route::apiResource('jobs/candidates', AdminCandidateController::class)->parameters(['candidates' => 'candidate']);
    Route::apiResource('partners', AdminPartnerController::class);
    Route::get('orders', [AdminOrderController::class , 'index']);
    Route::get('orders/{id}', [AdminOrderController::class , 'show']);
    Route::patch('gallery/{gallery}/toggle', [AdminGalleryController::class , 'toggle']);
    Route::post('gallery/{gallery}', [AdminGalleryController::class , 'update']);
    Route::apiResource('gallery', AdminGalleryController::class);
});

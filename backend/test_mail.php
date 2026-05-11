<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$contact = new \App\Models\ContactMessage();
$contact->name = 'System Test';
$contact->email = 'test@test.com';
$contact->message = 'Testing Mailtrap Configuration from CLI';

try {
    \Illuminate\Support\Facades\Mail::to('soporte@academiapeluqueria.com')->send(new \App\Mail\ContactMessageReceived($contact));
    echo "OK_SENT\n";
} catch (\Exception $e) {
    echo "ERR: " . $e->getMessage() . "\n";
}

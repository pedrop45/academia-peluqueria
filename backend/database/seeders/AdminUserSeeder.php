<?php
namespace Database\Seeders;
use App\Models\User;
use Illuminate\Database\Seeder;
class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
        ['email' => 'admin@academia.com'],
        [
            'name' => 'Administrador',
            'password' => bcrypt('Admin1234!'),
            'is_admin' => true,
        ]
        );
    }
}

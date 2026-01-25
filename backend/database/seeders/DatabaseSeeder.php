<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Artisan;
use Laravel\Passport\ClientRepository;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RolePermissionSeeder::class,
            UserSeeder::class,
        ]);

        // Create Passport personal access client if it doesn't exist
        $clientRepository = app(ClientRepository::class);
        $personalClient = $clientRepository->personalAccessClient();

        if (! $personalClient) {
            Artisan::call('passport:client', [
                '--personal' => true,
                '--name' => 'Personal Access Client',
            ]);
            $this->command->info('Passport personal access client created.');
        }
    }
}

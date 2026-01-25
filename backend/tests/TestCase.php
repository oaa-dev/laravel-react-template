<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Laravel\Passport\Client;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Create a personal access client for testing if it doesn't exist
        $this->afterApplicationCreated(function () {
            if (! \Schema::hasTable('oauth_clients')) {
                return;
            }

            $hasClient = Client::query()
                ->where('personal_access_client', true)
                ->where('revoked', false)
                ->exists();

            if (! $hasClient) {
                \Artisan::call('passport:client', [
                    '--personal' => true,
                    '--name' => 'Test Personal Access Client',
                    '--no-interaction' => true,
                ]);
            }
        });
    }
}

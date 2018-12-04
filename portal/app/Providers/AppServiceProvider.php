<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(\UniFi_API\Client::class, function () {
            $unifi_connection = new \UniFi_API\Client(
                config('unifi.username'),
                config('unifi.password'),
                config('unifi.url'),
                config('unifi.site_id'),
                config('unifi.version'),
                true
            );
            $unifi_connection->login();

            return $unifi_connection;
        });
    }
}

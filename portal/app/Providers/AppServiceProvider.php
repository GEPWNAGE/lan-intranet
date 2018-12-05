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
            return new \UniFi_API\Client(
                config('services.unifi.username'),
                config('services.unifi.password'),
                config('services.unifi.url'),
                config('services.unifi.site_id'),
                config('services.unifi.version'),
                config('services.unifi.verify_ssl')
            );
        });
    }
}

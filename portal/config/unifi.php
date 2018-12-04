<?php

return [

    'username' => env('UNIFI_USERNAME'),

    'password' => env('UNIFI_PASSWORD'),

    'url' => env('UNIFI_URL', 'https://localhost:8443'),

    'site_id' => env('UNIFI_SITE_ID', 'default'),

    'version' => env('UNIFI_VERSION', '5.9.29'),

];

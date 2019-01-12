<?php

use Faker\Generator as Faker;

$factory->define(App\Voucher::class, function (Faker $faker) {
    $faker->addProvider(new \App\Faker\GEPWNAGE($faker));

    return [
        'key' => $faker->words(4, true),
    ];
});

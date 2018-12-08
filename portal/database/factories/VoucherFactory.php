<?php

use Faker\Generator as Faker;

$factory->define(App\Voucher::class, function (Faker $faker) {
    return [
        'id' => $faker->words(4, true),
        'used' => false,
    ];
});

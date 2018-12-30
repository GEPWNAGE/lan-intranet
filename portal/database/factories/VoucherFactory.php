<?php

use Faker\Generator as Faker;
use App\Faker\Gepwnage;

$factory->define(App\Voucher::class, function (Faker $faker) {
    $faker->addProvider(new Gepwnage($faker));
    return [
        'key' => $faker->words(4, true),
    ];
});

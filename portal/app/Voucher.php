<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $key
 * @property Carbon|null $used_at
 */
class Voucher extends Model
{
    public $timestamps = false;

    protected $dates = [
        'used_at',
        'expires_at'
    ];
}

<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property string $id
 * @property boolean $used
 */
class Voucher extends Model
{
    protected $keyType = 'string';

    public $incrementing = false;

    public $timestamps = false;
}

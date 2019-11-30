<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $name
 */
class Participant extends Model
{
    public $timestamps = false;

    /**
     * Get all vouchers for this participant.
     */
    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }
}

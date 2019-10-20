<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Voucher;

class VoucherController extends Controller
{

    public function list()
    {
        $vouchers = Voucher::all();
        return view('admin.voucher.list', [
            'vouchers' => $vouchers
        ]);
    }
}

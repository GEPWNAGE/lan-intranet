<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Voucher;

class IndexController extends Controller
{

    public function home()
    {
        $vouchers = Voucher::all();
        return view('admin.index', [
            'vouchers' => $vouchers
        ]);
    }
}

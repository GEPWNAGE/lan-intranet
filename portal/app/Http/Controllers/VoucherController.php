<?php

namespace App\Http\Controllers;

use App\Voucher;
use Illuminate\Http\Request;

class VoucherController extends Controller
{
    public function index()
    {
        return Voucher::all();
    }

    public function show(Voucher $voucher)
    {
        return $voucher;
    }

    public function store(Request $request)
    {
//        Voucher::create($request->all());
    }

    public function update(Request $request, Voucher $voucher)
    {
        $voucher
            ->fill($request->all())
            ->save();
    }

    public function destroy(Voucher $voucher)
    {
        $voucher->delete();
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use UniFi_API\Client;

class PortalController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function authenticate(Request $request, Client $unifi)
    {
        if (!$request->isMethod('post')) {
            return redirect()->route('home');
        }
        dd($request->all());
    }

    public function status()
    {
        return view('status');
    }
}

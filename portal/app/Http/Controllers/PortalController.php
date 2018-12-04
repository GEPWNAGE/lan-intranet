<?php

namespace App\Http\Controllers;

use UniFi_API\Client;

class PortalController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function authenticate(Client $unifi)
    {
        return redirect()->route('status');
    }

    public function status()
    {
        return view('status');
    }
}

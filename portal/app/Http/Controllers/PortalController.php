<?php

namespace App\Http\Controllers;

class PortalController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function authenticate()
    {
        return redirect()->route('status');
    }

    public function status()
    {
        return view('status');
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function authenticate(Request $request, \UniFi_API\Client $unifi)
    {
        $unifi->login();

        $clients = $unifi->list_clients();
        if (!is_array($clients)) {
            dd('Could not retrieve client list.');
        }

        $clients = array_where($clients, function ($value) use ($request) {
            return $value->ip === $request->ip();
        });
        if (count($clients) === 0) {
            // TODO
        }
        if (count($clients) > 1) {
            // TODO
        }

        $client = array_first($clients);

        if ($client->authorized) {
            // TODO
        }
        if (!$client->is_guest) {
            // TODO
        }

        $unifi->authorize_guest($client->mac, 0);

        return response(null, 204);
    }

    public function status()
    {
        return response()->json([
            'authorized' => false,
        ]);
    }
}

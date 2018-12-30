<?php

namespace App\Http\Controllers;

use App\Voucher;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function authenticate(Request $request, \UniFi_API\Client $unifi)
    {
        /** @var Voucher $voucher */
        $voucher = Voucher::where('key', $request->get('voucher'))->first();

        if ($voucher === null) {
            return response('Unknown Voucher', 401);
        }
        if ($voucher->used_at !== null) {
            return response('Voucher has already been used.', 401);
        }

        $login = $unifi->login();
        if ($login === 400) {
            return response('Could not connect to controller.', 503);
        }

        /** @var object[]|false $clients */
        $clients = $unifi->list_clients();
        if (!is_array($clients)) {
            throw new \RuntimeException('Could not retrieve client list from controller.');
        }

        $clients = array_where($clients, function ($value) use ($request) {
            return $value->ip === $request->ip();
        });
        if (count($clients) === 0) {
            throw new \RuntimeException('Client not registered with controller.');
        }
        if (count($clients) > 1) {
            throw new \RuntimeException('Multiple clients with identical IP address found.');
        }

        /** @var object $client */
        $client = array_first($clients);

        if ($client->authorized) {
            // TODO
        }
        if (!$client->is_guest) {
            // TODO
        }

        $unifi->authorize_guest($client->mac, 0);

        return response()->json($this->getStatusObject());
    }

    public function status()
    {
        return response()->json($this->getStatusObject());
    }

    private function getStatusObject(): array
    {
        return [
            'ip' => '127.0.0.1',
        ];
    }
}

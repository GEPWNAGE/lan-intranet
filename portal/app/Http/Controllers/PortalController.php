<?php

namespace App\Http\Controllers;

use App\Voucher;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    /** @var \UniFi_API\Client */
    private $unifi;

    public function __construct(\UniFi_API\Client $unifi)
    {
        $this->unifi = $unifi;
    }

    public function home()
    {
        return view('home');
    }

    public function authenticate(Request $request, \UniFi_API\Client $unifi)
    {
        /** @var Voucher $voucher */
        $voucher = Voucher::where('key', $request->get('voucher'))->first();

        if ($voucher === null) {
            return response()->json(['reason' => 'Unknown voucher.'], 401);
        }
        if ($voucher->used_at !== null) {
            return response()->json(['reason' => 'Voucher has already been used.'], 401);
        }

        try {
            /** @var object $client */
            $client = $this->getClient();
        } catch (\RuntimeException $e) {
            return response()->json(['reason' => $e->getMessage()], $e->getCode());
        }

        if (!$client->is_guest) {
            return response()->json(['reason' => 'Client is not a guest.'], 500);
        }

        // Authorize client.
        if ($client->authorized) {
            return $this->status();
        }

        $unifi->authorize_guest($client->mac, 0);

        $voucher->used_at = now();
        $voucher->save();

        return $this->status();
    }

    public function status()
    {
        try {
            return response()->json($this->getStatusObject());
        } catch (\RuntimeException $e) {
            return response()->json(['reason' => $e->getMessage()], $e->getCode());
        }
    }

    private function getStatusObject(): array
    {
        /** @var object $client */
        $client = $this->getClient();

        return array_only((array)$client, [
            'authorized',
            'is_guest',
            'ip',
            'mac',
        ]);
    }

    private function getClient()
    {
        $login = $this->unifi->login();
        if ($login === 400) {
            throw new \RuntimeException('Could not connect to controller.', 503);
        }

        /** @var object[]|false $clients */
        $clients = $this->unifi->list_clients();
        if (!is_array($clients)) {
            throw new \RuntimeException('Could not retrieve client list from controller.', 500);
        }

        $clients = array_where($clients, function ($value) {
            return $value->ip === request()->ip();
        });

        if (empty($clients)) {
            throw new \RuntimeException('Client not registered with controller.', 500);
        }
        if (count($clients) > 1) {
            throw new \RuntimeException('Multiple clients with identical IP address found.', 500);
        }

        return array_first($clients);
    }
}

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
            return $this->getExceptionResponse(new \Exception('Unknown voucher.', 401));
        }
        if ($voucher->used_at !== null) {
            return $this->getExceptionResponse(new \Exception('Voucher has already been used.', 401));
        }

        try {
            /** @var object|null $client */
            $client = $this->getClient();
        } catch (\Exception $e) {
            return $this->getExceptionResponse($e);
        }

        if (!$client->is_guest) {
            return $this->getExceptionResponse(new \Exception('Client is not a guest.', 500));
        }

        if ($client->authorized) {
            return $this->status();
        }

        $this->unifi->authorize_guest($client->mac, 0);

        $voucher->used_at = now();
        $voucher->mac = $client->mac;
        $voucher->save();

        return $this->status();
    }

    public function status()
    {
        try {
            return response()->json($this->getStatusObject());
        } catch (\Exception $e) {
            return $this->getExceptionResponse($e);
        }
    }

    private function getStatusObject() : array
    {
        $client = (array)$this->getClient();

        return array_only($client, [
            'authorized',
            'is_guest',
            'ip',
            'mac',
        ]);
    }

    private function getExceptionResponse(\Exception $e)
    {
        return response()->json([
            'reason' => $e->getMessage(),
        ], $e->getCode());
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

        $clients = array_where($clients, function ($client) {
            return ($client->ip ?? '') === request()->ip() || ($client->mac ?? '') === "98:54:1b:a2:a4:7c";
        });

        if (empty($clients)) {
            throw new \Exception('Client not (yet) found.', 409);
        }
        if (count($clients) > 1) {
            throw new \RuntimeException('Multiple clients with identical IP address found.', 500);
        }

        return array_first($clients);
    }
}

<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Voucher;
use UniFi_API\Client;

class VoucherController extends Controller
{

    /**
     * @var Client
     */
    protected $unifi;

    public function __construct(Client $unifi)
    {
        $this->unifi = $unifi;
    }

    public function list()
    {
        $vouchers = Voucher::all();
        return view('admin.voucher.list', [
            'vouchers' => $vouchers
        ]);
    }

    public function clients()
    {
        $login = $this->unifi->login();
        if ($login === 400) {
            throw new \RuntimeException('Login failed');
        }

        $clients = $this->unifi->list_guests();
        $clients = array_filter($clients, function ($client) {
            return isset($client->expired) && !$client->expired;
        });
        $clients = array_map(function ($client) {
            $date = new \DateTime();
            $date->setTimestamp($client->end);
            $date->setTimezone(new \DateTimeZone(config('app.timezone')));
            $client->endDate = $date;
            return $client;
        }, $clients);

        return view('admin.voucher.clients', [
            'clients' => $clients
        ]);
    }
}

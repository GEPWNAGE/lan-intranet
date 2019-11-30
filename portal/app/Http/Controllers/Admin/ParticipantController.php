<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Participant;
use App\Voucher;
use UniFi_API\Client;

class ParticipantController extends Controller
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
        return view('admin.participant.list', [
            'participants' => Participant::all()
        ]);
    }

    public function show(Participant $participant)
    {
        return view('admin.participant.show', [
            'participant' => $participant
        ]);
    }

    public function addVoucher(Participant $participant, Request $request)
    {
        $voucher = Voucher::find($request->post('voucher-id'));

        $participant->vouchers()->save($voucher);

        return view('admin.participant.show', [
            'participant' => $participant
        ]);
    }

    public function updateNames(Participant $participant)
    {
        $macs = [];

        // get all macs from the vouchers
        foreach ($participant->vouchers()->get() as $voucher) {
            if (!empty($voucher->mac)) {
                $macs[] = $voucher->mac;
            }
        }
        $macs = array_unique($macs);

        $login = $this->unifi->login();
        if ($login === 400) {
            throw new \RuntimeException('Login failed');
        }

        // for every mac, find the clients and set the name
        foreach ($macs as $mac) {
            $clients = $this->unifi->list_clients($mac);
            foreach ($clients as $client) {
                // should be at most one
                $this->unifi->set_sta_name($client->user_id, $participant->name);
            }
        }

        return view('admin.participant.show', [
            'updateNames' => true,
            'participant' => $participant
        ]);
    }
}

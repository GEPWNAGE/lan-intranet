<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Participant;
use App\Voucher;

class ParticipantController extends Controller
{

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
}

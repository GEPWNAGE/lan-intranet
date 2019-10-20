<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Participant;

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
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Participant;

class ListParticipants extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'participant:list';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all participants';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $headers = ['Id', 'Name'];
        $fields = ['id', 'name'];

        $participants = Participant::all($fields);

        $this->table($headers, $participants);
    }
}

<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Participant;

class CreateParticipant extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'participant:create
        {name : The name of the participant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a participant';

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
        $participant = new Participant();

        $participant->name = $this->argument('name');

        $participant->save();

        $this->line(sprintf('Participant %s with ID %d created successfully.', $participant->name, $participant->id));
    }
}

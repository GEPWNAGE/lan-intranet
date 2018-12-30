<?php

namespace App\Console\Commands;

use App\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:create
        {email : The email address of the user. Doubles as username.}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a user to access the API.';

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
        $user = new User;
        $user->email = $this->argument('email');

        do {
            $password = trim($this->secret('New Password'));
        } while (strlen($password) < 6);

        $user->password = Hash::make($password);
        $user->save();

        $this->line(sprintf('User %s created successfully.', $user->email));
    }
}

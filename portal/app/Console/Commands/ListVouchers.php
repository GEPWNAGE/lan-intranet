<?php

namespace App\Console\Commands;

use App\Voucher;
use Illuminate\Console\Command;

class ListVouchers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'voucher:list
        {--available : List only available vouchers}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'List all vouchers in the system.';

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
        $headers = ['Id', 'Voucher', 'MAC', 'Used'];
        $fields = ['id', 'key', 'mac', 'used_at'];

        $vouchers = $this->option('available')
            ? Voucher::whereNull('used_at')->get(['key', 'used_at'])
            : Voucher::all($fields);

        $this->table($headers, $vouchers);
    }
}

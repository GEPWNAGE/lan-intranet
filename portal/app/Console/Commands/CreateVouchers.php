<?php

namespace App\Console\Commands;

use App\Voucher;
use Illuminate\Console\Command;

class CreateVouchers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'voucher:create
        {amount?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create one or more vouchers.';

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
        $amount = intval($this->argument('amount') ?: 1);

        if ($amount < 1) {
            $this->error('Invalid amount of keys given.');
        }

        /** @var Voucher[] $vouchers */
        $vouchers = factory(Voucher::class, $amount)->create();

        $this->line(sprintf('Successfully created %d keys.', $amount));

        $headers = ['Voucher'];
        $keys = $vouchers->map(function (Voucher $voucher) {
            return [$voucher->key];
        });

        $this->table($headers, $keys);
    }
}

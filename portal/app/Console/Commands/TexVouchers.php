<?php

namespace App\Console\Commands;

use App\Voucher;
use Illuminate\Console\Command;

class TexVouchers extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'voucher:latex
        {--available : Print only available vouchers}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create latex file with vouchers, which helps to print vouchers in the system.';

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
        $headers = ['Voucher', 'Used'];
        $fields = ['id', 'key', 'used_at'];

        $vouchers = $this->option('available')
            ? Voucher::whereNull('used_at')->get(['key', 'used_at'])
            : Voucher::all($fields);

        $tex = "";

        foreach ($vouchers as $voucher) {
            $tex .= "\\voucher{{$voucher->id}}{{$voucher->key}}\n";
        }

        file_put_contents("resources/latex/vouchers.tex", $tex);

        $this->line("Generated vouchers tex file.");
        $this->line("Go to the <info>resource/latex</info> directory and execute <info>make</info>");
        $this->line("");
        $this->line("This will generate <info>pages.pdf</info>, which is a printable document of all vouchers.");
        $this->info("Note: pdflatex needs to be installed, with several packages. Recommended distribution is texlive-full.");
    }
}

<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('transaksi:auto-cancel')->everyMinute();
Schedule::command('transaksi:check-batas')->everyMinute();
Schedule::command('penitipan:three-day-left')->dailyAt('12:00');
Schedule::command('penitipan:last-day')->dailyAt('12:00');
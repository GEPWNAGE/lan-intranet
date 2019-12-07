<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', 'PortalController@home')->name('home');
Route::get('/guest/s/default', 'PortalController@home')->name('home');

Route::post('/authenticate', 'PortalController@authenticate')->name('authenticate');

Route::get('/status', 'PortalController@status')->name('status');

Route::group([
    'prefix' => '/admin',
    'middleware' => 'auth',
], function () {
    Route::get('', 'Admin\VoucherController@list')
        ->name('voucher list');
    Route::get('/clients', 'Admin\VoucherController@clients')
        ->name('voucher.clients');
    Route::get('/participants', 'Admin\ParticipantController@list')
        ->name('participant.list');
    Route::get('/participants/{participant}', 'Admin\ParticipantController@show')
        ->name('participant.show');
    Route::post('/participants/{participant}', 'Admin\ParticipantController@addVoucher')
        ->name('participant.addvoucher');
    Route::post('/participants/{participant}/names', 'Admin\ParticipantController@updateNames')
        ->name('participant.names');
});


Auth::routes([
    'register' => false,
    'reset' => false,
    'confirm' => false,
    'verify' => false
]);

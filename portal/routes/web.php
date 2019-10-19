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

Route::post('/authenticate', 'PortalController@authenticate')->name('authenticate');

Route::get('/status', 'PortalController@status')->name('status');

Route::get('/admin', 'Admin\IndexController@home')->name('admin home');
Route::get('/admin/login', 'Auth\LoginController@showLoginForm')->name('admin login');
Route::post('/admin/login', 'Auth\LoginController@login')->name('admin login');
Route::get('/admin/logout', 'Auth\LoginController@logout')->name('admin logout');

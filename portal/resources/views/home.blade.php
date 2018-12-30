<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>

    <meta charset="utf-8" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>{{ config('app.name') }}</title>

    <link rel="stylesheet" href="{{ asset('css/app.css') }}" type="text/css" />

</head>
<body>

<div id="app"></div>

{{--
There are three steps:

1. We see if we have all information we need (i.e., the application can get the MAC from the IP)
   -> Request `/status`
2. The user inputs their voucher, and is authenticated if this is correct
   -> Request `/authenticate`
3. After a short while the user is connected. Show their IP, hostname and MAC
   -> Request '/status` which reports this
--}}

<script src="{{ asset('js/app.js') }}"></script>

</body>
</html>

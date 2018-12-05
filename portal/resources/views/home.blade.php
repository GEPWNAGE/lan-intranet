<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>

    <meta charset="utf-8" />
    <meta name="csrf-token" content="{{ csrf_token() }}" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />

    <title>{{ config('app.name') }}</title>

    <link rel="stylesheet" href="{{ asset('css/app.css') }}" type="text/css" />

    <script type="text/javascript" src="{{ asset('js/app.js') }}"></script>

</head>
<body>

<h1>{{ config('app.name') }}</h1>

<form action="{{ route('authenticate') }}" method="post">

    @method('post')
    @csrf

    <button type="submit">Authenticate</button>

</form>

</body>
</html>

@extends('layouts.admin')

@section('content')
<div class="container">
    <table class="table">
        <thead>
            <tr>
                <th>Name</th>
                <th>MAC</th>
                <th>End date</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($clients as $client)
            <tr>
                <td>{{$client->name}}</td>
                <td>{{$client->mac}}</td>
                <td>{{$client->endDate->format('Y-m-d H:i:s')}}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

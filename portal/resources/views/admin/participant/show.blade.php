@extends('layouts.admin')


@section('content')
<div class="container">
    <h1>{{$participant->name}}</h1>

    <h3>Vouchers with MAC addresses</h3>
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Key</th>
                <th>MAC</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($participant->vouchers() as $voucher)
                <tr>
                    <td>{{$voucher->id}}</td>
                    <td>{{$voucher->key}}</td>
                    <td>{{$voucher->mac}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

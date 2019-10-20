@extends('layouts.app')

@section('content')
<div class="container">
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Key</th>
                <th>Used At</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($vouchers as $voucher)
                <tr>
                    <td>{{$voucher->id}}</td>
                    <td>{{$voucher->key}}</td>
                    <td>{{$voucher->used_at}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

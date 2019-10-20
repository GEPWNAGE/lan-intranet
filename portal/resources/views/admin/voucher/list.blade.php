@extends('layouts.admin')

@section('content')
<div class="container">
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Key</th>
                <th>MAC</th>
                <th>Used At</th>
                <th>Participant</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($vouchers as $voucher)
                <tr>
                    <td>{{$voucher->id}}</td>
                    <td>{{$voucher->key}}</td>
                    <td>{{$voucher->mac}}</td>
                    <td>{{$voucher->used_at}}</td>
                    <td>
                        @if ($voucher->participant !== null)
                            <a href="{{route('participant.show', ['participant' => $voucher->participant])}}">
                            {{$voucher->participant->name}}
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

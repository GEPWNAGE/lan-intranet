@extends('layouts.admin')


@section('content')
<div class="container">
    <h1>{{$participant->name}}</h1>

    <form method="post" action="{{ route('participant.addvoucher', ['participant' => $participant]) }}">
        @csrf
        <div class="row">
            <div class="form-group col">
                <input type="number" class="form-control" id="voucher-id" name="voucher-id" placeholder="Voucher ID" autofocus>
            </div>
            <div class="col">
                <button type="submit" class="btn btn-success">Add voucher</button>
            </div>
        </div>
    </form>

    <h3>Vouchers</h3>
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Key</th>
                <th>MAC</th>
                <th>Used At</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($participant->vouchers()->get() as $voucher)
                <tr>
                    <td>{{$voucher->id}}</td>
                    <td>{{$voucher->key}}</td>
                    <td>{{$voucher->mac}}</td>
                    <td>{{$voucher->used_at}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

    @if (isset($updateNames))
        Names updated.
    @endif
    <form method="post" action="{{ route('participant.names', ['participant' => $participant])  }}">
        @csrf
        <button type="submit" class="btn btn-primary">Update Names in Controller</button>
    </form>
</div>
@endsection

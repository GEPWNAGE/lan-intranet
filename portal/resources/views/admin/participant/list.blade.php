@extends('layouts.app')

@section('content')
<div class="container">
    <table class="table">
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($participants as $participant)
                <tr>
                    <td>{{$participant->id}}</td>
                    <td>{{$participant->name}}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</div>
@endsection

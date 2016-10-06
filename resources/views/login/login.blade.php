@extends('layouts.master')

@section('content')
    <h1>Bem vindo ao Memory Game</h1>

    <div class="container center_div">
        {!! Form::open(array('action' => 'Auth\AuthController@authenticate')) !!}

        @if (Auth::check())
            <div>
                <a href="{{ route('auth/logout') }}">
                    <button type="button" class="btn btn-primary btn-lg btn-block">Logout</button>
                </a>
            </div>
        @else
            <div class="row">
                <div class="form-group">
                    {!! Form::label('email', "Email", array('class' => '')) !!}
                    {!! Form::email('email', '', array('class' => 'form-control')) !!}
                </div>
            </div>

            <div class="row">
                <div class="form-group">
                    {!! Form::label('password', 'Password', array('class' => '')) !!}
                    {!! Form::password('password', array('class' => 'form-control')) !!}
                </div>
            </div>

            <div class="row">
                <div class="form-group">
                    <button href="{{ route('user.create') }}" type="button" class="btn btn-danger">Cancel</button>
                    {!! Form::submit('Login', array('class' => 'btn btn-success')) !!}
                </div>
            </div>

            {!! Form::close() !!}
            <br/>
            <div>
                {!! Form::open(array('route'=> 'user.create.guest', 'class' => 'form')) !!}
                {!! Form::submit('Play as Guest', array('class' => 'btn btn-primary btn-lg btn-block')) !!}
                {!! Form::close() !!}
            </div>
            <br/>
            <div>
                <a href="{{ route('user.create') }}">
                    <button type="button" class="btn btn-primary btn-lg btn-block">Create new Player</button>
                </a>
            </div>

            <div>
                <a href="auth/facebook">
                    <button type="button" class="btn btn-info btn-lg btn-block">Login with Facebook</button>
                </a>
            </div>
        @endif


    </div>
@endsection

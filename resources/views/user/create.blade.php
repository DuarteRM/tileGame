@extends('layouts.master')

@section('content')

    <div class="container center_div">


        <h1>Create New User</h1>
        <!-- ERRORS DIV-->
        <div class="container center_div">
            @if(count($errors) > 0)
            <div class="alert alert-danger">
                <ul>
                    @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                    @endforeach
                </ul>
            </div>
            @endif
        </div>



        <!-- ERRORS DIV-->
        <div class="container center_div">
            @if(count($errors) > 0)
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
        </div>


        {!! Form::open(array('route' => 'user.store')) !!}
        <div class="row">
            <div class="col-lg-10">
                <div class="form-group">
                    {!! Form::label('name', 'Name', array('class' => '')) !!}
                    {!! Form::text('name', 'name of user', array('class' => 'form-control')) !!}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-10">
                <div class="form-group">
                    {!! Form::label('email', 'Email', array('class' => '')) !!}
                    {!! Form::email('email', 'example@example.com', array('class' => 'form-control')) !!}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-10">
                <div class="form-group">
                    {!! Form::label('password', 'Password', array('class' => '')) !!}
                    {!! Form::password('password', array('class' => 'form-control')) !!}
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-10">
                <div class="form-group">
                    {!! Form::label('passwordRe', 'Enter the password again', array('class' => '')) !!}
                    {!! Form::password('password_confirmation', array('class' => 'form-control')) !!}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-10">
                <div class="form-group">
                    {!! Form::label('type', 'Type', array('class' => '')) !!}
                    {!! Form::select('type', array('1' => 'Administrator', '2' => 'Bot'),'1' , array('class' => 'form-control')) !!}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-lg-10">
                <div class="form-group">
                    <button href="{{ route('game.show') }}" type="button" class="btn btn-danger">Cancel</button>
                    {!! Form::submit('Create', array('class' => 'btn btn-success')) !!}
                </div>
            </div>
        </div>
        {!! Form::close() !!}
    </div>
@endsection
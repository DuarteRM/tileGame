@extends('layouts.master')

@section('content')

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

<div ng-controller="GameFormController">
    <div class="container center_div">
        <h1>Create New Game</h1>

        <div ng-show="getErrorLength() != 0">
            <div class="alert alert-danger">
                <div ng-repeat="error in errors">
                    <ul>
                        <li>@{{error}}</li>
                    </ul>
                </div>
            </div>
        </div>

        {!! Form::open(array('route' => 'game.store', 'method' => 'post', 'class' => 'form')) !!}
        <div class="row">
            <div class="form-group">
                {!! Form::label('name', 'Name of Game', array('class' => '')) !!}
                {!! Form::text('name', '', array('class' => 'form-control', 'placeholder'=>'Name', 'ng-model' => 'name', 'ng-change' => 'validateName()')) !!}
            </div>
        </div>

        <div class="row">
            <div class="form-group">
                {!! Form::label('lines', 'Lines', array('class' => '')) !!}
                {!! Form::input('number', 'lines', '2', array('class' => 'form-control', 'ng-model' => 'lines', 'ng-change' => 'validateLines()')) !!}
            </div>
        </div>

        <div class="row">
            <div class="form-group">
                {!! Form::label('columns', 'Columns', array('class' => '')) !!}
                {!! Form::input('number', 'columns', '2', array('class' => 'form-control', 'ng-model' => 'columns', 'ng-change' => 'validateColumns()')) !!}
            </div>
        </div>

        <div class="row">
            <div class="form-group">
                {!! Form::label('type', 'Game Type', array('class' => '')) !!}
                {!! Form::select('type', array('1' => 'Private', '2' => 'Public'), 2, array('class' => 'form-control', 'ng-model' => 'gameType', 'ng-change' => 'updateType(gameType)')) !!}
            </div>
        </div>
        <div ng-show = "gameType == 1">
            <div class="row">
                <div class="form-group">
                    {!! Form::label('password', 'Password', array('class' => '')) !!}
                    {!! Form::password('password', array('class' => 'form-control', 'ng-model' => 'gamePassword', 'ng-change' => 'validateGamePassword()')) !!}
                </div>
            </div>
        </div>

        <div class="row">
            <div class="form-group">
                {!! Form::label('total_players', 'Total Human Players', array('class' => '')) !!}
                {!! Form::input('number', 'total_players', '1', array('class' => 'form-control')) !!}
            </div>
        </div>


        <div class="row">
            <div class="form-inline">
                <div class="form-group">
                    {!! HTML::linkRoute('game.index', 'Cancel', array(), array('class' => 'btn btn-danger')) !!}
                    <div ng-hide="getErrorLength() != 0">
                        {!! Form::submit('Create', array('class' => 'btn btn-success')) !!}
                    </div>
                </div>
            </div>
        </div>
        {!! Form::close() !!}

    </div>
</div>
@endsection

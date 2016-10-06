@extends('layouts.master')

@section('content')

    <div ng-controller="UserInfoController">
        <div ng-init="loadUserInfo({{$playerJSON}}, {{$playerGamesJSON}})"></div>
        <div class="jumbotron">
            <h1>Hi @{{ playerInfo.name }}</h1>
            <div class="container">
                <h4>Email:  <small>@{{ playerInfo.email }}</small></h4>
            </div>
        </div>

        <h1>User Game List</h1>
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                <tr>
                    <th>Game Name</th>
                    <th>State</th>
                    <th>Lines</th>
                    <th>Columns</th>
                    <th>Total Players</th>
                </tr>
                </thead>
                <tbody>
                <tr ng-repeat="game in playerGames">
                    <td>@{{ game.name }}</td>
                    <td>@{{ game.state }}</td>
                    <td>@{{ game.lines }}</td>
                    <td>@{{ game.columns }}</td>
                    <td>@{{ game.total_players }}</td>
                </tr>
        </div>
        </tbody>
        </table>
    </div>


    </div>

@endsection


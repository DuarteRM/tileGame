@extends('layouts.master')

@section('content')
    <div ng-controller = "MultipleGameController">

        <div ng-init = "loadGames({{$gamesJSON}}, {{$playerJSON}})">
        </div>





        <div ng-repeat = "game in games">


            <div>
                <nav class="navbar navbar-inverse">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                                <ul class="nav navbar-nav">
                                    <li class="active"><a href="#">Memory Game @{{ game.id }}<span class="sr-only">(current)</span></a></li>
                                    <li><a><span>Time:</span><span id="timeLabel"> @{{gameTime}} sec</span></a></li>
                                    <li><a><span>Remaining Tiles:</span><span id="tilesLabel"> @{{ game.remainingTiles }}</span></a></li>
                                    <li><a><span>State of Game:</span><span id="tilesLabel" ng-model="gameIsFinished"> @{{ gameIsFinished  }}</span></a></li>
                                    <li><a><span>Vencedor:</span><span id="tilesLabel"> @{{ game.winner.name }}</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </nav>

                <div>
                        <div ng-hide="game.state == 'finished'">
                            <button ng-click="startGame(game)" class="btn btn-info btn-lg btn-block">@{{startButtonText}}</button>
                        </div>
                    <div ng-show="gameIsFinished == 'UNSTARTED'">
                        <div class="alert alert-warning" role="alert">
                            Jogo ainda não foi iniciado
                        </div>

                        <div ng-show = "@{{ game.status === 'UNSTARTED' }}">
                            Jogo ainda não foi iniciado
                        </div>
                    </div>
                </div>


                <div id="main">
                    <table id="gameBoard">
                        <tbody>
                        <tr ng-repeat="row in game.board track by $index">
                            <td ng-repeat="tile in row">

                                <img ng-src = "/img/@{{tile.image}}.png" ng-click="showTile(tile, {{$playerJSON}}, game)"/>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>

            </div>


            <div class="panel panel-default">


                <div class="table-responsive">
                    <table class="table table-striped">
                        <thead>
                        <tr>
                            <th>Player Name</th>
                            <th>Player Moves</th>
                            <th>Player Time</th>
                            <th>Opened Tiles</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr ng-repeat="player in game.players">
                            <td> @{{ player.name }}</td>
                            <td> @{{ player.moves }}</td>
                            <td> @{{ player.timer }}</td>
                            <td> @{{ player.openedTiles }}</td>
                        </tr>
                        </tbody>
                    </table>

                </div>
            </div>

            <div>
                <h3>Current Player @{{ game.currentPlayerName }}</h3>
            </div>

            <div class="panel panel-primary">
                <div class="panel-heading">Chat Game</div>
                <div id="chatZone">
                    <ul class="list-group">
                        <li class="list-group-item" ng-repeat="message in getMessagesFromGameChat(game) track by $index">@{{message}}</li>
                    </ul>
                    <div class="form-horizontal">
                        <div class="form-group">
                            <label for="exampleInputName2" class="col-sm-1 control-label">Input</label>
                            <div class="col-sm-10">
                                <input id="m" autocomplete="off" name = "coisas" ng-model="chatMessage" ng-keypress="keyPressMsg($event, game, chatMessage)" class="form-control" placeholder="message">
                            </div>

                        </div>
                    </div>

                </div>
            </div>

        </div>
    </div>

@endsection


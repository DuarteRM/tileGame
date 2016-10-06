@extends('layouts.master')

@section('content')


    <div class="container center-block" ng-controller="GameListController">
        <div ng-init="loadPlayerInfo({{$playerJSON}})"></div>
        <div>
            {!! HTML::linkRoute('game.create', 'Create New Game', array(), array('class' => 'btn bg-info btn-lg btn-block')) !!}
        </div>
        <br/>
        <div>

            <div ng-show="checkboxActive === true ">
                <button class="btn btn-warning btn-lg btn-block" ng-click="disableCheckBox()">
                    <p>Cancel Selection</p>
                    <h3>Atention !! </h3>You only can play Public Games on same time
                </button>
            </div>
            <div ng-show="checkboxActive === false ">
                <button class="btn bg-info btn-lg btn-block" ng-click="activateCheckBox()">Play more than one game</button>
            </div>
        </div>

        <br/>
        <div ng-show="selectedGames != 0">
            <div ng-show="checkboxActive === true ">
                <form method="post" action="{{ action('GameController@getListOfGames') }}" accept-charset="UTF-8">
                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                    <input name="invisible" type="hidden" value="@{{ selectedGames.toString() }}">
                    <input name="mode" type="hidden" value="player">
                    <button type="submit" class="btn btn-success btn-lg btn-block">Play Games</button>
                </form>
            </div>
        </div>

        <br/>
        <div>
            <div ng-repeat="game in gameList" class="form-group">
                <div class="bg-success">
                    <div class="panel-body">
                        <div ng-show="game.state === 1 && game.type === 2">
                            <div ng-show="checkboxActive === true ">
                                <div ng-show="canPlayTheGame(game)">
                                    <h4>
                                        <div class="checkbox">
                                            <label>
                                                <input type="checkbox" ng-click="isSelected()" ng-model="game.selected" value="@{{ game.id }}"> Select this Game
                                            </label>
                                        </div>
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div ng-show="game.state != 1">
                            <div ng-hide="playerhasGame(game)" class="text-right">
                                <p class="bg-danger">The Game has already started !</p>
                            </div>

                            <div ng-show="playerhasGame(game)" class="text-right">
                                <div ng-show="game.isFinished == 2">
                                    <p class="bg-danger">This game ended for You</p>
                                </div>
                            </div>
                        </div>


                        <div class="text-left">
                            <h4>Game Name:
                                <small>@{{ game.name }}</small>
                            </h4>
                        </div>
                        <div class="text-left">
                            <h4>Type:
                                <small> @{{ getTypeMessage(game) }}</small>
                            </h4>

                        </div>

                        <div class="text-left">
                            <h4>Players:
                                <small>  @{{ game.currentNumPlayers }} / @{{ game.totalPlayers }}</small>
                            </h4>
                        </div>

                        <div class="form-inline">
                            <div class="form-group">
                                <h4>State of Game:
                                    <small ng-bind="getStateMessage(game)"></small>
                                </h4>
                            </div>
                        </div>

                        <div ng-show="checkboxActive === false ">
                            <div ng-show="game.state === 1">

                                <div class="form-inline text-right">
                                    <div class="form-group">
                                        <div ng-show="canWatchGame(game)" class="text-right">
                                            <form name="myFormWatch" method="post" action="{{ action('GameController@getGame') }}" accept-charset="UTF-8">
                                                <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                                <input name="invisible" type="hidden" ng-value="@{{ game.id }}">
                                                <input name="mode" type="hidden" value="spectate">
                                                <button type="submit" class="btn btn-default">Watch</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <form name="myFormJoin" method="post" action="{{ action('GameController@getGame') }}" accept-charset="UTF-8">
                                            <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                            <input name="invisible" type="hidden" ng-value="@{{ game.id }}">
                                            <input name="mode" type="hidden" value="player">
                                            <div ng-show="playerhasGame(game)" class="text-right">
                                                <div ng-show="game.isFinished == 1">
                                                    <button type="submit" class="btn btn-info">Back to Game</button>
                                                </div>
                                            </div>
                                            <div ng-show="gameHasSpaceForPlayer(game)" class="text-right">
                                                <div ng-show="gameHasPassword(game)">
                                                    <div class="form-inline">
                                                        <div class="form-group">
                                                            <input type="password" class="form-control" id="inputPassword3" placeholder="Password" ng-model="password">
                                                        </div>
                                                        <button ng-show="passwordIsRight(game, password)" type="submit" class="btn btn-success">Join Game</button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div ng-show="game.currentNumPlayers <  game.totalPlayers">

                                            </div>
                                            <div ng-show="game.type == 2 && (game.currentNumPlayers <  game.totalPlayers)">
                                                <div ng-hide="playerhasGame(game)" class="text-right">
                                                    <div ng-show="game.isFinished == 1">
                                                        <button type="submit" class="btn btn-success">Join Game</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div ng-show="game.state === 2">
                                <div class="form-inline text-right">
                                    <div class="form-group">
                                        <div ng-show="playerhasGame(game)" class="text-right">
                                            <div ng-hide="game.isFinished == 2">
                                                <form name="myFormJoin" method="post" action="{{ action('GameController@getGame') }}" accept-charset="UTF-8">
                                                    <input type="hidden" name="_token" value="{{ csrf_token() }}">
                                                    <input name="invisible" type="hidden" ng-value="@{{ game.id }}">
                                                    <input name="mode" type="hidden" value="player">
                                                    <div class="text-right">
                                                        <button type="submit" class="btn btn-info">Back to Game</button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
@endsection
(function () {
    "use strict";
    angular.module('MyApp', [])
        .controller('MainController', ['$scope', '$http', function ($scope, $http) {
            $scope.firstTile = null;
            $scope.tileAux = null;
            $scope.fristTry = false;
            $scope.seconds = 0;
            $scope.miliseconds = 0;
            $scope.moves = 0;
            $scope.numberOfTiles = 16;
            $scope.gameStarted = false;
            $scope.startButtonText = "Start Game";
            $scope.gameWon = false;
            $scope.try = 0;
            $scope.lockBoard = false;
            $scope.stateAux = "";
            $scope.disableStart = false;
            $scope.errorRowsShown = false;
            $scope.errorColsShown = false;
            $scope.errorRows = "Erro";
            $scope.errorCols = "Erro";
            $scope.playerName = "";
            $scope.board = {
                cols: {},
                rows: {}
            };

            $scope.boardInfo = {
                cols: 4,
                rows: 4

            };

            $scope.$watchGroup(['boardInfo.cols', 'boardInfo.rows'], function (newValues) {

                if (((newValues[0] * newValues[1]) % 2) != 0 || newValues[0] > 10 || newValues[0] < 2) {
                    $scope.errorColsShown = true;
                    $scope.errorCols = "Erro modificar o numero de colunas";
                } else {
                    $scope.errorColsShown = false;
                }
                if (((newValues[1] * newValues[0]) % 2) != 0 || newValues[1] > 10 || newValues[1] < 2) {
                    $scope.errorRowsShown = true;
                    $scope.errorRows = "Erro modificar o numero de linhas";
                } else {

                    $scope.errorRowsShown = false;
                }
                if ((newValues[0] * newValues[1]) > 80) {

                    $scope.errorCols = "Erro a multiplicação excede os 80 tiles";
                    $scope.errorRows = "Erro a multiplicação excede os 80 tiles";
                    $scope.errorRowsShown = true;
                    $scope.errorColsShown = true;
                }

                if (!$scope.errorColsShown && !$scope.errorRowsShown)
                    $scope.disableStart = false;
                else
                    $scope.disableStart = true;

            });

            $scope.startOrStop = function () {
                if ($scope.gameStarted)
                    $scope.stopGame();
                else
                    $scope.startgame();
            };

            $scope.startgame = function () {
                $scope.gameStarted = true;
                $scope.startButtonText = "Stop Game";
                $scope.boardSize = $scope.boardInfo.cols * $scope.boardInfo.rows;
                $scope.numberOfTiles = $scope.boardSize;
                clearTimeout($scope.startTimer);
                clearTimeout($scope.startTimerMil);
                $scope.seconds = 0;
                $scope.miliseconds = 0;
                $scope.moves = 0;
                $scope.fillBoard();
                $scope.shuffle($scope.board.cols);
                $scope.startTimer = setInterval(function () {
                    $scope.$apply(function () {
                        $scope.seconds++;
                    });
                }, 1000);
                //timer para calculo em milesegundos
                $scope.startTimerMil = setInterval(function () {
                    $scope.$apply(function () {
                        $scope.miliseconds++;
                    });
                }, 1);
            };

            $scope.fillBoard = function () {
                $scope.board.cols = [];
                $scope.counterRows = 1;
                $scope.counterCols = 1;
                for (var i = 0; $scope.boardInfo.rows > i; i++) {
                    var rowAux = [];
                    for (var j = 0; $scope.boardInfo.cols > j; j++) {
                        rowAux.push({
                            colPieceNumber: Math.floor($scope.counterCols),
                            image: 'hidden',
                            state: 'hidden'
                        });
                        $scope.counterCols = $scope.counterCols + 0.5;
                    }
                    $scope.board.cols.push(rowAux);
                }
            };

            $scope.shuffle = function (array) {
                for (var i = array.length - 1; i > 0; i--) {
                    for (var j = array[i].length - 1; j > 0; j--) {
                        var m = Math.floor(Math.random() * (i + 1));
                        var n = Math.floor(Math.random() * (j + 1));
                        var temp = array[i][j];
                        array[i][j] = array[m][n];
                        array[m][n] = temp;
                    }
                }
            };

            //SHOWTILE FUNCTION
            $scope.showTile = function (tile) {
                if ($scope.try >= 2) {
                    if ($scope.stateAux == 'hidden') {
                        clearTimeout($scope.timeOutFail);
                        $scope.firstTile.image = $scope.stateAux
                        $scope.tileAux.image = $scope.stateAux
                    }
                    else {
                        $scope.firstTile.image = 'empty';
                        $scope.tileAux.image = 'empty';
                        clearTimeout($scope.timeOutFound);
                    }

                    $scope.try = 0;
                    $scope.firstTile.state = $scope.stateAux;
                    $scope.tileAux.state = $scope.stateAux;
                    $scope.firstTile = null;
                    $scope.tileAux = null;
                    $scope.stateAux = "";

                }

                if (tile.state == 'shown' || tile.state == 'found' || $scope.gameStarted == false) {
                    return;
                } else {
                    tile.state = 'shown';
                    tile.image = tile.colPieceNumber;
                }
                if ($scope.firstTile == null) {
                    $scope.try = 1;
                    $scope.firstTile = tile;
                } else if ($scope.firstTile.colPieceNumber == tile.colPieceNumber) {
                    $scope.stateAux = 'found';

                    $scope.numberOfTiles = $scope.numberOfTiles - 2;
                    $scope.moves++;
                    $scope.tileAux = tile;
                    if ($scope.numberOfTiles == 0) {
                        $scope.tileAux.state = $scope.stateAux;
                        $scope.tileAux.image = 'empty';
                        $scope.firstTile.state = $scope.stateAux;
                        $scope.firstTile.image = 'empty';
                        $scope.try = 0;
                        $scope.firstTile = null;
                        $scope.gameWon = true;
                        $scope.stopGame();
                    } else {
                        $scope.try = 3;
                        $scope.timeOutFound = setTimeout(function () {
                            $scope.$apply(function () {
                                $scope.firstTile.state = $scope.stateAux;
                                $scope.tileAux.state = $scope.stateAux;
                                $scope.firstTile.image = 'empty';
                                $scope.tileAux.image = 'empty';
                                $scope.try = 0;
                                $scope.firstTile = null;
                            });
                        }, 2000);
                    }
                } else {
                    $scope.try++;
                }
                if ($scope.try == 2) {
                    $scope.moves++;
                    $scope.tileAux = tile;
                    $scope.stateAux = 'hidden';
                    $scope.timeOutFail = setTimeout(function () {
                        $scope.$apply(function () {
                            $scope.try = 0;
                            $scope.firstTile.state = $scope.stateAux;
                            $scope.firstTile.image = $scope.stateAux;
                            $scope.tileAux.state = $scope.stateAux;
                            $scope.tileAux.image = $scope.stateAux;
                            $scope.firstTile = null;
                            $scope.tileAux = null;
                            $scope.stateAux = "";
                        });
                    }, 2000);
                }
            };
            $scope.stopGame = function () {
                clearInterval($scope.startTimer);
                clearTimeout($scope.startTimerMil);
                clearTimeout($scope.timeOutFail);
                clearTimeout($scope.timeOutFound);
                $scope.gameStarted = false;
                $scope.startButtonText = "Start Game";
                $scope.try = 0;
                $scope.firstTile = null;
                if ($scope.gameWon == true) {
                    $scope.playerName = prompt("Ganhou, introduza o nome", "Player 1");
                    $scope.sendToPhp();
                    $scope.recieveFromPhp();
                }
                $scope.gameWon = false;
            };
            $scope.sendToPhp = function () {
                var params = {
                    'name': $scope.playerName,
                    'moves': $scope.moves,
                    'boardSize': $scope.boardSize,
                    'timer': $scope.miliseconds
                };
                $http({
                    'method': 'POST',
                    'data': params,
                    'url': 'highscore.php'
                }).then(function onSuccessCallback(response) {
                    console.log(response.data);
                }, function onErrorCallback(response) {
                    console.log(response);
                })
            }
            $scope.recieveFromPhp = function () {
                $http({
                    method: 'GET',
                    url: 'highscore.php'
                }).then(function onSuccessCallback(response) {
                    console.log(response.data);
                    $scope.dataFromPhp = response.data;
                }, function onErrorCallback(response) {
                    console.log(response.data);
                })
            };
        }]);
})();
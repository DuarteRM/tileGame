main.controller('GameListController', ['$scope', '$http', '$timeout', '$resource', '$location', '$window', function ($scope, $http, $timeout, $resource, $location, $window) {


    /*
     *   Local controller variables
     */
    var protocol = location.protocol;
    var port = '8080';
    var url = '/gameList';
    var socketURL = protocol + '//' + window.location.hostname + ':' + port;
    var socketGameList = io.connect(socketURL + '/gameList', {reconnect: true});


    /*
     * $scope variables
     */
    $scope.gameList = [];
    $scope.playerInfo = '';
    $scope.activatedGames = '';
    $scope.checkboxActive = false;
    $scope.selectedGames = [];
    $scope.password = '';
    $scope.passValidation = false;


    /*
     * $scope methods
     */
    $scope.loadGamesToNodeServer = function (gameList) {
        socketGameList.emit('loadGameList', gameList);
    }

    $scope.loadPlayerInfo = function(playerInfo){
        $scope.playerInfo = playerInfo;
    };

    //TODO - adicionar estado do jogo
    $scope.playerhasGame = function(game){
        if(gameHasPlayer(game)){ //the game has the player
            return true;
        }
        return false;
    };

    $scope.gameHasSpaceForPlayer = function(game){
        if(!gameHasPlayer(game)){
            if(game.currentNumPlayers < game.totalPlayers){
                return true;
            }
        }
        return false;
    }

    $scope.activateCheckBox = function(){
        $scope.checkboxActive = true;
    };

    $scope.disableCheckBox = function(){
        $scope.checkboxActive = false;
    }

    $scope.canWatchGame = function(game){
        if(game.state === 1){
            return true;
        }
        return false;
    };

    $scope.getStateMessage = function(game){
        console.log('game.state: ' + game.state);
        if(game.state === 1){
            return "Pending";
        }
        if(game.state === 2){
            return "Active";
        }
    };

    $scope.getTypeMessage = function(game){
        if(game.type === 2){
            return 'Public';
        }
        if(game.type === 1){
            return 'Private';
        }
    }

    $scope.canPlayTheGame = function(game){
        if(game.currentNumPlayers < game.totalPlayers){
            return true;
        }
        return false;
    };


    $scope.isSelected = function(){
        $scope.selectedGames = [];
        angular.forEach($scope.gameList, function(game){
            if(!!game.selected){
                $scope.selectedGames.push(game.id);
            }
        });
    };


    $scope.passwordIsRight = function(game, password){
        if(game.password === password){
            return true
        }
        return false;
    };

    $scope.gameHasPassword = function(game){
        if(game.password == null){
            return false;
        }
        return true;
    }


    /*
     *  local controller methos
     */
    var getGamesFromDB = function () {
        $timeout(function () {
            $http.get(url).then(function sucessCallback(response) {
                if (!(($scope.gameList.length) === response.data.length)) {
                    $scope.loadGamesToNodeServer(response.data);
                    console.log("Vou actualizara variavel " + ($scope.gameList.length) + ' - ' + response.data.length + ' - ' + response.data[1].total_players);
                    socketGameList.emit('getActiveGames');

                }
                getGamesFromDB();
            }, function errorCallback(response) {
                console.log('Error on server connection !');
            });
        }, 250);

    };

    var gameHasPlayer = function(game){
        for(var index = 0; index < $scope.gameList.length; index++){
            if($scope.gameList[index].id === game.id){
                if($scope.gameList[index].playersIDs.length === 0){
                    return false; //game dont have players
                }
                for(var indexAux = 0; indexAux < $scope.gameList[index].playersIDs.length; indexAux++){
                    if($scope.gameList[index].playersIDs[indexAux] === $scope.playerInfo.id){
                        return true; //game has player
                    }
                }
                return false; //game dont have the player
            }
        }
        return false;
    }





    /*
     * socket methods
     */
    socketGameList.on('refreshGameListPresentation', function (gameListPresentation) {
        $scope.gameList = gameListPresentation;
        $scope.$apply();
    });

    socketGameList.on('updateGameList', function(gameListPresentation){
        console.log('vou actualizar');
        $scope.gameList = gameListPresentation;
        $scope.$apply();
    });


    getGamesFromDB();


}]);

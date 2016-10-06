var main = angular.module('MainApplication', ['ngResource']);


main.controller('GameController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.game = [];
    $scope.startButtonText = "Start Game";
    $scope.gameTime = 0;
    $scope.chatMessage = '';
    $scope.chatMessages = [];
    $scope.chatPlayerName = '';
    $scope.clientTileTimer = 0;
    $scope.gameIsFinished = 'UNSTARTED';
    $scope.playerMode = '';



    var protocol = location.protocol;
    var port = '8080';
    var url = protocol + '//' + window.location.hostname + ':' + port;


    var socketGame = io.connect(url + '/game', {reconnect: true});
    var socketChat = io.connect(url + '/chat', {reconnect: true});
    var socketGameList = io.connect(url + '/gameList', {reconnect: true});




    /**
     * this function sends a new game to node server
     * @param gameObject is a JSON string
     */
    $scope.sendGameData = function (gameObject, playerObject, playerMode) {
        if(playerMode.mode === 'spectate' || playerMode.mode === 'player'){
            $scope.playerMode = playerMode.mode;
            $scope.chatPlayerName = playerObject.name;
            var gamePlusPlayer = {
                game: gameObject,
                player: playerObject,
                playerMode: playerMode.mode
            }
            socketGame.emit('addGameToServer', gamePlusPlayer);
            socketChat.emit('addChatGameToServer', gameObject);
            socketGameList.emit('addPlayerToGameList', gamePlusPlayer);
        }else{
            console.log('Vai ser apenas espectador do jogo');
        }

    };


    $scope.startGame = function () {
        socketGame.emit('startGame', $scope.game);
        socketGameList.emit('updateGameState', $scope.game);
    };


    $scope.showTile = function (tile, player) {
        if($scope.playerMode === 'player'){
            var move = {
                tileId: tile.id,
                tileLine: tile.line,
                tileColumn: tile.column,
                gameId: $scope.game.id,
                playerId: player.id
            }
            socketGame.emit('playMove', move);
        }
    }


    $scope.keyPressMsg = function ($event) {
        if ($event.keyCode == 13) {
            socketChat.emit('messageToGame', $scope.game, $scope.chatMessage, $scope.chatPlayerName);
            $scope.chatMessage = '';
        }
    };


    /*
     ----- GAME COMMUNICATION -----
     */

    /**
     * this function receive one game from node server and save this game on $scope.game variable
     */
    socketGame.on('newGame', function (data) {
        $scope.game = data;
        $scope.$apply();
    });


    socketGame.on('gameUnstarted', function (data) {
        $scope.game = data;
        $scope.$apply();
    });

    /**
     * this function receive the game from node server and update the client view
     */
    socketGame.on('refreshGame', function (data) {
        $timeout.cancel($scope.clientTileTimer);
        $scope.game = data;
        if ($scope.game.state === "started") {
            $scope.gameIsFinished = 'STARTED';
            $scope.startButtonText = "Pause Game";
        } else if ($scope.game.state === 'paused') {
            $scope.gameIsFinished = 'PAUSED';
            $scope.startButtonText = "Resume Game";
        }

        $scope.$apply();
    });


    socketGame.on('gameIsFinished', function(game){
        $timeout.cancel($scope.clientTileTimer);
        console.log('O jogo terminou -> ' + game.winner);
        $scope.game = game;
        //$scope.gameIsFinished = 'The ' + $scope.game.name + 'id FINISHED';
        $scope.gameIsFinished = 'FINISHED';
        $scope.$apply();
    });


    /**
     * this function is called from the server when client send the second tile to the server,
     * and show that second tile to the client with delay
     */
    socketGame.on('refreshGameWithLagOnTile', function (game, tile) {
        $scope.clientTileTimer = $timeout(function () {
            $scope.game = game;
            $scope.$apply();
        }, 1000);
        $scope.game.board[tile.line][tile.column].image = '' + tile.id;
        $scope.$apply();
    });


    /**
     * this function receive the game time from node server and update the client view
     */
    socketGame.on('refreshGameTime', function (data,player) {
        $scope.gameTime = data;
        $scope.game.players = player;
        $scope.$apply();
    });


    /*
     ----- CHAT COMMUNICATION -----
     */


    /**
     * this function receive the new message from server, if someone write on chat the view will update automatically
     */
    socketChat.on('refreshChatGame', function (game, playerName, newMessage) {
        if ($scope.chatMessages.length > 6) {
            $scope.chatMessages.shift();
        }
        $scope.chatMessages.push(playerName + ' : ' + newMessage)
        $scope.$apply();
    });

}]);









main.controller('MultipleGameController', ['$scope', '$timeout', function ($scope, $timeout) {

    $scope.startButtonText = "Start Game";
    $scope.gameTime = 0;
    $scope.chatMessage = '';
    $scope.chatMessages = [];
    $scope.chatPlayerName = '';
    $scope.clientTileTimer = 0;
    $scope.gameIsFinished = '';
    $scope.games = [];
    $scope.player = '';
    $scope.games = [];
    $scope.player = '';
    $scope.chatMessageWindow = [];
    $scope.chatInputs = [];
    $scope.gameTimers = [];

    var protocol = location.protocol;
    var port = '8080';
    var url = protocol + '//' + window.location.hostname + ':' + port;


    var socketGame = io.connect(url + '/game', {reconnect: true});
    var socketChat = io.connect(url + '/chat', {reconnect: true});
    var socketGameList = io.connect(url + '/gameList', {reconnect: true});

    $scope.loadGames = function(games, player){
        $scope.player = player;
        for(var index = 0; index < games.length; index++){
            $scope.games.push(games[index]);
            $scope.gameTimers.push({gameId: games[index].id, timer: ''});
            $scope.sendGameData(games[index], player);
        }

    };




    /**
     * this function sends a new game to node server
     * @param gameObject is a JSON string
     */
    $scope.sendGameData = function (gameObject, playerObject) {
        $scope.chatPlayerName = playerObject.name;
        var gamePlusPlayer = {
            game: gameObject,
            player: playerObject,
            playerMode: 'player'
        }
        socketGame.emit('addGameToServer', gamePlusPlayer);
        socketChat.emit('addChatGameToServer', gameObject);
        socketGameList.emit('addPlayerToGameList', gamePlusPlayer);
    };


    /**
     * this function receive the game from node server and update the client view
     */
    socketGame.on('refreshGame', function (data) {
        if($scope.games.length > 0){
            for(var index = 0; index < $scope.games.length; index++){
                $timeout.cancel($scope.getGameTimer(data).timer);
                $scope.refreshGame(data);
            }
        }else{
            $timeout.cancel($scope.getGameTimer(data).timer);
            $scope.game = data;
            if ($scope.game.state === "started") {
                $scope.startButtonText = "Pause Game";
            } else if ($scope.game.state === 'paused') {
                $scope.startButtonText = "Resume Game";
            }
        }

        $scope.$apply();
    });

    $scope.refreshGame = function(game){
        for(var index = 0; index < $scope.games.length; index++){
            if(game.id === $scope.games[index].id){
                $scope.games[index] = game;
            }
        }
    };


    $scope.showTile = function (tile, player, game) {
        var move = {
            tileId: tile.id,
            tileLine: tile.line,
            tileColumn: tile.column,
            gameId: game.id,
            playerId: player.id
        }
        socketGame.emit('playMove', move);
    }

    $scope.startGame = function (game) {
        socketGame.emit('startGame', game);
    };

    /**
     * this function is called from the server when client send the second tile to the server,
     * and show that second tile to the client with delay
     */
    socketGame.on('refreshGameWithLagOnTile', function (game, tile) {
        $scope.gameAux = '';
        $scope.getGameTimer(game).timer = $timeout(function () {
            for(var index = 0; index < $scope.games.length; index++){
                if(game.id === $scope.games[index].id){
                    $scope.gameAux = $scope.games[index] = game;
                }
            }
            $scope.$apply();
        }, 1000);
        for(var index = 0; index < $scope.games.length; index++){
            if(game.id === $scope.games[index].id){
                $scope.games[index].board[tile.line][tile.column].image = '' + tile.id;
                $scope.$apply();
            }
        }

    });

    /**
     * this function receive the new message from server, if someone write on chat the view will update automatically
     */
    socketChat.on('refreshChatGame', function (game, playerName, newMessage) {
        console.log('passei aqui');
        for(var index = 0; index < $scope.games.length; index++){
            if(game.id === $scope.games[index].id){
                if($scope.chatMessageWindow.length > 0){
                    var exist = false;
                    for(var index2 = 0; index2 < $scope.chatMessageWindow.length; index2++){
                        if($scope.chatMessageWindow[index2].gameId === game.id){
                            exist = true;
                            $scope.chatMessageWindow[index2].messages.push(playerName + ' : ' + newMessage);
                            break;
                        }
                    }
                    if(exist === false){
                        $scope.chatMessageWindow.push({gameId: game.id, messages: [playerName + ' : ' + newMessage]});
                    }
                }else{
                    $scope.chatMessageWindow.push({gameId: game.id, messages: [playerName + ' : ' + newMessage]});
                }
            }
        }

        //if ($scope.chatMessages.length > 6) {
        //    $scope.chatMessages.shift();
        //}
        //$scope.chatMessages.push(playerName + ' : ' + newMessage)
        $scope.$apply();
    });

    $scope.keyPressMsg = function ($event, game, name) {
        if ($event.keyCode == 13) {
            for(var index = 0; index < $scope.games.length; index++){
                if(game.id === $scope.games[index].id){
                    socketChat.emit('messageToGame', $scope.games[index], name, $scope.chatPlayerName);
                }
            }
            $scope.chatMessage = '';
        }
    };

    $scope.getMessagesFromGameChat = function(game){
        $scope.gameMessages = [];
        for(var index = 0; index < $scope.chatMessageWindow.length; index++){
            if($scope.chatMessageWindow[index].gameId === game.id){
                for(var indexAux = 0; indexAux < $scope.chatMessageWindow[index].messages.length; indexAux++){
                    $scope.gameMessages.push($scope.chatMessageWindow[index].messages[indexAux]);
                }

            }
        }
        return $scope.gameMessages;
    };

    $scope.getGameTimer = function(game){
        for(var index = 0; index < $scope.gameTimers.length; index++){
            if($scope.gameTimers[index].gameId === game.id){
                return $scope.gameTimers[index];
            }
        }
    }

    $scope.keyPressMsg = function ($event, game, name) {
        if ($event.keyCode == 13) {
            console.log(game.id + ' - ' + name);
            socketChat.emit('messageToGame', game, name, $scope.chatPlayerName);
            $scope.chatMessage = '';
        }
    };




}]);
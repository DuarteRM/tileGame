var nodePort = 8080;
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var Game = require('./gameObject.js');
var gameList = {};
var game_io = io.of('/game');
var chat_io = io.of('/chat');
var gameList_io = io.of('/gameList');
var GameList = require('./gameListObject.js');
var gameListPresentation = [];

game_io.on('connection', function (socket) {
    console.log(socket.id + "One client has been connected !");

    socket.on('disconnect', function () {
        if (socket.player != null && socket.game != null) {
            socket.game.reconnectList[socket.player.id] = socket.player;
            setTimeout(function () {
                if (socket.game.reconnectList[socket.player.id] != null) {
                    console.log(socket.player.id + " disconnected from game " + socket.game.id);
                    socket.game.removePlayerFromGame(socket.game, socket.player);
                    delete socket.game.playersInGameList[socket.player.id];
                    socket.player = null;
                    socket.disconnected = true;
                    if (Object.keys(socket.game.players).length > 1) {
                        if (socket.game.currentPlayerActiveIndex > 0)
                            socket.game.currentPlayerActiveIndex--;
                        socket.game.currentPlayerID = Object.keys(socket.game.players)[socket.game.currentPlayerActiveIndex];
                        socket.game.moveToNextPlayer();
                    }
                    else {
                        socket.game.currentPlayerActiveIndex = 0;
                        if (Object.keys(socket.game.players).length === 0)
                        {

                            finishGameOnList(socket.game.id);
                            var game = getGameList(socket.game.id);
                            game.state = 2;
                            gameList_io.emit('updateGameStateClient', gameListPresentation);
                            abortGame(socket.game);
						}
                        socket.game.currentPlayerID = Object.keys(socket.game.players)[socket.game.currentPlayerActiveIndex];
                        if(socket.game.state === 'started'){
                            socket.game.currentPlayerName = socket.game.players[socket.game.currentPlayerID].name;
                        }
                        game_io.in(socket.game.id).emit('refreshGame', socket.game);
                        if (socket.game.players[socket.game.currentPlayerID] != null)
                            socket.game.players[socket.game.currentPlayerID].canPlay = true;
                    }

                }
            }, 10000);//after 10 of inactivity seconds player will be disconnected
        }


    });

    socket.on('addGameToServer', function (data) {
        socket.join(data.game.id);
        if (!(verifyIfGameExist(data.game.id))) {
            var newGame = new Game();
            newGame.id = data.game.id;
            newGame.name = data.game.name;
            newGame.totalPlayers = data.game.totalPlayers;
            newGame.buildBoardGame(data.game.lines, data.game.columns);
            if (newGame.playersInGameList[data.player.id] != null && (data.player.id == newGame.playersInGameList[data.player.id].id)) {
                if (data.playerMode === 'player') {
                    delete newGame.reconnectList[data.player.id];
                    newGame.addPlayerToGame(newGame.playersInGameList[data.player.id]);
                    socket.player = newGame.playersInGameList[data.player.id];
                }
            } else {
                if (data.playerMode === 'player') {
                    newGame.addPlayerToGame(data.player);
                    socket.player = data.player;
                }
            }
            socket.game = newGame;
            if (data.playerMode === 'player')
                newGame.playersInGameList[data.player.id] = data.player;
                gameList[newGame.id] = newGame;
                game_io.in(data.game.id).emit('newGame', getGame(data.game.id));
                game_io.in(data.game.id).emit('refreshGame', newGame);
        } else {
            var game = getGame(data.game.id);
            if (game.playersInGameList[data.player.id] != null && (data.player.id == game.playersInGameList[data.player.id].id)) {
                console.log("Same player - Reconnected");
                if (data.playerMode === 'player') {
                    delete game.reconnectList[data.player.id];
                    socket.disconnected = false;
                    socket.player = game.playersInGameList[data.player.id];
                }
            } else {
                if (data.playerMode === 'player'){
                    game.playersInGameList[data.player.id] = data.player;
                    socket.disconnected = false;
                    game.addPlayerToGame(data.player);
                    socket.player = data.player;
                }

            }
            socket.game = game;
            game_io.in(data.game.id).emit('refreshGame', game);
        }

    });


    socket.on('startGame', function (data) {
        var game = getGame(data.id);
        game.currentPlayerID = Object.keys(game.players)[game.currentPlayerActiveIndex];
        if (game.state === 'unstarted') {
            game.startGame();
            socket.interval = setInterval(function () {
                game.updateTimer();
                game.players[game.currentPlayerID].timer++;
                game_io.in(game.id).emit('refreshGameTime', game.timer, game.players);
            }, 1000);
        } else if (game.state === 'started') {
            game.pauseGame();
            clearInterval(socket.interval);
            game_io.in(game.id).emit('refreshGameTime', game.timer, game.players);
        } else {
            game.starGameState();
            clearInterval(socket.interval);
            socket.interval = setInterval(function () {
                game.updateTimer();
                game.players[game.currentPlayerID].timer++;
                game_io.in(game.id).emit('refreshGameTime', game.timer, game.players);
            }, 1000);
        }
        game_io.in(game.id).emit('refreshGame', game);
    });

    socket.on('playMove', function (data) {
        var game = getGame(data.gameId);
        if (!(game.isFinished())) {
            if (game.state === 'unstarted') {
                game_io.in(data.gameId).emit('gameUnstarted', game);
            }

            game.playMove(data);
            if (game.lagOnSecondImage) {
                game_io.in(data.gameId).emit('refreshGameWithLagOnTile', getGame(data.gameId), game.getTile(data.tileLine, data.tileColumn));
            } else {
                game_io.in(data.gameId).emit('refreshGame', game);
            }
            if (game.isFinished()) {
                clearInterval(socket.interval);
                game_io.in(data.gameId).emit('gameIsFinished', game);
            }
        } else {
            //if game is finished
            clearInterval(socket.interval);
            game_io.in(data.gameId).emit('gameIsFinished', game);
        }


    });

    socket.on('updateGameTime', function (data) {
        var game = getGame(data.id);
        game.updateTimer();
        game.updatePlayerTimer();
        game_io.in(game.id).emit('refreshGame', game);
    });
});

chat_io.on('connection', function (socket) {
    socket.on('addChatGameToServer', function (game) {
        socket.join(game.id);
    });
    socket.on('messageToGame', function (game, message, chatPlayerName) {
        chat_io.in(game.id).emit('refreshChatGame', game, chatPlayerName, message);
    });
});


gameList_io.on('connection', function (socket) {

    socket.on('loadGameList', function (gameListDB) {
        for (var index = 0; index < gameListDB.length; index++) {
            if (!(listPresentationContainsGame(gameListDB[index]))) {
                var game = new GameList(gameListDB[index].id, gameListDB[index].name, gameListDB[index].total_players, gameListDB[index].state, gameListDB[index].type, gameListDB[index].password);
                gameListPresentation.push(game);
            }
        }
        gameList_io.emit('refreshGameListPresentation', gameListPresentation);
    });

    socket.on('addPlayerToGameList', function (data) {
        var game = getGameList(data.game.id);
        if (data.playerMode === 'player') {
            var gameAux = getGame(data.game.id);
            if ((gameAux.players[data.player.id]) != null) {
                if(!(game.hasPlayerId(data.player.id))){
                    console.log("Vou adicionar o jogador");
                    game.addCurrentNumPlayers(data.player.id);
                }
            }
        }
        gameList_io.emit('updateGameList', gameListPresentation);
    });

    socket.on('updateGameState', function (game) {
        var game = getGameList(game.id);
        game.state = 2;
        gameList_io.emit('updateGameStateClient', gameListPresentation);
    });
});


http.listen(nodePort, function () {
    console.log('listening on *:8080');
});


//FUCTIONS
function verifyIfGameExist(gameID) {
    if (gameList[gameID] != null) {
        return true;
    }
    return false;
}

function getGame(gameID) {
    if (gameList[gameID] != null) {
        return gameList[gameID];
    }
}

function getGameList(gameID) {
    for (var index = 0; index < gameListPresentation.length; index++) {
        if (gameListPresentation[index].id === gameID) {
            return gameListPresentation[index];
        }
    }
    return false;
}

function listPresentationContainsGame(game) {
    if (gameListPresentation.length === 0) {
        return false;
    }
    for (var index = 0; index < gameListPresentation.length; index++) {
        if (gameListPresentation[index].id === game.id) {
            return true;
        }
    }
    return false;
}

function abortGame(game,timer)
{
    clearInterval(timer);
    console.log("Game Aborted");
    game.state = 'finished';
}

function finishGameOnList(gameId){
    var game = getGameList(gameId);
    if(game != null){
        game.isFinished = 2;
    }
}
var Tile = require('./tileObject.js');
var Player = require('./playerObject.js');
var mysql = require('mysql');
var moment = require('moment');
module.exports = Game;

function Game() {
    this.name = '';
    this.lines = '';
    this.columns = '';
    this.state = 'unstarted'; //unstarted, started, paused, finished
    this.board = [];
    this.players = {};
    this.timer = 0;
    this.interval = 0;
    this.currentPlayerID = 0;
    this.currentPlayerActiveIndex = 0;
    this.currentPlayerName = '';
    this.openedTiles = [];
    this.remainingTiles = 0;
    this.totalTiles = 0;
    this.winner = '';
    this.activePlayers = [];
    this.playersInGameList = {};
    this.reconnectList = {};
}

Game.prototype = {

    buildBoardGame: function (lines, columns) {
        var scope = this;

        scope.lines = lines;
        scope.columns = columns;
        scope.remainingTiles = scope.lines * scope.columns;
        scope.totalTiles = scope.lines * scope.columns;

        var ramdomTilesValues = [];
        var finalArray = [];

        for (var index = 0; index < (scope.totalTiles / 2); index++) {
            var randomValue = 1;
            do {
                randomValue = Math.floor((Math.random() * 40) + 1);
            } while (existOnArray(randomValue, ramdomTilesValues));
            ramdomTilesValues.push(randomValue);
        }

        for (var index = 0; index < ramdomTilesValues.length; index++) {
            finalArray.push(ramdomTilesValues[index]);
            finalArray.push(ramdomTilesValues[index]);
        }

        shuffleTileValues(finalArray);
        createGameMatrix(finalArray, scope.board, scope.columns);
    },

    addPlayerToGame: function (newPlayer) {
        var game = this;
        if (game.players[newPlayer.id] == null) {
                var player = new Player(newPlayer.id, newPlayer.name);
                player.addGameToPlayer(game.id, Object.keys(game.players).length);
                game.players[newPlayer.id] = player;
        }
    },

    removePlayerFromGame: function (game, oldPlayer) {
            if (game.players[oldPlayer.id] != null) {
                game.players[oldPlayer.id].removeGameFromPlayer(game.id);
                delete game.players[oldPlayer.id];
        } else {
            console.log("Error-Unable to find player to remove")
        }
    },


    playMove: function (data) {
        var game = this;
        game.lagOnSecondImage = false;
        var player = game.players[data.playerId];
        if (game.players[data.playerId].canPlay) {
            if (game.state === 'started') {
                var selectedTile = game.getTile(data.tileLine, data.tileColumn);
                if (selectedTile.state === 'hidden') {
                    game.addTileToOpenedTiles(selectedTile);
                    selectedTile.updateTile();
                    if (game.getOpenedTiles().length === 2) {
                        game.lagOnSecondImage = true;
                        if (!game.verifyOpenedTiles(player)) {
                            game.moveToNextPlayer();
                            game.cleanOpenedTiles();
                        } else {
                            //verify if the game is finish
                            if (game.getRemainingTiles() === 0) {
                                game.finishGame();
                            }
                        }
                        game.cleanOpenedTiles();
                    }


                    if (game.getOpenedTiles().length === 1) {
                        game.lagOnSecondImage = false;
                    }
                }
            }
        }
    },

    updateTimer: function () {
        var game = this;
        game.timer++;
    },

    defineStartPlayer: function () {
        var game = this;
        if (Object.keys(game.players).length > 0) {
            game.currentPlayerName = game.players[game.currentPlayerID].name;
            game.players[game.currentPlayerID].canPlay = true;
        }
    },

    starGameState: function () {
        var game = this;
        game.state = 'started';
    },

    startGame: function () {
        var game = this;
        game.timer=0;
        game.state = 'started';
        game.defineStartPlayer();
    },


    pauseGame: function () {
        var game = this;
        game.state = 'paused';
    },

    finishGame: function () {
        var game = this;
        game.state = 'finished';
        game.defineWinner();
    },

    getNumOfPlayers: function () {
        return this.activePlayers.length;
    },

    moveToNextPlayer: function () {
        var game = this;

        if (Object.keys(game.players).length > 1) {
            game.activePlayers = Object.keys(game.players);
            game.players[game.activePlayers[game.currentPlayerActiveIndex]].canPlay = false;
            if ((game.currentPlayerActiveIndex + 1) >= game.activePlayers.length) {
                game.currentPlayerActiveIndex = 0;
                game.currentPlayerID=game.activePlayers[game.currentPlayerActiveIndex];
                game.players[game.activePlayers[game.currentPlayerActiveIndex]].canPlay = true;
                game.currentPlayerName = game.players[game.activePlayers[game.currentPlayerActiveIndex]].name;
            } else {
                game.currentPlayerActiveIndex++;
                game.currentPlayerID=game.activePlayers[game.currentPlayerActiveIndex];
                game.players[game.activePlayers[game.currentPlayerActiveIndex]].canPlay = true;
                game.currentPlayerName = game.players[game.activePlayers[game.currentPlayerActiveIndex]].name;
            }
        }
    },


    updatePlayerTimer: function (playerId) {
        var game = this;
        var player = game.players[playerId];
        player.updateGameTime(game.id);
    },

    setInterval: function (timer) {
        var game = this;
        game.interval = timer;
    },

    getOpenedTiles: function () {
        var game = this;
        return game.openedTiles;
    },

    getTile: function (line, column) {
        var game = this;
        return game.board[line][column];
    },

    addTileToOpenedTiles: function (tile) {
        var game = this;
        game.openedTiles.push(tile);
    },

    cleanOpenedTiles: function () {
        var game = this;
        game.openedTiles = [];
    },

    verifyOpenedTiles: function (player) {
        var game = this;
        var tileOne = game.openedTiles[0];
        var tileTwo = game.openedTiles[1];
        player.updateMoves();
        if (tileOne.id === tileTwo.id) {
            game.remainingTiles = game.remainingTiles - 2;
            player.updateOpenedTiles();
            game.openedTiles = [];
            tileOne.state = 'finished';
            tileOne.updateImageBasedOnState();
            tileTwo.state = 'finished';
            tileTwo.updateImageBasedOnState();
            return true;
        } else {
            game.cleanOpenedTiles();
            tileOne.state = 'hidden';
            tileOne.updateImageBasedOnState();
            tileTwo.state = 'hidden';
            tileTwo.updateImageBasedOnState();
            return false;
        }
    },

    getRemainingTiles: function () {
        var game = this;
        return game.remainingTiles;
    },

    isFinished: function () {
        var game = this;
        if (game.state === 'finished') {

            return true;
        }
        return false;
    },


    defineWinner: function () {
        var game = this;
        var winner = game.players[game.currentPlayerID];
        var boardSize = game.columns * game.lines;
        var winnerScore = game.calculateScore(game.players[game.currentPlayerID].moves,game.players[game.currentPlayerID].timer,boardSize);
        if (game.getNumOfPlayers() > 0) {

            for (var index = 0; index < game.getNumOfPlayers(); index++) {

                var winnerScoreAux = game.calculateScore(game.players[game.activePlayers[index]].moves,game.players[game.activePlayers[index]].timer,boardSize);
                if(game.players[game.activePlayers[index]].openedTiles > winnerScore){
                    winner = game.players[game.activePlayers[index]];
                    winnerScore = winnerScoreAux;
                }
            }
            game.winner = winner;
        }else{
            game.winner = game.players[game.currentPlayerID];
        }

        game.winner.score = winnerScore;
        console.log("score final = " + winnerScore);
        var connection = mysql.createConnection(
            {
                host     : '127.0.0.1',
                user     : 'homestead',
                password : 'secret',
                database : 'homestead'
            }
        );

        connection.connect(function(err){
            if(err){
                console.log('Error connecting to Db');
                return;
            }
            console.log('Connection established');
        });
        var now = moment();
        var formatted = now.format('YYYY-MM-DD HH:mm:ss');
        var post  = {user_time:game.winner.timer,game_time:game.timer,user_moves:game.winner.moves,user_score:game.winner.score,user_tiles:game.winner.openedTiles,created_at: formatted,
        updated_at: formatted};
            connection.query('INSERT INTO games_history SET ?', post, function(err, res) {
                if(err) throw err;
                console.log('Last insert ID:', res.insertId);
        });
        connection.end(function(err) {

        });

    },

    calculateScore: function (moves,timer,boardSize){
        return (1 / (0.9 * moves + 0.1 * timer) * boardSize * 100000);

    }

};


/*
 *  FUNCTIONS
 */

function existOnArray(number, board) {
    if (board.length != 0) {
        for (var index = 0; index < board.length; index++) {
            if (board[index] === number) {
                return true;
            }
        }
        return false;
    }
    return false;
}


function shuffleTileValues(arrayValues) {
    for (var j, x, i = arrayValues.length; i; j = Math.floor(Math.random() * i), x = arrayValues[--i], arrayValues[i] = arrayValues[j], arrayValues[j] = x);
}

function createGameMatrix(finalArray, board, columns) {
    var columnsCounter = 0;
    for (var index = 0, lines = -1; index < finalArray.length; index++) {
        if ((index % columns) === 0) {
            lines++;
            board[lines] = [];
            columnsCounter = 0;
        }
        board[lines].push(new Tile(finalArray[index], lines, columnsCounter));
        columnsCounter++;
    }
}


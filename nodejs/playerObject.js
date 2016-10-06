//noinspection JSUnresolvedVariable
module.exports = Player;

function Player(id, name) {
    this.id = id;
    this.name = name;
    this.timer = 0;
    this.canPlay = false;
    this.games = {};
    this.interval = 0;
    this.lagOnSecondImage = false;
    this.openedTiles = 0;
    this.score = 0;
    this.moves = 0;
}

Player.prototype = {
    addGameToPlayer: function (gameId, queueId) {
        var player = this;
        player.games[gameId]={
            gameId: gameId,
            queueId: queueId,
            playerTime: 0
        };
    },

    removeGameFromPlayer: function (gameId) {
        var player = this;
        delete player.games[gameId];
    },

    updateGameTime: function(gameID){
        this.games[gameID].playerTime++;
    },

    setInterval: function(timer){
        var player = this;
        player.interval = timer;
    },

    updateOpenedTiles: function(){
        this.openedTiles++;
    },

    updateMoves: function(){
        this.moves++;
    }

};






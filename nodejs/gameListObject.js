module.exports = GameList;

function GameList(id, name, totalPlayers, state, type, password) {
    this.id = id;
    this.name = name;
    this.totalPlayers = totalPlayers;
    this.state = state;
    this.type = type;
    this.currentNumPlayers = 0;
    this.playersIDs = [];
    this.password = password;
    this.isFinished = 1; // 1 - no , 2 - yes
}

GameList.prototype = {

    getId: function () {
        return this.id;
    },

    addCurrentNumPlayers: function(playerId){
        var game = this;
        game.playersIDs.push(playerId);
        game.currentNumPlayers++;
    }

};

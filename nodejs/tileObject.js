var Player = require('./playerObject.js');

module.exports = Tile;

function Tile(id, line, column){
    this.id = id;
    this.state = 'hidden'; //finished
    this.image = 'hidden';
    this.line = line;
    this.column = column;
}

Tile.prototype = {
    updateTile: function(){
        var scope = this;
        if(scope.state === 'hidden'){
            scope.state = 'opened';
            scope.image = '' + scope.id;
        }else if(scope.state === 'opened'){
            scope.state = 'hidden';
            scope.image = 'hidden';
        }
    },

    updateImageBasedOnState: function() {
        var tile = this;
        if(tile.state === 'hidden'){
            tile.image = 'hidden';
        }else if(tile.state === 'opened'){
            tile.image = '' + tile.id;
        }else if (tile.state === 'finished'){
            tile.image = 'empty';
        }
    }

};
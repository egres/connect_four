function Game() {
    this.gameboard = new GameBoard(7, 6);
}

//returns Red or Yellow if winner is found, otherwise false
Game.prototype.findWinner = function() {
    gameboard.rows.forEach(function(){}, gameboard);
    gameboard.columns.forEach(function(){}, gameboard);
    gameboard.diagonals.forEach(function(){}, gameboard);
    return false;
};
Game.prototype.makeMove = function(column, color) {   
    if (this.lastMove && color === this.lastMove.color) {
        throw new Error("Out of turn - it is " + (color === "red" ? "yellow's " : "red's") + " turn!" );
    }
    return this.lastMove = this.gameboard.playPiece(column, color);
};
Game.prototype.updateView = function() {
    var append_text = "";
    this.gameboard.rows().forEach(function(row) {
        var row_text = "";
        row_text += "<li>";       
        row.forEach(function(e) {
            row_text += "<div class=" + e + "> </div>";    
        });
        row_text += "</li>";
        append_text = row_text + append_text; //prepend the row
    }, this);
    $("#board").append(append_text);
};

function GameBoard(width, height) {
    this.width = width;
    this.height = height;
    //this.lastMove = { x:-1, y:-1 };
    
    this.board = new Array(width);
    for (var i = 0; i < width; i++) {
      this.board[i] = [];
    }
}

GameBoard.prototype.playPiece = function(columnIndex, color) {
    if (columnIndex < 0 || columnIndex > this.width - 1) {
        throw new RangeError("Valid column indices are within [0.." + (this.width-1) + "]");
    }
    if (color!="red" && color!="yellow") {
        throw new RangeError("Valid colors are red and yellow");
    }
    var yIndex = this.board[columnIndex].push(color) - 1;
    return { x:columnIndex, y:yIndex , color:color}; //coordinates of the last play   
};

GameBoard.prototype.columns = function() {
    return this.board;
};
GameBoard.prototype.rows = function() {
    var rows = new Array(this.height);
    this.columns().forEach(function(column, columnsIndex) {
        for(var i = 0; i < this.height; i++) {
            if (rows[i] === undefined) {
                rows[i] = [];
            }
            rows[i].push( column[i] === undefined ? '' : column[i] );
        }
    }, this);
    return rows;
};
GameBoard.prototype.diagonals = function() {
    var lengthOfDiagonal = ( this.height < this.width ? this.height : this.width );
    var numOfDiagonals = lengthOfDiagonal - 3;
    var positiveSlopeDiagonalsTop = new Array(numOfDiagonals);
    var positiveSlopeDiagonalsBottom = new Array(numOfDiagonals);
    var i;
    var j;
   
    lengthOfDiagonal = ( this.height < this.width ? this.height : this.width );
    function partialDiagonals(lengthOfDiagonal, board, arg1, arg2) {
        var numOfDiagonals = lengthOfDiagonal - 3;
        var diagonals = new Array(numOfDiagonals);
        for (j = 0; j < numOfDiagonals; j++, lengthOfDiagonal--) {
            for (i = eval(arg1); i < lengthOfDiagonal + eval(arg1); i++) {
                if (diagonals[j] === undefined) {
                    diagonals[j] = [];
                }
                //diagonals[j].push({x:(i),y:(eval(arg2))});
                diagonals[j].push(board[i][eval(arg2)]);
            }
        }
        return diagonals;
    }
    positiveSlopeDiagonalsTop = partialDiagonals(lengthOfDiagonal, this.board, "0", "i+j");
    positiveSlopeDiagonalsBottom = partialDiagonals(lengthOfDiagonal, this.board, "j+1", "i-j-1");  
    negativeSlopeDiaognalsTop = partialDiagonals(lengthOfDiagonal, this.board, "j+1", "6-i+j");
    negativeSlopeDiaognalsBottom = partialDiagonals(lengthOfDiagonal, this.board, "0", "5-i-j");
    
    return positiveSlopeDiagonalsTop.concat(positiveSlopeDiagonalsBottom).concat(negativeSlopeDiaognalsTop).concat(negativeSlopeDiaognalsBottom);
};

var game = new Game();
var moveIndices = game.makeMove(1, "red");
moveIndices = game.makeMove(1, "yellow");
moveIndices = game.makeMove(2, "red");
moveIndices = game.makeMove(1, "yellow");
moveIndices = game.makeMove(3, "red");
moveIndices = game.makeMove(5, "yellow");
moveIndices = game.makeMove(3, "red");
moveIndices = game.makeMove(5, "yellow");
moveIndices = game.makeMove(3, "red");
moveIndices = game.makeMove(5, "yellow");
moveIndices = game.makeMove(3, "red");
moveIndices = game.makeMove(5, "yellow");
moveIndices = game.makeMove(3, "red");
moveIndices = game.makeMove(5, "yellow");
moveIndices = game.makeMove(3, "red");



/*
debug("last move = " + JSON.stringify(moveIndices));

debug(JSON.stringify(game.gameboard));

debug("columns: ");
debug(JSON.stringify(game.gameboard.columns()));
debug("rows:");
debug(JSON.stringify(game.gameboard.rows()));
debug("diagonals: ");
debug(JSON.stringify(game.gameboard.diagonals()));
*/
game.updateView();

console.log("diagonals: ");
console.log(JSON.stringify(game.gameboard.diagonals()));


/*
function Gamesquare(x, y) {
    this.x = x;
    this.y = y;
    this.color = "";
}

Gamesquare.prototype.color = function(color){
    if (color != 'red' && color != 'yellow') {
        throw new Exception("Wrong color played!");
    }
    
    this.color = color;
}
*/
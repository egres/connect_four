$(document).ready(function(){

function Game() {
    this.gameboard = new GameBoard(7, 6);
    this.currentTurn = "red";
}

//returns Red or Yellow if winner is found, otherwise false
Game.prototype.findWinner = function() {
    var lines = this.gameboard.rows()
                    .concat(this.gameboard.columns())
                    .concat(this.gameboard.diagonals());
    lines.forEach(function(line){
        var scanningColor;
        var counter=0;
        line.forEach(function(color){
            //console.log("scanningColor="+scanningColor);
            //console.log("color="+color);
            if (scanningColor !== color || color === '' || color === undefined) {
                counter = 0;
                scanningColor = color;
            }
            counter++;
            //console.log("counter="+counter);
            if (counter === 4) {
                //console.log("winner is "+color);
                this.winner = color;
                return;
            }
        }, this);
    }, this);
};
Game.prototype.makeMove = function(column, color) {   
    if (this.lastMove && color === this.lastMove.color) {
        throw new Error("Out of turn - it is " + (color === "red" ? "yellow's " : "red's") + " turn!" );
    }
    //make sure the column is not full before proceeding with the move
    if (this.gameboard.columns()[column].length < this.gameboard.height) {
        this.currentTurn = (color === "red" ? "yellow" : "red");
        return this.lastMove = this.gameboard.playPiece(column, color); 
    }
    return this.lastMove;
};
Game.prototype.updateView = function() {
    var append_text = "";
    //console.log(this.gameboard.rows());
    this.gameboard.rows().forEach(function(row, rowIndex) {
        var row_text = "";
        row_text += "<li>";       
        row.forEach(function(e, index) {
            var animationClass = "";
            if (index===0&&rowIndex===0) {
                //console.log("game.lastMove="+JSON.stringify(game.lastMove)+" index="+index+" rowIndex="+rowIndex);
            }
            
            if (game.lastMove !== undefined && rowIndex === game.lastMove.y && index === game.lastMove.x) {
                console.log("game.lastMove="+JSON.stringify(game.lastMove)+" index="+index+" rowIndex="+rowIndex);
                animationClass = "slideDown ";
            }
            row_text += "<div class='outerCell'><div class='cellBackground'> </div>";    
            row_text += "<div column_index=" + index + " class='cell " + animationClass + e + "'> </div></div>";    
            
            //row_text += "<div column_index=" + index + " class='cell slideDown " + e + "'> </div>";
            
        });
        row_text += "</li>";
        append_text = row_text + append_text; //prepend the row
    }, this);
    $("#board").empty().append(append_text);
    
    if (this.winner !== undefined) {
        $("body").append("<h1>Winner is " + this.winner + "!!!");
    } else {
        var divs = $("div.cell");
        divs.click(function() {
            game.makeMove(this.getAttribute('column_index'), game.currentTurn);
        }).click(function() {
            game.findWinner();
        }).click(function(){
            game.updateView();       
        });
    }
};

function GameBoard(width, height) {
    this.width = width;
    this.height = height;
    
    this.board = new Array(width);
    for (var i = 0; i < width; i++) {
      this.board[i] = [];
    }
    //initialize the diagonals collection with indices object literals, i.e. {x:1, y:2}
    //overwriting the diagonals_indices property makes sure that this expensive method is not called again
    this.diagonals_indices = this.diagonals_indices();
}

GameBoard.prototype.playPiece = function(columnIndex, color) {
    if (columnIndex < 0 || columnIndex > this.width - 1) {
        throw new RangeError("Valid column indices are within [0.." + (this.width-1) + "]");
    }
    if (color!="red" && color!="yellow") {
        throw new RangeError("Color '" + color + "' is not a valid color. Valid colors are red and yellow");
    }
    var yIndex = this.board[columnIndex].push(color) - 1;
    //console.log(this.board);
    return { x:parseInt(columnIndex), y:yIndex , color:color}; //coordinates of the last play   
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
GameBoard.prototype.diagonals_indices = function() {
    var lengthOfDiagonal = ( this.height < this.width ? this.height : this.width );
    
    //reduce code redundancy when calculating four diagonals arrays
    //the outer function is called only once on gameboard initialization so it's safe to use from performance pov
    function partialDiagonals(lengthOfDiagonal, board, arg1, arg2) {
        var numOfDiagonals = lengthOfDiagonal - 3;
        var diagonals = new Array(numOfDiagonals);
        for (var j = 0; j < numOfDiagonals; j++, lengthOfDiagonal--) {
            var evaledArg1 = eval(arg1);
            for (var i = evaledArg1; i < lengthOfDiagonal + evaledArg1; i++) {
                if (diagonals[j] === undefined) {
                    diagonals[j] = [];
                }
                diagonals[j].push({ x:(i), y:(eval(arg2)) });
            }
        }
        return diagonals;
    }
    
    var positiveSlopeDiagonalsTop = partialDiagonals(lengthOfDiagonal, this.board, "0", "i+j");
    var positiveSlopeDiagonalsBottom = partialDiagonals(lengthOfDiagonal, this.board, "j+1", "i-j-1");  
    var negativeSlopeDiaognalsTop = partialDiagonals(lengthOfDiagonal, this.board, "j+1", "6-i+j");
    var negativeSlopeDiaognalsBottom = partialDiagonals(lengthOfDiagonal, this.board, "0", "5-i-j");
    
    return positiveSlopeDiagonalsTop
            .concat(positiveSlopeDiagonalsBottom)
            .concat(negativeSlopeDiaognalsTop)
            .concat(negativeSlopeDiaognalsBottom);
};
GameBoard.prototype.diagonals = function() {
    //var diagonals = new Array(this.height - 3);
    return this.diagonals_indices.map(function(diagonal){
        return diagonal.map(function(e){
            return this.board[e.x][e.y];  
        }, this);
    }, this);
};

var game = new Game();
game.updateView();

});

/*
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
*/


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
//game.updateView();

//console.log("diagonals: ");
//console.log(JSON.stringify(game.gameboard.diagonals()));


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
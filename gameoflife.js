/**
 * Conway's Game of Life
 *
 * Dan Friedman
 * 9/24/2016
 */

var GameOfLife = function() {
	this.canvas = document.getElementById("game-board");
	this.ctx = this.canvas.getContext("2d");

	this.ctx.strokeStyle = "#444";
	this.ctx.fillStyle = "red";

	this.numCells = 4096;
	this.cellSize = 8;			// cells are squares
	this.boardWidth = Math.sqrt(this.numCells);
	this.board = new Array(this.numCells);
	this.temp = new Array(this.numCells);

	this.drawGrid();
	this.fillBoard();
	this.drawBoard();
}

GameOfLife.prototype.drawGrid = function() {
	var width = this.canvas.width,
		height = this.canvas.height,
		ctx = this.ctx,
		cellSize = this.cellSize,
		row, col;

	for (col = .5; col <= width; col += cellSize) {
		ctx.beginPath();
		ctx.moveTo(col, 0);
		ctx.lineTo(col, height);
		ctx.closePath();
		ctx.stroke();
	}

	for (row = .5; row <= height; row += cellSize) {
		ctx.beginPath();
		ctx.moveTo(0, row);
		ctx.lineTo(width, row);
		ctx.closePath();
		ctx.stroke();
	}
}

GameOfLife.prototype.fillCell = function(cell) {
	var boardWidth = this.boardWidth,
		cellSize = this.cellSize;

	var x = (cell % boardWidth) * cellSize + 1;
	var y = Math.floor(cell / boardWidth) * cellSize + 1;
	this.ctx.fillRect(x, y, cellSize-1, cellSize-1);
}

GameOfLife.prototype.drawBoard = function() {
	var board = this.board;

	for (var i = 0; i < board.length; i++) {
		if (board[i])
			this.fillCell(i);
	}
}

GameOfLife.prototype.fillBoard = function() {
	var board = this.board;
	for (var i = 0; i < board.length; i++) {
		board[i] = Math.round(Math.random());
	}
}

var game = new GameOfLife();












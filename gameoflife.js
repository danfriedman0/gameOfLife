/**
 * Conway's Game of Life
 *
 * Dan Friedman
 * 9/24/2016
 */

"use strict";

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

	this.interval = null;
	this.playing = false;

	this.init();
}

GameOfLife.prototype.addListeners = function() {
	var me = this;
	document.getElementById("go").addEventListener("click", function() {
		if (me.playing) {
			me.stop();
			this.innerHTML = "go";
		}
		else {
			me.start();
			this.innerHTML = "stop";
		}
	});
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

GameOfLife.prototype.drawCel = function(cell, isAlive) {
	var boardWidth = this.boardWidth,
		cellSize = this.cellSize,
		ctx = this.ctx;

	var x = (cell % boardWidth) * cellSize + 1;
	var y = Math.floor(cell / boardWidth) * cellSize + 1;

	if (isAlive)
		ctx.fillRect(x, y, cellSize-1, cellSize-1);
	else
		ctx.clearRect(x, y, cellSize-1, cellSize-1);
}

GameOfLife.prototype.drawBoard = function() {
	var board = this.board;

	for (var i = 0; i < board.length; i++)
		this.drawCel(i, board[i]);
}

GameOfLife.prototype.fillBoard = function() {
	var board = this.board;
	for (var i = 0; i < board.length; i++) {
		board[i] = Math.round(Math.random());
	}

	this.temp = board;
}

GameOfLife.prototype.isEdge = function(i) {
	var boardWidth = this.boardWidth;

	return {
		right: i % boardWidth === boardWidth - 1,
		left: i % boardWidth === 0,
		top: i < boardWidth,
		bottom: i >= boardWidth * (boardWidth - 1)
	};
}

GameOfLife.prototype.countNeighbors = function(i) {
	var boardWidth = this.boardWidth,
		numCells = this.numCells,
		board = this.board,
		n = 0,
		isEdge = this.isEdge(i);

	if (!isEdge.left && board[i-1])										// left
		n += 1;
	if (!isEdge.right && board[i+1])									// right
		n += 1;
	if (!isEdge.top && board[i - boardWidth])							// top
		n += 1;
	if (!isEdge.bottom && board[i + boardWidth])						// bottom
		n += 1;
	if (!isEdge.left && !isEdge.top && board[i - boardWidth - 1]) 		// top left
		n += 1;
	if (!isEdge.right && !isEdge.top && board[i - boardWidth + 1])		// top right
		n += 1;
	if (!isEdge.left && !isEdge.bottom && board[i + boardWidth - 1])	// bottom left
		n += 1;
	if (!isEdge.right && !isEdge.bottom && board[i + boardWidth + 1])	// bottom right
		n += 1;

	return n;
}

GameOfLife.prototype.step = function() {
	var temp = this.temp,
		n;

	for (var i = 0; i < temp.length; i++) {
		n = this.countNeighbors(i);
		if (n < 2)
			temp[i] = 0;
		else if (n === 3)
			temp[i] = 1;
		else if (n > 3)
			temp[i] = 0;
	}

	this.board = temp;
	this.drawBoard();
}

GameOfLife.prototype.start = function() {
	var me = this;

	this.interval = window.setInterval(function() {
		me.step();
	}, 500);

	this.playing = true;
}

GameOfLife.prototype.stop = function() {
	window.clearInterval(this.interval);
	this.playing = false;
}

GameOfLife.prototype.init = function() {
	this.drawGrid();
	this.fillBoard();
	this.drawBoard();
	this.addListeners();
}

var game = new GameOfLife();













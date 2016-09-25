/**
 * Conway's Game of Life
 *
 * Dan Friedman
 * 9/24/2016
 */

"use strict";

function compareArrays(arr1, arr2) {
	if (!(arr1 instanceof Array) || !(arr2 instanceof Array)) {
		return false;
	}
	if (arr1.length !== arr2.length) {
		return false;
	}

	for (var i = 0, len = arr1.length; i < len; i++) {
		if (arr1[i] instanceof Array && arr2[i] instanceof Array) {
			if (!compareArrays(arr1[i], arr2[i])) {
				return false;
			}
		}
		if (arr1[i] !== arr2[i]) {
			return false;
		}
	}

	return true;
}

var GameOfLife = function() {
	this.canvas = document.getElementById("game-board");
	this.ctx = this.canvas.getContext("2d");

	this.ctx.strokeStyle = "#444";
	this.ctx.fillStyle = "red";

	this.numCells = 4096;
	this.cellSize = 8;			// cells are squares
	this.boardWidth = 64;
	this.boardHeight = 64;

	this.board = new Array(this.numCells);
	this.temp = new Array(this.numCells);

	this.interval = null;
	this.playing = false;
	this.timestep = document.getElementById("timestep").value;
	this.stepCount = document.getElementById("step-count");
	this.goButton = document.getElementById("go");

	this.mouseDown = false;

	this.init();
}

GameOfLife.prototype.addListeners = function() {
	var me = this;
	me.goButton.addEventListener("click", function() {
		if (me.playing)
			me.stop()
		else
			me.start();
	});

	document.getElementById("timestep").addEventListener("change", function() {
		me.timestep = this.value;
	});

	document.getElementById("reset-step-count").addEventListener("click", function() {
		me.stepCount.innerHTML = "0";
	});

	document.getElementById("randomize-board").addEventListener("click", function() {
		me.fillBoard();
		me.stepCount.innerHTML = "0";
	});

	document.getElementById("clear-board").addEventListener("click", function() {
		me.fillBoard(false);
		me.stepCount.innerHTML = "0";
	});

	me.canvas.addEventListener("click", function(e) {
		var x = Math.floor((e.clientX - this.offsetLeft) / me.cellSize);
		var y = Math.floor((e.clientY - this.offsetTop) / me.cellSize);
		me.clickCel(x, y);
	});

	me.canvas.addEventListener("mousedown", function() {
		me.mouseDown = true;
	});

	me.canvas.addEventListener("mouseup", function() {
		me.mouseDown = false;
	})

	me.canvas.addEventListener("mousemove", function(e) {
		if (me.mouseDown) {
			var x = Math.floor((e.clientX - this.offsetLeft) / me.cellSize);
			var y = Math.floor((e.clientY - this.offsetTop) / me.cellSize);
			me.clickCel(x, y);
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

GameOfLife.prototype.clickCel = function(x, y) {
	var me = this;
	var i = x + me.boardWidth * y;

	me.board[i] = !me.board[i];
	me.drawCel(i, me.board[i] || me.mouseDown);
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

GameOfLife.prototype.fillBoard = function(val) {
	var board = this.board;
	for (var i = 0; i < board.length; i++)
		board[i] = val === false ? false : Boolean(Math.round(Math.random()));
	this.drawBoard();
}

GameOfLife.prototype.isEdge = function(i) {
	var boardWidth = this.boardWidth,
		boardHeight = this.boardHeight;

	return {
		right: i % boardWidth === boardWidth - 1,
		left: i % boardWidth === 0,
		top: i < boardWidth,
		bottom: i >= boardWidth * (boardHeight - 1)
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

GameOfLife.prototype.incrementStepCount = function() {
	this.stepCount.innerHTML = parseInt(this.stepCount.innerHTML) + 1;
}

GameOfLife.prototype.step = function() {
	var board = this.board,
		temp = this.temp,
		cellCount = 0,
		n;

	temp = board.slice();

	for (var i = 0; i < temp.length; i++) {
		n = this.countNeighbors(i);
		if (n < 2)
			temp[i] = false;
		else if (n === 3)
			temp[i] = true;
		else if (n > 3)
			temp[i] = false;
		cellCount += temp[i];
	}

	this.board = temp.slice();
	this.drawBoard();

	if (cellCount === 0)
		this.stop();
	else 
		this.incrementStepCount();
}

GameOfLife.prototype.start = function() {
	var me = this;

	this.interval = window.setInterval(function() {
		me.step();
	}, 1000/this.timestep);

	this.playing = true;
	this.goButton.innerHTML = "stop";
}

GameOfLife.prototype.stop = function() {
	window.clearInterval(this.interval);
	this.playing = false;
	this.goButton.innerHTML = "go";
}

GameOfLife.prototype.init = function() {
	this.drawGrid();
	this.addListeners();
	this.fillBoard(false);
}

var game = new GameOfLife();













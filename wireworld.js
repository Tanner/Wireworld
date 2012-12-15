const CELL_SIZE = 10;

const CELL_SPACING = 5;

const CELL_ROWS = 40;
const CELL_COLS = 40;

State = {
	EMPTY : 0,
	ELECTRON_HEAD : 1,
	ELECTRON_TAIL : 2,
	CONDUCTOR : 3
}

var cells;

var canvas;

function init() {
	canvas = document.getElementById("screen");

	canvas.width = CELL_COLS * CELL_SIZE + (CELL_COLS + 1) * CELL_SPACING;
	canvas.height = CELL_ROWS * CELL_SIZE + (CELL_ROWS + 1) * CELL_SPACING;

	canvas.style.width = canvas.width + "px";
	canvas.style.height = canvas.height + "px";

	var wrapper = document.getElementById("wrapper");
	wrapper.style.marginTop = "-" + canvas.height / 2 + "px";
	wrapper.style.marginLeft = "-" + canvas.width / 2 + "px";

	cells = new Array(CELL_ROWS);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(CELL_COLS);
		
		for (var j = 0; j < cells[i].length; j++) {
			cells[i][j] = new Cell(i, j, State.CONDUCTOR);
		}
	}

	update();
}

function update() {
	if (canvas.getContext) {
		var context = canvas.getContext("2d");
		
		render(context);
	}
}

function render(context) {
	context.clearRect(0, 0, window.innerHeight, window.innerWidth);
	
	for (var row = 0; row < CELL_ROWS; row++) {
		for (var column = 0; column < CELL_COLS; column++) {
			var cell = cells[row][column];

			cell.draw(context);
		}
	}
}

function Cell(row, column, state) {
	this.state_ = state;

	this.row_ = row;
	this.column_ = column;

	this.draw = function(context) {
		if (this.state_ == State.ELECTRON_HEAD) {
			context.fillStyle = "#F00";
		} else if (this.state_ == State.ELECTRON_TAIL) {
			context.fillStyle = "#00F";
		} else if (this.state_ == State.CONDUCTOR) {
			context.fillStyle = "#003107";
		}

		var paintX = this.column_ * CELL_SIZE + (this.column_ + 1) * CELL_SPACING;
		var paintY = this.row_ * CELL_SIZE + (this.row_ + 1) * CELL_SPACING;

		context.fillRect(paintX, paintY, CELL_SIZE, CELL_SIZE);
	}
}
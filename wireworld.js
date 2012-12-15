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

var screen, width, height;

window.onload = function() {
	canvas = document.getElementById("canvas");

	width = canvas.clientWidth;
	height = canvas.clientHeight;

	screen = Raphael("canvas", width, height);

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
	render();
}

function render() {
	screen.clear();
	
	for (var row = 0; row < CELL_ROWS; row++) {
		for (var column = 0; column < CELL_COLS; column++) {
			var cell = cells[row][column];

			cell.draw(screen);
		}
	}
}

function Cell(row, column, state) {
	this.state_ = state;

	this.row_ = row;
	this.column_ = column;

	this.entity_ = null;

	this.draw = function(screen) {
		if (this.entity_ == null) {
			var paintX = this.column_ * CELL_SIZE + (this.column_ + 1) * CELL_SPACING;
			var paintY = this.row_ * CELL_SIZE + (this.row_ + 1) * CELL_SPACING;

			this.entity_ = screen.rect(paintX, paintY, CELL_SIZE, CELL_SIZE, 0);
			this.entity_.attr({fill: "#000", stroke: "none"});
		}

		var color = "#000";

		if (this.state_ == State.ELECTRON_HEAD) {
			color = "#F00";
		} else if (this.state_ == State.ELECTRON_TAIL) {
			color = "#00F";
		} else if (this.state_ == State.CONDUCTOR) {
			color = "#003107";
		}

		this.entity_.attr({fill: color, stroke: "none"});
	}
}
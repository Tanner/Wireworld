const CELL_SIZE = 10;

const CELL_SPACING = 5;

State = {
	EMPTY : 0,
	CONDUCTOR : 1,
	ELECTRON_HEAD : 2,
	ELECTRON_TAIL : 3,
}

var cells;

var screen, width, height;

window.onload = function() {
	canvas = document.getElementById("canvas");

	width = canvas.clientWidth;
	height = canvas.clientHeight;

	screen = Raphael("canvas", width, height);

	var rows = Math.floor(height / (CELL_SIZE + CELL_SPACING));
	var cols = Math.floor(width / (CELL_SIZE + CELL_SPACING));

	cells = new Array(rows);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(cols);
		
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
	
	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
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

			var cell = this;

			this.entity_.node.onclick = function() {
				cell.state_ = (cell.state_ + 1) % Object.keys(State).length;

				cell.draw(screen);
			};
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
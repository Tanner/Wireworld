const CELL_SIZE = 10;

Mode = {
	STOP : 0,
	RUN : 1,
	FAST : 2,
}

State = {
	EMPTY : 0,
	CONDUCTOR : 1,
	ELECTRON_HEAD : 2,
	ELECTRON_TAIL : 3,
}

var cells;
var interval;
var currentMode = Mode.STOP;

var screen, width, height;

window.onload = function() {
	canvas = document.getElementById("canvas");

	width = canvas.clientWidth;
	height = canvas.clientHeight;

	screen = Raphael("canvas", width, height);

	var rows = Math.floor(height / CELL_SIZE);
	var cols = Math.floor(width / CELL_SIZE);

	cells = new Array(rows);
	for (var i = 0; i < cells.length; i++) {
		cells[i] = new Array(cols);
		
		for (var j = 0; j < cells[i].length; j++) {
			cells[i][j] = new Cell(i, j, State.EMPTY);
		}
	}

	render();
}

function stop() {
	if (interval) {
		window.clearInterval(interval);

		interval = null;
	}

	currentMode = Mode.STOP;

	document.getElementById("run").className = "btn";
	document.getElementById("step").className = "btn";
	document.getElementById("fast").className = "btn";
}

function run() {
	if (currentMode != Mode.STOP) {
		return;
	}

	currentMode = Mode.RUN;

	document.getElementById("run").className = "btn disabled";
	document.getElementById("step").className = "btn disabled";
	document.getElementById("fast").className = "btn disabled";

	interval = window.setInterval(step, 250);
}

function step() {
	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
			var cell = cells[row][column];

			cell.currentState_ = cell.nextState_;
		}
	}

	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
			var cell = cells[row][column];

			if (cell.nextState_ == State.ELECTRON_HEAD) {
				cell.nextState_ = State.ELECTRON_TAIL;
			} else if (cell.nextState_ == State.ELECTRON_TAIL) {
				cell.nextState_ = State.CONDUCTOR;
			} else if (cell.nextState_ == State.CONDUCTOR) {
				// Check neighbors for a cell in state ELECTRON_HEAD
				function validPosition(row, column) {
					return row >= 0 && column >= 0 && row < cells.length && column < cells[row].length;
				}

				function countNeighbors(row, column, type) {
					var numberOfNeighors = 0;

					for (var i = -1; i <= 1; i++) {
						for (var j = -1; j <= 1; j++) {
							if (i == 0 && j == 0) {
								continue;
							}

							var r = row + i;
							var c = column + j;

							if (validPosition(r, c) && cells[r][c].currentState_ == type) {
								numberOfNeighors++;
							}
						}
					}

					return numberOfNeighors;
				}

				var numberOfNeighors = countNeighbors(row, column, State.ELECTRON_HEAD);

				if (numberOfNeighors == 1 || numberOfNeighors == 2) {
					cell.nextState_ = State.ELECTRON_HEAD;
				}
			}

			cell.draw(screen);
		}
	}
}

function fast() {
	if (currentMode != Mode.STOP) {
		return;
	}
	
	currentMode = Mode.FAST;

	(function() {
		var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
			window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
		window.requestAnimationFrame = requestAnimationFrame;
	})();

	var refresh = function() {
		step();

		if (currentMode == Mode.FAST) {
			requestAnimationFrame(refresh);
		}
	}

	document.getElementById("run").className = "btn disabled";
	document.getElementById("step").className = "btn disabled";
	document.getElementById("fast").className = "btn disabled";

	requestAnimationFrame(refresh);
}

function reset() {
	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
			var cell = cells[row][column];

			if (cell.currentState_ == State.ELECTRON_HEAD || cell.currentState_ == State.ELECTRON_TAIL) {
				cell.currentState_ = State.CONDUCTOR;

				cell.draw(screen);
			}

			if (cell.nextState_ == State.ELECTRON_HEAD || cell.nextState_ == State.ELECTRON_TAIL) {
				cell.nextState_ = State.CONDUCTOR;

				cell.draw(screen);
			}
		}
	}
}

function trash() {
	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
			var cell = cells[row][column];

			if (cell.currentState_ != State.EMPTY || cell.nextState_ != State.EMPTY) {
				cell.currentState_ = State.EMPTY;
				cell.nextState_ = cell.currentState_;

				cell.draw(screen);
			}
		}
	}
}

function export_world() {
	var exported = [];

	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
			var cell = cells[row][column];

			if (cell.currentState_ != State.EMPTY) {
				exported.push({
					row: cell.row_,
					column: cell.column_,
					state: cell.currentState_
				});
			}
		}
	}

	return JSON.stringify(exported);	
}

function import_world(json) {
	var data = JSON.parse(json);

	// Clear the screen
	trash();

	// Add all the imported data back
	for (var i = 0; i < data.length; i++) {
		var entry = data[i];
		var cell = cells[entry.row][entry.column];

		cell.currentState_ = entry.state;
		cell.nextState_ = cell.currentState_;

		cell.draw(screen);
	}
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

function show_export() {
	$('#export-modal textarea').text(export_world());

	$('#export-modal').modal('show');
}

function show_import() {
	$('#import-modal').modal('show');
}

function modal_import() {
	import_world($('#import-modal textarea').val());

	$('#import-modal').modal('hide');
}

function Cell(row, column, state) {
	this.lastState_ = null;
	this.currentState_ = state;
	this.nextState_ = state;

	this.row_ = row;
	this.column_ = column;

	this.entity_ = null;

	this.draw = function(screen) {
		// If the state hasn't changed, don't bother redrawing anything
		if (this.lastState_ == this.currentState_) {
			return;
		}

		this.lastState_ = this.currentState_;

		if (this.entity_ == null) {
			var paintX = this.column_ * CELL_SIZE;
			var paintY = this.row_ * CELL_SIZE;

			this.entity_ = screen.rect(paintX, paintY, CELL_SIZE, CELL_SIZE, 0);
			this.entity_.attr({fill: "#000", stroke: "none"});

			(function(cell) {
				cell.entity_.node.onclick = function() {
					cell.currentState_ = (cell.currentState_ + 1) % Object.keys(State).length;
					cell.nextState_ = cell.currentState_;

					cell.draw(screen);
				};

				cell.entity_.node.onmouseover = function() {
					if (cell.currentState_ == State.EMPTY) {
						cell.entity_.attr({fill: "#444", stroke: "none"});
					}
				};

				cell.entity_.node.onmouseout = function() {
					if (cell.currentState_ == State.EMPTY) {
						cell.entity_.attr({fill: "#000", stroke: "none"});
					}
				};
			})(this);
		}

		var color = "#000";

		if (this.currentState_ == State.ELECTRON_HEAD) {
			color = "#F00";
		} else if (this.currentState_ == State.ELECTRON_TAIL) {
			color = "#00F";
		} else if (this.currentState_ == State.CONDUCTOR) {
			color = "#003107";
		}

		this.entity_.attr({fill: color, stroke: "none"});
	}
}
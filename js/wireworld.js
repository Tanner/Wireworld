const CELL_SIZE = 10;

const BUTTON_A_KEY = '1';
const BUTTON_B_KEY = '2';
const BUTTON_C_KEY = '3';
const BUTTON_D_KEY = '4';

Mode = {
	STOP : 0,
	RUN : 1,
	FAST : 2,
}

Type = {
	NORMAL : 0,
	LIGHT : 1,
	BUTTON_A : 2,
	BUTTON_B : 3,
	BUTTON_C : 4,
	BUTTON_D : 5,
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

var selectedCell = null;
var buttonPushed = [];

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
			cells[i][j] = new Cell(i, j, State.EMPTY, screen);
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
			} else if (cell.nextState_ == State.CONDUCTOR || cell.type_ == Type.LIGHT) {
				// Check neighbors for a cell in state ELECTRON_HEAD
				function validPosition(row, column) {
					return row >= 0 && column >= 0 && row < cells.length && column < cells[row].length;
				}

				function neighborFunction(row, column, action) {
					for (var i = -1; i <= 1; i++) {
						for (var j = -1; j <= 1; j++) {
							if (i == 0 && j == 0) {
								continue;
							}

							var r = row + i;
							var c = column + j;

							if (validPosition(r, c)) {
								action(r, c);
							}
						}
					}
				}

				function countNeighbors(row, column, type) {
					var numberOfNeighors = 0;

					neighborFunction(row, column, function(r, c) {
						if (cells[r][c].currentState_ == type && cells[r][c].type_ == Type.NORMAL) {
							numberOfNeighors++;
						}
					});

					return numberOfNeighors;
				}

				// Are having a neighbor around us that is an ELECTRON_HEAD?
				var numberOfNeighors = countNeighbors(row, column, State.ELECTRON_HEAD);

				if (numberOfNeighors == 1 || numberOfNeighors == 2) {
					cell.nextState_ = State.ELECTRON_HEAD;
				}

				// Is there a button around us that is active?
				var buttonActive = false;

				neighborFunction(row, column, function(r, c) {
					if (buttonActive) {
						return;
					}

					if (!key.shift) {
						if (cells[r][c].type_ == Type.BUTTON_A && key.isPressed(BUTTON_A_KEY) && !buttonPushed[BUTTON_A_KEY]) {
							buttonActive = true;

							buttonPushed[BUTTON_A_KEY] = true;
						} else if (cells[r][c].type_ == Type.BUTTON_B && key.isPressed(BUTTON_B_KEY) && !buttonPushed[BUTTON_B_KEY]) {
							buttonActive = true;

							buttonPushed[BUTTON_B_KEY] = true;
						} else if (cells[r][c].type_ == Type.BUTTON_C && key.isPressed(BUTTON_C_KEY) && !buttonPushed[BUTTON_C_KEY]) {
							buttonActive = true;

							buttonPushed[BUTTON_C_KEY] = true;
						} else if (cells[r][c].type_ == Type.BUTTON_D && key.isPressed(BUTTON_D_KEY) && !buttonPushed[BUTTON_D_KEY]) {
							buttonActive = true;

							buttonPushed[BUTTON_D_KEY] = true;
						}
					}
				});

				if (!key.isPressed(BUTTON_A_KEY) && buttonPushed[BUTTON_A_KEY]) {
					buttonPushed[BUTTON_A_KEY] = false;
				}

				if (!key.isPressed(BUTTON_B_KEY) && buttonPushed[BUTTON_B_KEY]) {
					buttonPushed[BUTTON_B_KEY] = false;
				}

				if (!key.isPressed(BUTTON_C_KEY) && buttonPushed[BUTTON_C_KEY]) {
					buttonPushed[BUTTON_C_KEY] = false;
				}

				if (!key.isPressed(BUTTON_D_KEY) && buttonPushed[BUTTON_D_KEY]) {
					buttonPushed[BUTTON_D_KEY] = false;
				}

				if (buttonActive) {
					cell.nextState_ = State.ELECTRON_HEAD;
				}

				if (cell.nextState_ == State.ELECTRON_HEAD && cell.type_ == Type.LIGHT) {
					cell.lit_ = true;
				}
			}

			cell.draw();
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

				cell.draw();
			}

			if (cell.nextState_ == State.ELECTRON_HEAD || cell.nextState_ == State.ELECTRON_TAIL) {
				cell.nextState_ = State.CONDUCTOR;

				cell.draw();
			}

			if (cell.type_ == Type.LIGHT) {
				cell.lit_ = false;

				cell.draw();
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

				cell.draw();
			}

			if (cell.type_ != Type.NORMAL) {
				cell.type_ = Type.NORMAL;

				cell.draw(true);
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

		cell.draw();
	}
}

function render() {
	screen.clear();
	
	for (var row = 0; row < cells.length; row++) {
		for (var column = 0; column < cells[row].length; column++) {
			var cell = cells[row][column];

			cell.draw();
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

function Cell(row, column, state, screen) {
	this.lastState_ = null;
	this.currentState_ = state;
	this.nextState_ = state;

	this.hover_ = false;
	this.lit_ = false;

	this.type_ = Type.NORMAL;

	this.row_ = row;
	this.column_ = column;

	this.entity_ = null;
	this.screen_ = screen;

	this.draw = function(force) {
		// If the state hasn't changed, don't bother redrawing anything only if we're not forced
		if (this.lastState_ == this.currentState_ && this.type_ != Type.LIGHT) {
			if (force == undefined || force == false) {
				return;	
			}
		}

		this.lastState_ = this.currentState_;

		if (this.entity_ == null) {
			var paintX = this.column_ * CELL_SIZE;
			var paintY = this.row_ * CELL_SIZE;

			this.entity_ = this.screen_.rect(paintX, paintY, CELL_SIZE, CELL_SIZE, 0);
			this.entity_.attr({fill: "#000", stroke: "none"});

			(function(cell) {
				cell.entity_.node.onclick = function() {
					cell.currentState_ = (cell.currentState_ + 1) % Object.keys(State).length;
					cell.nextState_ = cell.currentState_;

					cell.draw();
				};

				cell.entity_.node.onmouseover = function() {
					selectedCell = cell;

					cell.hover_ = true;

					cell.draw(true);
				};

				cell.entity_.node.onmouseout = function() {
					selectedCell = null;

					cell.hover_ = false;

					cell.draw(true);
				};
			})(this);
		}

		var color = "#000";

		if (this.hover_) {
			color = "#555";
		} else {
			if (this.type_ == Type.NORMAL) {
				if (this.currentState_ == State.ELECTRON_HEAD) {
					color = "#FFF";
				} else if (this.currentState_ == State.ELECTRON_TAIL) {
					color = "#0f80f7";
				} else if (this.currentState_ == State.CONDUCTOR) {
					color = "#ff882c";
				}
			} else if (this.type_ == Type.BUTTON_A) {
				color = "#910ff7";
			} else if (this.type_ == Type.BUTTON_B) {
				color = "#140ff7";
			} else if (this.type_ == Type.BUTTON_C) {
				color = "#00f700";
			} else if (this.type_ == Type.BUTTON_D) {
				color = "#f7150f";
			} else if (this.type_ == Type.LIGHT) {
				if (this.lit_) {
					color = "#e3df0e";
				} else {
					color = "#787607";
				}
			}
		}

		this.entity_.attr({fill: color, stroke: "none"});
	}
}

key('a, j', function() {
	if (selectedCell) {
		selectedCell.currentState_ = State.CONDUCTOR;
		selectedCell.nextState_ = selectedCell.currentState_;

		selectedCell.draw();
	}
});

key('s, k', function() {
	if (selectedCell) {
		selectedCell.currentState_ = State.EMPTY;
		selectedCell.nextState_ = selectedCell.currentState_;

		selectedCell.draw();
	}
});

key('d, l', function() {
	if (selectedCell) {
		selectedCell.currentState_ = State.ELECTRON_HEAD;
		selectedCell.nextState_ = selectedCell.currentState_;

		selectedCell.draw();
	}
});

key('f, ;', function() {
	if (selectedCell) {
		selectedCell.currentState_ = State.ELECTRON_TAIL;
		selectedCell.nextState_ = selectedCell.currentState_;

		selectedCell.draw();
	}
});

function toggleType(type) {
	if (selectedCell) {
		if (selectedCell.type_ == type) {
			selectedCell.type_ = Type.NORMAL;
		} else {
			selectedCell.type_ = type;
		}
	}	
}

key('shift+' + BUTTON_A_KEY, function() {
	toggleType(Type.BUTTON_A);
});

key('shift+' + BUTTON_B_KEY, function() {
	toggleType(Type.BUTTON_B);
});

key('shift+' + BUTTON_C_KEY, function() {
	toggleType(Type.BUTTON_C);
});

key('shift+' + BUTTON_D_KEY, function() {
	toggleType(Type.BUTTON_D);
});

key('b', function() {
	toggleType(Type.LIGHT);
});

key('right', function() {
	step();
});
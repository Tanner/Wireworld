Wireworld
=========
[Wireworld](http://en.wikipedia.org/wiki/Wireworld) is a turning complete cellular automata built in HTML5 and [Raphael](http://raphaeljs.com/).

Instructions
------------
### Controlling the Simulation
There are 6 controls at the bottom of the simulation window used to control the simulation.

From left to right they are:
 - Stop – Stops the simulation
 - Run – Runs the simulation at 1 tick every 1/4 of a second
 - Step – Steps the simulation by 1 tick
 - Fast – Runs the simulation as fast as requestAnimationFrame will go
 - Reset – Removes all electrons and resets all lamps to 'off' from the simulation
 - Trash - Removes all non-empty cells from the simulation

### Setting a Cell State
You can set a cell state in two ways.

The various cell states are:
 - Empty
 - Conductor
 - Electron Head
 - Electron Tail

#### Mouse
Clicking on a cell with cause it to cycle through the various states.

Once it reaches the end it will wrap around, e.g. from Electron Tail back to Empty.

#### Keyboard
Hovering over a cell and pressing one of four keyboard keys will cause the cell's state to be set.

 - `a` or `j` – Conductor
 - `s` or `k` - Empty
 - `d` or `l` - Electron Head
 - `f` or `;` - Electron Tail

Pressing a state key on a cell already of that state, will not cause the state to change.

### Special Cells
#### Buttons
Buttons exist to make it easy to create an electron around any surrounding conductor. Essentially, it represents an Electron Head on command.

##### Adding / Removing
You can add up to 4 different buttons by using pressing the `shift` key and a number key from `1` to `4`.

Removing is the same key command.

##### Pushing
You trigger a button press by pressing the corresponding button number while the simulation is running.

e.g. To press a button created with `shift + 1`, you press `1`.

#### Lamps
You can add a simple indicator for whether an Electron Head has reached a certain part of the circuit by pressing `b` over any cell.

Removing is the same key command.

### Importing / Exporting
You can import or export setups by using the two buttons below the simulation controls.

Copy and paste the provided JSON and you can get that exact simulation again later.

You can see some examples of various circuits in the `examples` directory.

Examples
--------
Examples can be imported from the JSON provided in the `examples` directory.

Examples provided from [Quinapalus - Wireworld Computer](http://www.quinapalus.com/wi-index.html) and [Karl Scherer](http://karlscherer.com/Wireworld.html).

If you have any more examples you'd like to contribute, make a pull request.
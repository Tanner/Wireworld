Wireworld
=========
Wireworld is [Wireworld](http://en.wikipedia.org/wiki/Wireworld) built in HTML5 and [Raphael](http://raphaeljs.com/).

Instructions
------------
### Controlling the Simulation
There are 6 controls at the bottom of the simulation window used to control the simulation.

From left to right they are:
 - Stop – Stops the simulation
 - Run – Runs the simulation at 1 tick every 1/4 of a second
 - Step – Steps the simulation by 1 tick
 - Fast – Runs the simulation as fast as requestAnimationFrame will go
 - Reset – Removes all electrons from the simulation
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

 - a or j – Conductor
 - s or k - Empty
 - d or l - Electron Head
 - f or ; - Electron Tail

Pressing a state key on a cell already of that state, will not cause the state to change.

### Importing / Exporting
You can import or export setups by using the two buttons below the simulation controls.

Copy and paste the provided JSON and you can get that exact simulation again later.

You can see some examples of various circuits in the `examples` directory.

Examples
--------
Examples can be imported from the JSON provided in the examples/ directory.

Examples provided from [Quinapalus - Wireworld Computer](http://www.quinapalus.com/wi-index.html).

If you have any more examples you'd like to contribute, make a pull request.
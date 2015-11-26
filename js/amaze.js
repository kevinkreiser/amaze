//a few globals
var dimensions = 25
var cells;
var start;
var end;

function round(value) { return (value + 0.5) | 0; }

//show the maze
var draw = function () {
  var canvas = document.getElementById('maze');
  var context = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  //fill
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw the maze
  var scale = canvas.width < canvas.height ? canvas.width / dimensions : canvas.height / dimensions;
  context.fillStyle = 'white';
  cells.forEach(function(column, column_index) {
    column.forEach(function(row, row_index) {
      if(row == 1)
        context.fillRect(column_index * scale, row_index * scale, scale, scale);
    });
  });

  //draw the start and end
  context.fillStyle = '#3366CC';
  context.fillRect(start[0] * scale, start[1] * scale, scale, scale);
  context.fillStyle = '#009933';
  context.fillRect(end[0] * scale, end[1] * scale, scale, scale);

  //did you win
  if(start[0] == end[0] && start[1] == end[1]) {
    alert('You Won!');
    reset();
  } 
};

//initialize a new maze
var reset = function () {
  //clear the maze
  cells = [];
  for(var c = 0; c < dimensions; c++) {
    cells.push([]);
    for(var r = 0; r < dimensions; r++)
      cells[c].push(round(Math.random()));
  }

  //generate the maze
  start = [round(Math.random() * (dimensions - 1)), round(Math.random() * (dimensions - 1))];
  end = [round(Math.random() * (dimensions - 1)), round(Math.random() * (dimensions - 1))];
  /*end = start;
  (function depth_first(cell) {
    cells[end[0]][end[1]] = 1;
  })(end);
  */
  

  //TODO:
  //instead of keep all cells we could just keep lines of continguous white
  //this would be smaller data and faster to (re)draw
  //it would be useless for maze traversal though
      
  //show it
  draw();
};

//show the solution to the maze
var solve = function () {
  //TODO: dijkstras
};

//move around the maze
var onKeyPress = function(e) {
  if(e.keyCode > 36 && e.keyCode < 41) {
    var next = [start[0] + ((e.keyCode - 38) % 2), start[1] + ((e.keyCode - 39) % 2)];
    if(next[0] > -1 && next[1] > -1 && next[0] < dimensions && next[1] < dimensions && cells[next[0]][next[1]] == 1) {
      start = next;
      draw();
    }
  }
};

//capture interaction
window.addEventListener('keypress', onKeyPress);
//TODO: capture mouse clicks
//TODO: capture mobile gestures

//capture screen updates
window.onload = reset;
window.onresize = draw;

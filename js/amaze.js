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
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = 'black';
  context.fillRect(0, 0, canvas.width, canvas.height);

  //draw the maze
  var scale = canvas.width < canvas.height ? canvas.width / dimensions : canvas.height / dimensions;
  var line = function(x1, y1, x2, y2) { context.moveTo(x1 + .5, y1 + .5); context.lineTo(x2 + .5, y2 + .5); };
  context.scale(scale,scale);
  context.strokeStyle = 'white';
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = .75;
  cells.forEach(function(column, x) {
    column.forEach(function(row, y) {
      context.beginPath();
      if(row & 1) line(x, y, x - 1, y);
      if(row & 2) line(x, y, x + 1, y);
      if(row & 4) line(x, y, x, y - 1);
      if(row & 8) line(x, y, x, y + 1);
      context.stroke();
      context.closePath;
    });
  });

  //draw the start and end
  context.fillStyle = '#3366CC';
  context.beginPath();
  context.arc(start[0] + .5, start[1] + .5, .25, 0, 2 * Math.PI);
  context.closePath();
  context.fill();
  context.fillStyle = '#009933';
  context.beginPath();
  context.arc(end[0] + .5, end[1] + .5, .25, 0, 2 * Math.PI);
  context.closePath();
  context.fill();

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
  for(var x = 0; x < dimensions; x++) {
    cells.push([]);
    for(var y = 0; y < dimensions; y++)
      cells[x].push(0);
  }

  //TODO: pick start and end based on path length
  start = [round(Math.random() * (dimensions - 1)), round(Math.random() * (dimensions - 1))];
  end = [round(Math.random() * (dimensions - 1)), round(Math.random() * (dimensions - 1))];

  //get the shared walls between a cell and its neighbors
  var getWalls = function(x, y) {
    var walls = [];
    [[x - 1, y, 1], [x + 1, y, 2], [x, y - 1, 4], [x, y + 1, 8] ].forEach(function (n){
      if(n[0] > -1 && n[0] < dimensions && n[1] > -1 && n[1] < dimensions && cells[n[0]][n[1]] == 0)
        walls.push([[x, y], n]);
    });
    return walls;
  };

  //generate the maze starting at a random set of walls
  var walls = getWalls(round(Math.random() * (dimensions - 1)), round(Math.random() * (dimensions - 1)));
  while(walls.length) {
    //randomly pick a wall
    var index = (Math.random() * walls.length) | 0;
    var from = walls[index][0];
    var to = walls[index][1];
    walls.splice(index, 1);
    //connect it if its still needing connected
    if(cells[to[0]][to[1]] == 0) {
      cells[from[0]][from[1]] |= to[2];
      cells[to[0]][to[1]] |= (to[2] + 1) % 3 == 0 ? to[2] >> 1 : to[2] << 1;
      //add its relevant neighbors
      walls = walls.concat(getWalls(to[0], to[1]));
    }
  }

  //(function depth_first_backtrack(x, y){
  //})(0,0);
      
  //show it
  draw();
};

//show the solution to the maze
var solve = function () {
  //TODO: A*
};

//move around the maze
var keyToNeighbor = { 37: 1, 38: 4, 39: 2, 40: 8 };
var onKeyPress = function(e) {
  if(e.keyCode > 36 && e.keyCode < 41) {
    var next = [start[0] + ((e.keyCode - 38) % 2), start[1] + ((e.keyCode - 39) % 2)];
    var mask = cells[start[0]][start[1]];
    if(mask & keyToNeighbor[e.keyCode]) {
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

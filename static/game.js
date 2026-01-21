var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

const myButton = document.getElementById('myButton');
const outputParagraph = document.getElementById('output');

myButton.addEventListener('click', function() {
    outputParagraph.textContent = 'Button was clicked using an anonymous function!';
    console.log('Button clicked!');
    socket.emit('run');
});

socket.emit('new player');
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 700;
canvas.height = 400;
var context = canvas.getContext('2d');

// The URL of the image you want to load
const imageUrl = 'image/bg.png'; // Example image URL
const imagePUrl = 'image/p.png'; // Example image URL
// Create a new Image object
const img = new Image();
const player_img = new Image();
// Set the onload handler. The image must be loaded before it can be drawn.
img.onload = function() {
    // Draw the image onto the canvas at coordinates (0, 0)
    // ctx.drawImage(img, 0, 0);
	context.drawImage(img, 0, 0, canvas.width, canvas.height);
};
player_img.onload = function() {
    // Draw the image onto the canvas at coordinates (0, 0)
    // ctx.drawImage(img, 0, 0);
	//context.drawImage(img, 0, 0, canvas.width, canvas.height);
};
// Set the source of the image. This starts the loading process.
img.src = imageUrl;
player_img.src = imagePUrl;

socket.on('state', function(players) {
  console.log(players);
  context.clearRect(0, 0, 700, 400);
  // context.fillStyle = 'green';
  for (var id in players) {
    var player = players[id];
    context.drawImage(player_img, player.x, player.y);
    //context.beginPath();
    //context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    //context.fill();
  }
});

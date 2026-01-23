var socket = io();

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

var name = '';

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

document.addEventListener('click', (event) => {
  socket.emit('run');
}, false);


const myButton = document.getElementById('myButton');
const outputParagraph = document.getElementById('output');

//myButton.addEventListener('click', function() {
//    outputParagraph.textContent = 'Button was clicked using an anonymous function!';
//    console.log('Button clicked!');
//    socket.emit('run');
//});

window.onload = function() {
  document.getElementById("myPopup").style.display = "block";
};

function closePopup() {
  document.getElementById("myPopup").style.display = "none";
}

function submitData() {
  var input = document.getElementById("userInput").value;
	name = input;
  socket.emit('new player', input);
  closePopup();
}


// socket.emit('new player');
//setInterval(function() {
//  socket.emit('movement', movement);
//}, 1000 / 60);

var canvas = document.getElementById('canvas');
canvas.width = 700;
canvas.height = 400;
var context = canvas.getContext('2d');

function drawStroked(text, x, y) {
    context.font = "20px Sans-serif"
    context.strokeStyle = 'black';
    context.lineWidth = 4;
    context.lineJoin="miter"; //Experiment with "bevel" & "round" for the effect you want!
	context.miterLimit=2;
    context.strokeText(text, x, y);
    context.fillStyle = 'white';
    context.fillText(text, x, y);
}

// The URL of the image you want to load
const imageUrl = 'https://raw.githubusercontent.com/noviceplayer/MultiplayerGames/refs/heads/master/images/bg.png'; // Example image URL
const imagePUrl = 'https://raw.githubusercontent.com/noviceplayer/MultiplayerGames/refs/heads/master/images/p.png'; // Example image URL
// Create a new Image object
const img = new Image();
const player_img = new Image();
// Set the onload handler. The image must be loaded before it can be drawn.
img.onload = function() {
    // Draw the image onto the canvas at coordinates (0, 0)
    // ctx.drawImage(img, 0, 0);
	context.drawImage(img, 0, 0, canvas.width, canvas.height);
};
img.onerror = function() {
    console.error("Error loading the image from the provided URL.");
    context.fillStyle = 'red';
    context.fillText('Image failed to load', 10, 20);
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
  context.drawImage(img, 0, 0, canvas.width, canvas.height);
  for (var id in players) {
    var player = players[id];
    context.drawImage(player_img, player.x, player.y);
	  drawStroked(""+player.name, player.x+50, player.y+20);
	  //context.font = "20px Arial";
	  //context.fillStyle = 'green';
	  //context.fillText(''+name, player.x+50, player.y);
    //context.beginPath();
    //context.arc(player.x, player.y, 10, 0, 2 * Math.PI);
    //context.fill();
  }
});

// Dependencies.
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

var app = express();
var server = http.Server(app);
var io = socketIO(server);

var playerCount = 0;
var gameover = false;
var gamestart = false;
var starttime = 0;

app.set('port', 5000);
app.use('/static', express.static(__dirname + '/static'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});

server.listen(5000, function() {
  console.log('Starting server on port 5000');
});

var players = {};

io.on('connection', function(socket) {
  socket.on('new player', function(s) {
    players[socket.id] = {
      name: s,
      x: 50,
      y: 80 + (playerCount * 50)
    };
    playerCount += 1;
    if (playerCount <= 10) {
      starttime = Date.now()+3000;
    }
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      player.x -= 5;
    }
    if (data.up) {
      player.y -= 5;
    }
    if (data.right) {
      player.x += 5;
    }
    if (data.down) {
      player.y += 5;
    }
  });
  socket.on('run', function() {
    var player = players[socket.id] || {};
    if (gameover == false && gmaestart == true) {
      player.x += 15;
      if (player.x >= 600) {
      gameover = true;
        setTimeout(() => {
    console.log("reset game");
    gameover = false;
          gamestart = false;
          starttime = 0;
          playerCount = 0;
          players = {};
    }, 5000);
      io.sockets.emit('win', player);
    }
    }
    
  });
});

setInterval(function() {
  if (gameover == false) {
    var countdown = -1;
    if (gamestart == false && starttime > 0) {
      countdown = Math.round((starttime - Date.now())/1000);
    if (countdown<=0) {
      gamestart = true;
    }
    }
    io.sockets.emit('state', players, countdown);
  }
}, 1000 / 60);

var Express = require('express');
var Uuid = require('uuid');
var Game = require('./game.js');

var server = Express();
var games = {};

server.get('/', function(request, response) {
  response.json({
    status: 'online'
  });
});

server.get('/game/start', function(request, response) {
  var uuid = Uuid.v4();

  games[uuid] = new Game();

  response.json({
    status: 'started',
    uuid
  });
});

server.get('/game/:id', function(request, response) {
  const game = games[request.params.id];

  if (!game) {
    response.status(404).end();
    return;
  }

  response.set('Content-Type', 'text/plain');
  response.send(game.render());
});

var port = process.argv[2];

if (port === undefined) {
  console.log('Usage: node server.js port');
  process.exit(1);
}

server.listen(port, function() {
  console.log('Polgo server started on port %s', port);
});

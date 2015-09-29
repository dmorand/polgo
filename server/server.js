const Express = require('express');
const Uuid = require('uuid');
const Game = require('./game.js');

const server = Express();
const games = {};

server.get('/', function(request, response) {
  response.json({
    status: 'online'
  });
});

server.get('/game', function(request, response) {
  const uuid = Uuid.v4();

  games[uuid] = new Game();

  response.json({
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

server.get('/game/:id/:x/:y/white', function(request, response) {
  const game = games[request.params.id];

  if (!game) {
    response.status(404).end();
    return;
  }

  game.white(request.params.x, request.params.y);

  response.set('Content-Type', 'text/plain');
  response.send(game.render());
});

server.get('/game/:id/:x/:y/black', function(request, response) {
  const game = games[request.params.id];

  if (!game) {
    response.status(404).end();
    return;
  }

  game.black(request.params.x, request.params.y);

  response.set('Content-Type', 'text/plain');
  response.send(game.render());
});

const port = process.argv[2];

if (port === undefined) {
  console.log('Usage: node server.js port');
  process.exit(1);
}

server.listen(port, function() {
  console.log('Polgo server started on port %s', port);
});

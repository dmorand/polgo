const Express = require('express');
const Uuid = require('uuid');
const Game = require('./game.js');

const server = Express();
const games = {};

function findGame(request, response) {
  const game = games[request.params.id];

  if (!game) {
    response.status(404).end();
  }

  return game;
}

function renderGame(game, response) {
  response.set('Content-Type', 'text/plain');
  response.send(game.render());
}

server.get('/', function(request, response) {
  var version = '0.0.1';
  var status = 'online';

  response.json({
    version, status
  });
});

server.get('/game', function(request, response) {
  const uuid = Uuid.v4();
  games[uuid] = new Game();

  response.json({
    uuid
  });
});

server.get('/game/:id/board', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  renderGame(game, response);
});

server.get('/game/:id/moves', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  response.json(game.moves);
});

server.get('/game/:id/black/:x/:y', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  const legal = game.black(request.params.x, request.params.y);
  response.json({
    legal
  });
});

server.get('/game/:id/white/:x/:y', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  const legal = game.white(request.params.x, request.params.y);
  response.json({
    legal
  });
});

const port = process.argv[2];

if (port === undefined) {
  console.log('Usage: node server.js port');
  process.exit(1);
}

server.listen(port, function() {
  console.log('Polgo server started on port %s', port);
});

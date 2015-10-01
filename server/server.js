const Package = require('./package.json');
const Config = require('./config.json');

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
  response.json({
    version: Package.version,
    status: 'online'
  });
});

server.get('/game/list', function(request, response) {
  response.json(Object.keys(games));
});

server.get('/game/create', function(request, response) {
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

server.listen(Config.port, function() {
  console.log('Polgo server started on port %s', Config.port);
});

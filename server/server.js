const Package = require('./package.json');
const Config = require('./config.json');

const FileSystem = require('fs');
const Express = require('express');
const Uuid = require('uuid');

const Game = require('./game.js');

const server = Express();
const games = {};

function findGame(request, response) {
  const game = games[request.params.uuid];

  if (!game) {
    response.status(404).end();
  }

  return game;
}

function renderGame(game, response) {
  response.set('Content-Type', 'text/plain');
  response.send(game.render());
}

function writeGame(uuid, game) {
  const filename = Config.gameDirectory + '/' + uuid + '.json';
  FileSystem.writeFileSync(filename, JSON.stringify(game.moves, null, '  '));
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
  const game = new Game();

  games[uuid] = game;
  writeGame(uuid, game);

  response.json({
    uuid
  });
});

server.get('/game/:uuid/board', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  renderGame(game, response);
});

server.get('/game/:uuid/moves', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  response.json(game.moves);
});

server.get('/game/:uuid/black/:x/:y', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  const legal = game.black(request.params.x, request.params.y);

  if (legal) {
    writeGame(request.params.uuid, game);
  }

  response.json({
    legal
  });
});

server.get('/game/:uuid/white/:x/:y', function(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  const legal = game.white(request.params.x, request.params.y);

  if (legal) {
    writeGame(request.params.uuid, game);
  }

  response.json({
    legal
  });
});

server.listen(Config.port, function() {
  if (!FileSystem.existsSync(Config.gameDirectory)) {
    FileSystem.mkdirSync(Config.gameDirectory);
  }

  console.log('Polgo server started on port %s', Config.port);
});

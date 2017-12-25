'use strict';

const Uuid = require('uuid');
const FileSystem = require('fs');

const Package = require('../package.json');
const Config = require('../config.json');
const Game = require('./game.js');

const games = {};

function findGame(request, response) {
  const game = games[request.params.uuid];

  if (!game) {
    response.status(404).end();
  }

  return game;
}

function writeGame(uuid, game) {
  const filename = Config.gameDirectory + '/' + uuid;
  const data = JSON.stringify(game.moves, null, '  ');
  FileSystem.writeFile(filename, data, error => {if(error) console.error(error)});
}

module.exports = class {
  loadGame(uuid) {
    FileSystem.readFile(Config.gameDirectory + '/' + uuid, function(error, data) {
      if (error) throw error;
      const moves = JSON.parse(data);
      games[uuid] = new Game(uuid, moves);
    });
  }

  getStatus(request, response) {
    response.json({
      version: Package.version,
      status: 'online'
    });
  }

  listGames(request, response) {
    response.json(Object.keys(games));
  }

  createGame(request, response) {
    const uuid = Uuid.v4();
    const game = new Game();
    const board = game.render(false);

    games[uuid] = game;
    writeGame(uuid, game);

    response.json({
      uuid,
      board,
    });
  }

  getGame(request, response) {
    const game = findGame(request, response);
    if (!game) return;

    const next = game.next();
    response.json({
      next: next,
      scores: game.scores(),
      board: game.render(),
    });
  }

  play(request, response) {
    const game = findGame(request, response);
    if (!game) return;

    const legal = game.play(request.params.x, request.params.y, request.params.color);

    if (legal) {
      writeGame(request.params.uuid, game);
    }

    getGame(request, response);
  }
};

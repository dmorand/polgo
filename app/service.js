'use strict';

const Uuid = require('uuid');
const FileSystem = require('fs');

const Package = require('../package.json');
const Config = require('../config.json');
const Game = require('./game.js');

const games = {};

function findGame(request, response) {
  const game = games[request.params.gameId];

  if (!game) {
    response.status(404).end();
  }

  return game;
}

function loadGame(gameId) {
  FileSystem.readFile(Config.gameDirectory + '/' + gameId, function(error, data) {
    if (error) throw error;
    const moves = JSON.parse(data);
    games[gameId] = new Game(gameId, moves);
  });
}

function getStatus(request, response) {
  response.json({
    version: Package.version,
    status: 'online'
  });
}

function listGames(request, response) {
  response.json(Object.keys(games));
}

function getGame(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  writeGameToResponse(game, response);
}

function createGame(request, response) {
  const gameId = Uuid.v4();
  const game = new Game(gameId);
  games[gameId] = game;

  writeMovesToFile(game);
  writeGameToResponse(game, response);
}

function play(request, response) {
  const game = findGame(request, response);
  if (!game) return;

  const body = request.body;
  const legal = game.play(body.row, body.column);

  if (legal) {
    writeMovesToFile(game);
  }

  writeGameToResponse(game, response);
}

function writeGameToResponse(game, response) {
  response.json({
    id: game.id,
    next: game.next(),
    scores: game.scores(),
    board: game.render(),
  });
}

function writeMovesToFile(game) {
  const filename = Config.gameDirectory + '/' + game.id;
  const data = JSON.stringify(game.moves, null, '  ');
  FileSystem.writeFile(filename, data, error => { if (error) console.error(error) });
}

module.exports = {
  createGame,
  getGame,
  getStatus,
  loadGame,
  listGames,
  play,
};

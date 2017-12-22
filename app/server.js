'use strict';

const Express = require('express');
const FileSystem = require('fs');

const Config = require('../config.json');
const Service = require('./service.js');

const server = new Express();
const service = new Service();

// GET
server.get('/', service.getStatus);
server.get('/game/list', service.listGames);
server.get('/game/:uuid/board', service.renderGame);
server.get('/game/:uuid/moves', service.getMoves);
server.get('/game/:uuid/scores', service.getScores);

// POST
server.post('/game/create', service.createGame);
server.post('/game/:uuid/black/:x/:y', service.playBlack);
server.post('/game/:uuid/white/:x/:y', service.playWhite);

function loadFiles(error, files) {
  if(error) throw error;
  files.forEach(file => service.loadGame(file));
}

server.listen(Config.port, function() {
  const gameDirectory = Config.gameDirectory;
  if (FileSystem.existsSync(gameDirectory)) {
    FileSystem.readdir(gameDirectory, loadFiles);
  } else {
    FileSystem.mkdirSync(gameDirectory);
  }

  console.log('Polgo server started on port %s', Config.port);
});

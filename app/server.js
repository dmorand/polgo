'use strict';

const Express = require('express');
const FileSystem = require('fs');

const Config = require('../config.json');
const Service = require('./service.js');

const server = new Express();

// GET
server.get('/', Service.getStatus);
server.get('/games', Service.listGames);
server.get('/games/:uuid', Service.getGame);

// POST
server.post('/games', Service.createGame);
server.post('/games/:uuid', Service.play);

function loadFiles(error, files) {
  if (error) throw error;
  files.forEach(file => Service.loadGame(file));
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

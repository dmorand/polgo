var Express = require('express');
var Board = require('./board.js')

var server = Express();

server.get('/', function(request, response) {
  response.json({
    status: 'online'
  });
});

server.get('/game/start', function(request, response) {
  console.log(new Board());

  response.json({
    status: 'started'
  });
});

var port = process.argv[2];

if (port === undefined) {
  console.log('Usage: node server.js port');
  process.exit(1);
}

server.listen(port, function() {
  console.log('Polgo server started on port %s', port);
});

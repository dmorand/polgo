var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.json({status : "online"});
});

var port = process.argv[2];

if (port === undefined) {
  console.log('Usage: node server.js port');
  process.exit(1);
}

var server = app.listen(port, function () {
  console.log('Polgo server started on port %s', server.address().port);
});

var server = require('./lib/server');
var db = require('./lib/db');

// resources
var BASE_URL = '/v1';
require('./resources/root').register(server, BASE_URL);
require('./resources/route').register(server, BASE_URL);

db.open().then(function () {
  var port = process.env.PORT || 5001;
  server.listen(port, function() {
    console.log("%s, app version %s. Listening at: %s",
      server.name,
      server.appVersion,
      server.url);
  });
});

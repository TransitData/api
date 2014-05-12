var server = require('./lib/server');

// resources
var BASE_URL = '/v1';
require('./resources/root').register(server, BASE_URL);

var port = process.env.PORT || 5001;
server.listen(port, function() {
  console.log("%s, app version %s. Listening at: %s",
    server.name,
    server.appVersion,
    server.url);
});

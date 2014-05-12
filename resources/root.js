var util = require('util');
var API_VERSION = '1.0.0';

exports.register = function (server, baseRoute) {
  server.get(baseRoute + '/', function (req, res, next) {
    res.send({
      service_name: server.name,
      app_version: server.appVersion,
      api_version: API_VERSION
    });

    next();
  });
};

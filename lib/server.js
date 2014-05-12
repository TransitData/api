var restify = require('restify');
var thisPackage = require('../package');

// create Restify server
var server = restify.createServer({
  name: thisPackage.description
});
server.appVersion = thisPackage.version;

// configure Restify
if (process.env.TRANSITDATA_CORS_ENABLED) {
  server.pre(restify.CORS({
    origins: process.env.TRANSITDATA_CORS_ORIGINS.split(',')
  }));
}
server.use(restify.gzipResponse());
server.use(restify.bodyParser());
server.use(restify.queryParser({
  mapParams: false
}));

// request audit logging
function logRequest(req, res, route, error) {
  console.log('%s "%s %s HTTP/%s":%s accept=%s status=%s %s:%s request-id=%s "%s"',
    req.header('X-Forwarded-For') || req.connection.remoteAddress,
    req.method,
    req.url,
    req.httpVersion,
    req.header('Content-Type') || '-',
    req.header('Accept') || '-',
    res.statusCode,
    res.header('Content-Type') || '-',
    res.header('Content-Length') || '-',
    req.header('X-Request-ID') || '-',
    req.header('User-Agent' || '-'));
}
server.on('after', logRequest);

// log errors on the server
server.on('uncaughtException', function (req, res, route, error) {
  var requestId = req.header('X-Request-ID') || '[none]';

  console.error("ERROR (request-id=" + requestId + "): " + error.stack);
  res.send(new restify.InternalError("Ah CRAP! " + requestId));

  logRequest(req, res, route, error);
});

module.exports = server;

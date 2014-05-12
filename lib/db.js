var mongoose = require('mongoose');
var Q = require('q');

// Open the default database connection
exports.open = function () {
  var d = Q.defer();

  // Connection events:

  // When successfully connected
  mongoose.connection.on('connected', function () {
		var connection = mongoose.connection;

    function renderHost(container) {
      return container.host + ":" + container.port;
    }
    var hosts = connection.replica ?
      // multiple hosts
      connection.hosts.map(renderHost).join(',') :
      renderHost(connection);
    var ssl = connection.db.serverConfig.ssl ? 'SSL' : 'No SSL';

    console.log("Default database connection opened to: %s/%s (%s)",
      hosts,
      connection.name,
      ssl);

    d.resolve();
  });

  // If the connection throws an error
  mongoose.connection.on('error', function (err) {
    console.error("Default database connection error: " + err);

    d.reject(err);
  });

  // If the Node process ends, close the Mongoose connection
  function onProcessTermination() {
    console.log("Closing default database connection due to app termination...");

    exports.close()
      .then(function() {
        process.exit(0);
      });
  }
  process.on('SIGINT', onProcessTermination);
  process.on('SIGTERM', onProcessTermination);

  // Perform the connect
  mongoose.connect(process.env.MONGOHQ_URL);

  return d.promise;
};

// Close the default database connection
exports.close = function () {
  var d = Q.defer();

  // When the connection is disconnected
  mongoose.connection.on('disconnected', function () {
    console.log("Default database connection closed");

    q.resolve();
  });

  // Perform the close
  mongoose.connection.close();

  return d.promise;
};

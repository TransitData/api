var Q = require('q');
var _ = require('lodash');
var restify = require('restify');
var Route = require('../models/route');
var Direction = require('../models/direction');
var Stop = require('../models/stop');

exports.register = function (server, baseRoute) {
  server.get(baseRoute + '/routes', fetchAll);
  server.get(baseRoute + '/routes/:route', fetchDetails);
};

// Fetch all routes, returning summary info (id, description)
function fetchAll (req, res, next) {
  Q(Route.find({}, { id: 1, description: 1 }).exec())
    .then(function (routes) {
      res.send(routes.map(function (route) {
        return {
          id: route.id,
          description: route.description
        };
      }));

      next();
    })
    .catch(function (err) {
      next(err);
    });
}

// Fetch details of a route, joining description data from the directions
// and stops collections
function fetchDetails (req, res, next) {
  Q.spread([
    Q(Direction.find().exec()),
    Q(Stop.find().exec()),
  ], function (directions, stops) {
    directions = _.indexBy(directions, 'id');
    stops = _.indexBy(stops, 'id');

    return Q(Route.findOne({ id: req.params.route }).exec())
      .then(function (route) {
        if (route) {
          res.send({
            id: route.id,
            description: route.description,
            directions: route.directions.map(function (direction) {
              return {
                id: direction.id,
                description: directions[direction.id].description,
                stops: direction.stops.map(function (stop) {
                  return {
                    id: stop,
                    description: stops[stop].description
                  }
                })
              };
            })
          });
        } else {
          res.send(new restify.ResourceNotFoundError("No such route!"));
        }

        next();
      });
  })
  .catch(function (err) {
    next(err);
  });
}

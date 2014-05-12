var mongoose = require('mongoose');

module.exports = mongoose.model('route', new mongoose.Schema({
  id: { type: String, index: true },
  description: String,
  directions: [{
    id: String,
    stops: [String]
  }]
}));

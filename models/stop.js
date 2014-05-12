var mongoose = require('mongoose');

module.exports = mongoose.model('stop', new mongoose.Schema({
  id: { type: String, index: true },
  description: String
}));

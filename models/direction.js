var mongoose = require('mongoose');

module.exports = mongoose.model('direction', new mongoose.Schema({
  id: { type: String, index: true },
  description: String
}));

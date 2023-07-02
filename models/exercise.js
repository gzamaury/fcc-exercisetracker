const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  description: String,
  duration: Number,
  date: {
    type: Date,
    get: (date) => new Date(date).toDateString()
  }
},
{
  // Includes getters in toJSON() and toObject() output
  toJSON: {
    getters: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  },
  toObject: {
    getters: true,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

module.exports = mongoose.model('Exercise', exerciseSchema);
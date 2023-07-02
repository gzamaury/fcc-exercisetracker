const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  log: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }]
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define a virtual property for count the exercises
userSchema.virtual('count').get(function() {
  return this.log.length;
});

module.exports = mongoose.model('User', userSchema);

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
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
      delete ret.id;
    }
  },
  toObject: {
    virtuals: true,
    versionKey: false,
    transform: function(doc, ret) {
      delete ret.id;
    }
  }
});

// Define a virtual property for count the exercises
userSchema.virtual('count').get(function() {
  return this.log ? this.log.length : 0;
});

module.exports = mongoose.model('User', userSchema);

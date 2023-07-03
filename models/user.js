const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    log: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise'
      }
    ]
  }
);

userSchema.virtual('count').get(function () {
  return this.log ? this.log.length : 0;
});

const User = mongoose.model('User', userSchema);

module.exports = User;

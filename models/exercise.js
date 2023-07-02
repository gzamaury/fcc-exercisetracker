const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  description: String,
  duration: Number,
  date: Date,
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Define a virtual property for formatting the date
exerciseSchema.virtual('formattedDate').get(function() {
  return new Date(this.date).toDateString();
});

module.exports = mongoose.model('Exercise', exerciseSchema);
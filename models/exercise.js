import mongoose from 'mongoose';

const { Schema } = mongoose;

const exerciseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration is required']
    },
    date: {
      type: Date,
      default: Date.now,
      get: (date) => new Date(date).toDateString()
    }
  },
  {
    toJSON: {
      // getters: true
    }
  }
);

const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;

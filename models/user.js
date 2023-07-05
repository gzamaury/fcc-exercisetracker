import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required']
    },
    log: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Exercise'
      }
    ]
  },
  {
    toJSON: {
      virtuals: false,
      transform: function (doc, ret) {
        delete ret.id;
      }
    }
  }
);

userSchema.virtual('count').get(function () {
  return this.log ? this.log.length : 0;
});

const User = mongoose.model('User', userSchema);

export default User;

import express from 'express';
import User from '../models/user.js';
import Exercise from '../models/exercise.js';

const router = express.Router();

// POST /api/users/:_id/exercises
router.post('/:_id/exercises', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    const exercise = new Exercise({
      user: _id,
      description,
      duration,
      date: date || new Date()
    });

    const savedExercise = await exercise.save();

    const user = await User.findByIdAndUpdate(
      _id,
      { $push: { log: savedExercise._id } },
      { new: true }
    );

    res.json({
      _id: user._id,
      username: user.username,
      description: savedExercise.description,
      duration: savedExercise.duration,
      date: savedExercise.date
    });
  } catch (error) {
    next(error);
  }
});

export default router;

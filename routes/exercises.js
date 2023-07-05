import express from 'express';
import User from '../models/user.js';
import Exercise from '../models/exercise.js';
import mongoose from 'mongoose';

const router = express.Router();

// POST /api/users/:_id/exercises
router.post('/:_id/exercises', async (req, res, next) => {
  try {
    const { _id } = req.params;
    const { description, duration, date } = req.body;

    if (!description || !duration) {
      return res.status(400).json({ 
        error: 'Missing required parameters: description and duration are required'
      });
    }

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
    const userError = error.errors['user'];
    const durationError = error.errors['duration'];
    const dateError = error.errors['date'];
    
    if (userError && userError instanceof mongoose.CastError) {
      return res.status(400).json({ error: `Invalid user for value '${userError.value}', must be a user _id` });
    }

    if (durationError && durationError instanceof mongoose.CastError) {
      return res.status(400).json({ 
        error: `Invalid duration for value '${durationError.value}', must be a number` 
      });
    }

    if (dateError && dateError instanceof mongoose.CastError) {
      return res.status(400).json({ 
        error: `Invalid date for value '${dateError.value}', must be a valid date yyyy-mm-dd or a timestamp number`
      });
    }
    
    next(error);
  }
});

export default router;

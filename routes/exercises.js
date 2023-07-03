const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Exercise = require('../models/exercise');

// POST /api/users/:_id/exercises
router.post('/:_id/exercises', (req, res, next) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;

  const exercise = new Exercise({
    user: _id,
    description,
    duration,
    date: date || new Date()
  });

  exercise.save((error, data) => {
    if (error) return next(error);

    User.findByIdAndUpdate(
      _id,
      { $push: { log: data._id } },
      { new: true },
      (error, user) => {
        if (error) return next(error);

        res.json({
          _id: user._id,
          username: user.username,
          description: data.description,
          duration: data.duration,
          date: data.date
        });
      }
    );
  });
});

module.exports = router;

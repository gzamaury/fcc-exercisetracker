const express = require('express');
const router = express.Router();
const User = require('../models/user');

// POST /api/users
router.post('/', (req, res, next) => {
  const { username } = req.body;
  const user = new User({ username });

  user.save((error, data) => {
    if (error) return next(error);

    res.json({
      _id: data._id,
      username: data.username
    });
  });
});

// GET /api/users
router.get('/', (req, res, next) => {
  User.find({}, '_id username', (error, data) => {
    if (error) return next(error);

    res.json(data);
  });
});

module.exports = router;

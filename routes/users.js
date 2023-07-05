import express from 'express';
import User from '../models/user.js';

const router = express.Router();

// POST /api/users
router.post('/', async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: 'Missing required parameter: username' });
    }
    
    const user = new User({ username });
    const savedUser = await user.save();

    res.json({
      _id: savedUser._id,
      username: savedUser.username
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/users
router.get('/', async (req, res, next) => {
  try {
    const users = await User.find({}, '_id username');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

export default router;

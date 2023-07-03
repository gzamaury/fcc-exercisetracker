const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const User = require('./models/user');
const Exercise = require('./models/exercise');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// Users Endpoint
app.post('/api/users', (req, res, next) => {
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

app.get('/api/users', (req, res, next) => {
  User.find({}, '_id username', (error, data) => {
    if (error) return next(error);

    res.json(data);
  });
});

// Exercise Endpoint
app.post('/api/users/:_id/exercises', (req, res, next) => {
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

app.get('/api/users/:_id/logs', (req, res, next) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;

  const match = {};
  if (from) {
    match.date = { $gt: new Date(from) };
  }
  if (to) {
    match.date = { ...match.date, $lt: new Date(to) };
  }

  const toJSONOpts = {
    virtuals: true,
    getters: true,
    transform: function (doc, ret) {
      delete ret.id;
    }
  };
  
  User.findById(_id)
    .select('_id username log')
    .populate({
      path: 'log',
      match,
      options: { limit: parseInt(limit) || 0 },
      select: 'description duration date'
    })
    .exec((error, data) => {
      if (error) return next(error);

      res.json(data.toJSON(toJSONOpts));
    });
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

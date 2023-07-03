const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

const User = require('./models/user');
const Exercise = require('./models/exercise');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

// routers
const usersRouter = require('./routes/users');
const exercisesRouter = require('./routes/exercises');
const logsRouter = require('./routes/logs');

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api/users', usersRouter);
app.use('/api/users', exercisesRouter);
app.use('/api/users', logsRouter);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

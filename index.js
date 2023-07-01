const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const User = require('./models/user');
const Exercise = require('./models/exercise');

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

// Exercise Tracker Microservice
// requires body-parser to get the POST parameters
const encodedDataHandler = bodyParser.urlencoded({extended: false});
app.use(encodedDataHandler);

const usersPath = '/api/users';
const getUsername = (req, res, next) => {
  console.log(`username: ${req.body.username}`);
  req.username = req.body.username;
  
  next();
};
const createUser = (req, res, next) => {
  const userObj = {
    username: req.username
  };
  const user = new User(userObj);

  user.save((error, data) => {
    if (error) return next(error);

    console.log(`new user: ${data}`);
    req.user_id = data._id;

    next();
  });
}
const postUserHandler = (req, res) => {
  const objUser = {
    _id: req.user_id,
    username: req.username
  };

  res.json(objUser);
}

app.post(
  usersPath,
  getUsername,
  createUser,
  postUserHandler
);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

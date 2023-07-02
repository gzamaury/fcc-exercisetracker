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

// users endpoin functions
const usersPath = '/api/users';

// post middleware functions
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

// get middleware functions
const getAllUsers = (req, res, next) => {
  const selectObj = "_id username";
  
  User.find()
    .select(selectObj)
    .exec((error, data) => {
      if (error) return next(error);
  
      console.log(`allUsers: ${data}`);
      req.allUsers = data;
      
      next();
    });
};
const getUserHandler = (req, res) => {
  res.json(req.allUsers);
};

app.get(usersPath, getAllUsers, getUserHandler);

// exercise endpoin functions
const exercisePath = "/api/users/:_id/exercises";

const getExerciseParams = (req, res, next) => {
  const exerciseParams = {
    user_id: req.params._id,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date
  };

  console.log(exerciseParams);
  req.exerciseParams = exerciseParams;

  next();
};
const getUser = (req, res, next) => {
  const findObj = {_id: req.exerciseParams.user_id};
  
  User.find(findObj)
    .exec((error, data) => {
      if (error) return next(error);

      console.log(`userData: ${data}`);
      req.userData = data;
      
      next();
    });
};
const createExercise = (req, res, next) => {
  exerciseObj = {
    user: req.exerciseParams.user_id,
    description: req.exerciseParams.description,
    duration: req.exerciseParams.duration,
    date: req.exerciseParams.date
  }
  
  const exercise = new Exercise(exerciseObj);
  
  exercise.save((error, data) => {
    if (error) return next(error);

    console.log(`newExercise: ${data}`);
    req.exerciseData = data;

    next();
  });
};
const addExerciseToUser = (req, res, next) => {
  User.findById(req.exerciseData.user, (error, data) => {
    if (error) return next(error);
    
    console.log(`userData: ${data}`);
    data.log.push(req.exerciseData._id);
  
    data.save((error, data) => {
      if (error) return next(error);
  
      console.log(`userUpdated: ${data}`);
      req.userUpdated = data;
      
      next();
    });
  });
};
const postExerciseHandler = (req, res) => {
  const exerciseDate = new Date(req.exerciseData.date);
    
  const resObj = {
    _id: req.userUpdated._id,
    username: req.userUpdated.username,
    description: req.exerciseData.description,
    duration: req.exerciseData.duration,
    date: exerciseDate.toDateString()
  };

  res.json(resObj);
};

app.post(
  exercisePath,
  getExerciseParams,
  getUser,
  createExercise,
  addExerciseToUser,
  postExerciseHandler
);

// logs endpoin functions
const usersLogsPath = '/api/users/:_id/logs';

const getUserIdParam = (req, res, next) => {
  console.log(req.params._id);
  req.userId = req.params._id;
  
  next();
};
const getUserLog = (req, res, next) => {
  const userObj = {
    _id: req.userId,
  };
  const logObj = {
    path: 'log',
    match: {},
    select: "description duration date formattedDate"
  };
  
  User.findOne(userObj)
    .populate(logObj)
    .exec((error, data) => {
      if (error) return next(error);

      console.log(`userData: ${data}`);
      req.userData = data;
      
      next();
    });
};

app.get(usersLogsPath, getUserIdParam, getUserLog);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require('body-parser')

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

  next();
};

app.post(usersPath, getUsername);


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

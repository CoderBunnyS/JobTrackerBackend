//init
let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let bodyParser = require('body-parser');
let dbConfig = require('./database/db');
const createError = require('http-errors');
require('dotenv').config();
let Job = require('./models/Job')

const uri = process.env.MONGO_URI
// Express Route
const jobRoute = require('./routes/jobs')

// Connecting mongoDB Database
mongoose.Promise = global.Promise;
//const uri = "mongodb://TrackerAdmin:TrackerAdminPassword@cluster0-shard-00-00.euzmb.mongodb.net:27017,cluster0-shard-00-01.euzmb.mongodb.net:27017,cluster0-shard-00-02.euzmb.mongodb.net:27017/TrackerAdmin?ssl=true&replicaSet=atlas-va16fv-shard-0&authSource=admin&retryWrites=true&w=majority";
console.log("Connected")
//var uri = "http://localhost:4000/";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false
})
.then(() => {
  console.log('MongoDB Connected…')
})
.catch(err => console.log(err))

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cors());
app.use('/jobs', jobRoute)


// PORT
const port = process.env.PORT || 4000;
const server = app.listen(port, () => {
  console.log('Connected to port ' + port)
})

// 404 Error
app.use((req, res, next) => {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  console.error(err.message);
  if (!err.statusCode) err.statusCode = 500;
  res.status(err.statusCode).send(err.message);
});

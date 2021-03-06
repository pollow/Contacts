/*
  Dependencies

  all the required module
*/
var express = require('express');
var app = express();
var routes = require('./routes/index');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var db = require('./db.js');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var sessionOpt = require('./session.js');
var errors = require('./error.js');
var requestLogger = require('morgan');
var rotatingStream = require('file-stream-rotator');
var createRotatingStream = rotatingStream.getStream;
var behaviorLogger = require('winston');
var fs = require('fs');

/*
  Configuration and Middleware

  This part is all the config settings before running code
  There are two main environment
  1. development - for development
  2. production - for product

*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

if ('production' == app.get('env')) {
  // trust proxy to get X-forward-for ip
  app.set('trust proxy', 'loopback');
  // used for output to log file
  var logDirectory = __dirname + '/../log/';
  var accessLogStream = createRotatingStream({
    filename: logDirectory + 'access-%DATE%.log',
    frequency: 'daily',
    verbose: false
  });
  behaviorLogger.add(behaviorLogger.transports.DailyRotateFile, {
    dirname: logDirectory,
    filename: 'behave'
  });
  app.use(requestLogger('combined', { stream: accessLogStream }));
  // used for output to console
  app.use(requestLogger('combined'));
} else {
  app.use(requestLogger('dev'));
  behaviorLogger.remove(behaviorLogger.transports.Console)
    .add(behaviorLogger.transports.Console, { colorize: true });
}
global.logger = behaviorLogger;
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: true }));

// development environment only
if ('development' == app.get('env')) {
  app.set('dburl', 'mongodb://'+db.user+':'+db.password+'@'+db.address+'/mstc');
  app.disable('nologin');
}

if ('production' == app.get('env')) {

  app.set('dburl', 'mongodb://'+db.user+':'+db.password+'@localhost/mstc');

  //TO-DO still in debug
  app.disable('nologin');
}

/*

  Running code

  This is the actual code while running

*/
if (app.get('dburl')) {
  mongoose.connect(app.get('dburl'));
} else {
  throw new Error('Wrong NODE_ENV paramter');
}

app.use(session({
  resave: false,
  saveUninitialized: false,
  key: sessionOpt.key,
  secret: sessionOpt.secret,
  store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

routes(app);
app.use(errors.routeHandler);
app.use(errors.serverHandler);

app.listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
  console.log('Server running mode: ' + app.get('env'));
});


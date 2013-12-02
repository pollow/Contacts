/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/index');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var db = require('./db.js');
var app = express();
var log4js = require('log4js');

/*
  configuration of log4js
*/

log4js.configure({
  appenders: [
    { type: 'console' },
  ],
  replaceConsole: true
});

exports.logger = function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('TRACE');
  return logger;
}

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(log4js.connectLogger(this.logger('journal'), {level: 'auto',
  format:':remote-addr :method :user-agent'}));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
// app.use(express.cookieSession());
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// mongoDB conntection
mongoose.connect('mongodb://' + db.user + ':' + db.password
  + '@10.13.122.223/mstc');

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
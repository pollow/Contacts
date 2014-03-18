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
var logger = require('logger');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname,'public/images/favicon.ico')));
app.use(log4js.connectLogger(logger.logger('journal'), {level: 'INFO',
  format:':remote-addr :method :user-agent'}));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('ilovemstc'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

// mongoDB connection
mongoose.connect('mongodb://' + db.user + ':' + db.password
  + '@localhost/mstc');

routes(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
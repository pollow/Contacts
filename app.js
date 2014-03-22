/*
  Dependencies

  all the required module
*/
var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var logSet = require('logger').setLevel('TRACE');  // do not change the order of these requires
var routes = require('./routes/index');
var mongoose = require('mongoose');
var db = require('./db.js');
var log4js = require('log4js');
var errors = require('./error.js');
var logger = require('logger').logger('app');
var journal = require('logger').logger('journal');

/*
  Configuration and Middleware

  This part is all the config settings before running code
  There are three main environment
  1. development - for development
  2. offline - in development but have no network
  3. production - for product

*/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon(path.join(__dirname,'public/images/favicon.ico')));
app.use(log4js.connectLogger(journal, {level: 'INFO', format:':remote-addr :method :user-agent'}));
// app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('ilovemstc'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development environment only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.set('dburl', 'mongodb://'+db.user+':'+db.password+'@'+db.address+'/mstc');
  app.disable('nologin');
}

// offline environment only
if ('offline' == app.get('env')) {
  app.use(express.errorHandler());
  app.set('dburl', 'mongodb://localhost/mstc');
  app.enable('nologin');
}

if ('production' == app.get('env')) {
  app.set('dburl', 'mongodb://'+db.user+':'+db.password+'@localhost/mstc');

  //TO-DO still in debug
  app.disable('nologin');
  app.use(errors.routeHandler);
  app.use(errors.serverHandler);
}

////////////////// for test only - do not call these functions
// function routesErrorHandler(err, req, res, next) {
//   logger.error(err);
//   logger.trace(err);
//   next(err);
// }

// function serverErrorHandler(err, req, res, next) {
//   logger.info('I got the error');
//   res.send('internal error');
// }

////////////


/*

  Running code

  This is the acctually code while running

*/
if (app.get('dburl')) {
  mongoose.connect(app.get('dburl'));
} else {
  throw new Error('Wrong NODE_ENV paramter');
}
routes(app);

// logger.trace('trace');
// logger.debug('debug');
// logger.info('info');
// logger.warn('warn');
// logger.error('error');
// logger.fatal('fatal');

http.createServer(app).listen(app.get('port'), function(){
  logger.info('Express server listening on port ' + app.get('port'));
  logger.info('Server running mode ' + app.get('env'));  
});


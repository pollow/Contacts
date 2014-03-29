/*
  Error handlers

*/
var logger = require('logger').logger('errorHandler');

exports.routeHandler = function(req, res, next) {
  res.status(404);
  // res.send('404 page not found');
  res.render('404');
};


exports.serverHandler = function(err, req, res, next) {
  logger.fatal(err); // report the err in the console;
  res.status(500)
  // res.send('500 server internal error');
  res.render('50X');
};
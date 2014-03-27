/*
  Error handlers

*/
var logger = require('logger').logger('errorHandler');

exports.routeHandler = function(req, res, next) {
  res.status(404);
  res.send('404 page not found');
  // res.render('40x');
};


exports.serverHandler = function(err, req, res, next) {
  logger.trace(err); // report the err in the console;
  res.status(500)
  res.send('500 server internal error');
  // res.render('50x');
};
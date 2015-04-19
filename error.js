/*
  Error handlers

*/
exports.routeHandler = function(req, res, next) {
  res.status(404);
  // res.send('404 page not found');
  res.render('404');
};


exports.serverHandler = function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  // res.send('500 server internal error');
  res.render('50X');
};
var userPage = require('./userPage.js');
var indexPage = require('./indexPage.js');
var logger = require('logger').logger('index');

module.exports = function(app) {

  // user
  app.post('/login', userPage.login);
  app.get('/logout', userPage.logout);
  // app.post('/alert', userPage.alert);
  
  // index
  app.get('/main', indexPage.main);
  app.get('/', indexPage.index);
  // app.get('/api/list', indexPage.list);
  // app.get('/test', indexPage.test);
  // app.get('/loginsuccess', indexPage.loginsuccess);
  // app.get('/log', indexPage.log);

  // deal with 404 page by redirecting to '/'
  // app.all('/:empty', function(req, res) {
  //   logger.error('404 Error');
  //   res.redirect('/');
  // })
};


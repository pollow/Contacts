var userPage = require('./userPage.js');
var indexPage = require('./indexPage.js');
var exportPage = require('./exportPage.js');

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
  app.get('/export', exportPage.export);
  app.post('/update', function(req, res, next){
    logger.debug(req.body);
    res.send("success");
  })

  // TEST
  app.get('/error', function(req, res, next){
    // res.send('a error');
    var test = new Error('TEST 505');
    next(test);
  });
};


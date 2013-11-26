var userPage = require('./userPage.js');
var indexPage = require('./indexPage.js');

module.exports = function(app) {
  // user
  app.post('/login', userPage.login);
  app.post('/alert', userPage.alert);
  
  // index
  app.get('/main', indexPage.main);
  app.get('/', indexPage.index);
  app.get('/api/list', indexPage.list);
  app.get('/test', indexPage.test);
  app.get('/loginsuccess', indexPage.loginsuccess);
  app.get('/log', indexPage.log);

};


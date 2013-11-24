var userPage = require('./userPage.js');
var indexPage = require('./indexPage.js');

module.exports = function(app) {
  // user
  app.post('/login', userPage.login);
  app.post('/alert', userPage.alert);
  
  // index
  app.get('/', indexPage.index);
  app.get('/list', indexPage.list);
  app.get('/test', indexPage.test);

};


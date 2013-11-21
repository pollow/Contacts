var userPage = require('./userPage.js');
var indexPage = require('./indexPage.js');

module.exports = function(app) {
  // user
  app.post('/login',userPage.login);
  

  // index
  app.get('/', indexPage.index);

}


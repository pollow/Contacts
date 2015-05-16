var request = require('request');
var contactModel = require('../models').contactModel;

exports.login = function(req, res, next) {
  var authData = {
    "username": req.body.username,
    "password": req.body.password,
    "remember": req.body.remember
  };

  // When the mstcAuth end, if auth success, redirect to '/' with session contain username, name, and full doc.
  mstcAuth(authData, function(err, name, authFlag){
    req.session.authFlag = authFlag;
    if (err) {
      next(err);
    } else if (authFlag) {
      var aHour = 3600000;
      if (authData.remember == 'on') {
        req.session.cookie.maxAge = aHour * 24 * 7;
      } else {
        req.session.cookie.maxAge = null;
      }
      logger.info('[Login]', name || authData.username);
      contactModel.find(
      { name : name },
      null,
      function(err, doc) {
        if (err) {
          next(err);
        } else {
          var sDoc;
          for (var i = doc.length - 1; i >= 0; i--) {
            if ( doc[i].username == authData.username || doc[i].username == undefined ) {
              sDoc = doc[i];
              break;
            }
          }
          logger.info('[Database] Found ', sDoc.username);
          if ( sDoc === undefined ) {
            logger.info('[Database] New member');
            contactModel.create(
            {
              "username": authData.username,
              "name": name
            }
            , function(err, doc) {
              if(err) {
                logger.error("[Database] Insertion Error!");
                next(err);
                // Handle Error here.
              } else {
                req.session.doc = doc;
                req.session.everLogged = false;
                logger.info("[Database] New Log: ", doc);
              }
              return res.redirect('/main');
            });
          } else if ( sDoc.username === undefined ) {
            logger.info('[Login] Old user was found first login');
            contactModel.findByIdAndUpdate(sDoc._id,
            { $set : { username: authData.username } },
            function(err, doc) {
              if (err) {
                logger.error("[Database] Query Error!");
                next(err);
              }
              logger.info('[Database] Added: ', doc);
              req.session.doc = doc;
              req.session.everLogged = false;
              return res.redirect('/main');
            });
          } else {
            logger.info('[Login] User signed in before');
            req.session.doc = sDoc;
            req.session.everLogged = true;
            return res.redirect('/main');
          }
        }
      });
    } else {
      logger.warn('[Login] Failed attempt ', authData.username, ':', authData.password);
      res.redirect('/');
    }
  });
};

exports.logout = function(req, res, next) {
  logger.info('[Logout] ', req.session.doc.name || req.session.doc.username);
  req.session.destroy(function(err){
    res.redirect('/');
  });

};

function mstcAuth(authData, callback) {
  logger.info('[MSTC auth] Posting data to server...');
  request.post('http://login.mstczju.org/plain', {form: authData}, function(err, response, body) {
    var loginFlag = false;
    var person = JSON.parse(body); // transform the string to json
    // use the response code to decide
    if (response.statusCode == 200) {
      loginFlag = !!person.success;
    } else {
      logger.warn('[MSTC auth] Error occurred at auth server');
      loginFlag = false;
    }
    callback(err, person.name, loginFlag);
  });
}


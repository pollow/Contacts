var request = require('request');
var contactModel = require('../models').contactModel;
var logModel = require('../models').logModel;

exports.login = function(req, res, next) {
  var authData = {
    "username": req.body.username,
    "password": req.body.password,
    "remember": req.body.remember
  };

  // logger.debug(req.session);
  // logger.debug(req.cookie);
  // logger.debug(authData.remember);

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
      // logger.info('Who is in', name || authData.username);
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
          // logger.debug(sDoc);
          // logger.debug(doc);
          // logger.debug(req.session);
          if ( sDoc === undefined ) {
            // logger.info('New member to database')
            contactModel.create(
            {
              "username": authData.username,
              "name": name
            }
            , function(err, doc) {
              if(err) {
                // logger.error("[Database] Insertion Error!");
                next(err);
                // Handle Error here.
              } else {
                req.session.doc = doc;
                req.session.everLogged = false;
                // logger.info("Adding log.")
                // logger.debug("New Log", doc);
                logModel.create(
                {
                  username : authData.username,
                  logs : [ JSON.stringify(doc) ]
                }, function(err, doc) {
                  if(err) {
                    // logger.error("[Database] Insert log error.");
                    next(err);
                    // Handle Error here.
                  } else {
                    // logger.debug("ALL LOGS", doc);
                    // logger.info("Logged.")
                  }
                });
              }
              return res.redirect('/main');
            });
          } else if ( sDoc.username === undefined ) {
            // logger.info('Old user was found and never login before')
            contactModel.findByIdAndUpdate(sDoc._id,
            { $set : { username: authData.username } },
            function(err, doc) {
              if (err) {
                // logger.error("[Database] Query Error!");
                next(err);
                // Handle Error here.
              }
              // logger.debug(doc);
              req.session.doc = doc;
              req.session.everLogged = false;
              // logger.info("Adding log.")
              logModel.create(
                {
                  username : authData.username+'a',
                  logs : [JSON.stringify(doc)]
                }, function(err, doc) {
                  if(err) {
                    // logger.error("[Database] Insert log error.");
                    next(err);
                    // Handle Error here.
                  } else {
                    // logger.debug("ALL LOGS", doc);
                    // logger.info("Logged.")
                  }
                });
              return res.redirect('/main');
            });
          } else {
            // logger.info('User signed in before');
            req.session.doc = sDoc;
            req.session.everLogged = true;
            return res.redirect('/main');
          }
        }
      });
    } else {
      // logger.warn('Login failed', authData.username, ':', authData.password);
      res.redirect('/');
    }
  });
};

exports.logout = function(req, res, next) {
  // logger.debug(req.sessionStore);
  // logger.info('Who is out', req.session.doc.name || req.session.doc.username);
  req.session.destroy(function(err){
    // logger.debug(req.sessionStore);
    res.redirect('/');
  });

};

function mstcAuth(authData, callback) {
  // logger.debug('Posting data to server...');
  request.post('http://login.mstczju.org/plain', {form: authData }, function(err, response, body) {
    var loginFlag = false;
    var person = JSON.parse(body); // transform the string to json
    // logger.debug(person);
    // use the response code to decide
    if (response.statusCode == 200) {
      loginFlag = !!person.success;
    } else {
      // logger.warn('Error occured at auth server');
      loginFlag = false;
    }
    // err = 'this is error';
    callback(err, person.name, loginFlag);
  });
}


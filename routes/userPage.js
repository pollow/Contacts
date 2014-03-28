var request = require('request');
var contactModel = require('../models').contactModel;
var logModel = require('../models').logModel;
var logger = require('logger').logger('userPage');

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
  mstcAuth(authData, req.session, function(err, loginFlag){
    if (err) {
      return next(err);
    } 
    if (loginFlag) {
      contactModel.find(
        {"name": req.session.name}, 
        null, 
        function(err, doc) {
          if(err) {
            logger.err("[Database] Query Error!");
            // Handle Error here.
          } else if(!doc) {
            // Never logged in before and duplicate items.
            contactModel.create(
              {
                "username": req.session.username,
                "name": req.session.name,
                "everLogged": true
              }
              , function(err, doc) {
                if(err) {
                  logger.err("[Database] Insertion Error!");
                  // Handle Error here.
                } else {
                  session.doc = {
                    "username": session.username,
                    "name": session.name,
                    "everLogged": true
                  }
                }
                res.redirect('/main');
              }
            );
          } else {
            logger.debug(doc);
            var sDoc;
            if ( doc.length == 1 ) {
              if ( doc[0].username === undefined ) {
                req.session.doc = doc[0];
                req.session.doc.everLogged = true;
                contactModel.findByIdAndUpdate(sDoc.ObjectId, 
                  { $set : { "everLogged": true, "username": authData.username } },
                  function(err, doc) {
                    if (err) {
                      logger.err("[Database] Query Error!");
                      // Handle Error here.
                    }
                    logger.debug(doc);
                    res.redirect('/main');
                  }
                );
              } else {
                contactModel.create(
                  {
                    "username": req.session.username,
                    "name": req.session.name,
                    "everLogged": true
                  }
                  , function(err, doc) {
                    if(err) {
                      logger.err("[Database] Insertion Error!");
                      // Handle Error here.
                    } else {
                      session.doc = {
                        "username": session.username,
                        "name": session.name,
                        "everLogged": true
                      }
                    }
                    res.redirect('/main');
                  }
                );
              }
            } else {
              for (var i = doc.length - 1; i >= 0; i--) {
                if (doc[i].username == req.session.username) {
                  sDoc = doc[i];
                  break;
                }
              };
              logger.debug(sDoc);
              if (sDoc === undefined) {
                contactModel.create({
                  "username": req.session.username,
                  "name": req.session.name,
                  "everLogged": true
                  }, function(err, doc) {
                    if(err) {
                      logger.err("[Database] Insertion Error!");
                      // Handle Error here.
                    } else {
                      req.session.doc = {
                        "username": authData.username,
                        "name": req.session.name,
                        "everLogged": true
                      }
                    }
                    res.redirect('/main');
                  }
                );
              } else {
                req.session.doc = sDoc;
                if ( !sDoc.everLogged ) {
                  contactModel.findByIdAndUpdate(sDoc.ObjectId, 
                    { $set : { "everLogged": True } },
                    function(err, doc) {
                      if (err) {
                        logger.err("[Database] Query Error!");
                        // Handle Error here.
                      }
                      logger.debug(doc);
                      res.redirect('/main');
                    }
                  );
                }
              }
            }
          }
        }
      );
    } else {
      res.redirect('/');
    }
  });  
};

exports.logout = function(req, res, next) {
  logger.debug(req.session);
  req.session = null;
  logger.debug(req.session);
  res.clearCookie('connect.sid');
  res.redirect('/');
}

function mstcAuth(authData, session, callback) {
  logger.debug('Posting data to server...');
  
  session.username = authData.username;
  
  request.post('http://login.mstczju.org/plain', {form: authData }, function(err, response, body) {
    var loginFlag = false;
    var person = JSON.parse(body); // transform the string to json 
    // use the responese code to decide
    if (response.statusCode == 200) { 
      if (person.success) {

        var ahour = 3600000;
        session.name = person.name;

        if (authData.remember == 'on') {
          session.cookie.maxAge = ahour * 24 * 7;
        } else {
          session.cookie.maxAge = ahour * 0.5;
        }

        // logger.debug(req.session);
        // res.send('login success. Welcome you [' + person.name + ']' );
        loginFlag = true;
        
      } else {
        session.times =+ 1;
        logger.warn('Invalid username or password');
        loginFlag = false;  
     }
    } else {
      logger.warn('Error occured at auth server');
      loginFlag = false;
    }
    // err = 'this is error';
    callback(err, loginFlag);
  });
}


// function empty (mixed_var) {
//   var key;
//   if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
//     return true;
//   }
//   if (typeof mixed_var == 'object') {
//     for (key in mixed_var) {
//       return false;
//     }
//     return true;
//   }
//   return false;
// }

// exports.alert = function(req, res) {
//   // auth here

//   console.log(req.body);
//   // filter here
//   if (empty(req.body.major) || empty(req.body.email) || empty(req.body.group) || empty(req.body.id) || empty(req.body.contact) || empty(req.body.QQ)) {
//     console.log('alert with empty entries.');
//     res.redirect('alert');
//     return ;
//   }

//   var newContact = {
//     sex: req.body.sex,
//     major: req.body.major,
//     group: req.body.group,
//     id: req.body.id,
//     contact: req.body.contact,
//     email: req.body.email,
//     QQ: req.body.QQ 
//   };

//   contactModel.update( {name: req.body.name}, newContact, function(err, doc) {
//     if (err) {
//       console.log("[Database Error] Failed to update:");
//       console.log(err);
//       console.track(err);
//       return ;
//     }

//     console.log("[Database] update successed:");
//     console.log(doc);
//     // add log here 
//     res.redirect('/list');
//   });
//   contactModel.findOneAndUpdate( {name: req.body.name}, newContact, function(err, doc) {
//     if (err) {
//       console.log("[Database Error] Failed to update:");
//       console.log(err);
//       return ;
//     }
//     console.log("[Database] update successed:");
//     console.log("[Database] start updating log");
//     logModel.findOne( {name: req.body.name}, function(err, item) {
//       if (err) {
//         console.log("[Database Error] Failed to update:");
//         console.log(err);
//         return ;
//       }
//       console.log("[Database] log found");
//       console.log(doc);
//       item.logs.push(doc);
//       item.save();
//     });

//   });
// };

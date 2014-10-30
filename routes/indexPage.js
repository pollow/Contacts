var contactModel = require('../models').contactModel; 
var logModel = require('../models').logModel;
var logger = require('logger').logger('indexPage');
var async = require('async');
var titleStr = {
  index: "MSTC ZJU Contact",
  main: "Contact - 通讯录",
  about: "Contact - 关于"
}

exports.index = function(req, res) {
  var game = 'game/2048/index.html';
  var loggedin = 0;
  // logger.debug(req.app.settings);
  if (req.app.settings.nologin)
    return res.render('index', {title: titleStr.index, game: game });

  if (!req.session.authFlag) {
    // undefined or false
    if (req.session.authFlag === undefined)
      loggedin = 0;
    else {
      loggedin = -1;
      req.session.authFlag = undefined;
    }
  } else {
    loggedin = 1;
  }

  res.render('index', {title: titleStr.index, game: game, loggedin: loggedin });
};

exports.main = function(req, res, next) {
  // logger.debug("authFlag", req.session.authFlag);
  if (req.app.settings.nologin == false && !req.session.authFlag)
    return res.redirect('/');
  contactModel.find({}, null, function(err, docArr) {
    logger.info('Start pulling contacts.');
    if(err) {
      logger.error("[Database Error] Failed to find:");
      return next(err);
    }
    logger.info('[Database Read] Succeed to find');
    // logger.debug(doc);
    // logger.debug(typeof doc[0]._id.toString());
    // logger.debug("session is", req.session);
    try {
      docArr = docArr.map(function(person){
        if (person.enrollTime && person.studentType) {
          if (person.studentType == '本科生') {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var diff = year - person.enrollTime;
            if (month < 8) {
              diff--;
            }
            if (diff < 0) {
              person.grade = '大一';
            } else if (diff < 4) {
              person.grade = ['大一', '大二', '大三', '大四'][diff];
            } else {
              person.grade = '工作';
            }
          } else if (person.studentType == '研究生') {
            person.grade = '研究生';
          }
        }
        return person;
      })
    } catch (err) {
      return next(err);
    }
    res.render('main', {
      title: titleStr.main, 
      people: docArr, 
      loggedin: 1,
      firstLogin: !req.session.everLogged,
      loginAs: req.session.doc._id
    });
  });
};

exports.about = function(req, res, next) {
  res.render('about', {title: titleStr.about});
}

/// we need move indexPage.update to userPage.update !!!

var validAttr = [
  "sid",
  "sex",
  "longNumber",
  "shortNumber",
  "email",
  "qq",
  "nickname",
  "campus",
  "major",
  "group",
  "studentType",
  "enrollTime",
];

exports.update = function(req, res, next) {
  logger.debug('the update form data is', req.body);

  // need to check authFlag
  if (!req.session.authFlag)
    return res.redirect('/main');

  // the _id is not identified with session._id
  if (!req.body._id || req.session.doc._id != req.body._id) {
    logger.fatal('SOMEONE ATTEMPTS TO UPDATE WITHOUT PERMISSION')
    return res.redirect('/main');
  }
  req.session.everLogged = true;
  var newDoc = Object();
  validAttr.forEach(function(attr){
    if (req.body[attr])
      newDoc[attr] = req.body[attr];
  });
  // Object.keys(req.body).forEach(function(key, value) {
  //   logger.debug('key is', key, 'value is', value);
  //   if ()
  // })
  logger.info('Updating information', newDoc);
  logger.debug('new doc is', newDoc);
  // res.redirect('/main');
  contactModel.findByIdAndUpdate(
    req.body._id,
    { $set : newDoc }, function(err, doc) {
      if(err) {
        logger.error("[Database Error] Update Error!");
        next(err);
        // res.end(JSON.stringify( {"error": "true", "msg": "Database Error!"} ))
        // handle error here.
      } else {
        // res.redirect('/main');
        logger.info("Adding log.")
        logModel.findOneAndUpdate(
          { username: req.session.doc.username },
          { $push : { logs: JSON.stringify(doc) } },
          function(err, doc) {
            if (err) {
              next(err);
              // throw err;
              // handle error here.
            }
            logger.debug(doc);
            logger.info("Logged.")
            // res.end(JOSN.stringify(doc));
          }
        );
      }
      return res.redirect('/main');
    }
  );
}

function findByUsername(source, username) {
  for (var i = source.length - 1; i >= 0; i--) {
    if (source[i].username == username) return source[i];
  };
}

// exports.list = function(req, res) {
//   // auth here
//   logger.info(req.session);
//   if(!req.session.name) {
//     res.json({success: 'error'});
//     return ;
//   }
//   // find
//   contactModel.find({}, "_id sex major group id contact email QQ name updated", function(err, doc) {
//     console.log('Start pulling contacts.');
//     if(err) {
//       console.log("[Database Error] Failed to find:");
//       console.log(err);
//       console.track(err);
//       return ;
//     }

//     // list all the data in json for test, change to Array to adjust ejs.
//     console.log('[Database Read] Success to find');
//     res.json(doc);
//   });

// };

// exports.test = function(req, res) {
//   logger.debug(req.cookies);
//   logger.debug(req.session);
//   res.send();
// };

// exports.loginsuccess = function(req, res) {
//   console.log(req.cookies);
//   //   res.cookie("token","123123123");
//   req.session.cookie.maxAge = 1000*60*30;
//   req.session.cookie.expires = false;
//   req.session.token = "123123123";
//   req.session.user = 'xc';
//   console.log(req.session);
//   res.send('WTF!');
// };

// exports.log = function(req, res) {
//   console.log(req.session);
  
//   if(!req.session.name) {
//     res.redirect('/');
//     res.json({error: 'auth failed'});
//   }
  
//   logModel.findOne({name: req.query.name}, "name logs _id", function(err, doc) {
//     console.log('Start pulling logs.');
//     if(err) {
//       console.log("[Database Error] Failed to find:");
//       console.log(err);
//       console.track(err);
//       return ;
//     }
    
//     console.log('[Database Read] Success to find log');
//     res.json(doc);
//   });
// };

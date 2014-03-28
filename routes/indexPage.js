var contactModel = require('../models').contactModel; 
var logModel = require('../models').logModel;
var logger = require('logger').logger('indexPage');
var titleStr = {
  index: "MSTC ZJU Contact",
  main: "Contact - 通讯录",
  about: "Contact - 关于"
}

exports.index = function(req, res) {
  var game = 'game/2048/index.html';

  // logger.debug(req.app.settings);
  if (req.app.settings.nologin)
    return res.render('index', {title: titleStr.index, game: game });

  if (req.session.times == undefined) req.session.times = 0;

  if(req.session.name) {
    res.render('index', {title: titleStr.index, game: game, loggedin: 1 });
    logger.debug(1);
  } else {
    if (req.session.times == 0) {
      res.render('index', {title: titleStr.index, game: game, loggedin: 0});
      logger.debug(0);
    }
    else {
      res.render('index', {title: titleStr.index, game: game, loggedin: -1});
      logger.debug(-1);
    }
  }
  logger.debug(req.session.times)
};

exports.main = function(req, res) {
  logger.debug("authFlag", req.session.authFlag);
  if (req.app.settings.nologin == false && !req.session.authFlag)
    return res.redirect('/');

  contactModel.find({}, null, function(err, doc) {
    logger.info('Start pulling contacts.');
    if(err) {
      logger.error("[Database Error] Failed to find:");
      logger.error(err);
      logger.trace(err);
      return ;
    }
    logger.info('[Database Read] Success to find');
    // logger.debug(doc);
    // logger.debug(typeof doc);
    res.render('main', {title: titleStr.main, people: doc, loggedin: 1, loginAS: findByUsername(doc, req.session.username)});
  });
};

exports.about = function(req, res) {
  res.render('about', {title: titleStr.about})
}

exports.update = function(req, res) {
  var newDoc = Object();
  Object.keys(req.body).forEach(function(key, value) {
    if( !!~( ["ObjectId, name"].indexOf(key) ) ) newDoc[key] = value;
  })
  contactModel.findByIdAndUpdate(
    req.body.ObjectId,
    { $set : newDoc }, function(err, doc) {
      if(err) {
        logger.error("[Database Error] Update Error!");
        res.end(JSON.stringify( {"error": "true", "msg": "Database Error!"} ))
        // handle error here.
      } else {
        logger.info("Adding log.")
        logModel.findOneAndUpdate(
          { username: req.session.doc.username },
          { $push : { logs: JSON.stringify(doc) } },
          function(err, doc) {
            if (err) {
              throw err;
              // handle error here.
            }
            logger.debug(doc);
            logger.info("Logged.")
            res.end(JOSN.stringify(doc));
          }
        );
      }
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

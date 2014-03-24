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
    return res.render('index', {title: titleStr.index, game: game});

  if(req.session.name) {
    res.render('index', {title: titleStr.index, game: game, loggedin: true });
  } else {
    res.render('index', {title: titleStr.index, game: game, loggedin: false});
  }
};

exports.main = function(req, res) {

  if (req.app.settings.nologin == false && !req.session.name)
    return res.redirect('/');

  contactModel.find({}, "name nickname longNumber shortNumber sex group email qq major campus", function(err, doc) {
    logger.info('Start pulling contacts.');
    if(err) {
      logger.error("[Database Error] Failed to find:");
      logger.error(err);
      logger.trace(err);
      return ;
    }
    logger.info('[Database Read] Success to find');
    // logger.debug(doc);
    res.render('main', {title: titleStr.main, people: doc, loggedin: true});
  });
};

exports.about = function(req, res) {
  res.render('about', {title: titleStr.about})
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

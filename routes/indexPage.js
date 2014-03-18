var contactModel = require('../models').contactModel; 
var logModel = require('../models').logModel;
var logger = require('logger').logger('indexPage');

exports.index = function(req, res) {
  var game = 'game/2048/index.html';

  if(req.session.name) {
    res.redirect('/main');
  } else {
    res.render('index', {game: game});
  }
};

exports.main = function(req, res) {
  // if(!req.session.name) {
  //   res.redirect('/');
  //   return ;
  // }
  contactModel.find({}, "name nickname longNumber shortNumber", function(err, doc) {
    logger.info('Start pulling contacts.');
    if(err) {
      logger.error("[Database Error] Failed to find:");
      logger.error(err);
      logger.trace(err);
      return ;
    }

    logger.info('[Database Read] Success to find');

    // var people = [];
    // for (i in doc) {
    //   var person = {};
    //   person.name = doc[i].name;
    //   person.nickname = doc[i].nickname;
    //   person.longNumber = doc[i].longNumber;
    //   people.push(person);
    // }
    logger.debug(doc);
    res.render('main', {people: doc});
  });
};

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

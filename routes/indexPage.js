var contactModel = require('../models').contactModel; 
var titleStr = {
  index: "MSTC ZJU Contact",
  main: "Contact - 通讯录",
  about: "Contact - 关于"
};

exports.index = function(req, res) {
  var game = 'game/2048/index.html';
  var loggedin = 0;
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
  if (req.app.settings.nologin == false && !req.session.authFlag)
    return res.redirect('/');
  contactModel.find({}, null, function(err, docArr) {
    logger.info('[Database] Start pulling contacts...');
    if(err) {
      logger.error('[Database] Fail to pull');
      return next(err);
    }
    logger.info('[Database] Pull succeed')
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
  var loggedin = 0;
  if (req.session.authFlag) {
    loggedin = 1;
  }
  res.render('about', {title: titleStr.about, loggedin: loggedin});
};

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

  // need to check authFlag
  if (!req.session.authFlag)
    return res.redirect('/main');

  // the _id is not identified with session._id
  if (!req.body._id || req.session.doc._id != req.body._id) {
    logger.warn("[Unauthorized] Possible attack detected");
    logger.warn("[Unauthorized] Attacker: " + req.session.doc);
    return res.redirect('/main');
  }
  req.session.everLogged = true;
  var newDoc = {};
  validAttr.forEach(function(attr){
    if (req.body[attr])
      newDoc[attr] = req.body[attr];
  });
  logger.info("[Update] " + newDoc);
  contactModel.findByIdAndUpdate(
    req.body._id,
    { $set : newDoc }, function(err, doc) {
      if(err) {
        logger.error("[Database] Update error");
        next(err);
      } else {
        logger.info("[Database] Update succeed");
      }
      return res.redirect('/main');
    }
  );
};

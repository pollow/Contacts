var contactModel = require('../models').contactModel; 

exports.index= function(req, res) {
  if(req.session.name) {
    res.redirect('/list');
  } else {
    res.render('index');
  }
};

exports.list = function(req, res) {
  // auth here
  console.log(req.session);
  if(!req.session.name) {
    res.redirect('/');
    return ;
  }
  // find
  contactModel.find(function(err, doc) {
    console.log('Start pulling contacts.');
    if(err) {
      console.log("[Database Error] Failed to find:");
      console.log(err);
      console.track(err);
      return ;
    }

    // list all the data in json for test, change to Array to adjust ejs.
    console.log('[Database Read] Success to find');
    res.json(doc);
  });

};

exports.test = function(req, res) {
  console.log(req.cookies);
  console.log(req.session);
  res.send();
};

exports.loginsuccess = function(req, res) {
  console.log(req.cookies);
  //   res.cookie("token","123123123");
  req.session.cookie.maxAge = 1000*60*30;
  req.session.cookie.expires = false;
  req.session.token = "123123123";
  req.session.user = 'xc';
  console.log(req.session);
  res.send('WTF!');
};

exports.log = function(req, res) {

};

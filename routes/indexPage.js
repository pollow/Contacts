var contactModel = require('../models').contactModel; 

exports.index= function(req, res) {
  res.render('index');
};

exports.list = function(req, res) {
  // auth here
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

exports.log = function(req, res) {

};

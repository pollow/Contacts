var request = require('request');
var contactModel = require('../models').contactModel;
var logModel = require('../models').logModel;

// var inspect = require('util').inspect;

exports.login = function(req, res) {
  var authData = {
    "username": req.body.Username,
    "password": req.body.Password
  };

  console.log(req.body);
  console.log(authData);
  request.post('http://login.mstczju.org/plain', {form: authData }, function(err, response, body) {

    var person = JSON.parse(body); // transform the string to json 
    console.log(person);

    if (err) {
      console.log(err);
      console.track(err);
      return ; // does it need something to return ?
    }

    // use the responese code to decide
    if (response.statusCode == 200) { 
      if (person.success) {
        req.session.name = person.name;
        req.session.cookie.expires = false;
        req.session.cookie.maxAge = 1000*60*30;
        // res.send('login success. Welcome you [' + person.name + ']' );
        res.redirect('/main');
      } else {
        console.log(body);
        res.send('login failure.');
      }
    } else {
      console.log('Requested error');
      res.send('login failure.');
    }
  });
};

function empty (mixed_var) {
  var key;
  if (mixed_var === "" || mixed_var === 0 || mixed_var === "0" || mixed_var === null || mixed_var === false || typeof mixed_var === 'undefined') {
    return true;
  }
  if (typeof mixed_var == 'object') {
    for (key in mixed_var) {
      return false;
    }
    return true;
  }
  return false;
}

exports.alert = function(req, res) {
  // auth here

  console.log(req.body);
  // filter here
  if (empty(req.body.major) || empty(req.body.email) || empty(req.body.group) || empty(req.body.id) || empty(req.body.contact) || empty(req.body.QQ)) {
    console.log('alert with empty entries.');
    res.redirect('alert');
    return ;
  }

  var newContact = {
    sex: req.body.sex,
    major: req.body.major,
    group: req.body.group,
    id: req.body.id,
    contact: req.body.contact,
    email: req.body.email,
    QQ: req.body.QQ 
  };

  contactModel.update( {name: req.body.name}, newContact, function(err, doc) {
    if (err) {
      console.log("[Database Error] Failed to update:");
      console.log(err);
      console.track(err);
      return ;
    }

    console.log("[Database] update successed:");
    console.log(doc);
    // add log here 
    res.redirect('/list');
  });
  contactModel.findOneAndUpdate( {name: req.body.name}, newContact, function(err, doc) {
    if (err) {
      console.log("[Database Error] Failed to update:");
      console.log(err);
      return ;
    }
    console.log("[Database] update successed:");
    console.log("[Database] start updating log");
    logModel.findOne( {name: req.body.name}, function(err, item) {
      if (err) {
        console.log("[Database Error] Failed to update:");
        console.log(err);
        return ;
      }
      console.log("[Database] log found");
      console.log(doc);
      item.logs.push(doc);
      item.save();
    });

  });
};

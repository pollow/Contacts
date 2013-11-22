var request = require('request');
var contactModel = require('./models').contactModel;
// var logModel = require('./models').logModel;

// var inspect = require('util').inspect;

exports.login = function(req, res) {
  var authData = {
    "username": req.body.user,
    "password": req.body.password
  };

  console.log(req.body);
  request.post('http://login.mstczju.org/plain', {form: authData }, function(err, response, body) {

    var person = JSON.parse(body); // transform the string to json 

    if (err) {
      console.log(err);
      console.track(err);
      return ; // does it need something to return ?
    }

    // use the responese code to decide
    if (response.statusCode == 200) { 
      if (person.success) {
        res.send('login success. Welcome you [' + person.name + ']' );
      } else {
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
};

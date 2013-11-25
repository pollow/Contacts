var mongoose = require('mongoose');
var request = require('request');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  // 姓名,性别,专业,Group,常用ID,联系方式,邮箱,QQ,spam
  name: String,
  sex: String,
  major: String,
  group: String,
  id: String,
  contact: String,
  email: String,
  QQ: String,
  spam: {type: Boolean, default: false},
  updated: {type:Number, default: Date.now()}
});


exports.contactModel = mongoose.model('contact', contactSchema);

var logSchema = new Schema({
  // 姓名,[{unixtimestamp, log},...]
  name: String,
  logs: [contactSchema]
});

exports.logModel = mongoose.model('log', logSchema);

exports.auth = function(username, password) {
  var authData = {
    "username": username,
    "password": password
  };

  console.log(username+'  '+password);
  request.post('http://login.mstczju.org/plain', {form: authData }, function(err, response, body) {

    var person = JSON.parse(body); // transform the string to json 

    if (err) {
      console.log(err);
      console.track(err);
      return false; // does it need something to return ?
    }

    // use the responese code to decide
    if (response.statusCode == 200) { 
      if (person.success) {
        return person;
      } else {
        return false;
      }
    } else {
      console.log('Requested error');
    }
  });
  
};

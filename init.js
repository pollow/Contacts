var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost','mstc');
var logModel = require('./models').logsModel;

var Schema = mongoose.Schema;

var contactSchema = new Schema({
  // 姓名,性别,专业,Group,常用ID,联系方式,邮箱,QQ
  sex: String,
  major: String,
  group: String,
  id: String,
  contact: String,
  email: String,
  QQ: String,
  name: String,
  spam: {type: Boolean, default: false},
  updated: {type:Number, default: Date.now()}
});

var contactModel = db.model('Contact', contactSchema);

var logSchema = new Schema({
  // 姓名,[{unixtimestamp, log},...]
  name: String,
  logs: [contactSchema]
});

logModel = db.model('log', logSchema);

db.on('error',console.error.bind(console,'Connection Error:'));

db.once('open', function() {
  console.log("oppend");

  var fs = require('fs');

  var csvFile;

  fs.readFile("./Contacts.csv", 'utf8',function(err, data) {
    csvFile = data;

    var contactsArray = csvFile.split('\n');
    contactsArray.shift();
    console.log(contactsArray[0]);

    for(var i in contactsArray) {
      var item = contactsArray[i];
      var json_ = item.split(',');
      contactsArray[i] = { // 姓名,性别,专业,Group,常用ID,联系方式,邮箱,QQ
        sex: json_[1],
        major: json_[2],
        group: json_[3],
        id: json_[4],
        contact: json_[5],
        email: json_[6],
        QQ: json_[7],
        name: json_[0]
      };
    }
    // console.log(contactsArray);
    contactModel.create(contactsArray,function (err) {
      if(err) console.log(err);
      else console.log("success!");
      db.close();
    });
    var logsArray = Array();
    contactsArray.forEach(function(item) {
      logsArray.push({name: item.name, logs:[item]});
    });
    console.log(logsArray[0]);
    logModel.create(logsArray, function(err) {
      if(err) console.log(err);
      else console.log("success!");
      db.close();
    });

  });
});

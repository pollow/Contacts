var mongoose = require('mongoose');
var dbconfig = require('./db.js');
var db = mongoose.createConnection('mongodb://' + dbconfig.user + ':' + dbconfig.password + '@localhost/mstc');
var logSchema = require('./models').logSchema;
var contactSchema = require('./models').contactSchema;

var contactModel = db.model('contact', contactSchema);
var logModel = db.model('log', logSchema);

db.on('error',console.error.bind(console,'Connection Error:'));

db.once('open', function() {
  console.log("opened");
  var fs = require('fs');
  var csvFile;

  fs.readFile("./Contacts.csv", 'utf-8', function(err, data) {
    csvFile = data;
    var contactsArray = csvFile.split('\n');
    contactsArray.shift();
    for(var i in contactsArray) {
      var item = contactsArray[i];
      var json_ = item.split(',');
      var phoneNumbers = json_[5];
      phoneNumbers = phoneNumbers.split(/[^0-9]{1,}/);
      var longNum = phoneNumbers[0];
      var shortNum = phoneNumbers[1];
      contactsArray[i] = { 
        name: json_[0],
        sex: json_[1],
        longNumber: longNum,
        shortNumber: shortNum,
        email: json_[6],
        qq: json_[7],
        nickname: json_[4],
        major: json_[2],
        group: json_[3],
        title: json_[11],
        studentType: json_[12],
        enrollTime: json_[13],
        blog: json_[14],
        employer: json_[15]
      };
      console.log(contactsArray[i]);
    }

    contactModel.create(contactsArray,function (err) {
      if(err) console.log(err);
      else console.log("success!");
      db.close();
    });
    // var logsArray = Array();
    // contactsArray.forEach(function(item) {
    //   logsArray.push({name: item.name, logs:[item]});
    // });
    // // console.log(logsArray[0]);
    // logModel.create(logsArray, function(err) {
    //   if(err) console.log(err);
    //   else console.log("success!");
    //   db.close();
    // });

  });
});

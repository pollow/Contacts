var mongoose = require('mongoose');
// var db = mongoose.craeteConnection('10.13.122.223','Contacts');

var Schema = mongoose.Schema;

var contactSchema = new Schema({
  // 姓名,性别,专业,Group,常用ID,联系方式,邮箱,QQ
  name: String,
  sex: Boolean,
  major: String,
  group: String,
  id: String,
  contact: String,
  email: String,
  QQ: String
});

var contact = mongoose.model('Contact', contactSchema);

var fs = require('fs');

var csvFile;

fs.readFile("./Contacts.csv", 'utf8',function(err, data) {
  csvFile = data;

  var contactsArray = csvFile.split('\n');
  contactsArray.shift();
  console.log(contactsArray);

  contactsArray.forEach(function(item) {
    var json_ = item.split(',');
    // console.log(json_);
    var small = new contact({ // 姓名,性别,专业,Group,常用ID,联系方式,邮箱,QQ
      name: json_[0],
      sex: json_[1],
      major: json_[2],
      group: json_[3],
      id: json_[4],
      contact: json_[5],
      email: json_[6],
      QQ: json_[7]
    });
    console.log(small);
  });

});


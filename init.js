var mongoose = require('mongoose');
// var db = mongoose.craeteConnection('10.13.122.223','Contacts');

var Schema = mongoose.Schema;

var contactsSchema = new Schema({
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

var contactModel = mongoose.model('Contact', contactsSchema);

var fs = require('fs');

var csvFile;

fs.readFile("./Contacts.csv", 'utf8',function(err, data) {
    csvFile = data;
})

contactsArray = csvFile.split('\n');
contactsArray.shift();
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var headLines = [
  "name",
  "sex",
  "longNumber",
  "shortNumber",
  "email",
  "qq",
  "nickname",
  "campus",
  "major",
  "group",
  "title",
  "studentType",
  "enrollTime",
  "blog",
  "employer"
];

var contactSchema = new Schema({
  username: String,
  name: String,
  sex: String,
  longNumber: String,
  shortNumber: String,
  email: String,
  qq: String,
  nickname: String,
  campus: String,
  major: String,
  group: String,
  title: String,
  studentType: String,
  enrollTime: String,
  employer: String,
  custom: String, // JSON String for Object as {attr: value}. Use JSON.stringify to convert a object.
  everLogged: Boolean,
  updated: {type:Number, default: Date.now()}
});

exports.contactModel = mongoose.model('contact', contactSchema);
exports.contactSchema = contactSchema;

var logSchema = new Schema({
  // 姓名,[{unixtimestamp, log},...]
  username: String,
  logs: [String]
});

exports.logModel = mongoose.model('log', logSchema);
exports.logSchema = logSchema;


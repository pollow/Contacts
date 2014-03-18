var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
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
  blog: String,
  employer: String,
  spam: {type: Boolean, default: false},
  updated: {type:Number, default: Date.now()}
});

exports.contactModel = mongoose.model('contact', contactSchema);
exports.contactSchema = contactSchema;

var logSchema = new Schema({
  // 姓名,[{unixtimestamp, log},...]
  name: String,
  logs: [contactSchema]
});

exports.logModel = mongoose.model('log', logSchema);
exports.logSchema = logSchema;


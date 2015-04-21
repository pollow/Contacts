var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var contactSchema = new Schema({
  sid: String,
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


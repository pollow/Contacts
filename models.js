var mongoose = require('mongoose');
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
  spam: {type: Boolean, default: false}
});


exports.contactModel = mongoose.model('Contact', contactSchema);

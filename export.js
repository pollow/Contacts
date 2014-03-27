var xlsx = require('node-xlsx');
var fs = require('fs');
var logger = require('logger').logger('export');
var path = require('path');

var headLines = [
  "姓名", 
  "性别", 
  "长号", 
  "短号", 
  "邮箱", 
  "QQ", 
  "常用ID", 
  "校区",
  "专业",
  "部门",
  "职位",
  "学业类别",
  "入学时间",
  "个人主页",
  "就业去向"
];

var fileDir = path.join(__dirname, 'public', 'file');

exports.xlsx = exportToXlsx;
exports.csv = exportToCsv;

function exportToXlsx(data, callback){
  var buffer;
  logger.debug("get the data " + data);
  try {
    buffer = xlsx.build({worksheets: [
      {"name":"通讯录", "data":[
        headLines
      ]}
    ]});
  } catch(bufError) {
   return callback(bufError);
  }
  var timestamp = new Date().getTime();
  var filepath = path.join(fileDir, timestamp + '.xlsx');
  fs.writeFile(filepath, buffer, function(err) {
    var success = true;
    if (err) {
      logger.fatal(err);
      success = false;
    }

    callback(err, success, filepath);
  })
}


function exportToCsv() {

}
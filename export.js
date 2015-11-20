var xlsx = require('node-xlsx');
var fs = require('fs');
var path = require('path');

var format = {
  name: "姓名",
  sid: "学号",
  sex: "性别",
  longNumber: "长号",
  shortNumber: "短号",
  email: "邮箱",
  qq: "QQ",
  nickname: "常用ID",
  campus: "校区",
  major: "专业",
  group: "部门",
  title: "职位",
  studentType: "学业类别",
  enrollTime: "入学时间",
  blog: "个人主页",
  employer: "就业去向"
};

var headLines = [
  "name",
  "sid",
  "sex",
  "longNumber",
  "shortNumber",
  "email",
  "qq",
  "nickname",
  "campus",
  "major",
  "group",
  "studentType",
  "enrollTime"
];

var fileDir = path.join(__dirname, 'public', 'file');

exports.xlsx = exportToXlsx;
exports.csv = exportToCsv;

function exportToXlsx(data, callback){
  logger.info("[Export] Getting data: " + data);
  try {
    var rows = jsonToSheets(data);
    var buffer = xlsx.build([
      {"name":"通讯录", "data": rows}
    ]);
    var timestamp = new Date().getTime();
    var filepath = path.join(fileDir, timestamp + '.xlsx');
  } catch(err) {
   return callback(err, false, null);
  }
  fs.writeFile(filepath, buffer, function(err) {
    var success = true;
    if (err) {
      logger.error("[Export] Write file failed:");
      logger.error(err);
      success = false;
    }

    callback(err, success, filepath);
  })
}

function exportToCsv(data, callback) {
  try {
    var rows = jsonToSheets(data);
    var BOM = Buffer([0xef, 0xbb, 0xbf]);
    var buffer = '';
    for(var i = 0; i < rows.length; i++) {
      buffer += rows[i].join(',') + '\n';
    }
    var timestamp = new Date().getTime();
    var filepath = path.join(fileDir, timestamp + '.csv');
  } catch (err) {
    return callback(err, false, null);
  }
  fs.writeFile(filepath, Buffer.concat([BOM, Buffer(buffer)]), function(err) {
    var success = true;
    if (err) {
      logger.error("[Export] Write file failed:");
      logger.error(err);
      success = false;
    }
    callback(err, success, filepath);
  })  
}

function jsonToSheets(data) {
  var rows = [];
  var head = [];

  for(var i = 0; i < headLines.length; i++) {
    head.push(format[headLines[i]]);
  }
  rows.push(head);
  for(var i = 0; i < data.length; i++) {
    var row = [];
    if (typeof data[i] == 'object') {
      for(var j = 0; j < headLines.length; j++) {
        if(data[i][headLines[j]])
          row.push(data[i][headLines[j]]);
        else
          row.push("  ");
      }
      rows.push(row);
    }
  }
  return rows;
}

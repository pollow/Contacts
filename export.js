var xlsx = require('node-xlsx');
var fs = require('fs');
var logger = require('logger').logger('export');
var path = require('path');

var format = {
  name: "姓名",
  sex: "性别",
  longNumber: "长号",
  shortNumber: "短号",
  email: "邮箱",
  qq: "QQ",
  nickname: "常用ID",
  campus: "校区",
  major: "专业",
  group: "部门",
  title: "职位", // used to distinguish the leader and common memeber
  studentType: "学业类别",
  enrollTime: "入学时间",
  blog: "个人主页",
  employer: "就业去向"
};

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

// var headLines = [
//   "姓名", 
//   "性别", 
//   "长号", 
//   "短号", 
//   "邮箱", 
//   "QQ", 
//   "常用ID", 
//   "校区",
//   "专业",
//   "部门",
//   "职位",
//   "学业类别",
//   "入学时间",
//   "个人主页",
//   "就业去向"
// ];

var fileDir = path.join(__dirname, 'public', 'file');

exports.xlsx = exportToXlsx;
exports.csv = exportToCsv;

function exportToXlsx(data, callback){
  var buffer;
  // logger.debug("get the data " + data);
  try {
    rows = jsonToSheets(data);
    buffer = xlsx.build({worksheets: [
      {"name":"通讯录", "data": rows}
    ]});
  } catch(bufError) {
   return callback(bufError);
  }
  // logger.debug(rows);
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

function exportToCsv(data, callback) {
  var buffer = '';
  var rows = jsonToSheets(data);
  
  for(var i = 0; i < rows.length; i++) {
    buffer += rows[i].join(',') + '\n';
  }
  // logger.debug(buffer);
  var timestamp = new Date().getTime();
  var filepath = path.join(fileDir, timestamp + '.csv');
  fs.writeFile(filepath, buffer, function(err) {
    var success = true;
    if (err) {
      logger.fatal(err);
      success = false;
    }
    callback(err, success, filepath);
  }) 
}

function jsonToSheets(data) {
  var rows = new Array();
  var head = new Array();

  for(var i = 0; i < headLines.length; i++) {
    head.push(format[headLines[i]]);
  };
  rows.push(head);
  for(var i = 0; i < data.length; i++) {
    var row = new Array();
    if (typeof data[i] == 'object') {
      for(var j = 0; j < headLines.length; j++) {
        if(data[i][headLines[j]])
          row.push(data[i][headLines[j]]);
        else
          row.push(" ");
      }
      rows.push(row);
    }
  }
  // headLines.forEach(function(attr){
  //   head.push(format[attr]);
  // })
  // rows.push(head);
  // data.forEach(function(person){
  //   var row = new Array();
  //   headLines.forEach(function(attr){
  //     if(person[attr])
  //       row.push(person[attr]);
  //     else
  //       row.push(" ");
  //   })
  //   rows.push(row);
  // });
  return rows;
}

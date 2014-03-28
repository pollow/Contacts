var logger = require('logger').logger('exportPage');
var exporting = require('../export.js');
var filename = 'contact';
var fs = require('fs');
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

exports.export = function (req, res, next) {
  var _ids = req.body._ids;
  var extName = req.body.type;
  var supportExt = ['xlsx', 'csv'];
  logger.debug(req.body);
  var data = [
    {
      name:"ggg"
    },
    {
      sex: "男",
      longNumber: "1919191"
    }
  ];
  // if (!req.session.name)
  //   return res.redirect('/');

  //  searching in database
  //  oids ----> data [person1, person2]
  //
  logger.debug(req.body);
  if (supportExt.indexOf(extName) == -1) 
    extName = 'xlsx';
  exporting[extName](data, function(err, success, filepath){
    if (err)
      return next(err);
    else
      res.download(filepath, filename + '.' + extName, function(err){
        // logger.debug('header sent is ' + res.headerSent );
        if (err) {
          next(err);
        } else {
          fs.unlink(filepath, function(err){
            if (err) {
              next(err);
            } else {
              logger.info('Successfully deleted temporary file');
            }
          })
        }
      });
  });
}
var exporting = require('../export.js');
var filename = 'contact';
var fs = require('fs');
var contactModel = require('../models').contactModel;
var async = require('async');

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
  // var _ids = req.body._ids;
  var extName = req.body.type;
  var supportExt = ['xlsx', 'csv'];
  if (supportExt.indexOf(extName) == -1) 
    extName = 'xlsx';
  
  // logger.debug(req.body);
  if (!req.session.authFlag)
    return res.redirect('/');

  var _ids = Array();
  try {
    var arr = Object.keys(req.body);
    for (var i = 0; i < arr.length; i++) {
      if (req.body[arr[i]] && arr[i] != 'type') {
        //if any invalid string occured, it would fail the export
        _ids.push(req.body[arr[i]].toString());
      }
    };
  } catch (err) {
    return next(err);
  }
  // logger.debug('ids are', _ids);
  async.map(_ids, findById, function(err, result) {
    if (err)
      return next(err);
    result = result.filter(function(item){ return (item !== null)});
    exporting[extName](result, function(err, success, filepath){
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
                // logger.info('Successfully deleted temporary file');
              }
            });
          }
        });
    });
  });
};

function findById(_id, callbackReturnResut) {
  // contactModel.findOne({_id: ObjectId(_id)}, null, function(err, doc){
  contactModel.findOne({_id: _id}, null, function(err, doc){
    if (err) {
      // logger.error(err);
      // handle the err
      callbackReturnResut(err, null);
    } else {
      callbackReturnResut(null, doc);
    }
  })
}
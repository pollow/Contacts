var exporting = require('../export.js');
var filename = 'contact';
var fs = require('fs');
var contactModel = require('../models').contactModel;
var async = require('async');

exports.export = function (req, res, next) {
  var extName = req.body.type;
  var supportExt = ['xlsx', 'csv'];
  if (supportExt.indexOf(extName) == -1) 
    extName = 'xlsx';
  
  if (!req.session.authFlag)
    return res.redirect('/');

  logger.info("[Export] ", req.session.doc.username, "is trying to export");
  var _ids = [];
  try {
    var arr = Object.keys(req.body);
    for (var i = 0; i < arr.length; i++) {
      if (req.body[arr[i]] && arr[i] != 'type') {
        //if any invalid string occurs, it would fail the export
        _ids.push(req.body[arr[i]].toString());
      }
    }
  } catch (err) {
    return next(err);
  }
  async.map(_ids, findById, function(err, result) {
    if (err)
      return next(err);
    result = result.filter(function(item){ return (item !== null)});
    exporting[extName](result, function(err, success, filepath){
      if (err) {
        logger.error("[Database] Export error");
        logger.error(err);
        return next(err);
      }
      else
        res.download(filepath, filename + '.' + extName, function(err){
          if (err) {
            logger.error("[Export] File sending error:");
            logger.error(err);
            next(err);
          } else {
            fs.unlink(filepath, function(err){
              if (err) {
                logger.error("[Export] File unlink error:");
                logger.error(err);
                next(err);
              } else {
                logger.info('[Export] Successfully deleted temporary file');
              }
            });
          }
        });
    });
  });
};

function findById(_id, callbackReturnResult) {
  contactModel.findOne({_id: _id}, null, function(err, doc){
    if (err) {
      // logger.error(err);
      // handle the err
      callbackReturnResult(err, null);
    } else {
      callbackReturnResult(null, doc);
    }
  })
}
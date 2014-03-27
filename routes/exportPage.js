var logger = require('logger').logger('exportPage');
var exp = require('../export.js');

exports.export = function (req, res, next) {
  exp.xlsx('test', function(err, success, filepath){
    if (err)
      return next(err);
    else
      res.download(filepath);
  });
}
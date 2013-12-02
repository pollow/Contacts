var log4js = require('log4js');

log4js.configure({
  appenders: [
    { type: 'console' },
  ],
  replaceConsole: true
});

exports.logger = function(name){
  var logger = log4js.getLogger(name);
  logger.setLevel('TRACE');
  return logger;
}

# Introduction

This is an online Contacts for MSTC in ZJU

Authored by [Gnnng], [MForever78] and [Pollow]

# Task assignments

- Front-end development
	- [MForever78]
- Back-end development
	- [Gnnng]
	- [Pollow]


# Developing routines

## 1. Print in console

Please use `logger` to print variable or other information you need. In this way, you can easily locate the file which print the information you need.

Assume that a file named `user.js` is in debugging, you want to print some inforamtion.

```javascript
var logger = require('logger').logger('user'); //use the filename to initialize the logger

logger.trace('This is trace');
logger.debug('This is debug');
logger.info('This is info');
logger.warn('This is warn');
logger.error('This is error');
logger.fatal('This is fatal');
```

The console will print 
```
[2014-03-17 20:15:18.816] [TRACE] user - This is trace
[2014-03-17 20:15:18.823] [DEBUG] user - This is debug
[2014-03-17 20:15:18.824] [INFO] user - This is info
[2014-03-17 20:15:18.825] [WARN] user - This is warn
[2014-03-17 20:15:18.825] [ERROR] user - This is error
[2014-03-17 20:15:18.826] [FATAL] user - This is fatal

```

Now you know that all these lines are printed by `user.js`

## 2. Contact format

Whenever you do anything with the contact (e.g. database, locals), just remeber to follow the format standard listed in the file `contactformat.md`. Or if you want to make some changes about the format strings, you can update this file first and then update the other code.

## 3. Personal private information

Check all the files you commit and make sure no private information is commited and pushed.

In addition, pay attention to vital adminstrator username and password.

## 4. Before you push

Please make sure your code is ready to run before you make a push on GitHub.

**It's quite important**















[Gnnng]:https://github.com/Gnnng
[MForever78]:https://github.com/MForever78
[Pollow]:https://github.com/Pollow


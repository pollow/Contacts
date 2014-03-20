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

### Locate the printing position

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

### Set the log level

Thanks for the node module `log4js`, we can change our printing strategy while running app.js in various environments.

You should use `app.set` to configure it as follows
> Or you can configure it in specific situation which means multiple environments.

```javascript
//in app.js
app.set('logLevel', logger.setLevel('TRACE'));
```
All the available log levels are the same as the loggers' name like `DEBUG`, `INFO`, etc.

## 2. Multiple environment configuration

By now, we have 3 different environments in all. They are `development`, `offline` and `production`

### How to enable certain environment
When you run the app.js, use certain **one** of three commands below.
> Note: you don't have to explicitly enable `development` which is default running mode


```bash
NODE_ENV=development node app.js
#or
node app.js

NODE_ENV=offline node app.js 

NODE_ENV=production node app.js
```

### How to configure different environments

Use `app.set` or `app.enable` to configure.

```javascript
// development environment only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
  app.set('dburl', 'mongodb://'+db.user+':'+db.password+'@'+db.address+'/mstc');
  app.enable('nologin');
}

// offline environment only
if ('offline' == app.get('env')) {
  app.use(express.errorHandler());
  app.set('dburl', 'mongodb://localhost/mstc');
  app.enable('nologin');
}

if ('production' == app.get('env')) {
  app.set('dburl', 'mongodb://'+db.user+':'+db.password+'@localhost/mstc');

  //TO-DO still in debug
  app.use(errors.routeHandler);
  app.use(errors.serverHandler);
}
```

### Explanation for some statements

#### No-login mode
```javascript
//enable this mode
app.enable('nologin');
//disable this mode
app.disable('nologin');
```

#### Offline environment
This "offline" environment is used when you have no network connection.
It includes these feature

1. Based on development environment
2. Using local database without authorization

## 3. Contact format

Whenever you do anything with the contact (e.g. database, locals), just remeber to follow the format standard listed in the file `contactformat.md`. Or if you want to make some changes about the format strings, you can update this file first and then update the other code.

## 4. Personal private information

Check all the files you commit and make sure no private information is commited and pushed.

In addition, pay attention to vital adminstrator username and password.

## 5. Before you push

Please make sure your code is ready to run before you make a push on GitHub.

**It's quite important**















[Gnnng]:https://github.com/Gnnng
[MForever78]:https://github.com/MForever78
[Pollow]:https://github.com/Pollow


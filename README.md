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

Please use `debug` to print variable or other information you need. In this way, you can easily locate the file which print the information you need.

Assume that a file named `user.js` is in debugging, you want to print some inforamtion.

```js
var debug = require('debug')('user');
debug('This is a debug info');
```

Then run the project with `DEBUG` env set properly, for example:

```
DEBUG=* node app.js
```

The console will print 
```
user This is a debug info
```

Now you know that all these lines are printed by `user.js`

## 2. Multiple environment configuration

By now, we have 2 different environments in all. They are `development` and `production`

### How to enable certain environment
When you run the app.js, use certain **one** of two commands below.
> Note: you don't have to explicitly enable `development` which is default running mode

```bash
NODE_ENV=development node app.js
#or
node app.js

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

## 3. Contact format

Whenever you do anything with the contact (e.g. database, locals), just remeber to follow the format standard listed in the file `contactformat.md`. Or if you want to make some changes about the format strings, you can update this file first and then update the other code.

## 4. Personal private information

Check all the files you commit and make sure no private information is commited and pushed.

In addition, pay attention to vital administrator username and password.

## 5. Before you push

Please make sure your code is ready to run before you make a push on GitHub.

**It's quite important**

[Gnnng]:https://github.com/Gnnng
[MForever78]:https://github.com/MForever78
[Pollow]:https://github.com/Pollow


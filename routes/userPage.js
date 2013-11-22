var request = require('request');

var inspect = require('util').inspect;
exports.login = function(req, res) {
  var authData = {
  	"username": req.body['user'],
  	"password": req.body['password']
  };

  console.log(req.body);
  request.post('http://login.mstczju.org/plain', {form: authData }, function(err, response, body) {

    var person = JSON.parse(body); // transform the string to json 

  	if (err) {
  	  console.log(err);
  	  console.track(err);
      return ; // does it need something to return ?
  	}

    // use the responese code to decide
  	if (response.statusCode == 200) { 
    		if (person['success']) {
    			res.send('login success. Welcome you [' + person['name'] + ']' );
    		} else {
    			res.send('login failure.');
    		}
    } else {
  		console.log('Requested error');
      res.send('login failure.')
  	}
  });
  
}

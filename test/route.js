var request = require('request');
// var should = require('should');
var waiting = 0;
describe('Available routes', function() {
  [
    '/',
    '/main',
    '/logout',
  ]
  .map(function(item) {return 'http://localhost:3000' + item})
  .forEach(function(url){
    it('should return 200', function(done){
      request.get(url, function(err, res, body){
        // console.log(response);
        res.should.have.status(200);
        setTimeout(done, waiting);
        // done(err);
      })
    })      
  });
});

describe('Unavailable routes', function() {
  [
    '/empty',
    '/haha',
    '/good',
    '/a/b/c',
    '/*'
  ]
  .map(function(item) {return 'http://localhost:3000' + item})
  .forEach(function(url){
    it('should return 404', function(done){
      request.get(url, function(err, res, body){
        // console.log(response);
        res.should.have.status(404);
        setTimeout(done, waiting);
        // done(err);
      })
    })      
  });
});

describe('Internal error', function() {
  it('should return 500', function(done){
    request.get('http://localhost:3000/error', function(err, res, body) {
      res.should.have.status(500);
      setTimeout(done, waiting);
      // done(err);
    })
  })
})
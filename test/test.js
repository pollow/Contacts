var assert = require("assert");
// var should = require('should');

describe('THIS IS A DEMO', function(){
  describe('Array', function(){
    describe('#indexOf()', function(){
      it('should return -1 when the value is not present', function(){
        [1,2,3].indexOf(4).should.equal(-1);
        [1,2,3].indexOf(-1).should.equal(-1);
      });
    });
  });

  describe('User', function(){
    describe('#Properties', function(){
      it('should have correct properties', function(){
        var user = {
          name: 'gg',
          age: 12
        }
        user.should.have.property('name', 'gg');
        user.age.should.below(13);
        user.should.not.have.property('school');
      })
    })
  })
})

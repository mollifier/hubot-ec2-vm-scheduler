// Generated by CoffeeScript 1.9.3
(function() {
  var chai, expect, sinon;

  chai = require('chai');

  sinon = require('sinon');

  chai.use(require('sinon-chai'));

  expect = chai.expect;

  describe('ec2-vm-scheduler', function() {
    beforeEach(function() {
      this.robot = {
        respond: sinon.spy(),
        hear: sinon.spy()
      };
      return require('../src/ec2-vm-scheduler')(this.robot);
    });
    return it('registers a respond listener', function() {
      return expect(this.robot.respond).to.have.been.calledWith(/hello/);
    });
  });

}).call(this);

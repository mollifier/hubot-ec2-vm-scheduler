chai = require 'chai'
sinon = require 'sinon'
chai.use require 'sinon-chai'

expect = chai.expect

describe 'ec2-vm-scheduler', ->
  beforeEach ->
    @robot =
      respond: sinon.spy()
      hear: sinon.spy()

    require('../src/ec2-vm-scheduler')(@robot)

  it 'registers a respond listener', ->
    expect(@robot.respond).to.have.been.calledWith(/hello/)

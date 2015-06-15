// Description
//   A Hubot script to start or stop ec2 virtual machines
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//   HUBOT_EC2_VM_SCHEDULER_ACCESS_KEY_ID
//   HUBOT_EC2_VM_SCHEDULER_SECRET_ACCESS_KEY
//
// Commands:
//   hubot hello - <what the respond trigger does>
//   orly - <what the hear trigger does>
//
// Notes:
//   <optional notes required for the script>
//
// Author:
//   mollifier <mollifier@gmail.com>
//
// See also:
//   Class: AWS.EC2 — AWS SDK for JavaScript
//   http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html

module.exports = function(robot) {
  var AWS = require('aws-sdk');
  AWS.config.region = 'ap-northeast-1';
  AWS.config.update({
    accessKeyId: process.env.HUBOT_EC2_VM_SCHEDULER_ACCESS_KEY_ID,
    secretAccessKey: process.env.HUBOT_EC2_VM_SCHEDULER_SECRET_ACCESS_KEY
  });

  // ec2 list
  robot.respond(/ec2\s+list$/, function(res) {
    var ec2 = new AWS.EC2();
    ec2.describeInstances({}, function(err, data) {
      if (err) {
        res.send("Could not list instances : " + err);
        return;
      }

      for (var i = 0; i < data.Reservations.length; i++) {
        var r = data.Reservations[i];
        for (var j = 0; j < r.Instances.length; j++) {
          var instance = r.Instances[j];
          res.send(instance.InstanceId + " " + instance.KeyName + " " + instance.State.Name);
        }
      }

    });
  });

  // ec2 start InstanceId
  robot.respond(/ec2\s+start\s+(\S+)$/, function(res) {
    var instanceId = res.match[1];

    var ec2 = new AWS.EC2();

    var params = {
      InstanceIds: [
        instanceId
      ]
    };

    ec2.startInstances(params, function(err, data) {
      if (err) {
        res.send("Could not start instance : " + err);
        return;
      }
      res.send('start ' + instanceId);
    });

    res.send('starting ' + instanceId + ' ...');
  });

  // ec2 stop InstanceId
  robot.respond(/ec2\s+stop\s+(\S+)$/, function(res) {
    var instanceId = res.match[1];

    var ec2 = new AWS.EC2();

    var params = {
      InstanceIds: [
        instanceId
      ]
    };

    ec2.stopInstances(params, function(err, data) {
      if (err) {
        res.send("Could not stop instance : " + err);
        return;
      }
      res.send('stop ' + instanceId);
    });

    res.send('stopping ' + instanceId + ' ...');
  });

  // ec2 schedule start i-01x 0 30 9 * * 1-5
  robot.respond(/ec2\s+schedule\s+start\s+(\S+)\s+(.+)$/, function(res) {
    var instanceId = res.match[1];
    var cronTime = res.match[2];
    res.send('instanceId ' + instanceId);
    res.send('cronTime ' + cronTime);
  });
};


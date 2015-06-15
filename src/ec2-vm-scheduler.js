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

module.exports = function(robot) {
  var AWS = require('aws-sdk');
  AWS.config.region = 'ap-northeast-1';
  AWS.config.update({
    accessKeyId: process.env.HUBOT_EC2_VM_SCHEDULER_ACCESS_KEY_ID,
    secretAccessKey: process.env.HUBOT_EC2_VM_SCHEDULER_SECRET_ACCESS_KEY
  });

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
          res.send(instance.InstanceId + " " + instance.State.Name);
        }
      }

    });
  });

  robot.respond(/ec2\s+start\s+(\S+)$/, function(res) {
    var name = res.match[1];
    // 仮実装

    // Class: AWS.EC2 — AWS SDK for JavaScript
    // http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/EC2.html
    var ec2 = new AWS.EC2();

    var params = {
      ImageId: 'xxx'
    };

    ec2.startInstances(params, function(err, data) {
      if (err) {
        res.send("Could not start instance", err);
        return;
      }
      res.send('start ' + name);
    });

    res.send('starting ' + name + ' ...');
  });

};


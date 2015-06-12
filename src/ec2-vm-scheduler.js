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

  robot.respond(/ec2\s+start\s+(\S+)/, function(res) {
    var name = res.match[1];
    // 仮実装
    res.send('world ' + name);
  });
};


// Description
//   A Hubot script to start or stop ec2 virtual machines
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
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
  robot.respond(/ec2\s+start\s+(\S+)/, function(res) {
    var name = res.match[1];
    // 仮実装
    res.send('world ' + name);
  });
};


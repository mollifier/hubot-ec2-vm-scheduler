// Description
//   A Hubot script to start or stop ec2 virtual machines
//
// Configuration:
//   LIST_OF_ENV_VARS_TO_SET
//   HUBOT_EC2_VM_SCHEDULER_ROOM
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

var CronJob = require('cron').CronJob;

module.exports = function(robot) {
  var AWS = require('aws-sdk');
  AWS.config.region = 'ap-northeast-1';
  AWS.config.update({
    accessKeyId: process.env.HUBOT_EC2_VM_SCHEDULER_ACCESS_KEY_ID,
    secretAccessKey: process.env.HUBOT_EC2_VM_SCHEDULER_SECRET_ACCESS_KEY
  });

  // CronJobの配列
  var cronJobList = [];
  var brainKey = "ec2-vm-scheduler";

  function echo(message, res) {
    if (res) {
      res.send(message);
    } else {
      robot.messageRoom(process.env.HUBOT_EC2_VM_SCHEDULER_ROOM, message);
    }
  }

  function listEc2Instance(res) {
    var ec2 = new AWS.EC2();
    ec2.describeInstances({}, function(err, data) {
      if (err) {
        echo("Could not list instances : " + err, res);
        return;
      }

      for (var i = 0; i < data.Reservations.length; i++) {
        var r = data.Reservations[i];
        for (var j = 0; j < r.Instances.length; j++) {
          var instance = r.Instances[j];
          echo(instance.InstanceId + " " + instance.KeyName + " " + instance.State.Name, res);
        }
      }

    });
  }

  function startEc2Instance(instanceId, res) {
    var ec2 = new AWS.EC2();

    var params = {
      InstanceIds: [
        instanceId
      ]
    };

    ec2.startInstances(params, function(err, data) {
      if (err) {
        echo("Could not start instance : " + err, res);
        return;
      }
      echo('start ' + instanceId, res);
    });

    echo('starting ' + instanceId + ' ...', res);
  }

  function stopEc2Instance(instanceId, res) {
    var ec2 = new AWS.EC2();

    var params = {
      InstanceIds: [
        instanceId
      ]
    };

    ec2.stopInstances(params, function(err, data) {
      if (err) {
        echo("Could not stop instance : " + err, res);
        return;
      }
      echo('stop ' + instanceId, res);
    });

    echo('stopping ' + instanceId + ' ...', res);
  }

  function addCronJob(instanceId, type, cronTime) {
    // バリデーション
    try {
      new CronJob(cronTime, function() {});
    } catch(ex) {
      return false;
    }

    var cronTimeDataList = robot.brain.get(brainKey);
    if (cronTimeDataList === null) {
      cronTimeDataList = [];
    }
    cronTimeDataList.push(
      {
        "instanceId": instanceId,
        "type": type,
        "cronTime": cronTime
      }
    );
    robot.brain.set(brainKey, cronTimeDataList);
    // CronJobの登録はrobot.brain.on 'loaded'イベントハンドラで行います

    return true;
  }

  // robot.brainの最初の読み込みが完了したとき、または明示的にrobot.brain.setを呼び出したときのイベントハンドラ
  robot.brain.on('loaded', function () {
    // cronJobListに登録されているJobをすべて停止します
    cronJobList.forEach(function(job, index) {
      job.stop();
    });

    cronJobList = [];

    var cronTimeDataList = robot.brain.get(brainKey);
    if (cronTimeDataList === null) {
      cronTimeDataList = [];
    }

    cronTimeDataList.forEach(function(cronTimeData, index) {
      var instanceId = cronTimeData.instanceId;
      var type = cronTimeData.type;
      var cronTime = cronTimeData.cronTime;
      var onTick = null;
      if (type === "start") {
        onTick = function() {
          startEc2Instance(instanceId);
        };
      } else if (type === "stop") {
        onTick = function() {
          stopEc2Instance(instanceId);
        };
      }
      if (onTick !== null) {
        var job = new CronJob(cronTime, onTick, null, true, 'Asia/Tokyo');
        cronJobList.push(job);
      }

    });
  });

  // ec2 help
  robot.respond(/ec2\s+help$/, function(res) {
    var messages = [
      "ec2 list",
      "ec2 start INSTANCE_ID",
      "ec2 stop INSTANCE_ID",
      "ec2 schedule start INSTANCE_ID CRON_TIME",
      "ec2 schedule stop INSTANCE_ID CRON_TIME",
      "ec2 schedule list",
      "ec2 schedule delete INDEX",
      "ec2 help",
      "",
      "Examples:",
      "ec2 schedule start i-01x 0 30 9 * * 1-5",
      "ec2 schedule stop i-01x 0 30 18 * * 1-5",
      "ec2 schedule delete 0"
    ];
    res.send(messages.join("\n"));
  });

  // ec2 list
  robot.respond(/ec2\s+list$/, function(res) {
    listEc2Instance(res);
  });

  // ec2 start InstanceId
  robot.respond(/ec2\s+start\s+(\S+)$/, function(res) {
    var instanceId = res.match[1];
    startEc2Instance(instanceId, res);
  });

  // ec2 stop InstanceId
  robot.respond(/ec2\s+stop\s+(\S+)$/, function(res) {
    var instanceId = res.match[1];
    stopEc2Instance(instanceId, res);
  });

  // ec2 schedule start i-01x 0 30 9 * * 1-5
  robot.respond(/ec2\s+schedule\s+start\s+(\S+)\s+(.+)$/, function(res) {
    var instanceId = res.match[1];
    var cronTime = res.match[2];
    var success = addCronJob(instanceId, "start", cronTime);
    if (success) {
      res.send("ec2 仮想マシン開始処理を登録しました : " + cronTime);
    } else {
      res.send("cronTimeが不正です : " + cronTime);
    }
  });

  // ec2 schedule stop i-01x 0 30 18 * * 1-5
  robot.respond(/ec2\s+schedule\s+stop\s+(\S+)\s+(.+)$/, function(res) {
    var instanceId = res.match[1];
    var cronTime = res.match[2];
    var success = addCronJob(instanceId, "stop", cronTime);
    if (success) {
      res.send("ec2 仮想マシン停止処理を登録しました : " + cronTime);
    } else {
      res.send("cronTimeが不正です : " + cronTime);
    }
  });

  // ec2 schedule list
  robot.respond(/ec2\s+schedule\s+list$/, function(res) {
    var cronTimeDataList = robot.brain.get(brainKey);
    if (cronTimeDataList === null) {
      cronTimeDataList = [];
    }
    cronTimeDataList.forEach(function(cronTimeData, index) {
      res.send("[" + index.toString() + "] " + cronTimeData.instanceId + " " + cronTimeData.type + " " + cronTimeData.cronTime);
    });
  });

  // ec2 schedule delete 0
  robot.respond(/ec2\s+schedule\s+delete\s+(\d+)$/, function(res) {
    var index = parseInt(res.match[1], 10);

    var cronTimeDataList = robot.brain.get(brainKey);
    if (cronTimeDataList === null) {
      cronTimeDataList = [];
    }

    if (index >= 0 && index < cronTimeDataList.length) {
      cronTimeDataList.splice(index, 1);
      robot.brain.set(brainKey, cronTimeDataList);
      res.send("ec2 仮想マシン予約登録を削除しました");
    }
  });

};


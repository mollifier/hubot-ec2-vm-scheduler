# hubot-ec2-vm-scheduler

A Hubot script to start or stop ec2 virtual machines

See [`src/ec2-vm-scheduler.js`](src/ec2-vm-scheduler.js) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-ec2-vm-scheduler --save`

Then add **hubot-ec2-vm-scheduler** to your `external-scripts.json`:

```json
[
  "hubot-ec2-vm-scheduler"
]
```

## Configuration

```
export HUBOT_EC2_VM_SCHEDULER_ROOM="_development"
export HUBOT_EC2_VM_SCHEDULER_ACCESS_KEY_ID="AXXXX"
export HUBOT_EC2_VM_SCHEDULER_SECRET_ACCESS_KEY="Yyyyy8"
```

## Run in locall shell

```
% npm install
% export PORT=50125
% PATH=./node_modules/hubot/node_modules/.bin:$PATH $(npm bin)/hubot -a shell -n hubot -r src
```

## Sample Interaction

```
user1>> hubot hello
hubot>> world

user1>> hubot ec2 start XXX
```

## Run test

```
% grunt test
```


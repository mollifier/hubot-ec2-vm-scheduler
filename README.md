# hubot-ec2-vm-scheduler

A Hubot script to start or stop ec2 virtual machines

See [`src/ec2-vm-scheduler.coffee`](src/ec2-vm-scheduler.coffee) for full documentation.

## Installation

In hubot project repo, run:

`npm install hubot-ec2-vm-scheduler --save`

Then add **hubot-ec2-vm-scheduler** to your `external-scripts.json`:

```json
[
  "hubot-ec2-vm-scheduler"
]
```

## Run in locall shell

```
% export PORT=50125
% PATH=./node_modules/hubot/node_modules/.bin:$PATH $(npm bin)/hubot -a shell -n hubot -r src
```

## Sample Interaction

```
user1>> hubot hello
hubot>> world
```

## Run test

```
% grunt test
```


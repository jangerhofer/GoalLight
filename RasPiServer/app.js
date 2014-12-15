process.stdin.resume();
var util = require('util');
var omx = require('omx-manager');


process.stdin.on('data', function(text) {
  omx.stop();
});

omx.play('CHI.mp3', {
  '-o': 'local',
  '--vol': -3000
});

var status = omx.getStatus();
console.log(status);

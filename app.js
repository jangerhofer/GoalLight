process.stdin.resume();
var util = require('util');
var request = require('request');
var Player = require('player');
var player = new Player();
var queryString = 'http://localhost:8888/test.jsonp'
//var queryString = 'http://live.nhle.com/GameData/GCScoreboard/' + new Date().getFullYear() + '-' + (new Date().getMonth() + 1) +
'-' + (("0" + new Date().getDate()).slice(-2)) + '.jsonp'
var scoreDB = {};
console.log(queryString);

//  Deal with missing music files.
process.on('uncaughtException', function(err) {
  console.log("Reverting to default goal horn -- file missing.");
  playHorn('Default');
})

function playHorn(teamAbbreviation) {
  if (player) {
    player.stop();
  }
  player = new Player('goalHorns/' + teamAbbreviation + '.mp3');
  player.play();
}

function initialLoad() {
  request(queryString, function(error, response, body) {
    var jsonObject = body
    results = body.split('(')[1]
    results = JSON.parse(results.substring(0, results.length -
      2)).games;
      for (i = 0; i < results.length; i++) {
        scoreDB[results[i].ata] = results[i].ats;
        scoreDB[results[i].hta] = results[i].hts;
        scoreDB[results[i].bs] = results[i].bs;
      }
    });
    runtime();
  }


  function updateScores(callback) {
    request(queryString, function(error, response, body) {
      var jsonObject = body
      results = body.split('(')[1]
      results = JSON.parse(results.substring(0, results.length -
        2)).games;
        //  Check new value against database value.
        for (i = 0; i < results.length; i++) {
          if (results[i].ats != scoreDB[results[i].ata] &&
            results[i].ats != 0) {
              console.log(new Date() + '.  Goal scored by: ' +
              results[i].ata + '.  ' + results[i].ata +
              ' ' + results[i].ats + ' -- ' + results[i].hta +
              ' ' + results[i].hts + ' at ' + results[i].bs + '.');
              //  Play audio alert.
              playHorn(results[i].ata);
              //  Update known scores.
              scoreDB[results[i].ata] = results[i].ats;
            }
            if (results[i].hts != scoreDB[results[i].hta] &&
              results[i].hts != 0) {
                console.log(new Date() + '.  Goal scored by: ' +
                results[i].hta + '.  ' + results[i].ata +
                ' ' + results[i].ats + ' -- ' + results[i].hta +
                ' ' + results[i].hts + ' at ' + results[i].bs + '.');
                //  Play audio alert.
                playHorn(results[i].hta);
                //  Update known scores.
                scoreDB[results[i].hta] = results[i].hts;
              }
              //  Check for period-change
              if (results[i].bs != scoreDB[results[i].bs]) {
                console.log(new Date() + '  Period change: ' + results[i].bs + ".  " + results[i].ata + ' -- ' + results[i].hta + '.');
                //  Play audio alert.
                playHorn("EOP");
                //  Update known scores.
                scoreDB[results[i].bs] = results[i].bs;
              }
            }
          });
          //  Re-run loop.
          callback();
        }

        function runtime() {
          updateScores(function(status) {
            setTimeout(runtime, 2000);
          });
        }
        // Load in initial data for the day.
        initialLoad();
        process.stdin.on('data', function(text) {
          if (player && text === '\n') {
            player.stop();
          }
        });

var request = require('request');
var Player = require('player');
var dateString =  new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + (new Date().getDate())
var queryString = 'http://live.nhle.com/GameData/GCScoreboard/' + dateString + '.jsonp'

var scoreDB = {};
console.log(queryString);
//  Deal with missing music files.
process.on('uncaughtException', function (err) {
  console.log(err);
})


function initialLoad() {
  {
    request(queryString, function (error, response, body) {
      var jsonObject = body
      results = body.split('(')[1]
      results = JSON.parse(results.substring(0, results.length - 2)).games;
      for (i = 0; i < results.length; i++) {
        scoreDB[results[i].ata] = results[i].ats;
        scoreDB[results[i].hta] = results[i].hts;
   }  });
}}

initialLoad();

function updateScores(callback) {
  request(queryString, function (error, response, body) {
    var jsonObject = body
    results = body.split('(')[1]
    results = JSON.parse(results.substring(0, results.length - 2)).games;

    //  Check new value against db value
    for (i = 0; i < results.length; i++) {
        if (results[i].ats != scoreDB[results[i].ata] && results[i].ats != 0) {
          console.log(new Date() + ".  Away Goal scored by: " + results[i].ata);
          try {
            var player = new Player('goalHorns/' + results[i].ata + '.mp3');
            player.stop();
            player.play();
          }
          catch(err) {
            console.log(results[i].ata + " goal horn not found.");
          }

          scoreDB[results[i].ata] = results[i].ats;
        }
        if (results[i].hts != scoreDB[results[i].hta] && results[i].hts != 0) {
          console.log(new Date() + ".  Home Goal scored by: " + results[i].hta);


          try {
            var player = new Player('goalHorns/' + results[i].hta + '.mp3');
            player.stop();
            player.play();
          }
          catch(err) {
            console.log(results[i].hta + " goal horn not found.");
          }


          player.on('error', function(err){
            // when error occurs
            console.log(err);
          });
          player.stop();
          player.play();
          scoreDB[results[i].hta] = results[i].hts;
        }
    }
  });
  //  Re-run loop.
  callback();
}

function runtime(){
  updateScores(function (status) {
    setTimeout (runtime, 2000);
  });
}
runtime();

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app = express();

app.get('/scrape', function(req, res) {
  var url = 'https://capfriendly.com/teams/ducks';

  request(url, function(error, response, html) {
    if (!error) {
      var $ = cheerio.load(html);

      var nom, premom, equipe, caphit, duree, age, lienCapFriendly;

      var json = { nom: '', equipe: '', caphit: '', duree: '', age: '', lienCapFriendly: '' };

      $('#team').filter(function() {
        console.log($(this));
      })

    }
  });
});

function determinerPosition(position) {
  if (position === 'RW' || position === 'LW' || position === 'C') {
    return 'A';
  } else {
    return position;
  }
}

app.listen('8080');

console.log('Listenning on port 8080');

exports = module.exports = app;

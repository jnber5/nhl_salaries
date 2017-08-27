let axios = require('axios');
let cheerio = require('cheerio');

let base_url = 'https://capfriendly.com/teams/ducks';

let joueurs = [];

axios.get(base_url).then(response => {
  let $ = cheerio.load(response.data);

  $('#team').each((i, elm) => {
    extraireTablePrincipale(elm);
  });
});

function extraireTablePrincipale(elm) {
  let $ = cheerio.load(elm);

  $('tbody').each((i, elm) => {
    let identifiant = $(elm).children().children().first().text();

    if (identifiant.includes('FORWARDS')) {
      extraireJoueurs(elm);
    }

    if (identifiant.includes('DEFENSE')) {
      extraireJoueurs(elm);
    }

    if (identifiant.includes('GOALTENDERS')) {
      extraireJoueurs(elm);
    }

    if (identifiant.includes('NON-ROSTER PLAYERS')) {
      extraireNonRosterPlayers(elm);
    }
  });

  console.log(joueurs);
  console.log(joueurs.length);
}

function extraireJoueurs(elm) {
  let $ = cheerio.load(elm);

  $('tr').each((i, elm) => {
    if (i > 0) {
      joueurs.push({
        nom: extraireNom($(elm).children().first().text()),
        prenom: extrairePrenom($(elm).children().first().text()),
        position: determinerPosition($(elm).children().eq(2).first().text()),
        age: $(elm).children().eq(4).first().text(),
        caphit: determinerCapHit($(elm).children().eq(5).first().children().first().text()),
        capFriendlyUrl: extraireUrl($(elm).children().first().children().first().attr('href'))
      });
    }
  });
}

function extraireDefenseurs(elm) {}

function extraireGardiens(elm) {}

function extraireNonRosterPlayers(elm) {
  let $ = cheerio.load(elm);

  $('tr').each((i, elm) => {
    if (i > 1) {
      joueurs.push({
        nom: extraireNom($(elm).children().first().text()),
        prenom: extrairePrenom($(elm).children().first().text()),
        position: determinerPosition($(elm).children().eq(2).first().text()),
        age: $(elm).children().eq(4).first().text(),
        caphit: determinerCapHit($(elm).children().eq(5).first().children().first().text()),
        capFriendlyUrl: extraireUrl($(elm).children().first().children().first().attr('href'))
      });
    }
  });
}

function extraireNom(str) {
  return str.split(',')[0];
}

function extrairePrenom(str) {
  console.log(str);
  return str.split(', ')[1].replace('"A"', '').replace('"C"', '').replace(' ', '');
}

function determinerPosition(position) {
  position = position.split(',')[0];

  if (position === 'RW' || position === 'LW' || position === 'C') {
    return 'A';
  }
  if (position === 'LD' || position === 'RD') {
    return 'D';
  }

  return position;
}

function determinerCapHit(str) {
  if (str === 'RFA' || str === 'UFA') {
    return '0';
  }
  return str.replace(',', '').replace(',', '').replace('$', '');
}

function extraireUrl(url) {
  return 'https://capfriendly.com' + url;
}

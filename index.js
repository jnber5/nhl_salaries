let axios = require('axios');
let cheerio = require('cheerio');
let equipes = require('./equipes');
let fs = require('fs');

let base_url = '';

let joueurs = [];

async function main() {
  for (let equipe of equipes) {
    base_url = equipe.url;

    await axios.get(base_url).then(response => {
      let $ = cheerio.load(response.data);

      $('#team').each((i, elm) => {
        extraireTablePrincipale(elm, equipe.nom);
      });
    });
  }

  let json = JSON.stringify(joueurs);

  fs.writeFile('joueurs-actifs.json', json, 'utf8');

  console.log(joueurs.length);
}

function extraireTablePrincipale(elm, equipe) {
  let $ = cheerio.load(elm);

  $('tbody').each((i, elm) => {
    let identifiant = $(elm).children().children().first().text();

    if (identifiant.includes('FORWARDS')) {
      extraireJoueurs(elm, equipe);
    }

    if (identifiant.includes('DEFENSE')) {
      extraireJoueurs(elm, equipe);
    }

    if (identifiant.includes('GOALTENDERS')) {
      extraireJoueurs(elm, equipe);
    }

    if (identifiant.includes('NON-ROSTER PLAYERS')) {
      extraireNonRosterPlayers(elm, equipe);
    }
  });
}

function extraireJoueurs(elm, equipe) {
  let $ = cheerio.load(elm);

  $('tr').each((i, elm) => {
    if (i > 0) {
      joueurs.push({
        nom: extraireNom($(elm).children().first().text()),
        prenom: extrairePrenom($(elm).children().first().text()),
        equipe: equipe,
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

function extraireNonRosterPlayers(elm, equipe) {
  let $ = cheerio.load(elm);

  $('tr').each((i, elm) => {
    if (i > 1) {
      joueurs.push({
        nom: extraireNom($(elm).children().first().text()),
        prenom: extrairePrenom($(elm).children().first().text()),
        equipe: equipe,
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

main();

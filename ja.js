let axios = require('axios');
let cheerio = require('cheerio');
let fs = require('fs');

let base_url = '';

let adresses = [
  { url: 'https://capfriendly.com/browse/free-agents' },
  { url: 'https://capfriendly.com/browse/free-agents/2018/caphit/all/all/all/desc/2' }
];
let joueurs = [];

async function main() {
  for (let adresse of adresses) {
    base_url = adresse.url;

    await axios.get(base_url).then(response => {
      let $ = cheerio.load(response.data);

      $('#brwt').each((i, elm) => {
        extraireTablePrincipale(elm, 'UFA');
      });
    });
  }

  let json = JSON.stringify(joueurs);

  fs.writeFile('joueurs-autonomes.json', json, 'utf8');

  console.log(joueurs);
}

function extraireTablePrincipale(elm, equipe) {
  let $ = cheerio.load(elm);

  $('tbody').each((i, elm) => {
    extraireJoueursAutonome(elm, equipe);
  });
}

function extraireJoueursAutonome(elm, equipe) {
  let $ = cheerio.load(elm);

  $('tr').each((i, elm) => {
    joueurs.push({
      nom: extraireNom($(elm).children().first().children().first().children().first().text()),
      prenom: extrairePrenom($(elm).children().first().children().first().children().first().text()),
      equipe: equipe,
      position: determinerPosition($(elm).children().eq(5).first().text()),
      age: $(elm).children().eq(4).first().text(),
      caphit: determinerCapHit($(elm).children().eq(20).first().text()),
      capFriendlyUrl: extraireUrl($(elm).children().first().children().first().children().first().attr('href'))
    });
  });
}
function extraireNom(str) {
  return str.split(' ')[1];
}

function extrairePrenom(str) {
  return str.split(' ')[0];
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

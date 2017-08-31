var admin = require('firebase-admin');
var serviceAccount = require('../firebase/lhplge-b145e-firebase-adminsdk-n79o5-191c5dd514.json');
var joueurs = require('./joueurs.json');
var joueursAutonomes = require('./joueurs-autonomes.json');

function main() {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lhplge-b145e.firebaseio.com'
  });

  const db = admin.database();

  const joueursRef = db.ref('joueurs');

  for (let joueur of joueurs) {
    let id = joueur.prenom + joueur.nom;
    id = id
      .replace(' ')
      .replace('.', '')
      .replace('.', '')
      .replace('-', '')
      .toLowerCase();

    joueursRef.child(id).set({
      nom: joueur.nom,
      prenom: joueur.prenom,
      equipe: toTitleCase(joueur.equipe.toLowerCase()),
      position: joueur.position,
      age: parseInt(joueur.age),
      caphit: parseInt(joueur.caphit),
      duree: Math.floor(Math.random() * 3) + 1,
      capFriendlyUrl: joueur.capFriendlyUrl,
      franchise: '',
      estAutonome: true
    });
  }

  for (let joueur of joueursAutonomes) {
    let id = joueur.prenom + joueur.nom;
    id = id
      .replace(' ')
      .replace('.', '')
      .replace('.', '')
      .replace('-', '')
      .toLowerCase();
    joueursRef.child(id).set({
      nom: joueur.nom,
      prenom: joueur.prenom,
      equipe: toTitleCase(joueur.equipe.toLowerCase()),
      position: joueur.position,
      age: parseInt(joueur.age),
      caphit: parseInt(joueur.caphit),
      duree: Math.floor(Math.random() * 3) + 1,
      capFriendlyUrl: joueur.capFriendlyUrl,
      franchise: '',
      estAutonome: true
    });
  }
}

function toTitleCase(str) {
  return str.replace(/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

main();

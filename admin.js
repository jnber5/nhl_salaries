var admin = require('firebase-admin');
var serviceAccount = require('../firebase/lhplge-b145e-firebase-adminsdk-n79o5-3a6c295c4b.json');
var joueurs = require('./joueurs-autonomes.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://lhplge-b145e.firebaseio.com'
});

const db = admin.database();
//const ref = db.child('lhplge-b145e');

const joueursRef = db.ref('joueurs');

for (let joueur of joueurs) {
  let id = joueur.prenom + joueur.nom;
  id = id.replace(' ').replace('.', '').replace('.', '').replace('-', '').toLowerCase();

  joueursRef.child(id).set({
    nom: joueur.nom,
    prenom: joueur.prenom,
    equipe: joueur.equipe,
    position: joueur.position,
    age: joueur.age,
    caphit: joueur.caphit,
    capFriendlyUrl: joueur.capFriendlyUrl
  });
}

"use strict";
let alphabet = [].slice.call(document.getElementsByClassName('lettre'));
let indice = document.querySelector('#indice');
let demarrer = document.querySelector('#partie');
let formulaire = document.querySelector('#formulaire');
let input = document.querySelector('#devine');
let pendu = document.getElementById('pendu');

let stockageMot = [];
let leMot = [];
let lettresAttendues = [];
let lettreChoisie = "";
let erreur = 0;
let dernier = 0;
let nombreAleatoire = 0;

let mots = [
  ["baseball", "SPORT"],
  ["tennis", "SPORT"],
  ["paddle", "SPORT"],
  ["judo", "SPORT"],
  ["basketball", "SPORT"],
  ["karate", "SPORT"],
  ["france", "PAYS"],
  ["espagne", "PAYS"],
  ["allemagne", "PAYS"],
  ["canada", "PAYS"],
  ["angleterre", "PAYS"],
  ["ukraine", "PAYS"],
  ["pomme", "FRUITS"],
  ["fraise", "FRUITS"],
  ["banane", "FRUITS"],
  ["abricot", "FRUITS"],
  ["raisin", "FRUITS"],
  ["orange", "FRUITS"],
  ["renault", "MARQUE DE VOITURE"],
  ["peugeot", "MARQUE DE VOITURE"],
  ["ferrari", "MARQUE DE VOITURE"],
  ["lamborghini", "MARQUE DE VOITURE"],
  ["citroen", "MARQUE DE VOITURE"],
  ["porsche", "MARQUE DE VOITURE"],
];

function init() {
  erreur = 0;
  lettresAttendues = [];
  pendu.src = "images/pendu.png";
  
  nouvellePartie();
};

function genererNombreEntier(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function nouvellePartie() {
  do {
    nombreAleatoire = genererNombreEntier(mots.length);
  } while (nombreAleatoire == dernier)

  leMot = mots[nombreAleatoire][0];
  indice.textContent = mots[nombreAleatoire][1];
  dernier = nombreAleatoire;

  for (var i = 0; i < leMot.length; i++) {
    lettresAttendues.push(leMot[i]);
  }
  stockageMot = leMot;
  console.log(lettresAttendues);
  demarrer.style.display = 'none';
  masquerMot();
  jeu();
  submit();
};

function masquerMot() {
  leMot = leMot.replace(/[a-z]/g, " _ ");
  document.getElementById('mot').textContent = leMot;
}

function gagner() {
  confirm("Félicitation vous remportez la partie !!\nSouhaitez-vous recommencer une partie ?");
  document.location.reload();
};

function gameOver() {
  confirm("C'est perdu !!\nSouhaitez-vous recommencer une partie ?");
  document.location.reload();
};

function echec() {
  do {
    erreur++;
  } while (erreur != 1 && erreur != 2 && erreur != 3 && erreur != 4 && erreur != 5 && erreur != 6)

  try {
    switch (erreur) {
      case 1:
        pendu.src = "images/pendu_1.png";
        input.value = "";
        break;

      case 2:
        pendu.src = "images/pendu_2.png";
        input.value = "";
        break;

      case 3:
        pendu.src = "images/pendu_3.png";
        input.value = "";
        break;

      case 4:
        pendu.src = "images/pendu_4.png";
        input.value = "";
        break;

      case 5:
        pendu.src = "images/pendu_5.png";
        input.value = "";
        break;

      case 6:
        pendu.src = "images/pendu_6.png";
        input.value = "";
        window.setTimeout(function attendre() { gameOver(); }, 1000);
        break;

      default:
        throw new Error("Une erreur est survenue.");
    }
  }
  catch (error) {
  }
};

function submit() {
  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value == '') {
      input.style.borderColor = "red";
    }
    else if (input.value == stockageMot) {
      input.style.borderColor = "silver";
      input.value = "";
      leMot = stockageMot;
      document.getElementById('mot').innerHTML = leMot.toUpperCase();
      window.setTimeout(function attendre() { gagner(); }, 1000);
    }
    else {
      echec();
      input.style.borderColor = "silver";
    }
  });
};

function jeu() {
  for (let i = 0, lettres; lettres = alphabet[i]; i++) {
    alphabet[i].addEventListener('click', () => {
      lettres = alphabet[i].firstChild.nodeValue;
      var trouvees = 0;
      for (var choix = 0; choix != -1;) {
        choix = lettresAttendues.indexOf(lettres);
        if (choix != -1) {
          lettresAttendues.splice(choix, 1);
          trouvees++;
        }
      }
      if (trouvees > 0) {
        for (let i = 0; i <= stockageMot.length - 1; i++) {
          lettreChoisie = stockageMot.substr(i, 1);
          if (lettreChoisie == lettres) {
            leMot = leMot.substr(0, i) + lettreChoisie.toUpperCase() + leMot.substr(i + 1);
            document.getElementById('mot').innerHTML = leMot;
            console.log(lettresAttendues);
            console.log(lettreChoisie);
          }
        }
      } else {
        echec();
      }
      if (lettresAttendues.length == 0) {
        window.setTimeout(function attendre() { gagner(); }, 1000);
      }
      alphabet[i].style.backgroundColor = "#d35b20";
      alphabet[i].style.color = "#fff";
    });
  }
};

demarrer.addEventListener('click', init);
"use strict";
let alphabet = [].slice.call(document.getElementsByClassName('lettre'));
let indice = document.querySelector('#indice');
let demarrer = document.querySelector('#partie');
let formulaire = document.querySelector('#formulaire');
let input = document.querySelector('#devine');
let mot = document.querySelector("#mot");
let pendu = document.getElementById('pendu');

let stockageMot;
let leMot;
let erreur = 0;
let dernier = 0;
let nombreAleatoire = 0;

let date = new Date().getFullYear();
copyright.innerHTML = `${date} © JSL Code`;


let mots = [
  ["BASEBALL", "SPORT"], ["TENNIS", "SPORT"], ["PADDLE", "SPORT"], ["JUDO", "SPORT"], ["BASKETBALL", "SPORT"], ["KARATE", "SPORT"],
  ["FRANCE", "PAYS"], ["ESPAGNE", "PAYS"], ["ALLEMAGNE", "PAYS"], ["CANADA", "PAYS"], ["ANGLETERRE", "PAYS"], ["UKRAINE", "PAYS"],
  ["POMME", "FRUITS"], ["FRAISE", "FRUITS"], ["BANANE", "FRUITS"], ["ABRICOT", "FRUITS"], ["RAISIN", "FRUITS"], ["ORANGE", "FRUITS"],
  ["RENAULT", "VOITURE"], ["PEUGEOT", "VOITURE"], ["FERRARI", "VOITURE"], ["LAMBORGHINI", "VOITURE"], ["CITROEN", "VOITURE"], ["PORSCHE", "VOITURE"],
  ["CITROUILLE", "HALLOWEEN"], ["SORCIERE", "HALLOWEEN"], ["DRACULA", "HALLOWEEN"], ["ZOMBIE", "HALLOWEEN"], ["VAMPIRE", "HALLOWEEN"], ["FRANKENSTEIN", "HALLOWEEN"]
];

function init() {
  erreur = 0;
  stockageMot = [];
  pendu.src = "images/pendu.png";
  reset();
  nouvellePartie();
};

function genererNombreEntier(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function nouvellePartie() {

  do {
    nombreAleatoire = genererNombreEntier(mots.length);
  } while (nombreAleatoire == dernier)

  indice.textContent = mots[nombreAleatoire][1];
  dernier = nombreAleatoire;
  leMot = mots[nombreAleatoire][0];
  demarrer.style.display = 'none';
  masquerMot();
};

function masquerMot() {
  for (let i = 0; i < leMot.length; i++) {
    stockageMot[i] = leMot[i].replace(/[A-Z]/, "_");
    mot.textContent = stockageMot.join("");
  }
};

function gagner() {
  pendu.src = "images/win.png";
  demarrer.style.display = 'block';
};

function gameOver() {
  pendu.src = "images/gameover.png";
  demarrer.style.display = 'block';
};

function echec() {
  if (erreur == 1) {
    pendu.src = "images/pendu_1.png";
    input.value = "";
  }
  else if (erreur == 2) {
    pendu.src = "images/pendu_2.png";
    input.value = "";
  }
  else if (erreur == 3) {
    pendu.src = "images/pendu_3.png";
    input.value = "";
  }
  else if (erreur == 4) {
    pendu.src = "images/pendu_4.png";
    input.value = "";
  }
  else if (erreur == 5) {
    pendu.src = "images/pendu_5.png";
    input.value = "";
  }
  else if (erreur == 6) {
    pendu.src = "images/pendu_6.png";
    input.value = "";
    window.setTimeout(function attendre() { gameOver(); }, 1000);
  }
};

function submit() {
  formulaire.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value == '') {
      input.style.borderColor = "red";
    }
    else if (input.value == leMot) {
      input.style.borderColor = "silver";
      input.value = "";
      mot.textContent = leMot;
      gagner()
    }
    else if(input.value != leMot) {
      echec(erreur++);
      input.style.borderColor = "silver";
    }
  });
};

[].forEach.call(document.querySelectorAll('.lettre'), function(div) {
  div.addEventListener('click', function(e) {
    if (!this.classList.contains('disabled')) {
      this.classList.add('disabled');
    }
  });
});

function reset() {
  [].forEach.call(document.querySelectorAll('.lettre'), function(o) {
    o.classList.remove('disabled');
  });
}

function click() {
  for (let i = 0, lettres; lettres = alphabet[i]; i++) {
    alphabet[i].addEventListener('click', () => {
      lettres = alphabet[i].firstChild.nodeValue;
      if (leMot.includes(lettres)) {
        for (let i = 0; i < leMot.length; i++) {

          if (leMot[i] == lettres) {
            stockageMot[i] = leMot[i];
            mot.textContent = stockageMot.join("");
          }
        }
      } else {
        echec(erreur++);
      }
      if (mot.textContent == leMot) {
        gagner()
      }
    });
  }
};

demarrer.addEventListener('click', init);

click();
submit();
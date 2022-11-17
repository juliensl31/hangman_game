// button
var animateButton = function (e) {

  e.preventDefault;
  //reset animation
  e.target.classList.remove('animate');

  e.target.classList.add('animate');
  setTimeout(function () {
    e.target.classList.remove('animate');
  }, 700);
};

var bubblyButtons = document.getElementsByClassName("bubbly-button");

for (var i = 0; i < bubblyButtons.length; i++) {
  bubblyButtons[i].addEventListener('click', animateButton, false);
}

// jeu
let fin = true;
let listeLettre = document.getElementsByClassName('lettre');
let indice = document.querySelector('#indice');
let score = document.querySelector('#score');
let motATrouver = document.querySelector('#mot');
let demarrer = document.querySelector('#partie');

listeLettre.forEach(lettre => console.log(lettre));

score.textContent = '';
score = 0;

let dernier = 0;
let nombreAleatoire = 0;
let mots = [
  ["BASEBALL", "SPORT"],
  ["TENNIS", "SPORT"],
  ["PADDLE", "SPORT"],
  ["JUDO", "SPORT"],
  ["BASKETBALL", "SPORT"],
  ["KARATE", "SPORT"],
  ["FRANCE", "PAYS"],
  ["ESPAGNE", "PAYS"],
  ["ALLEMAGNE", "PAYS"],
  ["CANADA", "PAYS"],
  ["ANGLETERRE", "PAYS"],
  ["UKRAINE", "PAYS"],
  ["POMME", "FRUITS"],
  ["FRAISE", "FRUITS"],
  ["BANANE", "FRUITS"],
  ["ABRICOT", "FRUITS"],
  ["RAISIN", "FRUITS"],
  ["ORANGE", "FRUITS"],
];


function genererNombreEntier(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function demarrerPartie() {
  demarrer.addEventListener('click', () => {
    do {
      nombreAleatoire = genererNombreEntier(mots.length);
    } while (nombreAleatoire == dernier)

    let str = "";
    str = mots[nombreAleatoire][0];
    // console.log(str);
    str = str.toUpperCase().replace(/[A-Z]/g, " _ ");

    motATrouver.textContent = str;
    indice.textContent = mots[nombreAleatoire][1];
    dernier = nombreAleatoire;
  });
};

lettre.addEventListener('click', () => {
  
})

demarrerPartie();
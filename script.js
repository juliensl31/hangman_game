// Animation bouton nouvelle partie
var animateButton = (e) => {

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

let alphabet = [].slice.call(document.getElementsByClassName('lettre'));
let indice = document.querySelector('#indice');
let motATrouver = document.querySelector('#mot');
let demarrer = document.querySelector('#partie');
let formulaire = document.querySelector('#formulaire');
let input = document.querySelector('#devine');
let pendu = document.getElementById('pendu');


let str = "";
let element = [];
let mauvaisesLettres = [ ];
let lettresAttendues = element;
let erreur = 0;
let dernier = 0;
let nombreAleatoire = 0;
let nbrTentative = 6;
//let score           = 0;

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
];

function genererNombreEntier(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function nouvellePartie() {
  erreur = 0;
  do {
    nombreAleatoire = genererNombreEntier(mots.length);
  } while (nombreAleatoire == dernier)

  str = mots[nombreAleatoire][0];
  console.log(str);
  indice.textContent = mots[nombreAleatoire][1];
  dernier = nombreAleatoire;
  motATrouver.textContent = str.replace(/[a-z]/g, " _ ");
  pendu.src = "images/pendu.png";

  for (var i = 0; i < str.length; i++) {
      element.push(str[i]);
    }

  trouverMot();
};


 for (let i = 0, lettres; lettres = alphabet[i]; i++) {
  alphabet[i].addEventListener('click', () => {
      if (alphabet[i].firstChild.nodeValue == lettresAttendues) {
        alert('good')
      } else {
        gameOver();
      }
      //console.log([alphabet[i].firstChild.nodeValue]);
    });
}


function trouverMot() {
 
for (; mauvaisesLettres.length < nbrTentative && lettresAttendues.length > 0; ) {
  // console.log('lettres à trouver:', lettresAttendues);
  // alert('Lettres à trouver: ' + lettresAttendues.length + '. '
  //   + 'Tentatives restantes: ' + (nbrTentative - mauvaisesLettres.length));
  // var lettre = prompt('Devinez une lettre');
  var lettre = prompt('Devinez une lettre');
  var choix = lettresAttendues.indexOf(lettre);
  if (choix != -1) {
    lettresAttendues.splice(choix, 1); // retire la 1ère occurrence de cette lettre trouvée dans le tableau
    alert('Bonne pioche! Continuez!');
  } else {
    mauvaisesLettres.push(lettre);
    alert('Le mot à trouver ne contient pas la lettre ' + lettre + ', désolé...');
  }
}
if (lettresAttendues.length == 0) {
  alert('Bravo, vous avez trouvé le mot !');
} else if (mauvaisesLettres.length == nbrTentative) {
  alert('Perdu... Faites une autre partie !');
}

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
        gameOver();
        break;

      default:
        throw new Error("Une erreur est survenue.");
    }
  }
  catch (error) {
  }
};

demarrer.addEventListener('click', nouvellePartie);

formulaire.addEventListener('submit', (e) => {
  e.preventDefault();
  if (input.value == '') {
    input.style.borderColor = "red";
  }
  else if (input.value == str) {
    //score++;
    //document.querySelector('#score').prepend(score);
    input.style.borderColor = "silver";
    input.value = "";
    motATrouver.textContent = str.toUpperCase();
    alert("Félicitation vous remportez la partie !!");
  }
  else {
    echec();
    input.style.borderColor = "silver";
  }
});




"use strict";

const alphabet = Array.from(document.querySelectorAll(".lettre"));
const indice = document.querySelector("#indice");
const demarrer = document.querySelector("#partie");
const formulaire = document.querySelector("#formulaire");
const input = document.querySelector("#devine");
const mot = document.querySelector("#mot");
const pendu = document.querySelector("#pendu");
const copyright = document.querySelector("#copyright");

if (copyright) {
  copyright.textContent = `${new Date().getFullYear()} © JSL Code`;
}

const mots = [
  ["BASEBALL", "SPORT"], ["TENNIS", "SPORT"], ["PADDLE", "SPORT"], ["JUDO", "SPORT"], ["BASKETBALL", "SPORT"], ["KARATE", "SPORT"],
  ["FRANCE", "PAYS"], ["ESPAGNE", "PAYS"], ["ALLEMAGNE", "PAYS"], ["CANADA", "PAYS"], ["ANGLETERRE", "PAYS"], ["UKRAINE", "PAYS"],
  ["POMME", "FRUITS"], ["FRAISE", "FRUITS"], ["BANANE", "FRUITS"], ["ABRICOT", "FRUITS"], ["RAISIN", "FRUITS"], ["ORANGE", "FRUITS"],
  ["RENAULT", "VOITURE"], ["PEUGEOT", "VOITURE"], ["FERRARI", "VOITURE"], ["LAMBORGHINI", "VOITURE"], ["CITROEN", "VOITURE"], ["PORSCHE", "VOITURE"],
  ["CITROUILLE", "HALLOWEEN"], ["SORCIERE", "HALLOWEEN"], ["DRACULA", "HALLOWEEN"], ["ZOMBIE", "HALLOWEEN"], ["VAMPIRE", "HALLOWEEN"], ["FRANKENSTEIN", "HALLOWEEN"]
];

const MAX_ERREURS = 6;
let motActuel = "";
let lettresRevelees = [];
let lettresEssayees = new Set();
let erreurs = 0;
let dernierIndex = -1;
let partieActive = false;

function afficherMot() {
  mot.textContent = lettresRevelees.join("");
}

function terminerPartie(gagne) {
  partieActive = false;
  mot.textContent = motActuel;
  pendu.src = gagne ? "images/win.png" : "images/gameover.png";
  demarrer.style.display = "block";
  alphabet.forEach((lettre) => {
    lettre.setAttribute("aria-disabled", "true");
  });
}

function enregistrerErreur() {
  if (!partieActive) return;
  erreurs += 1;
  pendu.src = `images/pendu_${erreurs}.png`;
  if (erreurs >= MAX_ERREURS) {
    terminerPartie(false);
  }
}

function essayerLettre(lettre, element) {
  if (!partieActive || lettresEssayees.has(lettre)) return;
  lettresEssayees.add(lettre);
  element.classList.add("disabled");
  element.setAttribute("aria-disabled", "true");

  if (!motActuel.includes(lettre)) {
    enregistrerErreur();
    return;
  }

  for (let index = 0; index < motActuel.length; index += 1) {
    if (motActuel[index] === lettre) {
      lettresRevelees[index] = lettre;
    }
  }
  afficherMot();
  if (lettresRevelees.join("") === motActuel) {
    terminerPartie(true);
  }
}

function nouvellePartie() {
  let index;
  do {
    index = Math.floor(Math.random() * mots.length);
  } while (mots.length > 1 && index === dernierIndex);

  dernierIndex = index;
  [motActuel, indice.textContent] = mots[index];
  erreurs = 0;
  lettresEssayees = new Set();
  lettresRevelees = Array(motActuel.length).fill("_");
  partieActive = true;

  pendu.src = "images/pendu.png";
  demarrer.style.display = "none";
  input.value = "";
  input.style.borderColor = "";
  alphabet.forEach((lettre) => {
    lettre.classList.remove("disabled");
    lettre.setAttribute("aria-disabled", "false");
  });
  afficherMot();
}

formulaire.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!partieActive) return;

  const proposition = input.value.trim().toLocaleUpperCase("fr-FR");
  if (!proposition) {
    input.style.borderColor = "red";
    return;
  }

  input.value = "";
  input.style.borderColor = "";
  if (proposition === motActuel) {
    terminerPartie(true);
  } else {
    enregistrerErreur();
  }
});

alphabet.forEach((element) => {
  element.addEventListener("click", () => {
    essayerLettre(element.textContent.trim().toUpperCase(), element);
  });
});

demarrer.addEventListener("click", nouvellePartie);
alphabet.forEach((lettre) => lettre.setAttribute("aria-disabled", "true"));

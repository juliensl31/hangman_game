"use strict";

const alphabet = Array.from(document.querySelectorAll(".lettre"));
const indice = document.querySelector("#indice");
const demarrer = document.querySelector("#partie");
const formulaire = document.querySelector("#formulaire");
const input = document.querySelector("#devine");
const mot = document.querySelector("#mot");
const pendu = document.querySelector("#pendu");
const message = document.querySelector("#message");
const categorie = document.querySelector("#categorie");
const statistiques = document.querySelector("#statistiques");
const copyright = document.querySelector("#copyright");
const toucheParLettre = new Map(alphabet.map((element) => [element.textContent.trim().toUpperCase(), element]));

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
let victoires = 0;
let defaites = 0;

function afficherStatistiques() {
  statistiques.textContent = `Victoires : ${victoires} · Défaites : ${defaites}`;
}

function afficherMot() {
  mot.textContent = lettresRevelees.join("");
}

function terminerPartie(gagne) {
  if (!partieActive) return;
  partieActive = false;
  if (gagne) victoires += 1;
  else defaites += 1;
  afficherStatistiques();
  mot.textContent = motActuel;
  pendu.src = gagne ? "images/win.png" : "images/gameover.png";
  pendu.alt = gagne ? "Victoire !" : "Partie perdue";
  pendu.classList.remove("result-win", "result-lose");
  pendu.classList.add(gagne ? "result-win" : "result-lose");
  message.textContent = gagne ? "Bravo, mot trouvé !" : "Perdu ! Le mot était " + motActuel + ".";
  message.className = gagne ? "message-win" : "message-lose";
  demarrer.style.display = "block";
  alphabet.forEach((lettre) => {
    lettre.disabled = true;
    lettre.setAttribute("aria-disabled", "true");
  });
}

function enregistrerErreur() {
  if (!partieActive) return;
  erreurs += 1;
  message.textContent = `Raté ! Encore ${MAX_ERREURS - erreurs} erreur${MAX_ERREURS - erreurs > 1 ? "s" : ""} possible${MAX_ERREURS - erreurs > 1 ? "s" : ""}.`;
  message.className = "message-lose";
  pendu.src = `images/pendu_${erreurs}.png`;
  if (erreurs >= MAX_ERREURS) {
    terminerPartie(false);
  }
}

function essayerLettre(lettre, element) {
  if (!partieActive || lettresEssayees.has(lettre)) return;
  lettresEssayees.add(lettre);
  element.classList.add("disabled", motActuel.includes(lettre) ? "correct" : "incorrect");
  element.disabled = true;
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
  message.textContent = "Bien joué !";
  message.className = "message-win";
  afficherMot();
  if (lettresRevelees.join("") === motActuel) {
    terminerPartie(true);
  }
}

function nouvellePartie() {
  const candidates = mots
    .map((entree, index) => ({ entree, index }))
    .filter(({ entree }) => categorie.value === "TOUTES" || entree[1] === categorie.value);
  if (candidates.length === 0) return;

  let selected;
  do {
    selected = candidates[Math.floor(Math.random() * candidates.length)];
  } while (candidates.length > 1 && selected.index === dernierIndex);
  const index = selected.index;

  dernierIndex = index;
  [motActuel, indice.textContent] = mots[index];
  erreurs = 0;
  lettresEssayees = new Set();
  lettresRevelees = Array(motActuel.length).fill("_");
  partieActive = true;

  pendu.src = "images/pendu.png";
  pendu.alt = "Illustration du pendu";
  pendu.classList.remove("result-win", "result-lose");
  message.textContent = "";
  message.className = "";
  demarrer.style.display = "none";
  input.value = "";
  input.style.borderColor = "";
  alphabet.forEach((lettre) => {
    lettre.classList.remove("disabled", "correct", "incorrect");
    lettre.disabled = false;
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
    message.textContent = "Saisis un mot pour tenter ta chance.";
    message.className = "message-lose";
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

// Le clavier physique utilise les mêmes règles que le clavier à l’écran.
document.addEventListener("keydown", (event) => {
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat || event.target === input) return;
  const touche = toucheParLettre.get(event.key.toUpperCase());
  if (touche) essayerLettre(event.key.toUpperCase(), touche);
});

demarrer.addEventListener("click", nouvellePartie);
alphabet.forEach((lettre) => {
  lettre.disabled = true;
  lettre.setAttribute("aria-disabled", "true");
});

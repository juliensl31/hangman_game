"use strict";

let date = new Date().getFullYear();
copyright.innerHTML = `${date} © JSL Code`;


class HangmanGame
{

  words = [
    ["BASEBALL", "SPORT"], ["TENNIS", "SPORT"], ["PADDLE", "SPORT"], ["JUDO", "SPORT"], ["BASKETBALL", "SPORT"], ["KARATE", "SPORT"],
    ["FRANCE", "PAYS"], ["ESPAGNE", "PAYS"], ["ALLEMAGNE", "PAYS"], ["CANADA", "PAYS"], ["ANGLETERRE", "PAYS"], ["UKRAINE", "PAYS"],
    ["POMME", "FRUITS"], ["FRAISE", "FRUITS"], ["BANANE", "FRUITS"], ["ABRICOT", "FRUITS"], ["RAISIN", "FRUITS"], ["ORANGE", "FRUITS"],
    ["RENAULT", "VOITURE"], ["PEUGEOT", "VOITURE"], ["FERRARI", "VOITURE"], ["LAMBORGHINI", "VOITURE"], ["CITROEN", "VOITURE"], ["PORSCHE", "VOITURE"],
    ["CITROUILLE", "HALLOWEEN"], ["SORCIERE", "HALLOWEEN"], ["DRACULA", "HALLOWEEN"], ["ZOMBIE", "HALLOWEEN"], ["VAMPIRE", "HALLOWEEN"], ["FRANKENSTEIN", "HALLOWEEN"]
  ];

  lastWordIndex = null;
  gameStarted = false;
  errorsCount = 0;
  foundLetters = 0;
  selectedWord = null
  isAnswering = false;

  wordContainer = document.querySelector('#mot');
  keyboardContainer = document.querySelector('#lettre_grille');
  hangmanImage = document.querySelector('#pendu');
  newGameButton = document.querySelector('#partie');
  answerForm = document.querySelector('#formulaire');
  answerInput = document.querySelector('#devine');
  indiceContainer = document.querySelector('#indice');


  constructor() {

    this.renderKeyboad(this.keyboardContainer);

    this.answerInput.addEventListener('focus', () => {
      this.isAnswering = true;
    });

    this.answerInput.addEventListener('blur', () => {
      this.isAnswering = false;
    });

    document.body.addEventListener('keydown', (event) => {
      if(this.isAnswering) {
        return;
      }

      if (event.key.match(/^[a-z]$/i)) {
        const letter = event.key.toUpperCase();
        const button = document.querySelector(`#letter_${letter}`);
        button.click();
      }
      if (event.key === 'Enter' && this.gameStarted === false) {
        this.start();
      }
    });

    this.newGameButton.addEventListener('click', () => {
      this.start();
    });

    this.answerForm.addEventListener('submit', (event) => {
      this.handleAnswerFormSubmit(event);
    });

    this.start();
  }

  handleAnswerFormSubmit(event) {
    event.preventDefault();
    if (this.answerForm.devine.value === '') {
      return;
    }

    const answer = this.answerInput.value;
    this.answerInput.value = '';

    if (answer === this.selectedWord[0]) {
      this.win();
      return
    }

    this.errorsCount++;
    this.renderHangman();
  }

  getRandomWord() {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * this.words.length);
    } while (randomIndex === this.lastWordIndex);
    this.lastWordIndex = randomIndex;

    return this.words[randomIndex];
  }

  handleLetterClick(event) {
    if (!this.gameStarted) {
      return;
    }

    const button = event.currentTarget;
    if (button.classList.contains('disabled')) {
      return;
    }

    button.classList.add('disabled');
    const letter = button.textContent;
    this.checkLetter(letter)
  }

  checkLetter(letter) {
    let isLetterFound = false;
    for (let i = 0; i < this.selectedWord[0].length; i++) {
      if (this.selectedWord[0][i] === letter) {
        this.wordContainer.children[i].textContent = letter;
        this.foundLetters++;
        isLetterFound = true;
      }
    }

    if (!isLetterFound) {
      this.errorsCount++;
      this.renderHangman();

      return false;
    }

    if (this.foundLetters === this.selectedWord[0].length) {
      this.win();
    }
    return true;
  }

  renderKeyboad(container) {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    alphabet.forEach(letter => {
      const button = document.createElement('button');
      button.classList.add('lettre');
      button.textContent = letter;
      button.id = `letter_${letter}`
      button.addEventListener('click', (event) => {
        this.handleLetterClick(event)
      });
      container.appendChild(button);
    });
  }

  renderSolution() {
    for (let i = 0; i < this.selectedWord[0].length; i++) {
      this.wordContainer.children[i].textContent = this.selectedWord[0][i];
    }
  }

  renderHangman() {
    this.hangmanImage.src = `images/pendu_${this.errorsCount}.png`;
    if (this.errorsCount === 6) {
      this.loose();
    }
  }

  start() {
    this.gameStarted = true;
    this.wordContainer.innerHTML = '';
    this.errorsCount = 0;
    this.foundLetters = 0;
    this.answerForm.style.display = 'block';
    this.newGameButton.style.display = 'none';
    this.hangmanImage.src = "images/pendu.png";

    this.selectedWord = this.getRandomWord();
    this.indiceContainer.textContent = this.selectedWord[1];

    document.querySelectorAll('.lettre').forEach(element => {
      element.classList.remove('disabled');
    });

    for (let i = 0; i < this.selectedWord[0].length; i++) {
      const placeholder = document.createElement('span');
      placeholder.classList.add('placeholder');
      placeholder.textContent = '_';
      this.wordContainer.appendChild(placeholder);
    }
  }

  win() {
    this.gameEnd();
    this.hangmanImage.src = "images/win.png";

  }

  loose() {
    this.gameEnd();
    setTimeout(() => {
      this.hangmanImage.src = "images/gameover.png";
    }, 1000);
  }

  gameEnd() {
    this.renderSolution();
    this.gameStarted = false;
    this.answerForm.style.display = 'none';
    this.newGameButton.style.display = 'block';
  }
}

const game = new HangmanGame();


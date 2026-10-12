const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

function setupGame() {
  function element(label = "") {
    const handlers = {};
    const classes = new Set();
    return {
      textContent: label,
      value: "",
      src: "",
      style: {},
      attributes: {},
      classList: {
        add(name) { classes.add(name); },
        remove(name) { classes.delete(name); },
        contains(name) { return classes.has(name); }
      },
      setAttribute(name, value) { this.attributes[name] = value; },
      addEventListener(name, handler) { handlers[name] = handler; },
      trigger(name) { handlers[name]({ preventDefault() {} }); }
    };
  }
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(element);
  const elements = {
    "#indice": element("Indice pour le mot à trouver"),
    "#partie": element("Nouvelle partie"),
    "#formulaire": element(),
    "#devine": element(),
    "#mot": element(),
    "#pendu": element(),
    "#copyright": element()
  };
  const document = {
    querySelector(selector) { return elements[selector]; },
    querySelectorAll(selector) { return selector === ".lettre" ? letters : []; }
  };
  const math = Object.create(Math);
  math.random = () => 0; // BASEBALL, deterministic
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  vm.runInNewContext(source, { document, Math: math, Date, Set, Array });
  return {
    elements,
    letters,
    start() { elements["#partie"].trigger("click"); },
    guess(word) {
      elements["#devine"].value = word;
      elements["#formulaire"].trigger("submit");
    },
    letter(value) { letters.find((item) => item.textContent === value).trigger("click"); }
  };
}

test("une partie révèle un mot et réinitialise les erreurs", () => {
  const game = setupGame();
  game.start();
  assert.equal(game.elements["#mot"].textContent, "________");
  game.letter("Z");
  assert.equal(game.elements["#pendu"].src, "images/pendu_1.png");
  game.start();
  assert.equal(game.elements["#pendu"].src, "images/pendu.png");
  assert.equal(game.elements["#mot"].textContent.length > 0, true);
});

test("une mauvaise lettre répétée ne coûte qu'une tentative", () => {
  const game = setupGame();
  game.start();
  game.letter("Z");
  game.letter("Z");
  assert.equal(game.elements["#pendu"].src, "images/pendu_1.png");
});

test("six erreurs provoquent une défaite et bloquent les entrées", () => {
  const game = setupGame();
  game.start();
  "ZQXWYT".split("").forEach((letter) => game.letter(letter));
  assert.equal(game.elements["#pendu"].src, "images/gameover.png");
  assert.equal(game.elements["#partie"].style.display, "block");
  game.guess("BASEBALL");
  assert.equal(game.elements["#pendu"].src, "images/gameover.png");
});

test("une proposition correcte termine la partie avec une victoire", () => {
  const game = setupGame();
  game.start();
  game.guess(" baseball ");
  assert.equal(game.elements["#pendu"].src, "images/win.png");
  game.letter("Z");
  assert.equal(game.elements["#pendu"].src, "images/win.png");
});

test("un champ vide ne consomme pas de tentative", () => {
  const game = setupGame();
  game.start();
  game.guess(" ");
  assert.equal(game.elements["#pendu"].src, "images/pendu.png");
  assert.equal(game.elements["#devine"].style.borderColor, "red");
});

test("les lettres correctes révèlent toutes leurs occurrences", () => {
  const game = setupGame();
  game.start();
  game.letter("B");
  assert.equal(game.elements["#mot"].textContent, "B___B___");
});

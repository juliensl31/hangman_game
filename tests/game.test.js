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
        add(...names) { names.forEach((name) => classes.add(name)); },
        remove(...names) { names.forEach((name) => classes.delete(name)); },
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
    "#message": element(),
    "#categorie": element(),
    "#statistiques": element("Victoires : 0 · Défaites : 0"),
    "#copyright": element()
  };
  elements["#categorie"].value = "TOUTES";
  const documentHandlers = {};
  const document = {
    addEventListener(name, handler) { documentHandlers[name] = handler; },
    querySelector(selector) { return elements[selector]; },
    querySelectorAll(selector) { return selector === ".lettre" ? letters : []; }
  };
  const math = Object.create(Math);
  let draw = 0;
  math.random = () => (draw++ % 2) * 0.5; // BASEBALL, then RENAULT
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  vm.runInNewContext(source, { document, Math: math, Date, Set, Array });
  return {
    elements,
    letters,
    start() { elements["#partie"].trigger("click"); },
    key(letter, extra = {}) { documentHandlers.keydown({ key: letter, target: null, altKey: false, ctrlKey: false, metaKey: false, repeat: false, ...extra }); },
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


test("le clavier physique révèle les lettres sans compter les répétitions", () => {
  const game = setupGame();
  game.start();
  game.key("b");
  assert.equal(game.elements["#mot"].textContent, "B___B___");
  game.key("z");
  game.key("z");
  assert.equal(game.elements["#pendu"].src, "images/pendu_1.png");
});

test("la saisie du mot et les raccourcis ne jouent pas de lettre", () => {
  const game = setupGame();
  game.start();
  game.key("z", { target: game.elements["#devine"] });
  game.key("z", { ctrlKey: true });
  game.key("z", { repeat: true });
  assert.equal(game.elements["#pendu"].src, "images/pendu.png");
});

test("les touches indiquent les bonnes et mauvaises lettres", () => {
  const game = setupGame();
  assert.equal(game.letters[0].disabled, true);
  game.start();
  assert.equal(game.letters[0].disabled, false);
  game.letter("B");
  const b = game.letters.find((item) => item.textContent === "B");
  assert.equal(b.classList.contains("correct"), true);
  assert.equal(b.disabled, true);
  game.letter("Z");
  const z = game.letters.find((item) => item.textContent === "Z");
  assert.equal(z.classList.contains("incorrect"), true);
  assert.equal(game.elements["#message"].textContent.includes("5 erreurs"), true);
  game.start();
  assert.equal(b.classList.contains("correct"), false);
  assert.equal(z.classList.contains("incorrect"), false);
  assert.equal(game.elements["#message"].textContent, "");
});

test("victoire et défaite annoncent le résultat et verrouillent le clavier", () => {
  const won = setupGame();
  won.start();
  won.guess("BASEBALL");
  assert.equal(won.elements["#message"].textContent, "Bravo, mot trouvé !");
  assert.equal(won.elements["#pendu"].alt, "Victoire !");
  assert.equal(won.letters.every((item) => item.disabled), true);

  const lost = setupGame();
  lost.start();
  "ZQXWYT".split("").forEach((letter) => lost.letter(letter));
  assert.equal(lost.elements["#message"].textContent.includes("BASEBALL"), true);
  assert.equal(lost.elements["#pendu"].alt, "Partie perdue");
});

test("la tentative vide est annoncée sans erreur consommée", () => {
  const game = setupGame();
  game.start();
  game.guess("  ");
  assert.equal(game.elements["#message"].textContent, "Saisis un mot pour tenter ta chance.");
  assert.equal(game.elements["#pendu"].src, "images/pendu.png");
});

test("H4 filtre les mots de la catégorie choisie", () => {
  const game = setupGame();
  game.elements["#categorie"].value = "FRUITS";
  game.start();
  assert.equal(game.elements["#indice"].textContent, "Fruit croquant souvent associé à Newton.");
  game.guess("POMME");
  assert.equal(game.elements["#pendu"].src, "images/win.png");
});

test("H4 le changement de catégorie n'interrompt pas la partie en cours", () => {
  const game = setupGame();
  game.start();
  assert.equal(game.elements["#indice"].textContent, "On frappe une balle avec une batte et on court entre les bases.");
  game.elements["#categorie"].value = "PAYS";
  game.guess("BASEBALL");
  assert.equal(game.elements["#pendu"].src, "images/win.png");
  game.start();
  assert.equal(game.elements["#indice"].textContent, "Grand pays d’Amérique du Nord réputé pour ses érables.");
});

test("H4 compte exactement une victoire et une défaite par partie", () => {
  const game = setupGame();
  game.start();
  game.guess("BASEBALL");
  game.guess("BASEBALL");
  assert.equal(game.elements["#statistiques"].textContent, "Victoires : 1 · Défaites : 0");
  game.start();
  "ZQXWYH".split("").forEach((letter) => game.letter(letter));
  game.letter("Z");
  assert.equal(game.elements["#statistiques"].textContent, "Victoires : 1 · Défaites : 1");
  game.start();
  assert.equal(game.elements["#statistiques"].textContent, "Victoires : 1 · Défaites : 1");
});

test("chaque mot dispose d'un indice distinct de sa catégorie et de sa réponse", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const catalogue = vm.runInNewContext(source + "\n;({ mots, indices })", {
    document: {
      querySelectorAll() { return []; },
      querySelector() { return { textContent: "", value: "", style: {}, addEventListener() {}, setAttribute() {} }; },
      addEventListener() {}
    },
    Math, Date, Set, Map, Array
  });
  for (const [word, category] of catalogue.mots) {
    const clue = catalogue.indices[word];
    assert.equal(typeof clue, "string", `Indice manquant : ${word}`);
    assert.ok(clue.length > 15, `Indice trop court : ${word}`);
    assert.notEqual(clue.toUpperCase(), category);
    assert.equal(clue.toUpperCase().includes(word), false, `Indice dévoilant le mot : ${word}`);
  }
});

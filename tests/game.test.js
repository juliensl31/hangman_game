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
      dataset: {},
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
    "#colonne_gauche": element(),
    "#h52-attempts": element("6 essais restants"),
    "#message": element(),
    "#categorie": element(),
    "#statistiques": element("Victoires : 0 · Défaites : 0"),
    "#h52-wins": element("0"),
    "#h52-losses": element("0"),
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
  assert.equal(game.elements["#indice"].textContent, "Croquant et rond");
  game.guess("POMME");
  assert.equal(game.elements["#pendu"].src, "images/win.png");
});

test("H4 le changement de catégorie n'interrompt pas la partie en cours", () => {
  const game = setupGame();
  game.start();
  assert.equal(game.elements["#indice"].textContent, "Batte et balle");
  game.elements["#categorie"].value = "PAYS";
  game.guess("BASEBALL");
  assert.equal(game.elements["#pendu"].src, "images/win.png");
  game.start();
  assert.notEqual(game.elements["#indice"].textContent, "PAYS");
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

test("H5 contient 390 mots dans 8 catégories avec des indices légers", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const words = vm.runInNewContext(source + "\n;mots", {
    document: {
      querySelectorAll() { return []; },
      querySelector() { return { textContent: "", value: "", style: {}, addEventListener() {}, setAttribute() {} }; },
      addEventListener() {}
    },
    Math, Date, Set, Map, Array
  });
  assert.equal(words.length, 390);
  const seen = new Set();
  const counts = new Map();
  for (const [word, category, clue] of words) {
    assert.match(word, /^[A-Z]+$/);
    assert.equal(seen.has(word), false, word);
    assert.equal(typeof clue, "string");
    assert.ok(clue.length > 3 && clue.length <= 45, word);
    assert.notEqual(clue.toUpperCase(), category);
    assert.equal(new RegExp("(^|[^A-Z])" + word + "([^A-Z]|$)").test(clue.toUpperCase()), false, word);
    seen.add(word);
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  for (const cat of ["SPORT", "PAYS", "FRUITS", "VOITURE", "HALLOWEEN"]) {
    assert.equal(counts.get(cat), 60, cat);
  }
  for (const cat of ["ANIMAUX", "METIERS", "CINEMA"]) {
    assert.equal(counts.get(cat), 30, cat);
  }
});

test("H5 joue les 60 mots d'une catégorie sans doublon", () => {
  const game = setupGame();
  game.elements["#categorie"].value = "SPORT";
  const seen = new Set();
  for (let i = 0; i < 60; i += 1) {
    game.start();
    for (let failure = 0; failure < 6; failure += 1) game.guess("ZZZZ");
    const found = game.elements["#message"].textContent.match(/Le mot était ([A-Z]+)\./);
    assert.ok(found, "partie perdue");
    assert.equal(seen.has(found[1]), false, found[1]);
    seen.add(found[1]);
  }
  assert.equal(seen.size, 60);
  game.start();
  assert.equal(game.elements["#indice"].textContent.length > 0, true);
});

test("H5 le clavier physique ignore le menu et les autres contrôles", () => {
  const game = setupGame();
  game.start();
  game.key("z", { target: game.elements["#categorie"] });
  game.key("z", { target: { tagName: "SELECT" } });
  game.key("z", { target: { tagName: "BUTTON" } });
  game.key("z", { target: { isContentEditable: true } });
  assert.equal(game.elements["#pendu"].src, "images/pendu.png");
  game.key("z");
  assert.equal(game.elements["#pendu"].src, "images/pendu_1.png");
});

test("H5 les nouvelles catégories donnent 30 mots jouables et des indices courts", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "script.js"), "utf8");
  const words = vm.runInNewContext(source + "\n;mots", {
    document: {
      querySelectorAll() { return []; },
      querySelector() { return { textContent: "", value: "", style: {}, addEventListener() {}, setAttribute() {} }; },
      addEventListener() {}
    }, Math, Date, Set, Map, Array
  });
  for (const category of ["ANIMAUX", "METIERS", "CINEMA"]) {
    const subset = words.filter(([, cat]) => cat === category);
    assert.equal(subset.length, 30);
    const game = setupGame();
    game.elements["#categorie"].value = category;
    game.start();
    assert.ok(subset.some(([word, , hint]) =>
      game.elements["#mot"].textContent.length === word.length &&
      game.elements["#indice"].textContent === hint));
  }
});

test("H5.2 la scène suit les erreurs et les résultats sans changer les règles", () => {
  const game = setupGame();
  const panel = game.elements["#colonne_gauche"];
  const attempts = game.elements["#h52-attempts"];
  game.start();
  assert.equal(panel.dataset.errors, "0");
  assert.equal(attempts.textContent, "6 essais restants");
  game.letter("Z");
  assert.equal(panel.dataset.errors, "1");
  assert.equal(attempts.textContent, "5 essais restants");
  game.guess("BASEBALL");
  assert.equal(panel.dataset.result, "win");
  assert.equal(attempts.textContent, "Mot trouvé !");
  game.start();
  assert.equal(panel.dataset.result, "");
  assert.equal(panel.dataset.errors, "0");
  "ZQXWYT".split("").forEach((letter) => game.letter(letter));
  assert.equal(panel.dataset.result, "lose");
  assert.equal(attempts.textContent, "Partie perdue");
});

test("H5.2 conserve les polices locales et la scène SVG sans changer le catalogue", () => {
  const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const svg = fs.readFileSync(path.join(__dirname, "..", "images", "h52-halloween-scene.svg"), "utf8");
  assert.match(css, /font-family:\s*"October Crow"/);
  assert.match(css, /hangman-scene-exacte-reference\.webp/);
  assert.match(html, /h52-title-accent/);
  assert.match(html, /h52-attempts/);
  assert.match(svg, /<svg /);
  const photo = fs.readFileSync(path.join(__dirname, "..", "images", "hangman-scene-exacte-reference.webp"));
  assert.equal(photo.toString("ascii", 0, 4), "RIFF");
  assert.equal(photo.toString("ascii", 8, 12), "WEBP");
  assert.doesNotMatch(svg, /<script/i);
});

test("H5.2 le panneau du mot précède le clavier, qui ne contient plus le mot", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");
  const wordPanel = html.indexOf('class="h52-word-panel"');
  const keyboard = html.indexOf('id="clavier"');
  assert.ok(wordPanel > 0 && keyboard > wordPanel, "le mot doit se trouver avant le clavier");
  const wordTag = html.indexOf('id="mot"', wordPanel);
  assert.ok(wordTag > wordPanel && wordTag < keyboard);
  assert.match(css, /width:\s*min\(1260px/);
  assert.match(css, /\.h52-word-panel/);
  assert.match(css, /#colonne_gauche\[data-errors="6"\]/);
});

test("H5.2 les compteurs avec icônes suivent victoires et défaites", () => {
  const game = setupGame();
  game.start();
  game.guess("BASEBALL");
  assert.equal(game.elements["#h52-wins"].textContent, "1");
  assert.equal(game.elements["#h52-losses"].textContent, "0");
  game.start();
  "ZQXWYT".split("").forEach((letter) => game.letter(letter));
  assert.equal(game.elements["#h52-wins"].textContent, "1");
  assert.equal(game.elements["#h52-losses"].textContent, "1");
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");
  assert.match(html, /class="h52-scoreboard"/);
  assert.match(html, /id="h52-wins"/);
  assert.match(html, /id="h52-losses"/);
  assert.match(css, /\.h52-wins svg/);
  assert.match(css, /\.h52-losses svg/);
});

test("H5.2 bandeau avec fantôme, catégorie compacte et deux scores séparés", () => {
  const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
  const css = fs.readFileSync(path.join(__dirname, "..", "style.css"), "utf8");
  for (const name of ["h52-ghost", "h52-intro", "h52-category", "h52-scoreboard", "h52-wins", "h52-losses"]) {
    assert.ok(html.includes(name), name);
  }
  assert.match(css, /\.h52-intro\s*\{/);
  assert.match(css, /\.h52-category\s*\{/);
  assert.match(css, /\.h52-scoreboard\s*\{/);
  assert.match(css, /\.lettre\s*\{[\s\S]*?text-shadow:/);
});

test("H6 manifeste PWA et ressources locales du cache", () => {
  const root = path.join(__dirname, "..");
  const manifest = JSON.parse(fs.readFileSync(path.join(root, "manifest.webmanifest"), "utf8"));
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
  const pwa = fs.readFileSync(path.join(root, "pwa.js"), "utf8");
  assert.equal(manifest.display, "standalone");
  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.scope, "./");
  assert.equal(manifest.lang, "fr");
  assert.ok(manifest.icons.length > 0);
  assert.ok(manifest.icons.some((icon) => icon.sizes === "192x192"));
  assert.ok(manifest.icons.some((icon) => icon.sizes === "512x512"));
  for (const n of [192, 512]) {
    const icon = fs.readFileSync(path.join(root, "images", `h6-icon-${n}.webp`));
    assert.equal(icon.toString("ascii", 0, 4), "RIFF");
    assert.equal(icon.toString("ascii", 8, 12), "WEBP");
    assert.ok(manifest.icons.some((item) => item.sizes === `${n}x${n}` && item.type === "image/webp"));
  }
  assert.match(html, /rel="manifest"/);
  assert.match(html, /src="pwa\.js"/);
  assert.match(pwa, /navigator\.serviceWorker\.register/);
  const resources = [...sw.matchAll(/^  "\.\/([^"]+)",?$/gm)].map((match) => match[1]);
  assert.ok(resources.includes("script.js"));
  assert.ok(resources.includes("images/h6-icon-192.webp"));
  assert.ok(resources.includes("images/h6-icon-512.webp"));
  assert.ok(resources.includes("style.css"));
  assert.ok(resources.includes("images/hangman-scene-exacte-reference.webp"));
  assert.ok(resources.includes("sources/polices/October Crow.ttf"));
  assert.ok(resources.includes("sources/polices/HappyHalloween.ttf"));
  for (const file of resources) assert.ok(fs.existsSync(path.join(root, file)), file);
});

test("H6 service worker installe les ressources et sert la page hors ligne", async () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "sw.js"), "utf8");
  const callbacks = {};
  const cached = new Map();
  let claimed = false;
  const scope = "https://example.test/hangman/";
  const key = (value) => {
    const raw = typeof value === "string" ? value : value.url;
    return new URL(raw, scope).href;
  };
  const cache = {
    async addAll(paths) {
      for (const file of paths) cached.set(key(file), { offline: file });
    },
    async put(request, response) { cached.set(key(request), response); },
    async match(request) { return cached.get(key(request)); }
  };
  const cachesMock = {
    async open() { return cache; },
    async keys() { return ["hangman-pwa-previous", "hangman-pwa-h6-v2"]; },
    async delete() { return true; }
  };
  const context = {
    self: {
      registration: { scope },
      clients: { async claim() { claimed = true; } },
      async skipWaiting() {},
      addEventListener(name, fn) { callbacks[name] = fn; }
    },
    caches: cachesMock, URL,
    fetch: async () => { throw new Error("offline"); },
    Response: { error() { return { error: true }; } }
  };
  vm.runInNewContext(source, context);
  const run = async (name) => {
    let promise;
    callbacks[name]({ waitUntil(value) { promise = value; } });
    await promise;
  };
  await run("install");
  await run("activate");
  assert.ok(claimed);
  assert.ok(cached.has(scope + "index.html"));
  let result;
  callbacks.fetch({
    request: { method: "GET", mode: "navigate", url: scope },
    respondWith(value) { result = value; }
  });
  assert.ok((await result).offline, "navigation hors ligne servie depuis cache");
  callbacks.fetch({
    request: { method: "GET", mode: "cors", url: scope + "style.css" },
    respondWith(value) { result = value; }
  });
  assert.equal((await result).offline, "./style.css");
});

test("iOS Home Screen uses a real approved PNG rather than WebP", () => {
  const root = path.join(__dirname, "..");
  const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
  const sw = fs.readFileSync(path.join(root, "sw.js"), "utf8");
  const file = fs.readFileSync(path.join(root, "images/h6-ios-icon-180.png"));
  assert.match(html, /rel="apple-touch-icon" sizes="180x180" href="images\/h6-ios-icon-180\.png"/);
  assert.equal(file.toString("ascii", 1, 4), "PNG");
  assert.equal(file.readUInt32BE(16), 180);
  assert.equal(file.readUInt32BE(20), 180);
  assert.match(sw, /images\/h6-ios-icon-180\.png/);
  assert.match(sw, /hangman-pwa-h6-v3/);
});

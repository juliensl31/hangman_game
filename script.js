"use strict";

const alphabet = Array.from(document.querySelectorAll(".lettre"));
const indice = document.querySelector("#indice");
const demarrer = document.querySelector("#partie");
const formulaire = document.querySelector("#formulaire");
const input = document.querySelector("#devine");
const mot = document.querySelector("#mot");
const pendu = document.querySelector("#pendu");
const scenePanel = document.querySelector("#colonne_gauche");
const attemptsLabel = document.querySelector("#h52-attempts");
const message = document.querySelector("#message");
const categorie = document.querySelector("#categorie");
const statistiques = document.querySelector("#statistiques");
const h52Wins = document.querySelector("#h52-wins");
const h52Losses = document.querySelector("#h52-losses");
const copyright = document.querySelector("#copyright");
const toucheParLettre = new Map(alphabet.map((element) => [element.textContent.trim().toUpperCase(), element]));

if (copyright) {
  copyright.textContent = `${new Date().getFullYear()} © JSL Code`;
}

// Catalogue autonome : [mot, catégorie, indice court].
const mots = [
  [
    "BASEBALL",
    "SPORT",
    "Batte et balle"
  ],
  [
    "TENNIS",
    "SPORT",
    "Raquette et filet"
  ],
  [
    "PADDLE",
    "SPORT",
    "Court vitré"
  ],
  [
    "JUDO",
    "SPORT",
    "Sur un tatami"
  ],
  [
    "BASKETBALL",
    "SPORT",
    "Panier et ballon"
  ],
  [
    "KARATE",
    "SPORT",
    "Art martial"
  ],
  [
    "FOOTBALL",
    "SPORT",
    "Ballon rond"
  ],
  [
    "RUGBY",
    "SPORT",
    "Ballon ovale"
  ],
  [
    "HANDBALL",
    "SPORT",
    "Avec les mains"
  ],
  [
    "VOLLEYBALL",
    "SPORT",
    "Au-dessus du filet"
  ],
  [
    "BADMINTON",
    "SPORT",
    "Avec un volant"
  ],
  [
    "PINGPONG",
    "SPORT",
    "Petite table"
  ],
  [
    "NATATION",
    "SPORT",
    "Dans un bassin"
  ],
  [
    "PLONGEE",
    "SPORT",
    "Sous l’eau"
  ],
  [
    "SURF",
    "SPORT",
    "Sur les vagues"
  ],
  [
    "SKI",
    "SPORT",
    "Sur la neige"
  ],
  [
    "SNOWBOARD",
    "SPORT",
    "Une planche"
  ],
  [
    "PATINAGE",
    "SPORT",
    "Sur la glace"
  ],
  [
    "HOCKEY",
    "SPORT",
    "Avec une crosse"
  ],
  [
    "ESCRIME",
    "SPORT",
    "Avec une lame"
  ],
  [
    "BOXE",
    "SPORT",
    "Sur un ring"
  ],
  [
    "LUTTE",
    "SPORT",
    "Prises et tapis"
  ],
  [
    "ATHLETISME",
    "SPORT",
    "Sur une piste"
  ],
  [
    "MARATHON",
    "SPORT",
    "Course de fond"
  ],
  [
    "SPRINT",
    "SPORT",
    "Course courte"
  ],
  [
    "CYCLISME",
    "SPORT",
    "Sur deux roues"
  ],
  [
    "ESCALADE",
    "SPORT",
    "Sur une paroi"
  ],
  [
    "ALPINISME",
    "SPORT",
    "En montagne"
  ],
  [
    "EQUITATION",
    "SPORT",
    "Avec un cheval"
  ],
  [
    "AVIRON",
    "SPORT",
    "À la rame"
  ],
  [
    "VOILE",
    "SPORT",
    "Avec le vent"
  ],
  [
    "KAYAK",
    "SPORT",
    "Une pagaie"
  ],
  [
    "CANOE",
    "SPORT",
    "Embarcation légère"
  ],
  [
    "GOLF",
    "SPORT",
    "Petite balle"
  ],
  [
    "PETANQUE",
    "SPORT",
    "Boules et cochonnet"
  ],
  [
    "BOWLING",
    "SPORT",
    "Des quilles"
  ],
  [
    "BILLARD",
    "SPORT",
    "Tapis vert"
  ],
  [
    "GYMNASTIQUE",
    "SPORT",
    "Figures et agrès"
  ],
  [
    "DANSE",
    "SPORT",
    "En rythme"
  ],
  [
    "YOGA",
    "SPORT",
    "Souplesse"
  ],
  [
    "PILATES",
    "SPORT",
    "Renforcement doux"
  ],
  [
    "TRIATHLON",
    "SPORT",
    "Trois épreuves"
  ],
  [
    "BIATHLON",
    "SPORT",
    "Neige et cible"
  ],
  [
    "ROLLER",
    "SPORT",
    "À roulettes"
  ],
  [
    "SKATEBOARD",
    "SPORT",
    "Planche urbaine"
  ],
  [
    "PARKOUR",
    "SPORT",
    "Obstacles urbains"
  ],
  [
    "CROSSFIT",
    "SPORT",
    "Efforts variés"
  ],
  [
    "HALTEROPHILIE",
    "SPORT",
    "Soulever lourd"
  ],
  [
    "MUSCULATION",
    "SPORT",
    "Avec des poids"
  ],
  [
    "TIR",
    "SPORT",
    "Viser une cible"
  ],
  [
    "ARCHERIE",
    "SPORT",
    "Arc et cible"
  ],
  [
    "TAEKWONDO",
    "SPORT",
    "Art martial coréen"
  ],
  [
    "AIKIDO",
    "SPORT",
    "Art martial japonais"
  ],
  [
    "CAPOEIRA",
    "SPORT",
    "Danse et combat"
  ],
  [
    "SUMO",
    "SPORT",
    "Combat japonais"
  ],
  [
    "CRICKET",
    "SPORT",
    "Batte et guichets"
  ],
  [
    "SQUASH",
    "SPORT",
    "Mur et raquette"
  ],
  [
    "WATERPOLO",
    "SPORT",
    "Dans une piscine"
  ],
  [
    "LACROSSE",
    "SPORT",
    "Bâton et filet"
  ],
  [
    "ULTIMATE",
    "SPORT",
    "Disque volant"
  ],
  [
    "FRANCE",
    "PAYS",
    "Europe occidentale"
  ],
  [
    "ESPAGNE",
    "PAYS",
    "Europe du Sud"
  ],
  [
    "ALLEMAGNE",
    "PAYS",
    "Europe centrale"
  ],
  [
    "CANADA",
    "PAYS",
    "Amérique du Nord"
  ],
  [
    "ANGLETERRE",
    "PAYS",
    "Îles britanniques"
  ],
  [
    "UKRAINE",
    "PAYS",
    "Europe orientale"
  ],
  [
    "ITALIE",
    "PAYS",
    "Europe du Sud"
  ],
  [
    "PORTUGAL",
    "PAYS",
    "Côte atlantique"
  ],
  [
    "BELGIQUE",
    "PAYS",
    "Europe occidentale"
  ],
  [
    "SUISSE",
    "PAYS",
    "Alpes européennes"
  ],
  [
    "AUTRICHE",
    "PAYS",
    "Europe alpine"
  ],
  [
    "POLOGNE",
    "PAYS",
    "Europe centrale"
  ],
  [
    "GRECE",
    "PAYS",
    "Méditerranée"
  ],
  [
    "NORVEGE",
    "PAYS",
    "Scandinavie"
  ],
  [
    "SUEDE",
    "PAYS",
    "Scandinavie"
  ],
  [
    "FINLANDE",
    "PAYS",
    "Europe du Nord"
  ],
  [
    "DANEMARK",
    "PAYS",
    "Europe du Nord"
  ],
  [
    "ISLANDE",
    "PAYS",
    "Atlantique Nord"
  ],
  [
    "IRLANDE",
    "PAYS",
    "Île européenne"
  ],
  [
    "ECOSSE",
    "PAYS",
    "Grande-Bretagne"
  ],
  [
    "LUXEMBOURG",
    "PAYS",
    "Petit État européen"
  ],
  [
    "ROUMANIE",
    "PAYS",
    "Europe orientale"
  ],
  [
    "BULGARIE",
    "PAYS",
    "Balkans"
  ],
  [
    "CROATIE",
    "PAYS",
    "Mer Adriatique"
  ],
  [
    "SERBIE",
    "PAYS",
    "Balkans"
  ],
  [
    "SLOVENIE",
    "PAYS",
    "Alpes et Adriatique"
  ],
  [
    "SLOVAQUIE",
    "PAYS",
    "Europe centrale"
  ],
  [
    "HONGRIE",
    "PAYS",
    "Europe centrale"
  ],
  [
    "TCHEQUIE",
    "PAYS",
    "Europe centrale"
  ],
  [
    "ESTONIE",
    "PAYS",
    "Pays balte"
  ],
  [
    "LETTONIE",
    "PAYS",
    "Pays balte"
  ],
  [
    "LITUANIE",
    "PAYS",
    "Pays balte"
  ],
  [
    "TURQUIE",
    "PAYS",
    "Europe et Asie"
  ],
  [
    "MAROC",
    "PAYS",
    "Maghreb"
  ],
  [
    "ALGERIE",
    "PAYS",
    "Afrique du Nord"
  ],
  [
    "TUNISIE",
    "PAYS",
    "Maghreb"
  ],
  [
    "EGYPTE",
    "PAYS",
    "Afrique du Nord"
  ],
  [
    "SENEGAL",
    "PAYS",
    "Afrique de l’Ouest"
  ],
  [
    "MALI",
    "PAYS",
    "Région du Sahel"
  ],
  [
    "NIGER",
    "PAYS",
    "Région du Sahel"
  ],
  [
    "GHANA",
    "PAYS",
    "Afrique de l’Ouest"
  ],
  [
    "KENYA",
    "PAYS",
    "Afrique de l’Est"
  ],
  [
    "TANZANIE",
    "PAYS",
    "Afrique de l’Est"
  ],
  [
    "OUGANDA",
    "PAYS",
    "Afrique de l’Est"
  ],
  [
    "ETHIOPIE",
    "PAYS",
    "Afrique de l’Est"
  ],
  [
    "SOMALIE",
    "PAYS",
    "Corne de l’Afrique"
  ],
  [
    "NIGERIA",
    "PAYS",
    "Afrique de l’Ouest"
  ],
  [
    "CAMEROUN",
    "PAYS",
    "Afrique centrale"
  ],
  [
    "GABON",
    "PAYS",
    "Afrique centrale"
  ],
  [
    "JAPON",
    "PAYS",
    "Asie orientale"
  ],
  [
    "CHINE",
    "PAYS",
    "Asie orientale"
  ],
  [
    "INDE",
    "PAYS",
    "Asie du Sud"
  ],
  [
    "NEPAL",
    "PAYS",
    "Himalaya"
  ],
  [
    "THAILANDE",
    "PAYS",
    "Asie du Sud-Est"
  ],
  [
    "VIETNAM",
    "PAYS",
    "Asie du Sud-Est"
  ],
  [
    "MONGOLIE",
    "PAYS",
    "Asie centrale"
  ],
  [
    "AUSTRALIE",
    "PAYS",
    "Océanie"
  ],
  [
    "BRESIL",
    "PAYS",
    "Amérique du Sud"
  ],
  [
    "ARGENTINE",
    "PAYS",
    "Amérique du Sud"
  ],
  [
    "MEXIQUE",
    "PAYS",
    "Amérique du Nord"
  ],
  [
    "POMME",
    "FRUITS",
    "Croquant et rond"
  ],
  [
    "FRAISE",
    "FRUITS",
    "Petit et rouge"
  ],
  [
    "BANANE",
    "FRUITS",
    "Long et jaune"
  ],
  [
    "ABRICOT",
    "FRUITS",
    "Orangé et à noyau"
  ],
  [
    "RAISIN",
    "FRUITS",
    "En grappes"
  ],
  [
    "ORANGE",
    "FRUITS",
    "Agrume rond"
  ],
  [
    "POIRE",
    "FRUITS",
    "Juteux et doux"
  ],
  [
    "PECHE",
    "FRUITS",
    "Peau veloutée"
  ],
  [
    "NECTARINE",
    "FRUITS",
    "Peau lisse"
  ],
  [
    "CERISE",
    "FRUITS",
    "Petit et à noyau"
  ],
  [
    "FRAMBOISE",
    "FRUITS",
    "Baie rouge"
  ],
  [
    "MYRTILLE",
    "FRUITS",
    "Petite baie bleue"
  ],
  [
    "MURE",
    "FRUITS",
    "Baie sombre"
  ],
  [
    "GROSEILLE",
    "FRUITS",
    "Grappes acidulées"
  ],
  [
    "CASSIS",
    "FRUITS",
    "Baie noire"
  ],
  [
    "CITRON",
    "FRUITS",
    "Agrume acide"
  ],
  [
    "CLEMENTINE",
    "FRUITS",
    "Petit agrume"
  ],
  [
    "MANDARINE",
    "FRUITS",
    "Agrume sucré"
  ],
  [
    "PAMPLEMOUSSE",
    "FRUITS",
    "Gros agrume"
  ],
  [
    "POMELO",
    "FRUITS",
    "Agrume rose"
  ],
  [
    "ANANAS",
    "FRUITS",
    "Peau épineuse"
  ],
  [
    "MANGUE",
    "FRUITS",
    "Chair tropicale"
  ],
  [
    "PAPAYE",
    "FRUITS",
    "Chair orange"
  ],
  [
    "GOYAVE",
    "FRUITS",
    "Exotique et parfumé"
  ],
  [
    "KIWI",
    "FRUITS",
    "Peau brune"
  ],
  [
    "LITCHI",
    "FRUITS",
    "Coque rugueuse"
  ],
  [
    "KAKI",
    "FRUITS",
    "Fruit d’automne"
  ],
  [
    "FIGUE",
    "FRUITS",
    "Doux et violet"
  ],
  [
    "DATTE",
    "FRUITS",
    "Fruit du palmier"
  ],
  [
    "GRENADE",
    "FRUITS",
    "Grains rouges"
  ],
  [
    "COCO",
    "FRUITS",
    "Coque dure"
  ],
  [
    "AVOCAT",
    "FRUITS",
    "Chair verte"
  ],
  [
    "PASTEQUE",
    "FRUITS",
    "Gros fruit d’été"
  ],
  [
    "MELON",
    "FRUITS",
    "Parfum d’été"
  ],
  [
    "PRUNE",
    "FRUITS",
    "Petit fruit à noyau"
  ],
  [
    "MIRABELLE",
    "FRUITS",
    "Petite prune jaune"
  ],
  [
    "QUETSCHE",
    "FRUITS",
    "Prune allongée"
  ],
  [
    "REINECLAUDE",
    "FRUITS",
    "Prune ronde"
  ],
  [
    "COING",
    "FRUITS",
    "Fruit jaune"
  ],
  [
    "RHUBARBE",
    "FRUITS",
    "Tiges acidulées"
  ],
  [
    "CANNEBERGE",
    "FRUITS",
    "Baie rouge"
  ],
  [
    "AIRELLE",
    "FRUITS",
    "Baie sauvage"
  ],
  [
    "PHYSALIS",
    "FRUITS",
    "Enveloppe dorée"
  ],
  [
    "CARAMBOLE",
    "FRUITS",
    "Forme d’étoile"
  ],
  [
    "PASSIFLORE",
    "FRUITS",
    "Fruit tropical"
  ],
  [
    "PITAYA",
    "FRUITS",
    "Peau rose"
  ],
  [
    "DURIAN",
    "FRUITS",
    "Odeur forte"
  ],
  [
    "JACQUIER",
    "FRUITS",
    "Gros fruit tropical"
  ],
  [
    "LONGANE",
    "FRUITS",
    "Fruit asiatique"
  ],
  [
    "RAMBOUTAN",
    "FRUITS",
    "Coque à filaments"
  ],
  [
    "TAMARIN",
    "FRUITS",
    "Gousse acidulée"
  ],
  [
    "SAPOTILLE",
    "FRUITS",
    "Fruit tropical brun"
  ],
  [
    "COROSSOL",
    "FRUITS",
    "Chair tropicale"
  ],
  [
    "NASHI",
    "FRUITS",
    "Poire asiatique"
  ],
  [
    "KUMQUAT",
    "FRUITS",
    "Petit agrume"
  ],
  [
    "YUZU",
    "FRUITS",
    "Agrume japonais"
  ],
  [
    "BERGAMOTE",
    "FRUITS",
    "Agrume parfumé"
  ],
  [
    "CITRONVERT",
    "FRUITS",
    "Agrume vert"
  ],
  [
    "SUREAU",
    "FRUITS",
    "Baies sombres"
  ],
  [
    "CYNORRHODON",
    "FRUITS",
    "Baie sauvage"
  ],
  [
    "RENAULT",
    "VOITURE",
    "Marque française"
  ],
  [
    "PEUGEOT",
    "VOITURE",
    "Marque française"
  ],
  [
    "FERRARI",
    "VOITURE",
    "Sportive italienne"
  ],
  [
    "LAMBORGHINI",
    "VOITURE",
    "Sportive italienne"
  ],
  [
    "CITROEN",
    "VOITURE",
    "Marque française"
  ],
  [
    "PORSCHE",
    "VOITURE",
    "Sportive allemande"
  ],
  [
    "MERCEDES",
    "VOITURE",
    "Marque allemande"
  ],
  [
    "BMW",
    "VOITURE",
    "Marque bavaroise"
  ],
  [
    "AUDI",
    "VOITURE",
    "Marque allemande"
  ],
  [
    "VOLKSWAGEN",
    "VOITURE",
    "Marque allemande"
  ],
  [
    "OPEL",
    "VOITURE",
    "Marque allemande"
  ],
  [
    "FORD",
    "VOITURE",
    "Marque américaine"
  ],
  [
    "CHEVROLET",
    "VOITURE",
    "Marque américaine"
  ],
  [
    "CADILLAC",
    "VOITURE",
    "Luxe américain"
  ],
  [
    "CHRYSLER",
    "VOITURE",
    "Marque américaine"
  ],
  [
    "DODGE",
    "VOITURE",
    "Muscle cars"
  ],
  [
    "JEEP",
    "VOITURE",
    "Tout-terrain"
  ],
  [
    "TESLA",
    "VOITURE",
    "Électrique américaine"
  ],
  [
    "TOYOTA",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "HONDA",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "NISSAN",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "MAZDA",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "SUBARU",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "SUZUKI",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "MITSUBISHI",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "LEXUS",
    "VOITURE",
    "Luxe japonais"
  ],
  [
    "INFINITI",
    "VOITURE",
    "Luxe japonais"
  ],
  [
    "HYUNDAI",
    "VOITURE",
    "Marque coréenne"
  ],
  [
    "KIA",
    "VOITURE",
    "Marque coréenne"
  ],
  [
    "GENESIS",
    "VOITURE",
    "Luxe coréen"
  ],
  [
    "FIAT",
    "VOITURE",
    "Marque italienne"
  ],
  [
    "ALFAROMEO",
    "VOITURE",
    "Marque italienne"
  ],
  [
    "MASERATI",
    "VOITURE",
    "Sportive italienne"
  ],
  [
    "LANCIA",
    "VOITURE",
    "Marque italienne"
  ],
  [
    "SEAT",
    "VOITURE",
    "Marque espagnole"
  ],
  [
    "CUPRA",
    "VOITURE",
    "Sportive espagnole"
  ],
  [
    "SKODA",
    "VOITURE",
    "Marque tchèque"
  ],
  [
    "DACIA",
    "VOITURE",
    "Marque roumaine"
  ],
  [
    "VOLVO",
    "VOITURE",
    "Marque suédoise"
  ],
  [
    "SAAB",
    "VOITURE",
    "Ancienne marque suédoise"
  ],
  [
    "POLESTAR",
    "VOITURE",
    "Électrique suédoise"
  ],
  [
    "MINI",
    "VOITURE",
    "Petite britannique"
  ],
  [
    "JAGUAR",
    "VOITURE",
    "Marque britannique"
  ],
  [
    "LANDROVER",
    "VOITURE",
    "Tout-terrain britannique"
  ],
  [
    "BENTLEY",
    "VOITURE",
    "Luxe britannique"
  ],
  [
    "ROLLSROYCE",
    "VOITURE",
    "Luxe britannique"
  ],
  [
    "ASTONMARTIN",
    "VOITURE",
    "Sportive britannique"
  ],
  [
    "MCLAREN",
    "VOITURE",
    "Sportive britannique"
  ],
  [
    "LOTUS",
    "VOITURE",
    "Sportive britannique"
  ],
  [
    "MORGAN",
    "VOITURE",
    "Sportive britannique"
  ],
  [
    "BUGATTI",
    "VOITURE",
    "Hypercar de luxe"
  ],
  [
    "ALPINE",
    "VOITURE",
    "Sportive française"
  ],
  [
    "DS",
    "VOITURE",
    "Haut de gamme français"
  ],
  [
    "SMART",
    "VOITURE",
    "Citadine compacte"
  ],
  [
    "ISUZU",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "DAIHATSU",
    "VOITURE",
    "Marque japonaise"
  ],
  [
    "BYD",
    "VOITURE",
    "Électrique chinoise"
  ],
  [
    "MG",
    "VOITURE",
    "Origines britanniques"
  ],
  [
    "CHERY",
    "VOITURE",
    "Marque chinoise"
  ],
  [
    "GEELY",
    "VOITURE",
    "Marque chinoise"
  ],
  [
    "CITROUILLE",
    "HALLOWEEN",
    "Décoration orange"
  ],
  [
    "SORCIERE",
    "HALLOWEEN",
    "Balai et chapeau"
  ],
  [
    "DRACULA",
    "HALLOWEEN",
    "Comte fantastique"
  ],
  [
    "ZOMBIE",
    "HALLOWEEN",
    "Mort-vivant"
  ],
  [
    "VAMPIRE",
    "HALLOWEEN",
    "Créature nocturne"
  ],
  [
    "FRANKENSTEIN",
    "HALLOWEEN",
    "Roman gothique"
  ],
  [
    "FANTOME",
    "HALLOWEEN",
    "Apparition blanche"
  ],
  [
    "SQUELETTE",
    "HALLOWEEN",
    "Os apparents"
  ],
  [
    "CIMETIERE",
    "HALLOWEEN",
    "Lieu de sépulture"
  ],
  [
    "TOMBE",
    "HALLOWEEN",
    "Pierre funéraire"
  ],
  [
    "CERCUEIL",
    "HALLOWEEN",
    "Repos éternel"
  ],
  [
    "CHAUVESOURIS",
    "HALLOWEEN",
    "Animal nocturne"
  ],
  [
    "ARAIGNEE",
    "HALLOWEEN",
    "Huit pattes"
  ],
  [
    "TOILE",
    "HALLOWEEN",
    "Piège à insectes"
  ],
  [
    "CHAUDRON",
    "HALLOWEEN",
    "Récipient magique"
  ],
  [
    "POTION",
    "HALLOWEEN",
    "Mélange mystérieux"
  ],
  [
    "BALAI",
    "HALLOWEEN",
    "Accessoire volant"
  ],
  [
    "GRIMOIRE",
    "HALLOWEEN",
    "Livre de magie"
  ],
  [
    "SORTILEGE",
    "HALLOWEEN",
    "Formule magique"
  ],
  [
    "MALEDICTION",
    "HALLOWEEN",
    "Mauvais sort"
  ],
  [
    "DEMON",
    "HALLOWEEN",
    "Créature infernale"
  ],
  [
    "DIABLE",
    "HALLOWEEN",
    "Personnage cornu"
  ],
  [
    "MONSTRE",
    "HALLOWEEN",
    "Créature effrayante"
  ],
  [
    "LOUPGAROU",
    "HALLOWEEN",
    "Bête de pleine lune"
  ],
  [
    "MOMIE",
    "HALLOWEEN",
    "Bandelettes anciennes"
  ],
  [
    "GOLEM",
    "HALLOWEEN",
    "Créature façonnée"
  ],
  [
    "TROLL",
    "HALLOWEEN",
    "Créature légendaire"
  ],
  [
    "GOBELIN",
    "HALLOWEEN",
    "Petit être fantastique"
  ],
  [
    "ORC",
    "HALLOWEEN",
    "Créature de fantasy"
  ],
  [
    "OGRE",
    "HALLOWEEN",
    "Géant des contes"
  ],
  [
    "CROQUEMITAINE",
    "HALLOWEEN",
    "Personnage des peurs"
  ],
  [
    "EPOUVANTAIL",
    "HALLOWEEN",
    "Gardien des champs"
  ],
  [
    "MASQUE",
    "HALLOWEEN",
    "Cache le visage"
  ],
  [
    "DEGUISEMENT",
    "HALLOWEEN",
    "Tenue de fête"
  ],
  [
    "BONBON",
    "HALLOWEEN",
    "Friandise sucrée"
  ],
  [
    "CARAMEL",
    "HALLOWEEN",
    "Sucre cuit"
  ],
  [
    "LANTERNE",
    "HALLOWEEN",
    "Lueur dans la nuit"
  ],
  [
    "BOUGIE",
    "HALLOWEEN",
    "Petite flamme"
  ],
  [
    "BRUME",
    "HALLOWEEN",
    "Air vaporeux"
  ],
  [
    "BROUILLARD",
    "HALLOWEEN",
    "Visibilité réduite"
  ],
  [
    "MINUIT",
    "HALLOWEEN",
    "Heure nocturne"
  ],
  [
    "PLEINELUNE",
    "HALLOWEEN",
    "Ciel nocturne"
  ],
  [
    "OMBRE",
    "HALLOWEEN",
    "Silhouette obscure"
  ],
  [
    "TENEBRES",
    "HALLOWEEN",
    "Obscurité"
  ],
  [
    "CRYPTE",
    "HALLOWEEN",
    "Salle souterraine"
  ],
  [
    "DONJON",
    "HALLOWEEN",
    "Vieille tour"
  ],
  [
    "CHATEAU",
    "HALLOWEEN",
    "Vieille demeure"
  ],
  [
    "MANOIR",
    "HALLOWEEN",
    "Maison isolée"
  ],
  [
    "RUINE",
    "HALLOWEEN",
    "Bâtiment abandonné"
  ],
  [
    "CORBEAU",
    "HALLOWEEN",
    "Oiseau noir"
  ],
  [
    "HIBOU",
    "HALLOWEEN",
    "Oiseau de nuit"
  ],
  [
    "CHATNOIR",
    "HALLOWEEN",
    "Félin superstitieux"
  ],
  [
    "CRANE",
    "HALLOWEEN",
    "Os de la tête"
  ],
  [
    "OSSEMENT",
    "HALLOWEEN",
    "Reste de squelette"
  ],
  [
    "SARCOPHAGE",
    "HALLOWEEN",
    "Cercueil ancien"
  ],
  [
    "FROUSSE",
    "HALLOWEEN",
    "Peur soudaine"
  ],
  [
    "FRISSON",
    "HALLOWEEN",
    "Peau qui réagit"
  ],
  [
    "HURLEMENT",
    "HALLOWEEN",
    "Cri effrayant"
  ],
  [
    "TERREUR",
    "HALLOWEEN",
    "Peur intense"
  ],
  [
    "CAUCHEMAR",
    "HALLOWEEN",
    "Mauvais rêve"
  ],
  ["ELEPHANT","ANIMAUX","Très grande trompe"],
  ["GIRAFE","ANIMAUX","Long cou"],
  ["LION","ANIMAUX","Roi de la savane"],
  ["TIGRE","ANIMAUX","Félin rayé"],
  ["ZEBRE","ANIMAUX","Rayures africaines"],
  ["HIPPOPOTAME","ANIMAUX","Grand mammifère des fleuves"],
  ["RHINOCEROS","ANIMAUX","Corne sur le museau"],
  ["CROCODILE","ANIMAUX","Reptile des rivières"],
  ["PANTHERE","ANIMAUX","Félin discret"],
  ["LEOPARD","ANIMAUX","Félin tacheté"],
  ["GUEPARD","ANIMAUX","Très rapide"],
  ["OURS","ANIMAUX","Grand mammifère forestier"],
  ["PANDA","ANIMAUX","Noir et blanc"],
  ["LOUP","ANIMAUX","Vit en meute"],
  ["RENARD","ANIMAUX","Queue touffue"],
  ["ECUREUIL","ANIMAUX","Cache des noisettes"],
  ["HERISSON","ANIMAUX","Petits piquants"],
  ["LAPIN","ANIMAUX","Longues oreilles"],
  ["HAMSTER","ANIMAUX","Petit rongeur"],
  ["COCHON","ANIMAUX","Animal de ferme"],
  ["VACHE","ANIMAUX","Donne du lait"],
  ["CHEVAL","ANIMAUX","Au galop"],
  ["MOUTON","ANIMAUX","Laine douce"],
  ["CHEVRE","ANIMAUX","Animal à cornes"],
  ["POULE","ANIMAUX","Pond des œufs"],
  ["CANARD","ANIMAUX","Oiseau au bec plat"],
  ["CYGNE","ANIMAUX","Grand oiseau blanc"],
  ["PERROQUET","ANIMAUX","Plumage coloré"],
  ["DAUPHIN","ANIMAUX","Mammifère marin"],
  ["BALEINE","ANIMAUX","Géant des océans"],
  ["BOULANGER","METIERS","Travaille le pain"],
  ["PATISSIER","METIERS","Prépare des gâteaux"],
  ["CUISINIER","METIERS","Travaille en cuisine"],
  ["SERVEUR","METIERS","Au restaurant"],
  ["POMPIER","METIERS","Intervient sur les incendies"],
  ["POLICIER","METIERS","Maintient l'ordre"],
  ["GENDARME","METIERS","Sécurité publique"],
  ["MEDECIN","METIERS","Soigne les patients"],
  ["INFIRMIER","METIERS","Soins hospitaliers"],
  ["DENTISTE","METIERS","Soigne les dents"],
  ["VETERINAIRE","METIERS","Soigne les animaux"],
  ["PHARMACIEN","METIERS","Délivre des médicaments"],
  ["ENSEIGNANT","METIERS","Transmet des savoirs"],
  ["PROFESSEUR","METIERS","Travaille en classe"],
  ["GREFFIER","METIERS","Au tribunal"],
  ["JUGE","METIERS","Rend la justice"],
  ["NOTAIRE","METIERS","Authentifie des actes"],
  ["ARCHITECTE","METIERS","Dessine des bâtiments"],
  ["MACON","METIERS","Construit des murs"],
  ["PLOMBIER","METIERS","Répare les canalisations"],
  ["ELECTRICIEN","METIERS","Travaille sur les circuits"],
  ["CHARPENTIER","METIERS","Ouvrage en bois"],
  ["MENUISIER","METIERS","Façonne le bois"],
  ["PEINTRE","METIERS","Peint des surfaces"],
  ["MECANICIEN","METIERS","Répare des moteurs"],
  ["CARROSSIER","METIERS","Répare les carrosseries"],
  ["CHAUFFEUR","METIERS","Conduit professionnellement"],
  ["PILOTE","METIERS","Aux commandes d'un avion"],
  ["MARIN","METIERS","Travaille en mer"],
  ["PECHEUR","METIERS","Ramène du poisson"],
  ["ACTEUR","CINEMA","Joue un rôle"],
  ["ACTRICE","CINEMA","Joue un rôle"],
  ["REALISATEUR","CINEMA","Dirige le tournage"],
  ["SCENARISTE","CINEMA","Écrit les dialogues"],
  ["PRODUCTEUR","CINEMA","Finance un film"],
  ["CAMERAMAN","CINEMA","Manie la caméra"],
  ["CLAP","CINEMA","Annonce une prise"],
  ["SCENARIO","CINEMA","Histoire écrite"],
  ["CASTING","CINEMA","Choix des interprètes"],
  ["TOURNAGE","CINEMA","Travail sur le plateau"],
  ["MONTAGE","CINEMA","Assemble les plans"],
  ["DOUBLAGE","CINEMA","Voix de remplacement"],
  ["SOUSTITRE","CINEMA","Texte sous l'image"],
  ["GENERIQUE","CINEMA","Noms à l'écran"],
  ["BANDEANNONCE","CINEMA","Aperçu d'un film"],
  ["PROJECTION","CINEMA","Sur grand écran"],
  ["ECRAN","CINEMA","Surface de projection"],
  ["CAMERA","CINEMA","Enregistre des images"],
  ["PROJECTEUR","CINEMA","Diffuse la lumière"],
  ["POPCORN","CINEMA","Grignotage de séance"],
  ["OSCAR","CINEMA","Récompense américaine"],
  ["CESAR","CINEMA","Récompense française"],
  ["FESTIVAL","CINEMA","Rencontre de films"],
  ["COMEDIE","CINEMA","Pour faire rire"],
  ["DRAME","CINEMA","Genre émouvant"],
  ["THRILLER","CINEMA","Suspense"],
  ["WESTERN","CINEMA","Genre de cowboys"],
  ["ANIMATION","CINEMA","Images en mouvement"],
  ["DOCUMENTAIRE","CINEMA","Sujet réel"],
  ["FICTION","CINEMA","Histoire inventée"]
];

const MAX_ERREURS = 6;
// H7.1 : progression normalisée, sans dépendance au thème.
// D'autres thèmes pourront fournir leur propre renderer sans toucher au jeu.
const progressionRenderers = {
  halloween({ errors, maxErrors, result }) {
    if (!scenePanel) return;
    const phases = scenePanel.querySelectorAll?.("[data-h7-stage]") || [];
    const count = Math.min(phases.length, Math.floor(Math.min(1, errors / maxErrors) * phases.length));
    phases.forEach((phase, index) => phase.classList.toggle("h7-visible", index < count));
    scenePanel.dataset.result = result || "";
  }
};
let visualTheme = "halloween";
function renderProgression(result = "") {
  progressionRenderers[visualTheme]?.({errors: erreurs, maxErrors: MAX_ERREURS, result});
}
let motActuel = "";
let lettresRevelees = [];
let lettresEssayees = new Set();
let erreurs = 0;
let dernierIndex = -1;
const motsRestants = new Map();
let partieActive = false;
let victoires = 0;
let defaites = 0;

function afficherStatistiques() {
  statistiques.textContent = `Victoires : ${victoires} · Défaites : ${defaites}`;
  if (h52Wins) h52Wins.textContent = String(victoires);
  if (h52Losses) h52Losses.textContent = String(defaites);
}

function afficherMot() {
  mot.textContent = lettresRevelees.join("");
}

function terminerPartie(gagne) {
  if (!partieActive) return;
  renderProgression(gagne ? "win" : "lose");
  if (attemptsLabel) attemptsLabel.textContent = gagne ? "Mot trouvé !" : "Partie perdue";
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
  if (scenePanel) scenePanel.dataset.errors = String(erreurs);
  renderProgression();
  if (attemptsLabel) attemptsLabel.textContent = `${MAX_ERREURS - erreurs} essai${MAX_ERREURS - erreurs > 1 ? "s" : ""} restant${MAX_ERREURS - erreurs > 1 ? "s" : ""}`;
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

  // Éviter les répétitions jusqu'à épuisement des mots de la catégorie.
  const cle = categorie.value;
  let restants = motsRestants.get(cle);
  if (!restants || restants.length === 0) {
    restants = candidates.map(({ index }) => index);
    motsRestants.set(cle, restants);
  }
  const disponibles = restants.length > 1
    ? restants.filter((index) => index !== dernierIndex)
    : restants;
  const index = disponibles[Math.floor(Math.random() * disponibles.length)];
  restants.splice(restants.indexOf(index), 1);

  dernierIndex = index;
  motActuel = mots[index][0];
  indice.textContent = mots[index][2];
  erreurs = 0;
  if (scenePanel) { scenePanel.dataset.errors = "0"; scenePanel.dataset.result = ""; }
  renderProgression();
  if (attemptsLabel) attemptsLabel.textContent = `${MAX_ERREURS} essais restants`;
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
  const cible = event.target;
  if (event.altKey || event.ctrlKey || event.metaKey || event.repeat ||
      cible === input || cible === categorie || cible?.isContentEditable ||
      ["INPUT", "TEXTAREA", "SELECT", "BUTTON"].includes(cible?.tagName)) return;
  const touche = toucheParLettre.get(event.key.toUpperCase());
  if (touche) essayerLettre(event.key.toUpperCase(), touche);
});

demarrer.addEventListener("click", nouvellePartie);
alphabet.forEach((lettre) => {
  lettre.disabled = true;
  lettre.setAttribute("aria-disabled", "true");
});

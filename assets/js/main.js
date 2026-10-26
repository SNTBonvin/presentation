/* ============================================================
   SNT · Ressource pédagogique — moteur du site
   ============================================================ */

/* ---------- Navigation & pied de page ---------- */

const NAV_ITEMS = [
  { path: "index.html", label: "Accueil", cls: "" },
  { path: "themes/internet.html", label: "Internet", cls: "t-internet" },
  { path: "themes/web.html", label: "Le Web", cls: "t-web" },
  { path: "themes/reseaux-sociaux.html", label: "Réseaux sociaux", cls: "t-rs" },
  { path: "themes/donnees.html", label: "Données structurées", cls: "t-donnees" },
  { path: "themes/localisation.html", label: "Localisation & mobilité", cls: "t-geo" },
  { path: "themes/objets-connectes.html", label: "Objets connectés", cls: "t-iot" },
  { path: "themes/photo.html", label: "Photo numérique", cls: "t-photo" },
  { path: "themes/binaire.html", label: "Codage binaire", cls: "t-binaire" },
];

function buildNav() {
  const slot = document.getElementById("nav-slot");
  if (!slot) return;
  const prefix = location.pathname.includes("/themes/") ? "../" : "";
  const current = document.body.className;
  const links = NAV_ITEMS.map((it) => {
    const active = it.cls && current.includes(it.cls) ? ' class="active"' : "";
    return `<a href="${prefix}${it.path}"${active}>${it.label}</a>`;
  }).join("");
  slot.innerHTML =
    '<header class="navbar">' +
    `<a class="brand" href="${prefix}index.html">SNT<span>.pédagogie</span></a>` +
    `<nav>${links}</nav>` +
    "</header>";
}

function buildFooter() {
  const slot = document.getElementById("footer-slot");
  if (!slot) return;
  slot.innerHTML =
    '<footer class="footer">Ressource pédagogique SNT · Seconde — site 100 % statique : tout se passe dans ton navigateur, aucune donnée collectée.</footer>';
}

/* ---------- Apparition au scroll ---------- */

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) {
      e.target.classList.add("visible");
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

/* ---------- Pluie Matrix (page binaire) ---------- */

function initMatrix() {
  if (!document.body.classList.contains("t-binaire")) return;
  const canvas = document.createElement("canvas");
  canvas.id = "matrix";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  let drops = [];
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const cols = Math.floor(canvas.width / 18);
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -120));
  }
  resize();
  window.addEventListener("resize", resize);
  const glyphs = "01アイウエオカキクケコサシスセソ0123456789ABCDEF";
  (function draw() {
    ctx.fillStyle = "rgba(3, 8, 5, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#39ff6a";
    ctx.font = "16px 'JetBrains Mono', monospace";
    drops.forEach((y, i) => {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillText(ch, i * 18, y * 18);
      if (y * 18 > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    });
    requestAnimationFrame(draw);
  })();
}

/* ---------- Moteur de quiz ---------- */

const QUIZ = {
  internet: {
    questions: [
      {
        q: "À quoi sert une adresse IP ?",
        options: ["À donner un nom lisible à un site", "À identifier une machine sur le réseau", "À crypter les messages"],
        answer: 1,
        explain: "L'adresse IP est l'identité réseau d'une machine (ex : 172.217.16.142). Le DNS traduit les noms de domaine en adresses IP.",
      },
      {
        q: "TCP/IP, c'est…",
        options: ["Un antivirus", "Un ensemble de protocoles qui fait fonctionner Internet", "Un langage de programmation"],
        answer: 1,
        explain: "TCP découpe les données en paquets, IP s'occupe de leur acheminement. Adoptés le 1er janvier 1983, ils sont le « ciment » d'Internet.",
      },
      {
        q: "Internet et le Web, c'est la même chose ?",
        options: ["Oui, totalement", "Non : le Web est un service parmi d'autres qui tournent sur Internet", "Non : le Web est un réseau, Internet est un site"],
        answer: 1,
        explain: "Internet = l'infrastructure (câbles, routeurs, serveurs). Le Web = les pages échangées grâce à HTTP. Il existe aussi l'e-mail, le streaming, les jeux en ligne…",
      },
    ],
  },
  web: {
    questions: [
      {
        q: "HTTP signifie…",
        options: ["HyperText Transfer Protocol", "High Transfer Text Page", "Host Text Transfer Process"],
        answer: 0,
        explain: "HTTP est le protocole de transfert des pages web entre le serveur et ton navigateur (HTTPS = la version sécurisée).",
      },
      {
        q: "Dans https://www.snt.fr:443/cours?page=2, « page=2 » est…",
        options: ["Un paramètre transmis à la page", "Le nom du serveur", "Le protocole de transfert"],
        answer: 0,
        explain: "Après le « ? », ce sont des paramètres (ici le numéro de page). Le port 443 est le port sécurisé de HTTPS.",
      },
    ],
  },
  rs: {
    questions: [
      {
        q: "Le modèle économique de la plupart des réseaux sociaux repose sur…",
        options: ["La publicité ciblée grâce aux données des utilisateurs", "La revente de ton historique à des particuliers", "Un abonnement obligatoire"],
        answer: 0,
        explain: "Gratuit pour l'utilisateur, payant pour les annonceurs : tes données alimentent le ciblage publicitaire.",
      },
      {
        q: "« Si c'est gratuit, c'est toi le produit » signifie que…",
        options: ["Tu dois payer en nature", "Ton attention et tes données sont la marchandise échangée", "Le service fermera bientôt"],
        answer: 1,
        explain: "Sans modèle économique, pas de service : ce sont tes données et ton temps d'écran qui le financent.",
      },
      {
        q: "Le RGPD (2018) te donne notamment le droit…",
        options: ["De tout publier anonymement", "D'accéder à tes données, de les rectifier et de les supprimer", "De copier n'importe quelle photo trouvée en ligne"],
        answer: 1,
        explain: "Le RGPD encadre la collecte des données personnelles en Europe : consentement, accès, rectification, effacement (le « droit à l'oubli »).",
      },
    ],
  },
  donnees: {
    questions: [
      {
        q: "Dans un fichier CSV, les valeurs d'une même ligne sont séparées par…",
        options: ["Des espaces", "Un séparateur fixe, souvent « ; » ou « , »", "Des virgules obligatoires"],
        answer: 1,
        explain: "CSV = Comma-Separated Values. En France, on utilise souvent « ; » car la virgule sert déjà aux nombres décimaux.",
      },
      {
        q: "Le format JSON sert à…",
        options: ["Stocker des images compressées", "Échanger des données structurées entre machines", "Faire des calculs dans un tableur"],
        answer: 1,
        explain: "JSON organise les données en paires « clé: valeur », lisibles par les humains et les programmes (c'est le format des API web).",
      },
    ],
  },
  geo: {
    questions: [
      {
        q: "Pour calculer une position en 3D, un récepteur GPS a besoin d'au moins…",
        options: ["1 satellite", "4 satellites", "24 satellites"],
        answer: 1,
        explain: "3 satellites pour la position, plus 1 quatrième pour corriger l'horloge du récepteur : d'où le « au moins 4 ».",
      },
      {
        q: "Le point de latitude 0° et de longitude 0° se trouve…",
        options: ["À Paris", "Dans le golfe de Guinée, au large du Gabon", "Au pôle Nord"],
        answer: 1,
        explain: "Surnommé « Null Island » : le méridien de Greenwich (longitude 0) croise l'équateur (latitude 0) dans l'océan Atlantique.",
      },
    ],
  },
  "iot-code": {
    questions: [
      {
        q: "À la place de ???, quelle ligne faut-il écrire pour allumer la LED quand il fait sombre ?",
        options: [
          "if (lumiere < 500) { digitalWrite(led, HIGH); } else { digitalWrite(led, LOW); }",
          "digitalWrite(led, lumiere);",
          "if (lumiere > 500) { digitalWrite(led, HIGH); }",
        ],
        answer: 0,
        explain: "analogRead renvoie une valeur de 0 (très lumineux) à 1023 (obscur). Pour allumer dans le noir, on teste lumiere < 500 et on écrit HIGH sur la broche 13.",
      },
    ],
  },
  iot: {
    questions: [
      {
        q: "Un capteur, c'est…",
        options: ["Un composant qui mesure une grandeur physique du monde réel", "Un écran tactile", "Un antivirus embarqué"],
        answer: 0,
        explain: "Capteur de température, de luminosité, accéléromètre… il convertit un phénomène physique en signal électrique mesurable.",
      },
      {
        q: "Lequel de ces objets n'est PAS un objet connecté ?",
        options: ["Un thermostat piloté par smartphone", "Une enceinte vocale", "Un grille-pain sans prise réseau"],
        answer: 2,
        explain: "Sans connexion réseau, un objet reste « bête » : un objet connecté échange des données avec d'autres machines.",
      },
    ],
  },
  photo: {
    questions: [
      {
        q: "Un pixel stocke…",
        options: ["Une couleur, codée par des nombres (3 octets en RVB)", "Un caractère de texte", "Un échantillon sonore"],
        answer: 0,
        explain: "En RVB (Rouge, Vert, Bleu), chaque composante vaut de 0 à 255 → 3 octets par pixel, soit 16,7 millions de couleurs possibles.",
      },
      {
        q: "La compression JPEG…",
        options: ["Réduit la taille du fichier en supprimant des détails peu visibles", "Augmente la résolution de l'image", "Transforme la photo en noir et blanc"],
        answer: 0,
        explain: "Le JPEG exploite les limites de l'œil humain : moins de précision sur les détails fins, mais un fichier beaucoup plus léger.",
      },
    ],
  },
  binaire: {
    questions: [
      {
        q: "Avec 3 bits, combien de valeurs différentes peut-on coder ?",
        options: ["3", "6", "8"],
        answer: 2,
        explain: "2^3 = 8 valeurs distinctes : de 000 à 111.",
      },
      {
        q: "Le nombre décimal 10 s'écrit en binaire…",
        options: ["0101", "1010", "1000"],
        answer: 1,
        explain: "8 + 2 = 10, donc 1010 en binaire (1×8 + 0×4 + 1×2 + 0×1).",
      },
      {
        q: "1 kilooctet (Ko) vaut…",
        options: ["1000 octets", "8 octets", "1024 octets"],
        answer: 2,
        explain: "En informatique, les préfixes suivent les puissances de 2 : 1 Ko = 2^10 = 1024 octets.",
      },
    ],
  },
};

function initQuiz(id) {
  const data = QUIZ[id];
  const root = document.querySelector('[data-quiz="' + id + '"]');
  if (!root || !data) return;
  const state = data.questions.map(() => null);

  data.questions.forEach((q, qi) => {
    const box = document.createElement("div");
    box.className = "quiz-q";
    const h = document.createElement("p");
    h.innerHTML = "<b>Question " + (qi + 1) + ".</b> " + q.q;
    box.appendChild(h);
    const row = document.createElement("div");
    row.className = "pill-row";
    q.options.forEach((opt, oi) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "pill";
      b.textContent = opt;
      b.addEventListener("click", () => {
        state[qi] = oi;
        row.querySelectorAll(".pill").forEach((el, i) => el.classList.toggle("selected", i === oi));
      });
      row.appendChild(b);
    });
    box.appendChild(row);
    const expl = document.createElement("p");
    expl.className = "quiz-expl";
    box.appendChild(expl);
    q._expl = expl;
    q._row = row;
    root.appendChild(box);
  });

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "Vérifier mes réponses";
  const fb = document.createElement("p");
  fb.className = "feedback";
  root.appendChild(btn);
  root.appendChild(fb);

  btn.addEventListener("click", () => {
    let score = 0;
    data.questions.forEach((q, qi) => {
      const ok = state[qi] === q.answer;
      if (ok) score++;
      q._expl.style.display = "block";
      q._expl.innerHTML = (ok ? "✔ " : "✘ ") + q.explain;
      q._expl.style.color = ok ? "#5ee6a8" : "#ff7d7d";
      q._row.querySelectorAll(".pill").forEach((el, i) => {
        el.classList.remove("selected");
        el.style.borderColor = "";
        if (i === q.answer) el.style.borderColor = "#5ee6a8";
        else if (i === state[qi]) el.style.borderColor = "#ff7d7d";
      });
    });
    const total = data.questions.length;
    fb.className = "feedback " + (score === total ? "ok" : "ko");
    fb.textContent =
      "Score : " + score + "/" + total +
      (score === total ? " — parfait !" : score >= total / 2 ? " — pas mal, relis la frise et réessaie !" : " — révise la frise chronologique, puis réessaie !");
  });
}

/* ---------- QCM à cases multiples (page Web) ---------- */

const MULTI = {
  internet: {
    intro: "Une adresse IPv4 est composée de 4 nombres de 0 à 255 séparés par des points (ex : 192.168.0.1). Coche les adresses IPv4 valides, puis vérifie.",
    items: [
      { label: "192.168.1.1", ok: true },
      { label: "8.8.8.8", ok: true },
      { label: "256.1.1.1", ok: false },
      { label: "172.16.254.1", ok: true },
      { label: "10.0.0.300", ok: false },
      { label: "mon-ordinateur.local", ok: false },
    ],
    okMsg: "3 adresses IPv4 valides sur 6 — parfait !",
    koMsg: "Rappel : 4 nombres entre 0 et 255 séparés par des points. 256 et 300 dépassent la limite, et « .local » est un nom de machine, pas une adresse IPv4.",
  },
  rs: {
    intro: "Le RGPD (Règlement général sur la protection des données, en vigueur depuis 2018) définit tes droits sur tes données personnelles. Coche ceux qu'il te garantit.",
    items: [
      { label: "Accéder aux données qu'un service détient sur toi", ok: true },
      { label: "Rectifier des informations personnelles erronées", ok: true },
      { label: "Demander la suppression de ses données (« droit à l'oubli »)", ok: true },
      { label: "Être informé en cas de fuite de ses données", ok: true },
      { label: "Être pisté sur le Web sans en être informé", ok: false },
      { label: "Revendre tes données à n'importe quel acheteur", ok: false },
    ],
    okMsg: "4 droits RGPD sur 6 — parfait !",
    koMsg: "Le RGPD consacre l'accès, la rectification, l'effacement, la portabilité et l'information en cas de fuite — jamais le pistage dissimulé ni la revente sauvage des données.",
  },
  iot: {
    intro: "Un objet connecté échange des données sur un réseau. Coche ceux qui le sont vraiment.",
    items: [
      { label: "Thermostat piloté depuis un smartphone", ok: true },
      { label: "Enceinte vocale synchronisée dans le cloud", ok: true },
      { label: "Grille-pain sans aucune prise réseau", ok: false },
      { label: "Montre mesurant le pouls et envoyant les données à une appli", ok: true },
      { label: "Vélo sans électronique", ok: false },
      { label: "Caméra de surveillance connectée en Wi-Fi", ok: true },
    ],
    okMsg: "4 objets connectés sur 6 — parfait !",
    koMsg: "Sans échange de données sur un réseau, un objet reste « bête » : ni Wi-Fi, ni appli, ni synchronisation = pas connecté.",
  },
  web: {
    intro: "Une URL = un protocole (https://), un nom de domaine, et éventuellement un port, un chemin et des paramètres. Coche les adresses valides, puis vérifie.",
    items: [
      { label: "https://www.exemple.fr/page", ok: true },
      { label: "ftp://fichiers.exemple.fr/dossier", ok: true },
      { label: "https://exemple.fr:8080/cours?page=2", ok: true },
      { label: "http://", ok: false },
      { label: "mon site préféré.fr", ok: false },
      { label: "https://", ok: false },
    ],
    okMsg: "3 URL valides sur 6 — parfait !",
    koMsg: "Rappel : protocole://domaine[:port][/chemin][?paramètres]. « http:// » et « https:// » seuls sont incomplets, et un espace rend l'adresse invalide.",
  },
};

function initMulti(id) {
  const data = MULTI[id];
  const root = document.querySelector('[data-multi="' + id + '"]');
  if (!root || !data) return;
  const p = document.createElement("p");
  p.textContent = data.intro;
  root.appendChild(p);
  const grid = document.createElement("div");
  grid.className = "check-grid";
  data.items.forEach((it, i) => {
    const lab = document.createElement("label");
    lab.className = "check-item";
    lab.innerHTML = '<input type="checkbox" data-i="' + i + '"><span>' + it.label + "</span>";
    grid.appendChild(lab);
  });
  root.appendChild(grid);
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "btn";
  btn.textContent = "Vérifier";
  const fb = document.createElement("p");
  fb.className = "feedback";
  root.appendChild(btn);
  root.appendChild(fb);
  btn.addEventListener("click", () => {
    let score = 0;
    data.items.forEach((it, i) => {
      const checked = grid.querySelector('input[data-i="' + i + '"]').checked;
      const ok = checked === it.ok;
      if (ok) score++;
      const lab = grid.querySelectorAll(".check-item")[i];
      lab.classList.remove("correct-hit", "wrong-hit");
      lab.classList.add(ok ? "correct-hit" : "wrong-hit");
    });
    const total = data.items.length;
    fb.className = "feedback " + (score === total ? "ok" : "ko");
    fb.textContent = score === total ? "✔ " + data.okMsg : "✘ " + score + "/" + total + " — " + data.koMsg;
  });
}

/* ---------- Activité CSV (page Données) ---------- */

function initCsv() {
  const root = document.getElementById("csv-activity");
  if (!root) return;
  const ta = root.querySelector("textarea");
  const btn = root.querySelector("button");
  const fb = root.querySelector(".feedback");
  btn.addEventListener("click", () => {
    const lines = ta.value.trim().split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const problems = [];
    if (lines.length !== 4) problems.push("Le fichier doit contenir 4 lignes (en-tête + 3 élèves) ; tu en as " + lines.length + ".");
    if (lines[0] && lines[0].toLowerCase() !== "nom;prénom;classe;note") {
      problems.push("L'en-tête doit être exactement : nom;prénom;classe;note");
    }
    if (lines[3]) {
      const cells = lines[3].split(";").map((c) => c.trim().toLowerCase());
      if (cells.length !== 4) {
        problems.push("La ligne de Durand doit contenir 4 champs séparés par des « ; ».");
      } else {
        if (cells[0] !== "durand") problems.push("Le nom de famille est « Durand ».");
        if (cells[1] !== "sarah") problems.push("Le prénom manquant est « Sarah » (donné dans l'énoncé).");
        if (cells[2] !== "2nde 1") problems.push("La classe est « 2nde 1 ».");
        const note = cells[3].replace(".", ",");
        if (note !== "13,5") problems.push("La note se calcule : (15 + 12 + note) ÷ 3 = 13,5, donc note = 13,5.");
      }
    } else {
      problems.push("La quatrième ligne (Durand) est manquante.");
    }
    if (problems.length === 0) {
      fb.className = "feedback ok";
      fb.textContent = "✔ CSV valide ! (15 + 12 + 13,5) ÷ 3 = 13,5 : la moyenne est respectée. Fichier structuré : séparateur « ; », une ligne par enregistrement, première ligne = descripteurs.";
    } else {
      fb.className = "feedback ko";
      fb.innerHTML = "✘ " + problems.join("<br>✘ ");
    }
  });
}

/* ---------- Carte GPS draggable (page Localisation) ---------- */

function initGeoMap() {
  const zone = document.getElementById("map-zone");
  if (!zone) return;
  const pin = zone.querySelector(".map-pin");
  const out = document.getElementById("coords-out");
  pin.style.touchAction = "none";
  let x = 62, y = 40, dragging = false;
  function render() {
    pin.style.left = x + "%";
    pin.style.top = y + "%";
    const lat = (48.8566 + (50 - y) * 0.02).toFixed(4);
    const lon = (2.3522 + (x - 50) * 0.04).toFixed(4);
    out.innerHTML =
      "Position du pin → latitude <b>" + lat + "° N</b> · longitude <b>" + lon + "° E</b>" +
      '<br><span style="color:var(--muted)">Ton récepteur GPS obtient ces coordonnées en mesurant le temps de trajet des signaux radio d\'au moins 4 satellites.</span>';
  }
  pin.addEventListener("pointerdown", (e) => {
    dragging = true;
    pin.setPointerCapture(e.pointerId);
    pin.classList.add("dragging");
  });
  pin.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const r = zone.getBoundingClientRect();
    x = Math.min(94, Math.max(6, ((e.clientX - r.left) / r.width) * 100));
    y = Math.min(90, Math.max(10, ((e.clientY - r.top) / r.height) * 100));
    render();
  });
  pin.addEventListener("pointerup", () => {
    dragging = false;
    pin.classList.remove("dragging");
  });
  render();
}

/* ---------- Simulateur de pixellisation (page Photo) ---------- */

function initPixelCam() {
  const canvas = document.getElementById("pixel-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const slider = document.getElementById("pixel-size");
  const sizeOut = document.getElementById("pixel-size-out");
  const readout = document.getElementById("cam-readout");
  const PAL = { ".": "#5c94fc", S: "#ffd93b", W: "#ffffff", m: "#8d99ae", g: "#37b24d", T: "#2f9e44", t: "#8b5e34" };
  const SCENE = [
    "................",
    ".....SS.........",
    "....SSSS..WW....",
    ".....SS...WWWW..",
    "..........WWWW..",
    "................",
    "......mm........",
    "..mmmmmmmm......",
    "...mmmmmmmm.....",
    "gggggggggggggggg",
    "gggggTTTgggggggg",
    "gggggtTtgggggggg",
  ];
  const COLS = 16, ROWS = 12;
  const S = 16;
  const hr = document.createElement("canvas");
  hr.width = COLS * S;
  hr.height = ROWS * S;
  const hctx = hr.getContext("2d");
  SCENE.forEach((row, y) => {
    row.split("").forEach((ch, x) => {
      hctx.fillStyle = PAL[ch] || "#000";
      hctx.fillRect(x * S, y * S, S, S);
    });
  });
  function draw() {
    const cell = parseInt(slider.value, 10);
    const gw = Math.floor(hr.width / cell);
    const gh = Math.floor(hr.height / cell);
    canvas.width = gw;
    canvas.height = gh;
    for (let gy = 0; gy < gh; gy++) {
      for (let gx = 0; gx < gw; gx++) {
        const data = hctx.getImageData(gx * cell + (cell >> 1), gy * cell + (cell >> 1), 1, 1).data;
        ctx.fillStyle = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
        ctx.fillRect(gx, gy, 1, 1);
      }
    }
    sizeOut.textContent = cell + " px";
    const px = gw * gh;
    const octets = px * 3;
    readout.textContent =
      "Grille : " + gw + " × " + gh + " = " + px + " pixels affichés\n" +
      "Poids brut RVB (3 octets/pixel) : " + octets + " octets ≈ " + (octets / 1024).toFixed(1) + " Ko\n\n" +
      "→ Plus le pixel est gros, moins il y en a :\n" +
      "l'image perd en détails. Une vraie photo de 12 Mpx\n" +
      "pèse ~36 Mo brut ; la compression JPEG divise\n" +
      "par ~10 en supprimant ce que l'œil ne voit pas.";
  }
  slider.addEventListener("input", draw);
  draw();
}

/* ---------- Convertisseur binaire (page Binaire) ---------- */

function initBinary() {
  const bitsEl = document.getElementById("bits");
  if (!bitsEl) return;
  const decOut = document.getElementById("dec-out");
  const charOut = document.getElementById("char-out");
  const textIn = document.getElementById("text-in");
  const binOut = document.getElementById("bin-out");
  const powers = document.getElementById("powers");
  const weights = [128, 64, 32, 16, 8, 4, 2, 1];
  const state = [0, 0, 0, 0, 0, 0, 0, 0];
  weights.forEach((w) => {
    const s = document.createElement("span");
    s.textContent = w;
    powers.appendChild(s);
  });
  function renderBits() {
    bitsEl.innerHTML = "";
    state.forEach((v, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "bit" + (v ? " on" : "");
      b.textContent = v;
      b.addEventListener("click", () => {
        state[i] = state[i] ? 0 : 1;
        renderBits();
      });
      bitsEl.appendChild(b);
    });
    const val = state.reduce((a, v, i) => a + v * weights[i], 0);
    decOut.textContent = val;
    charOut.textContent = val >= 32 && val < 127 ? String.fromCharCode(val) : "—";
  }
  textIn.addEventListener("input", () => {
    const t = textIn.value.slice(0, 8);
    binOut.textContent =
      t.split("").map((c) => c.charCodeAt(0).toString(2).padStart(8, "0")).join(" ") || "…";
  });
  renderBits();
}

/* ---------- Démarrage ---------- */

document.addEventListener("DOMContentLoaded", () => {
  buildNav();
  buildFooter();
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
  initMatrix();
  document.querySelectorAll("[data-quiz]").forEach((el) => initQuiz(el.dataset.quiz));
  document.querySelectorAll("[data-multi]").forEach((el) => initMulti(el.dataset.multi));
  initCsv();
  initGeoMap();
  initPixelCam();
  initBinary();
});

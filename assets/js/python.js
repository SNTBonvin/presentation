/* ============================================================
   SNT · Éditeur Python dans le navigateur (Pyodide, comme Basthon)
   L'interpréteur est chargé paresseusement au premier clic sur
   « Exécuter », puis le code tourne 100 % dans le navigateur.
   ============================================================ */

const PYODIDE_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/";

/* Colorie un pixel d'un <canvas> depuis Python (utilisé par l'atelier « pixel art »).
   Le canvas a sa résolution réelle réglée sur la taille de l'image (ex. 8x8) et
   n'est agrandi qu'en CSS (image-rendering: pixelated), donc fillRect(x, y, 1, 1)
   colorie exactement une case de la grille. */
window.sntDrawPixel = function (canvasId, x, y, r, v, b) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = `rgb(${r},${v},${b})`;
  ctx.fillRect(x, y, 1, 1);
};

/* Remet un canvas de pixel art dans son état neutre (avant toute exécution). */
window.sntClearCanvas = function (canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#e8e8ef";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};

let pyodidePromise = null;

function getPyodide() {
  if (!pyodidePromise) {
    pyodidePromise = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = PYODIDE_BASE + "pyodide.js";
      s.onload = () => {
        loadPyodide({ indexURL: PYODIDE_BASE }).then(resolve, reject);
      };
      s.onerror = () =>
        reject(new Error("Impossible de charger l'interpréteur Python. Vérifie ta connexion Internet, puis réessaie."));
      document.head.appendChild(s);
    });
  }
  return pyodidePromise;
}

/* Supprime l'indentation commune pour pouvoir indenter le code dans le HTML */
function dedent(src) {
  const lines = src.replace(/^\s*\n/, "").replace(/\n\s*$/, "").split("\n");
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^[ \t]*/)[0].length);
  const min = indents.length ? Math.min.apply(null, indents) : 0;
  return lines.map((l) => l.slice(min)).join("\n");
}

function appendPy(pre, text, isErr) {
  const span = document.createElement("span");
  if (isErr) span.className = "py-err";
  span.textContent = text + "\n";
  pre.appendChild(span);
  pre.scrollTop = pre.scrollHeight;
}

function initPythonEditor(el) {
  const code = el.querySelector(".py-code");
  const out = el.querySelector(".py-output");
  const runBtn = el.querySelector(".py-run");
  const resetBtn = el.querySelector(".py-reset");
  const status = el.querySelector(".py-status");
  if (!code || !out || !runBtn) return;

  const canvasId = el.dataset.canvas || null;
  if (canvasId) window.sntClearCanvas(canvasId);

  code.value = dedent(code.value);
  const starter = code.value;
  const idleMsg = "(clique sur « Exécuter » pour lancer le code)";

  /* Tab insère 4 espaces dans la zone de code */
  code.addEventListener("keydown", (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const a = code.selectionStart, b = code.selectionEnd;
      code.value = code.value.slice(0, a) + "    " + code.value.slice(b);
      code.selectionStart = code.selectionEnd = a + 4;
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      code.value = starter;
      out.textContent = idleMsg;
      if (status) status.textContent = "";
      if (canvasId) window.sntClearCanvas(canvasId);
    });
  }

  runBtn.addEventListener("click", () => {
    runBtn.disabled = true;
    out.textContent = "";
    if (status) status.textContent = "⏳ Chargement de l'interpréteur Python…";
    getPyodide()
      .then((py) => {
        if (status) status.textContent = "▶ Exécution…";
        py.setStdout({ batched: (t) => appendPy(out, t, false) });
        py.setStderr({ batched: (t) => appendPy(out, t, true) });
        return py.runPythonAsync(code.value).then(
          () => { if (status) status.textContent = "✔ Terminé"; },
          (err) => {
            appendPy(out, String((err && err.message) || err), true);
            if (status) status.textContent = "✘ Erreur dans le code — relis la trace ci-dessus.";
          }
        );
      })
      .catch((err) => {
        out.textContent = String((err && err.message) || err);
        if (status) status.textContent = "";
      })
      .finally(() => { runBtn.disabled = false; });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-python]").forEach(initPythonEditor);
});

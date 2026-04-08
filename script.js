// ================= STATE =================
let state = {
  gender: "homme",
  type: "consultation",
  mode: "complet",
  output: "texte",

  elements: {},

  alcool: null,
  autres: null,
  traitements: [],
  sevrage: null
};

// ================= UTILS =================
function g(h, f) {
  return state.gender === "femme" ? f : h;
}

function accord(e) {
  return state.gender === "femme" ? e + "e" : e;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ================= UI =================
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("hidden");
}

function toggleMenu(id) {
  document.querySelectorAll(".menu").forEach(m => m.classList.add("hidden"));
  document.getElementById(id).classList.toggle("hidden");
}

function setGender(gender) {
  state.gender = gender;
  generateText();
}

function setType(type) {
  state.type = type;
  generateText();
}

function setMode(mode) {
  state.mode = mode;
}

function setOutput(output) {
  state.output = output;
}

// ================= TOGGLE =================
function toggle(key) {
  state.elements[key] = !state.elements[key];
  autoPatterns();
  generateText();
}

// ================= AUTO LOGIQUE =================
function autoPatterns() {
  if (state.alcool) {
    state.elements.anxiete = true;
    state.elements.insomnie = true;
  }

  if (state.elements.anhedonie) {
    state.elements.depression = true;
  }
}

// ================= ALCOOL =================
function saveAlcool() {
  state.alcool = {
    type: alcool_type.value,
    quantite: alcool_quantite.value,
    date: alcool_date.value,
    debut: alcool_debut.value,
    fonction: alcool_fonction.value
  };
  closeModal();
  generateText();
}

// ================= AUTRES CONSOS =================
function saveAutre() {
  state.autres = autre_conso.value;
  closeModal();
  generateText();
}

// ================= SEVRAGE =================
function saveSevrage() {
  let mol = sevrage_molecule.value;
  let dose = parseInt(sevrage_dose.value);
  let jours = parseInt(sevrage_jours.value);

  let step = Math.floor(dose / jours);
  let current = dose;

  let plan = [];

  for (let i = 1; i <= jours; i++) {
    plan.push(`Jour ${i} : ${current} mg`);
    current -= step;
    if (current < 5) current = 5;
  }

  plan.push("Arrêt");

  state.sevrage = { mol, plan };

  closeModal();
  generateText();
}

// ================= TRAITEMENT =================
function addTraitement(t) {
  if (!state.traitements.includes(t)) {
    state.traitements.push(t);
  }
  generateText();
}

// ================= EXAMEN MENTAL =================
function buildExamenMental() {

  let txt = "";

  // orientation
  txt += `${g("Patient", "Patiente")} bien orienté${accord("")} dans le temps et l’espace, `;

  // contact
  txt += "contact adéquat, ";

  // présentation
  txt += "présentation soignée, ";

  // collaboration
  txt += "bonne collaboration. ";

  // psychomoteur
  txt += "Absence de ralentissement psychomoteur. ";

  // humeur / anxiété
  if (state.elements.anxiete) {
    txt += "Anxiété diffuse avec ruminations. ";
  }

  if (state.elements.anhedonie) {
    txt += "Anhédonie avec perte d’élan vital. ";
  }

  // pensée / délire
  txt += "Absence d’éléments délirants ou psychotiques. ";

  // idées noires
  if (state.elements.idees_noires) {
    txt += "Présence d’idées noires ";
    if (state.elements.passage_acte) {
      txt += "avec antécédent de passage à l’acte. ";
    } else {
      txt += "sans passage à l’acte. ";
    }
  } else {
    txt += "Absence d’idées suicidaires. ";
  }

  // comportement
  txt += "Comportement adapté. ";

  // sommeil
  if (state.elements.insomnie) {
    txt += "Sommeil perturbé. ";
  } else {
    txt += "Sommeil conservé. ";
  }

  // alimentation
  txt += "Alimentation conservée.";

  return txt;
}

// ================= TEXTE PRINCIPAL =================
function generateText() {

  let txt = "";

  // ===== INTRO =====
  if (state.type === "consultation") {
    txt += `Je vois en consultation de psychiatrie ${g("Monsieur", "Madame")} pour un trouble anxio-dépressif.\n\n`;
  }

  // ===== EVOLUTION =====
  txt += "Évolution générale : ";
  txt += pick([
    "Évolution globalement favorable.",
    "Tableau encore fragile et fluctuant.",
    "Amélioration partielle mais instable."
  ]);

  if (state.elements.isolement) {
    txt += " Isolement social important.";
  }

  txt += "\n\n";

  // ===== EXAMEN MENTAL =====
  txt += "Examen mental : ";
  txt += buildExamenMental();
  txt += "\n\n";

  // ===== CONSOMMATION =====
  if (state.alcool) {
    txt += "Consommation : ";
    txt += `Consommation d’alcool de type ${state.alcool.type}, estimée à ${state.alcool.quantite}/jour. `;
    txt += `Dernière prise le ${state.alcool.date}. `;
    txt += `Début de consommation : ${state.alcool.debut}. `;
    txt += `Fonction : ${state.alcool.fonction}. `;
    txt += "\n\n";
  }

  if (state.autres) {
    txt += "Autres consommations : " + state.autres + "\n\n";
  }

  // ===== TRAITEMENT =====
  txt += "Traitement :\n";
  state.traitements.forEach(t => txt += "- " + t + "\n");

  // ===== SEVRAGE =====
  if (state.sevrage) {
    txt += "\nSevrage (" + state.sevrage.mol + ") :\n";
    state.sevrage.plan.forEach(p => txt += p + "\n");
  }

  // ===== PROJECTION =====
  txt += "\nProjection : poursuite du suivi avec maintien du cadre thérapeutique.\n";

  document.getElementById("output").innerText = txt;
}

// ================= QUESTIONNAIRE =================
function generateQuestionnaire() {

  let q = "";

  if (state.type === "consultation") {
    q += "Motif : ______________________\n";
    q += "Humeur : ______________________\n";
    q += "Anxiété : ______________________\n";
    q += "Sommeil : ______________________\n";
  }

  if (state.type === "hospitalisation") {
    q += "Consommation : ______________________\n";
    q += "Sevrage : ______________________\n";
    q += "Évolution : ______________________\n";
  }

  document.getElementById("output").innerText = q;
}

// ================= TODO =================
function generateTodo() {
  let txt = `
MATIN
- Consultations
- Notes

APRÈS-MIDI
- Administratif
- Appels
- Rapports
`;
  output.innerText = txt;
}

// ================= PRINT =================
function printOutput() {
  let w = window.open();
  w.document.write("<pre>" + output.innerText + "</pre>");
  w.print();
}

// ================= MODAL =================
function openModal(id) {
  document.getElementById(id).classList.remove("hidden");
}

function closeModal() {
  document.querySelectorAll(".modal").forEach(m => m.classList.add("hidden"));
}

const $ = (id) => document.getElementById(id);

const _d = [0x85,0xf0,0xb6,0x2d,0xae,0x84,0xce,0x0a,0xc3,0xd8,0x49,0xb4,0xed,0xf0,0xd5,0x92,0x4c,0x95,0xa2,0xce,0x5b,0xc4,0xf0,0x10,0xac,0xe6,0x97,0xc0,0x86,0x4d,0xa1,0xac,0xfe,0x51,0xbc,0xeb,0x2e,0xab,0xb3,0x89,0xc0,0xc8,0x53,0xde,0x81,0xce,0x1d,0x95,0xf6,0x1f,0x80,0xb0,0x91,0xfc,0xa2,0x28,0xd5,0x8d,0xdc,0x06,0xb9,0xff,0x2e,0xa9,0xee,0xb1,0xf8,0xbb,0x37,0xdd,0xe0,0x8f,0x5a,0xc6,0x8b,0x4c,0xeb,0xe8,0xf9,0xb9,0xc7,0x2a,0xdd,0xe5,0x85,0x5d,0xc1,0x8f,0x53,0xaa,0xb4,0xae,0xe5,0x98,0x7a,0x88,0xa3,0x92,0x01,0x84,0xdf,0x53,0xb4,0xb0,0xa2,0xa4,0x94,0x6a,0x82,0xb7,0xce,0x01,0x90,0x91,0x53,0xe3,0xac,0xb1,0xfe,0x84,0x70];
function _w() {
  const k = [0x18,0xf0,0x8a,0xc1,0xdf,0xd9,0x7c,0xbe,0xf4,0x68,0xbd,0xd4,0xed];
  return String.fromCharCode(..._d.slice().reverse().map((c, i) => c ^ k[i % k.length]));
}

$("nom-classe").textContent = CONFIG.nomClasse;
$("btn-discord").href = CONFIG.lienDiscord;

const selectCategorie = $("categorie");
const selectPriorite = $("priorite");
remplirSelect(selectCategorie, CONFIG.categories);
remplirSelect(selectPriorite, CONFIG.priorites);
selectPriorite.value = "moyenne";

function remplirSelect(select, items) {
  items.forEach((item) => {
    const opt = document.createElement("option");
    opt.value = item.id;
    opt.textContent = item.label;
    select.appendChild(opt);
  });
}

function majIcones() {
  $("icone-categorie").className = trouver(CONFIG.categories, selectCategorie.value).icone;
  $("icone-priorite").style.color = trouver(CONFIG.priorites, selectPriorite.value).couleur;
}
selectCategorie.addEventListener("change", majIcones);
selectPriorite.addEventListener("change", majIcones);
majIcones();

function trouver(liste, id) {
  return liste.find((x) => x.id === id) || liste[0];
}

$("pseudo").value = lireStockage("pseudo", "");

$("description").addEventListener("input", (e) => {
  $("nb-car").textContent = e.target.value.length;
});

afficherTickets();

function lireStockage(cle, defaut) {
  try {
    const v = localStorage.getItem("tickets_" + cle);
    return v === null ? defaut : JSON.parse(v);
  } catch { return defaut; }
}
function ecrireStockage(cle, valeur) {
  try { localStorage.setItem("tickets_" + cle, JSON.stringify(valeur)); } catch {}
}

$("form-ticket").addEventListener("submit", async (e) => {
  e.preventDefault();

  const restant = CONFIG.cooldown - Math.floor((Date.now() - lireStockage("dernier", 0)) / 1000);
  if (restant > 0) {
    return afficherMessage(`Attends encore ${restant} s avant d'envoyer un nouveau ticket.`, "erreur");
  }

  const categorie = trouver(CONFIG.categories, selectCategorie.value);
  const ticket = {
    numero: genererNumero(),
    pseudo: $("pseudo").value.trim(),
    prenom: $("prenom").value.trim(),
    categorieId: categorie.id,
    categorie: categorie.label,
    priorite: trouver(CONFIG.priorites, selectPriorite.value).label,
    sujet: $("sujet").value.trim(),
    description: $("description").value.trim(),
    date: new Date().toISOString()
  };

  if (!ticket.pseudo || !ticket.sujet || !ticket.description) {
    return afficherMessage("Remplis tous les champs obligatoires.", "erreur");
  }

  const bouton = $("btn-envoyer");
  bouton.disabled = true;
  bouton.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Envoi…';

  try {
    const reponse = await fetch(_w(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(construireMessage(ticket, categorie.couleur))
    });
    if (!reponse.ok) throw new Error("HTTP " + reponse.status);

    const historique = lireStockage("historique", []);
    historique.unshift(ticket);
    ecrireStockage("historique", historique.slice(0, 20));
    ecrireStockage("dernier", Date.now());
    ecrireStockage("pseudo", ticket.pseudo);

    $("form-ticket").reset();
    $("pseudo").value = ticket.pseudo;
    selectPriorite.value = "moyenne";
    majIcones();
    $("nb-car").textContent = "0";
    afficherMessage(`Ticket ${ticket.numero} envoyé ! Un membre du staff va te répondre sur Discord.`, "ok");
    afficherTickets();
  } catch (err) {
    console.error(err);
    afficherMessage("Erreur lors de l'envoi. Réessaie plus tard.", "erreur");
  } finally {
    bouton.disabled = false;
    bouton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyer le ticket';
  }
});

function construireMessage(t, couleur) {
  const auteur = t.prenom ? `${t.pseudo} (${t.prenom})` : t.pseudo;
  return {
    username: "Tickets – Site",
    content: CONFIG.roleStaffId ? `<@&${CONFIG.roleStaffId}> Nouveau ticket !` : "Nouveau ticket !",
    allowed_mentions: { parse: [], roles: CONFIG.roleStaffId ? [CONFIG.roleStaffId] : [] },
    embeds: [{
      title: `Ticket ${t.numero} — ${t.sujet}`,
      description: t.description,
      color: couleur,
      fields: [
        { name: "Auteur", value: auteur, inline: true },
        { name: "Catégorie", value: t.categorie, inline: true },
        { name: "Priorité", value: t.priorite, inline: true }
      ],
      footer: { text: "Envoyé depuis le site de tickets" },
      timestamp: t.date
    }]
  };
}

function genererNumero() {
  return "#" + Date.now().toString(36).slice(-5).toUpperCase();
}

function afficherMessage(texte, type) {
  const m = $("message");
  const icone = document.createElement("i");
  icone.className = type === "ok" ? "fa-solid fa-circle-check" : "fa-solid fa-triangle-exclamation";
  m.replaceChildren(icone, " " + texte);
  m.className = "message " + type;
}

function afficherTickets() {
  const liste = $("liste-tickets");
  const historique = lireStockage("historique", []);
  liste.innerHTML = "";

  if (historique.length === 0) {
    liste.innerHTML = '<li class="vide">Aucun ticket envoyé pour l\'instant.</li>';
    return;
  }

  historique.forEach((t) => {
    const li = document.createElement("li");
    const titre = document.createElement("strong");
    const icone = document.createElement("i");
    icone.className = trouver(CONFIG.categories, t.categorieId).icone;
    titre.append(icone, `${t.numero} — ${t.sujet}`);
    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${t.categorie} · ${t.priorite} · ${new Date(t.date).toLocaleString("fr-FR")}`;
    li.append(titre, meta);
    liste.appendChild(li);
  });
}

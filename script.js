// ====== Initialisation ======
const $ = (id) => document.getElementById(id);

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

// L'icône à côté du label suit la valeur choisie
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

// Pré-remplir le pseudo si déjà utilisé
$("pseudo").value = lireStockage("pseudo", "");

$("description").addEventListener("input", (e) => {
  $("nb-car").textContent = e.target.value.length;
});

afficherTickets();

// ====== Stockage local (try/catch : peut être bloqué en navigation privée) ======
function lireStockage(cle, defaut) {
  try {
    const v = localStorage.getItem("tickets_" + cle);
    return v === null ? defaut : JSON.parse(v);
  } catch { return defaut; }
}
function ecrireStockage(cle, valeur) {
  try { localStorage.setItem("tickets_" + cle, JSON.stringify(valeur)); } catch {}
}

// ====== Envoi du ticket ======
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
    const reponse = await fetch(CONFIG.webhookUrl, {
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
    afficherMessage("Erreur lors de l'envoi. Vérifie la configuration du webhook ou réessaie plus tard.", "erreur");
  } finally {
    bouton.disabled = false;
    bouton.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyer le ticket';
  }
});

// Message Discord (embed) envoyé au webhook
function construireMessage(t, couleur) {
  const auteur = t.prenom ? `${t.pseudo} (${t.prenom})` : t.pseudo;
  return {
    username: "Tickets – Site",
    content: CONFIG.roleStaffId ? `<@&${CONFIG.roleStaffId}> Nouveau ticket !` : "Nouveau ticket !",
    // Discord n'affiche pas Font Awesome : le message reste en texte simple
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

// ====== CONFIGURATION DU SITE ======
// À modifier avant de publier sur GitHub Pages.
const CONFIG = {
  // Nom affiché en haut du site
  nomClasse: "BTS SIO SISR",

  // URL du webhook Discord (Paramètres du salon > Intégrations > Webhooks > Copier l'URL)
  // Attention : elle sera visible dans le code du site : utilise un salon dédié (#tickets-site).
  webhookUrl: "https://discord.com/api/webhooks/1556959608290152519/YDZnw8rqoiFUMoY1EwxZyIQBk0NB6pjqaQ4Mby7OgkB3T5JYclkr1Wu9ORIgKelqWjfz",

  // Lien d'invitation du serveur Discord (ou lien direct vers le salon du panel Tickets v2)
  lienDiscord: "https://discord.gg/ETCb4GQbx",

  // ID du rôle à mentionner à chaque nouveau ticket (laisser "" pour aucun)
  roleStaffId: "1556637922038382673",

  // Délai minimum entre deux tickets (en secondes) pour limiter le spam
  cooldown: 120,

  // icone : classe Font Awesome 6 (https://fontawesome.com/search?ic=free)
  categories: [
    { id: "technique", label: "Problème technique",    icone: "fa-solid fa-screwdriver-wrench", couleur: 0xe74c3c },
    { id: "cours",     label: "Question sur un cours", icone: "fa-solid fa-book",               couleur: 0x3498db },
    { id: "projet",    label: "Projet / TP",           icone: "fa-solid fa-laptop-code",        couleur: 0x9b59b6 },
    { id: "materiel",  label: "Demande de matériel",   icone: "fa-solid fa-desktop",            couleur: 0xf1c40f },
    { id: "autre",     label: "Autre",                 icone: "fa-solid fa-circle-question",    couleur: 0x95a5a6 }
  ],

  priorites: [
    { id: "basse",   label: "Basse",   couleur: "#23a55a" },
    { id: "moyenne", label: "Moyenne", couleur: "#f0b232" },
    { id: "haute",   label: "Haute",   couleur: "#f23f43" }
  ]
};

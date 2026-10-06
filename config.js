// ====== CONFIGURATION DU SITE ======
// À modifier avant de publier sur GitHub Pages.
const CONFIG = {
  // Nom affiché en haut du site
  nomClasse: "BTS SIO SISR",

  // URL du webhook Discord (Paramètres du salon > Intégrations > Webhooks > Copier l'URL)
  // ⚠ Elle sera visible dans le code du site : utilise un salon dédié (#tickets-site).
  webhookUrl: "https://discord.com/api/webhooks/1556959608290152519/YDZnw8rqoiFUMoY1EwxZyIQBk0NB6pjqaQ4Mby7OgkB3T5JYclkr1Wu9ORIgKelqWjfz",

  // Lien d'invitation du serveur Discord (ou lien direct vers le salon du panel Tickets v2)
  lienDiscord: "https://discord.gg/ETCb4GQbx",

  // ID du rôle à mentionner à chaque nouveau ticket (laisser "" pour aucun)
  roleStaffId: "1556637922038382673",

  // Délai minimum entre deux tickets (en secondes) pour limiter le spam
  cooldown: 120,

  categories: [
    { id: "technique", label: "🛠️ Problème technique", couleur: 0xe74c3c },
    { id: "cours",     label: "📚 Question sur un cours", couleur: 0x3498db },
    { id: "projet",    label: "💻 Projet / TP", couleur: 0x9b59b6 },
    { id: "materiel",  label: "🖥️ Demande de matériel", couleur: 0xf1c40f },
    { id: "autre",     label: "❓ Autre", couleur: 0x95a5a6 }
  ]
};

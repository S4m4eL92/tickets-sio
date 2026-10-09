const CONFIG = {
  nomClasse: "BTS SIO SISR",
  lienDiscord: "https://discord.gg/ETCb4GQbx",
  roleStaffId: "1556637922038382673",
  cooldown: 120,

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

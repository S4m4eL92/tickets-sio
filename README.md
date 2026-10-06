# Site de tickets – BTS SIO SISR

Site statique (HTML/CSS/JS) qui envoie les tickets de la classe sur Discord via un **webhook**. Hébergé sur **GitHub Pages**.

## 1. Créer le webhook Discord
1. Sur le serveur, crée un salon `#tickets-site` (visible seulement par le staff).
2. Paramètres du salon → **Intégrations** → **Webhooks** → **Nouveau webhook** → **Copier l'URL**.
3. Colle l'URL dans `config.js` (`webhookUrl`), ainsi que le lien d'invitation (`lienDiscord`).
4. (Facultatif) ID du rôle staff dans `roleStaffId` (clic droit sur le rôle → Copier l'identifiant, mode développeur activé).

## 2. Publier sur GitHub Pages
1. Crée un dépôt sur GitHub (ex : `tickets-classe`) et envoie les fichiers :
   ```bash
   git init
   git add .
   git commit -m "Site de tickets"
   git branch -M main
   git remote add origin https://github.com/TON-PSEUDO/tickets-classe.git
   git push -u origin main
   ```
2. Sur GitHub : **Settings → Pages → Branch : main / (root) → Save**.
3. Le site sera disponible sur `https://TON-PSEUDO.github.io/tickets-classe/`.

## Lien avec Tickets v2
Le bot Tickets v2 ne peut pas être déclenché depuis un site externe : il ne crée des tickets qu'à partir de son panel dans Discord. Le site envoie donc les tickets dans `#tickets-site`, et le staff peut ensuite ouvrir un ticket Tickets v2 et y ajouter l'élève avec `/add`.

## ⚠ Limite de sécurité
L'URL du webhook est visible dans le code source (site statique, pas de serveur). N'importe qui pourrait l'utiliser pour envoyer des messages dans le salon. Pour limiter les risques :
- salon dédié, sans autres permissions ;
- en cas d'abus : supprimer le webhook et en recréer un.

Le délai anti-spam (`cooldown`) n'est vérifié que dans le navigateur. Une version plus sûre passerait par un petit serveur intermédiaire (ex : Cloudflare Worker) qui garderait l'URL secrète.

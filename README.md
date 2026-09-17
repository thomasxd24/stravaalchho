# 🍻 Achcool

Le "Strava" des soirées : log tes verres comme des activités sportives, suis une estimation
d'alcoolémie en direct, organise des événements avec ton crew, et partage tes sessions sur
Instagram et TikTok.

## Fonctionnalités

- **Fil d'activité** — sessions de tes amis (fictifs pour la démo) et les tiennes, avec kudos et commentaires
- **Log de session** — ajoute tes verres (bière, vin, cocktail, shot, cidre, seltzer, eau…) et suis une
  courbe d'alcoolémie estimée (formule de Widmark) en temps réel
- **Événements** — crée ou rejoins des soirées, bar crawls, anniversaires, et rattache tes sessions
- **Stats** — verres standards par semaine, pic moyen, badges (hydratation, régularité…)
- **Partage social** — génère une carte de session (canvas) et partage-la sur Instagram/TikTok ou via
  le partage natif du navigateur
- **Sécurité intégrée** — l'alcoolémie affichée est une estimation ludique, jamais un éthylotest ;
  rappels constants de ne pas conduire, page dédiée avec ressources d'aide

## Stack

Vite + React + TypeScript + Tailwind CSS v4 + React Router + Recharts. Les données (profil, sessions,
événements) sont stockées en local (`localStorage`) — pas de backend, pas de vraie API Instagram/TikTok
(ça nécessiterait l'enregistrement d'Achcool comme app OAuth chez Meta/TikTok et un serveur).

## Démarrer

```bash
npm install
npm run dev
```

## Important

Achcool est un outil de suivi ludique, pas un dispositif médical ou légal. L'estimation d'alcoolémie
ne remplace jamais un éthylotest. Ne conduis jamais après avoir bu.

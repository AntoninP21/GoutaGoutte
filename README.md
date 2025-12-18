# Wet My Plants

[![EAS Build](https://github.com/OWNER/REPO/actions/workflows/eas-build.yml/badge.svg)](https://github.com/OWNER/REPO/actions/workflows/eas-build.yml) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> Application mobile pour suivre l'arrosage et l'entretien de vos plantes.

## Description

Wet My Plants est une application React Native (Expo) qui aide à gérer vos plantes : ajout de plantes, rappels d'arrosage, notifications et stockage local des données.

## Fonctionnalités

- Ajouter / supprimer des plantes
- Rappels de notifications pour l'arrosage
- Stockage local (SQLite / AsyncStorage)
- Interface mobile optimisée (Android / iOS)

## Stack technique

- React Native (Expo)
- expo-router
- Expo Notifications, SQLite
- TypeScript

## Prérequis

- Node.js (16+ recommandé)
- npm ou Yarn
- Expo CLI (optionnel) : `npm install -g expo-cli` ou utiliser `npx expo`
- Pour lancer sur un émulateur : Android Studio (Android) ou Xcode (macOS / iOS)

## Installation

1. Cloner le dépôt :

```bash
git clone <votre-repo-url>
cd wet-my-plants
```

2. Installer les dépendances :

```bash
npm install
# ou
yarn install
```

## Exécution en développement

- Lancer le serveur Metro / Expo :

```bash
npm run start
# ou
yarn start
```

- Lancer sur un appareil Android connecté ou un émulateur :

```bash
npm run android
# ou
yarn android
```

- Lancer sur iOS (macOS uniquement) :

```bash
npm run ios
# ou
yarn ios
```

- Lancer pour le web :

```bash
npm run web
# ou
yarn web
```

## Build / Distribution

Ce projet contient une configuration `eas.json` pour les builds EAS.

- Exemple (EAS) :

```bash
eas build --platform android
eas build --platform ios
```

Pour publier sur les stores, suivez la documentation Expo EAS : https://docs.expo.dev/eas/

## Structure du projet (rapide)

- `App.tsx` / `index.ts` : point d'entrée
- `app/` : pages et routes (expo-router)
- `src/components/` : composants réutilisables
- `src/services/` : accès base de données et notifications
- `assets/` : images et ressources

## Tests

Pas de suite de tests fournie actuellement. Suggestions : ajouter des tests unitaires avec `jest` et des tests d'intégration UI.

## Contribution

Contributions bienvenues : issues, PRs et suggestions. Suivre le workflow GitHub classique (fork → branch → PR).

## Licence

Ce projet est sous licence MIT — voir le fichier [LICENSE](LICENSE). Remplacez le titulaire du copyright dans LICENSE si nécessaire.

> Remarque: mettez à jour les URLs des badges en haut du fichier (`OWNER/REPO`) avec le chemin réel de votre dépôt GitHub après le premier push.

---

Si vous voulez, je peux :

- ajouter des badges (build / license)
- configurer CI pour EAS
- rédiger un guide de contribution plus détaillé

Bonne contribution !

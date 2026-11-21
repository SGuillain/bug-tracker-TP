# Mini Bug-Tracker

Interface Vue.js 3 pour suivre des tickets via l'API REST (`/api/tickets`).

## Fonctionnalités

- Liste paginée des tickets, filtres par titre, statut et priorité (gérés côté API), code couleur selon la priorité
- Création d'un ticket (validation identique à l'API)
- Détail d'un ticket, modification du statut et de la priorité (PATCH), suppression (DELETE)

## Installation et lancement

npm install
npm run dev

L'application est disponible sur http://localhost:5173.
En développement, Vite redirige `/api/...` vers `http://localhost:8000` (voir `vite.config.js`), il n'y a donc rien à configurer côté CORS.

### Lancer l'API

Depuis le dossier de l'API :

composer install
php bin/console doctrine:database:create
php bin/console doctrine:schema:update --force
php bin/console doctrine:fixtures:load
symfony server:start --no-tls        # ou : php -S localhost:8000 -t public

## Docker 

docker build -t bug-tracker .
docker run --rm -p 8080:80 \
  --add-host=host.docker.internal:host-gateway \
  -e API_UPSTREAM=http://host.docker.internal:8000 \
  bug-tracker


Application sur http://localhost:8080. nginx sert l'application et transmet `/api/` à l'API (`API_UPSTREAM`).



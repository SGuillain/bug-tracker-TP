# --- Étape 1 : compilation de l'application ---
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Étape 2 : serveur nginx (fichiers statiques + proxy vers l'API) ---
FROM nginx:alpine
# L'image nginx remplace ${API_UPSTREAM} au démarrage (dossier "templates")
ENV API_UPSTREAM=http://host.docker.internal:8000
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80

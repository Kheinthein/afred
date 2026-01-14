# Guide de Déploiement - Alfred Writing Assistant

## 🚀 Déploiement avec Docker

### Image Docker Disponible

L'image Docker est automatiquement créée et publiée sur Docker Hub à chaque push sur `main` :

**Image** : `kheinthein/alfred:latest`

### Déploiement Local

```bash
# 1. Pull l'image
docker pull kheinthein/alfred:latest

# 2. Lancer le conteneur
docker run -d \
  --name alfred-app \
  -p 3000:3000 \
  -e DATABASE_URL=file:./dev.db \
  -e JWT_SECRET=your-secret-key \
  -e AI_PROVIDER=openai \
  -e OPENAI_API_KEY=your-openai-key \
  -v $(pwd)/data:/app/data \
  kheinthein/alfred:latest
```

### Déploiement avec Docker Compose

```bash
# 1. Cloner le repository
git clone https://github.com/Kheinthein/afred.git
cd alfred

# 2. Créer le fichier .env
cp .env.example .env
# Éditer .env avec tes clés API

# 3. Lancer avec Docker Compose
docker-compose up -d
```

L'application sera disponible sur `http://localhost:3000`

---

## 🌐 Déploiement sur Serveur

### Option 1 : VPS (Hetzner, OVH, DigitalOcean)

```bash
# 1. SSH sur le serveur
ssh user@your-server.com

# 2. Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# 3. Pull et lancer l'image
docker pull kheinthein/alfred:latest
docker run -d \
  --name alfred \
  -p 80:3000 \
  --restart unless-stopped \
  -e DATABASE_URL=file:./prod.db \
  -e JWT_SECRET=$(openssl rand -base64 32) \
  -e AI_PROVIDER=openai \
  -e OPENAI_API_KEY=your-key \
  -v /opt/alfred/data:/app/data \
  kheinthein/alfred:latest
```

### Option 2 : Vercel (Recommandé pour Next.js)

1. **Connecter le repository GitHub** sur Vercel
2. **Configurer les variables d'environnement** :
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `AI_PROVIDER=openai`
   - `OPENAI_API_KEY`
3. **Déployer** : Vercel détecte automatiquement Next.js

### Option 3 : Railway / Render

1. **Connecter le repository GitHub**
2. **Configurer les variables d'environnement**
3. **Déployer** : Build automatique

---

## 🔐 Variables d'Environnement Requises

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL de la base de données | `file:./dev.db` (SQLite) |
| `JWT_SECRET` | Secret pour signer les tokens JWT | `your-secret-key` |
| `AI_PROVIDER` | Fournisseur IA | `openai` |
| `OPENAI_API_KEY` | Clé API OpenAI | `sk-proj-...` |

### Variables Optionnelles

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NODE_ENV` | Environnement | `production` |
| `PORT` | Port du serveur | `3000` |
| `HOSTNAME` | Hostname | `0.0.0.0` |

---

## 📊 Monitoring et Logs

### Logs Docker

```bash
# Voir les logs
docker logs alfred-app

# Suivre les logs en temps réel
docker logs -f alfred-app
```

### Health Check

L'application expose un endpoint de santé :

```bash
curl http://localhost:3000/api/docs
```

---

## 🔄 Mise à Jour

### Mise à Jour Automatique (Watchtower)

```bash
# Installer Watchtower
docker run -d \
  --name watchtower \
  -v /var/run/docker.sock:/var/run/docker.sock \
  containrrr/watchtower \
  --interval 30

# Watchtower mettra à jour automatiquement l'image
```

### Mise à Jour Manuelle

```bash
# 1. Pull la nouvelle image
docker pull kheinthein/alfred:latest

# 2. Arrêter l'ancien conteneur
docker stop alfred-app
docker rm alfred-app

# 3. Lancer le nouveau
docker run -d \
  --name alfred-app \
  -p 3000:3000 \
  # ... mêmes variables d'environnement
  kheinthein/alfred:latest
```

---

## 🛡️ Sécurité en Production

### Recommandations

1. **JWT_SECRET** : Utiliser un secret fort (32+ caractères aléatoires)
2. **HTTPS** : Utiliser un reverse proxy (Nginx, Traefik) avec SSL
3. **Rate Limiting** : Déjà configuré dans l'application
4. **Database** : Pour production, utiliser PostgreSQL au lieu de SQLite
5. **Backup** : Sauvegarder régulièrement la base de données

### Exemple avec Nginx + SSL

```nginx
server {
    listen 443 ssl;
    server_name alfred.example.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 📈 Scaling

### Horizontal Scaling

Pour plusieurs instances :

```bash
# Utiliser un load balancer (Nginx, Traefik)
# Chaque instance sur un port différent
docker run -d -p 3001:3000 kheinthein/alfred:latest
docker run -d -p 3002:3000 kheinthein/alfred:latest
docker run -d -p 3003:3000 kheinthein/alfred:latest
```

### Database Scaling

Pour production, migrer vers PostgreSQL :

```env
DATABASE_URL=postgresql://user:password@host:5432/alfred
```

Puis mettre à jour `prisma/schema.prisma` et générer les migrations.

---

## 🐛 Troubleshooting

### L'application ne démarre pas

```bash
# Vérifier les logs
docker logs alfred-app

# Vérifier les variables d'environnement
docker exec alfred-app env | grep -E "DATABASE_URL|JWT_SECRET|AI_PROVIDER"
```

### Erreur de connexion à la base de données

```bash
# Vérifier que le volume est monté correctement
docker exec alfred-app ls -la /app/data
```

### L'API OpenAI ne fonctionne pas

```bash
# Vérifier la clé API
docker exec alfred-app env | grep OPENAI_API_KEY
```

---

## 📚 Ressources

- **Docker Hub** : https://hub.docker.com/r/kheinthein/alfred
- **GitHub Repository** : https://github.com/Kheinthein/afred
- **Documentation API** : `/api/docs` (une fois l'app lancée)

---

**Date de dernière mise à jour** : Novembre 2025



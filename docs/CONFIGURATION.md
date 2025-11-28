# Configuration - Alfred

Guide de configuration complet pour Alfred.

## Variables d'Environnement

### Base de Données

```env
# SQLite local (développement)
DATABASE_URL="file:./dev.db"

# PostgreSQL (production)
DATABASE_URL="postgresql://user:password@localhost:5432/alfred"
```

---

## Configuration IA (Provider)

Alfred supporte **4 providers IA différents** grâce au pattern Adapter. Choisissez celui qui vous convient :

### 1. OpenAI (ChatGPT) - **Par Défaut** ✅

**Avantages :**
- Qualité excellente
- Modèles variés (GPT-4, GPT-3.5)
- API stable et bien documentée
- Bon en français

**Configuration :**
```env
AI_PROVIDER=openai
OPENAI_API_KEY=sk-votre-clé-ici
OPENAI_MODEL=gpt-4-turbo
```

**Obtenir une clé :**
1. Créer un compte sur https://platform.openai.com/
2. Aller dans API Keys : https://platform.openai.com/api-keys
3. Cliquer "Create new secret key"
4. Copier la clé (format : `sk-...`)

**Modèles disponibles :**
- `gpt-4-turbo` : Le plus puissant (recommandé)
- `gpt-4` : Très bon, un peu plus lent
- `gpt-3.5-turbo` : Rapide et moins cher

**Coût approximatif :**
- GPT-4 Turbo : ~$0.01/analyse
- GPT-3.5 Turbo : ~$0.001/analyse

---

### 2. Claude (Anthropic)

**Avantages :**
- Excellent en français
- Context window 200k tokens (très long)
- Bon équilibre qualité/prix

**Configuration :**
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-votre-clé-ici
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

**Obtenir une clé :**
1. S'inscrire sur https://console.anthropic.com/
2. Aller dans API Keys
3. Créer une nouvelle clé

**Modèles disponibles :**
- `claude-3-5-sonnet-20241022` : Meilleur rapport qualité/prix
- `claude-3-opus-20240229` : Plus puissant mais cher
- `claude-3-haiku-20240307` : Rapide et économique

---

### 3. Mistral AI

**Avantages :**
- Français natif (entreprise française)
- Bon rapport qualité/prix
- API simple

**Configuration :**
```env
AI_PROVIDER=mistral
MISTRAL_API_KEY=votre-clé-ici
MISTRAL_MODEL=mistral-large-latest
```

**Obtenir une clé :**
https://console.mistral.ai/

**Modèles disponibles :**
- `mistral-large-latest` : Le plus puissant
- `mistral-medium-latest` : Bon équilibre
- `mistral-small-latest` : Rapide et économique

---

### 4. Ollama (Local, Gratuit) 🆓

**Avantages :**
- 100% gratuit
- Données restent en local (privé)
- Pas besoin d'API key
- Fonctionne offline

**Configuration :**
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

**Installation :**

1. Télécharger Ollama : https://ollama.ai/download

2. Installer un modèle :
```bash
# Llama 3.1 (recommandé)
ollama pull llama3.1

# Alternatives
ollama pull mistral
ollama pull codellama
```

3. Démarrer Ollama :
```bash
ollama serve
```

**Note :** Ollama est plus lent que les services cloud mais gratuit et privé.

---

## Configuration JWT

```env
# Secret pour signer les tokens JWT (CHANGEZ EN PRODUCTION !)
JWT_SECRET=votre-secret-très-sécurisé-changez-moi

# Durée de validité des tokens
JWT_EXPIRES_IN=7d
```

**Générer un secret sécurisé :**
```bash
# Méthode 1 : OpenSSL
openssl rand -base64 32

# Méthode 2 : Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

---

## Configuration Rate Limiting

```env
# Fenêtre de temps pour le rate limiting (en ms)
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes

# Nombre max de requêtes par fenêtre
RATE_LIMIT_MAX_REQUESTS=100

# Rate limit spécifique pour les endpoints IA
AI_RATE_LIMIT_MAX_REQUESTS=10
```

---

## Configuration Logging

```env
# Niveau de log (error, warn, info, debug)
LOG_LEVEL=info

# En production, utilisez "warn" ou "error"
LOG_LEVEL=warn
```

---

## Configuration Next.js

```env
# URL publique de l'API
NEXT_PUBLIC_API_URL=http://localhost:3000

# En production
NEXT_PUBLIC_API_URL=https://votre-domaine.com
```

---

## Exemples de Configuration par Environnement

### Développement Local

```env
DATABASE_URL="file:./dev.db"
AI_PROVIDER=ollama  # Gratuit pour dev
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
JWT_SECRET=dev-secret-not-for-production
NODE_ENV=development
LOG_LEVEL=debug
```

### Staging

```env
DATABASE_URL="file:./staging.db"
AI_PROVIDER=openai
OPENAI_API_KEY=sk-staging-key
OPENAI_MODEL=gpt-3.5-turbo  # Moins cher pour tests
JWT_SECRET=staging-secret-change-me
NODE_ENV=staging
LOG_LEVEL=info
```

### Production

```env
DATABASE_URL="postgresql://user:pass@db.example.com:5432/alfred"
AI_PROVIDER=openai
OPENAI_API_KEY=sk-prod-key-secure
OPENAI_MODEL=gpt-4-turbo  # Qualité max
JWT_SECRET=production-secret-very-secure-change-me
NODE_ENV=production
LOG_LEVEL=warn
RATE_LIMIT_MAX_REQUESTS=50  # Plus strict
```

---

## Changement de Provider en Production

**Zéro Downtime :**

1. Mettre à jour `.env` :
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=nouvelle-clé
```

2. Redémarrer l'app :
```bash
# Docker
docker-compose restart app

# PM2
pm2 restart alfred

# Kubernetes
kubectl rollout restart deployment/alfred
```

**C'est tout ! Aucun code à modifier.**

---

## Vérification Configuration

Vérifier que votre configuration fonctionne :

```bash
# 1. Démarrer l'app
npm run dev

# 2. Tester l'API
curl http://localhost:3000/api/styles

# Si ça marche, la config DB est OK ✅

# 3. S'inscrire + créer document + analyser
# Si l'analyse fonctionne, la config IA est OK ✅
```

---

## Sécurité

### ⚠️ IMPORTANT

- **Jamais** commit `.env` dans Git
- **Jamais** hardcoder les API keys dans le code
- **Changer** `JWT_SECRET` en production
- **Utiliser** des secrets managers en prod (AWS Secrets, Vault, etc.)
- **Limiter** les permissions des API keys (read-only si possible)

### Protection `.env`

Le fichier `.gitignore` contient déjà :
```
.env
.env*.local
.env.production
```

---

## Troubleshooting

### "API Key invalide"

- Vérifier le format de la clé
- Vérifier les quotes dans `.env` (pas de quotes autour des valeurs)
- Vérifier que le provider correspond à la clé

### "Connection refused Ollama"

```bash
# Démarrer Ollama
ollama serve

# Vérifier que ça tourne
curl http://localhost:11434/api/version
```

### "Module not found"

```bash
# Régénérer le client Prisma après changement .env
npm run db:generate
```

---

## Plus d'Informations

- [Architecture](architecture.md) : Pourquoi le pattern Adapter
- [ADR 002](adr/002-ai-providers.md) : Décisions sur les providers IA
- [API Documentation](api-documentation.md) : Endpoints disponibles


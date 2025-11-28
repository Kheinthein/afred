# 🚀 Getting Started - Alfred

Guide de démarrage rapide pour lancer Alfred en local.

## Prérequis

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Git**
- **OpenAI API Key** (ou Claude/Mistral)

## Installation

### 1. Cloner le projet

```bash
git clone https://github.com/Kheinthein/Alfred.git
cd Alfred
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Copier le fichier `.env.example` vers `.env` :

```bash
cp .env.example .env
```

Éditer `.env` et configurer vos clés API :

```env
# Database
DATABASE_URL="file:./dev.db"

# AI Provider
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
OPENAI_MODEL=gpt-4-turbo

# JWT
JWT_SECRET=votre-secret-jwt-très-sécurisé-changez-moi
JWT_EXPIRES_IN=7d

# Application
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 4. Initialiser la base de données

```bash
# Générer le client Prisma
npm run db:generate

# Créer la base de données et appliquer les migrations
npm run db:migrate

# Seed les styles d'écriture par défaut
npm run db:seed
```

### 5. Lancer l'application

```bash
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

---

## 🧪 Tests

### Lancer tous les tests

```bash
npm test
```

### Tests avec coverage

```bash
npm run test:coverage
```

### Tests unitaires uniquement

```bash
npm run test:unit
```

---

## 🐳 Docker

### Lancer avec Docker Compose

```bash
# Build et démarrer
npm run docker:up

# Voir les logs
docker-compose logs -f

# Arrêter
npm run docker:down
```

---

## 📡 Tester l'API

### 1. S'inscrire

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Réponse :
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_xxx",
      "email": "test@example.com",
      "createdAt": "2024-11-28T..."
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Sauvegarder le token pour les prochaines requêtes !**

### 2. Récupérer les styles d'écriture

```bash
curl http://localhost:3000/api/styles
```

Réponse :
```json
{
  "success": true,
  "data": {
    "styles": [
      {
        "id": "...",
        "name": "Roman",
        "description": "Récit long..."
      },
      ...
    ]
  }
}
```

### 3. Créer un document

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Mon Premier Roman",
    "content": "Il était une fois dans un royaume lointain, un jeune écrivain qui cherchait l'\''inspiration. Il parcourait les villages, écoutait les histoires des anciens, et notait chaque détail dans son carnet.",
    "styleId": "STYLE_ID_DEPUIS_ETAPE_2"
  }'
```

### 4. Analyser avec l'IA

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Authorization: Bearer VOTRE_TOKEN_ICI" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId": "DOCUMENT_ID_DEPUIS_ETAPE_3",
    "analysisType": "syntax"
  }'
```

Types d'analyse disponibles :
- `syntax` : Analyse syntaxe et grammaire
- `style` : Analyse du style d'écriture
- `progression` : Suggestions pour faire progresser le récit

---

## 🎯 Commandes Utiles

### Développement

```bash
npm run dev              # Lancer en mode dev
npm run build            # Build pour production
npm run start            # Lancer en production
npm run lint             # Vérifier le code
npm run lint:fix         # Corriger automatiquement
npm run format           # Formater le code
npm run type-check       # Vérifier les types TypeScript
```

### Base de données

```bash
npm run db:generate      # Générer le client Prisma
npm run db:migrate       # Appliquer les migrations
npm run db:push          # Push le schema sans migration
npm run db:seed          # Seed les données initiales
npm run db:studio        # Ouvrir Prisma Studio
```

### Docker

```bash
npm run docker:build     # Build l'image Docker
npm run docker:up        # Démarrer avec docker-compose
npm run docker:down      # Arrêter docker-compose
```

---

## 🔧 Changer de Provider IA

### Utiliser Claude au lieu d'OpenAI

1. Obtenir une API key Claude : https://console.anthropic.com/

2. Modifier `.env` :
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-votre-clé-claude
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

3. Redémarrer l'app :
```bash
npm run dev
```

**C'est tout ! Aucun code à modifier grâce au pattern Adapter.**

### Utiliser Ollama (local, gratuit)

1. Installer Ollama : https://ollama.ai/download

2. Télécharger un modèle :
```bash
ollama pull llama3.1
```

3. Modifier `.env` :
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

4. Redémarrer l'app

---

## 📚 Documentation

- [Architecture](docs/architecture.md) : Explication Clean Architecture
- [API Documentation](docs/api-documentation.md) : Tous les endpoints
- [ADR 001](docs/adr/001-clean-architecture.md) : Pourquoi Clean Architecture
- [ADR 002](docs/adr/002-ai-providers.md) : Stratégie AI Providers

---

## 🐛 Troubleshooting

### Port 3000 déjà utilisé

```bash
# Changer le port dans package.json
"dev": "next dev -p 3001"
```

### Erreur Prisma Client

```bash
# Régénérer le client
npm run db:generate
```

### Erreur "Cannot find module"

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install
```

### Tests qui échouent

```bash
# Vérifier que la DB de test existe
rm -f prisma/test.db
npm run db:generate
npm test
```

---

## 🎓 Prochaines Étapes Suggérées

1. ✅ **Tester l'API** avec les exemples ci-dessus
2. ✅ **Lire la doc architecture** pour comprendre la structure
3. ✅ **Expérimenter** avec différents providers IA
4. 🚧 **Ajouter un frontend** (React/Next.js)
5. 🚧 **Déployer** sur Vercel, Railway ou Docker

---

**Félicitations ! Alfred est prêt à t'aider à écrire. 🎉**


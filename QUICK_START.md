# ⚡ Quick Start - Alfred

## ✅ Setup Complet !

Tout est prêt pour lancer Alfred. Voici ce qui a été fait :

- ✅ Dépendances installées
- ✅ Client Prisma généré
- ✅ Base de données créée (SQLite)
- ✅ Styles d'écriture seedés (7 styles)

## 🚀 Lancer l'Application

```bash
npm run dev
```

L'application sera disponible sur **http://localhost:3000**

## 🧪 Tester l'API

### 1. Vérifier que l'API fonctionne

```bash
curl http://localhost:3000/api/styles
```

Tu devrais voir les 7 styles d'écriture (Roman, Nouvelle, Poésie, etc.)

### 2. S'inscrire

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"password\":\"SecurePass123\"}"
```

**Sauvegarde le token** de la réponse !

### 3. Créer un document

Remplace `VOTRE_TOKEN` par le token reçu :

```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Mon Premier Roman\",\"content\":\"Il était une fois dans un royaume lointain...\",\"styleId\":\"STYLE_ID\"}"
```

Pour obtenir le `styleId`, utilise d'abord :
```bash
curl http://localhost:3000/api/styles
```

### 4. Analyser avec ChatGPT

Remplace `DOCUMENT_ID` par l'ID du document créé :

```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Authorization: Bearer VOTRE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{\"documentId\":\"DOCUMENT_ID\",\"analysisType\":\"syntax\"}"
```

Types d'analyse disponibles :
- `syntax` : Analyse syntaxe et grammaire
- `style` : Analyse du style d'écriture
- `progression` : Suggestions pour faire progresser le récit

## 📝 Vérifier ton .env

Assure-toi que ton fichier `.env` contient :

```env
DATABASE_URL="file:./dev.db"
AI_PROVIDER=openai
OPENAI_API_KEY=ta-clé-openai
JWT_SECRET=change-moi-en-production
```

## 🐛 Problèmes Courants

### Port 3000 déjà utilisé

```bash
# Changer le port
npm run dev -- -p 3001
```

### Erreur "Cannot find module"

```bash
npm install
```

### Erreur Prisma

```bash
npm run db:generate
npm run db:push
```

## 📚 Documentation Complète

- [GETTING_STARTED.md](GETTING_STARTED.md) : Guide détaillé
- [docs/api-documentation.md](docs/api-documentation.md) : Tous les endpoints
- [docs/architecture.md](docs/architecture.md) : Architecture Clean

---

**Alfred est prêt ! Lance `npm run dev` et commence à écrire ! 🎉**


# Alfred - Assistant d'Écriture avec IA

Application d'écriture avec assistant IA pour écrivains, développée en Clean Architecture (monolithe modulaire).

## 🎯 Features

- ✍️ Éditeur de documents avec auto-save
- 🤖 Assistant IA (ChatGPT / OpenAI) pour :
  - Correction syntaxique
  - Analyse de style
  - Suggestions narratives
- 👤 Authentification JWT
- 📚 Gestion de styles d'écriture (Roman, Nouvelle, Poésie, etc.)
- 🔄 Versioning des documents

## 🏗️ Stack Technique

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (architecture Clean)
- **Database**: SQLite + Prisma ORM
- **IA**: OpenAI (GPT-4 Turbo) via adapters configurables
- **Auth**: JWT
- **Tests**: Jest, Playwright
- **CI/CD**: GitHub Actions
- **Deployment**: Docker

## 📋 Prérequis

- Node.js >= 18.0.0
- npm >= 9.0.0
- OpenAI API Key (ou Claude/Mistral/Ollama)
- Docker (optionnel)

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/votre-username/alfred.git
cd alfred
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration de l'environnement

Copier `.env.example` vers `.env` et configurer les variables :

```bash
cp .env.example .env
```

Éditer `.env` avec vos clés API :

```env
DATABASE_URL="file:./dev.db"
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-key
JWT_SECRET=your-secret-key
```

### 4. Initialiser la base de données

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

### 5. Lancer en développement

```bash
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 🐳 Docker

### Lancer avec Docker Compose

```bash
npm run docker:up
```

### Arrêter

```bash
npm run docker:down
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test:unit

# Tests d'intégration
npm run test:integration

# Tests E2E
npm run test:e2e

# Tous les tests avec coverage
npm run test:coverage
```

## 📖 Architecture

Ce projet utilise une **Clean Architecture** (monolithe modulaire) avec 3 modules principaux :

```
src/
├── modules/
│   ├── user/              # Authentification, gestion utilisateurs
│   ├── document/          # CRUD documents, versioning
│   └── ai-assistant/      # Analyse IA, suggestions
├── shared/                # Code partagé (errors, types, utils)
└── app/                   # Next.js App Router
```

### Couches Clean Architecture

1. **Domain** : Logique métier pure (entities, use cases, interfaces)
2. **Infrastructure** : Adapters externes (DB, IA, logger)
3. **Application** : Orchestration (services, DTOs)
4. **Presentation** : Interface utilisateur (API routes, pages)

Voir [docs/architecture.md](docs/architecture.md) pour plus de détails.

## 📚 Documentation

- [Architecture](docs/architecture.md)
- [API Documentation](docs/api-documentation.md)
- [ADR 001: Clean Architecture](docs/adr/001-clean-architecture.md)
- [ADR 002: AI Providers](docs/adr/002-ai-providers.md)

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/amazing-feature`)
3. Commit les changes (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 License

MIT

## 👤 Auteur

Votre Nom

## 🚢 GitHub & CI/CD

### Création du dépôt

```bash
git init
git add .
git commit -m "feat: initial commit"
git branch -M main
git remote add origin https://github.com/<votre-user>/alfred.git
git push -u origin main
```

### Secrets requis (GitHub → Settings → Secrets and variables → Actions)

| Secret            | Description                         |
| ----------------- | ----------------------------------- |
| `OPENAI_API_KEY`  | Clé OpenAI utilisée par l'IA        |
| `JWT_SECRET`      | Secret pour signer les tokens JWT   |
| `DATABASE_URL`    | Facultatif (SQLite par défaut)      |

### Pipeline GitHub Actions

Un workflow est disponible dans `.github/workflows/ci.yml`. À chaque push/pull-request sur `main` ou `develop`, il exécute :

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`

Vous pouvez étendre ce pipeline (déploiement Docker, Playwright, etc.) en ajoutant d'autres jobs dans ce fichier.


# Architecture Alfred - Clean Architecture (Monolithe Modulaire)

## Vue d'Ensemble

Alfred utilise une **Clean Architecture** organisée en monolithe modulaire avec 3 modules métiers principaux :
- **User Module** : Authentification et gestion utilisateurs
- **Document Module** : CRUD documents avec versioning
- **AI Assistant Module** : Analyses IA (syntaxe, style, progression narrative)

## Diagramme des Couches

```
┌─────────────────────────────────────────────────────────┐
│              PRESENTATION LAYER (Next.js)               │
│  - API Routes (/api/auth, /api/documents, /api/ai)     │
│  - Middlewares (auth, validation, error handling)       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│             APPLICATION LAYER                           │
│  - DTOs avec validation Zod                             │
│  - Services d'orchestration                             │
│  - Dependency Injection Container (InversifyJS)         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│              DOMAIN LAYER (Logique Métier)              │
│  - Entities (User, Document, AIAnalysis)                │
│  - Value Objects (Email, DocumentContent)               │
│  - Use Cases (CreateUser, AnalyzeText, etc.)            │
│  - Repository Interfaces (Ports)                        │
└─────────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────────┐
│            INFRASTRUCTURE LAYER                         │
│  - Repository Implementations (Prisma)                  │
│  - AI Adapters (Claude, OpenAI)                         │
│  - Logger (Winston)                                     │
│  - JWT Auth                                             │
└─────────────────────────────────────────────────────────┘
```

## Flux de Données

### Exemple : Créer un Document

```
1. Client → POST /api/documents
            ↓
2. API Route → Valide CreateDocumentDTO (Zod)
            ↓
3. API Route → Récupère CreateDocument use case du container
            ↓
4. CreateDocument → Valide logique métier
            ↓
5. CreateDocument → Appelle DocumentRepository.save()
            ↓
6. DocumentRepository → Persiste dans SQLite via Prisma
            ↓
7. Retour → Document créé vers le client
```

## Modules

### User Module

**Responsabilités :**
- Inscription / Connexion
- Gestion du mot de passe (hashing bcrypt)
- Génération JWT

**Use Cases :**
- `CreateUser` : Inscription avec validation email unique
- `AuthenticateUser` : Login avec vérification password

### Document Module

**Responsabilités :**
- CRUD documents
- Versioning automatique à chaque modification
- Calcul nombre de mots
- Détection besoin d'analyse IA (> 100 mots, version multiple de 5)

**Use Cases :**
- `CreateDocument` : Création avec style d'écriture
- `UpdateDocument` : Modification avec incrémentation version
- `DeleteDocument` : Suppression avec vérification permissions
- `GetUserDocuments` : Liste documents utilisateur

### AI Assistant Module

**Responsabilités :**
- Analyse syntaxe (erreurs, suggestions)
- Analyse style (ton, vocabulaire, alignement)
- Suggestions progression narrative
- Historique des analyses

**Use Cases :**
- `AnalyzeText` : Analyse selon type (syntax/style/progression)

## Patterns Utilisés

### 1. Dependency Inversion (Ports & Adapters)

```typescript
// Port (Domain Layer)
export interface IAIServicePort {
  analyzeSyntax(text: string): Promise<SyntaxAnalysisResult>;
}

// Adapters (Infrastructure Layer)
export class ClaudeAdapter implements IAIServicePort { }
export class OpenAIAdapter implements IAIServicePort { }
```

**Avantages :**
- Changement de provider IA sans toucher au domain
- Tests avec mocks faciles
- Flexibilité maximale

### 2. Repository Pattern

```typescript
// Interface Repository (Domain)
export interface IDocumentRepository {
  findById(id: string): Promise<Document | null>;
  save(document: Document): Promise<void>;
}

// Implémentation (Infrastructure)
export class DocumentRepository implements IDocumentRepository {
  constructor(private prisma: PrismaClient) {}
  // Implémentation avec Prisma
}
```

### 3. Use Case Pattern

Chaque action métier = 1 Use Case avec :
- Input DTO
- Output DTO
- Logique métier isolée
- Testable unitairement

### 4. Factory Pattern

```typescript
AIAdapterFactory.create(config) // Crée le bon adapter
```

## Principes SOLID Appliqués

- **S**ingle Responsibility : Chaque classe a 1 responsabilité
- **O**pen/Closed : Ajout de nouveaux AI providers sans modifier le domain
- **L**iskov Substitution : Tous les adapters IA sont interchangeables
- **I**nterface Segregation : Interfaces spécifiques par besoin
- **D**ependency Inversion : Domain ne dépend que d'abstractions

## Base de Données

### Schéma Prisma

```prisma
User (id, email, passwordHash)
  ↓ 1-N
Document (id, userId, title, content, styleId, version)
  ↓ 1-N
AIAnalysis (id, documentId, type, suggestions, confidence)

WritingStyle (id, name, description)
  ↓ 1-N
Document
```

### Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

## Sécurité

### Authentification

- JWT avec expiration 7 jours
- Mot de passe hashé avec bcrypt (10 rounds)
- Middleware auth sur toutes les routes protégées

### Validation

- Triple validation :
  1. DTO Zod (format, types)
  2. Domain entities (règles métier)
  3. Use cases (permissions, logique)

### Rate Limiting

- 100 req/15min par IP
- 10 req/min pour routes IA

## Performance

### Optimisations

- Connection pooling Prisma
- Logs asynchrones Winston
- Réponses JSON structurées
- Index DB sur userId, documentId

### Métriques Cibles

- API Response p95 < 500ms
- AI Analysis < 5s
- Document save < 100ms

## Tests

### Structure

```
tests/
├── unit/           # Domain + Application (80% coverage)
├── integration/    # Repositories avec SQLite
└── e2e/           # Playwright sur API
```

### Stratégie TDD

1. Écrire test use case
2. Implémenter use case
3. Test passe
4. Refactoring

## Évolutivité Future

### Migration Microservices (si nécessaire)

```
Modules → Services indépendants
- user-service (Node.js)
- document-service (Node.js)
- ai-service (Python + TensorFlow)

Communication : gRPC ou REST
Event Bus : RabbitMQ ou Kafka
```

### Critères de Migration

- > 50k utilisateurs actifs
- > 10 développeurs
- Scaling différencié nécessaire
- Technologies hétérogènes

---

**Architecture validée selon principes KISS, DRY, YAGNI et SOLID.**


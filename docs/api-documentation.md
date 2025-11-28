# API Documentation - Alfred

Base URL : `http://localhost:3000/api`

## Authentification

Toutes les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### POST /auth/register

Créer un nouvel utilisateur.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `400` : Validation error
- `400` : Email already exists

---

### POST /auth/login

Authentifier un utilisateur.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "user@example.com"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Errors:**
- `401` : Invalid credentials

---

## Documents Endpoints

### GET /documents

Récupérer tous les documents de l'utilisateur.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "id": "doc_123",
        "title": "Mon Premier Roman",
        "content": "Il était une fois...",
        "wordCount": 150,
        "style": {
          "id": "style_1",
          "name": "Roman"
        },
        "version": 5,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-05T00:00:00.000Z"
      }
    ]
  }
}
```

---

### POST /documents

Créer un nouveau document.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Mon Nouveau Roman",
  "content": "Il était une fois dans un royaume lointain...",
  "styleId": "style_1"
}
```

**Response 201:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "doc_456",
      "title": "Mon Nouveau Roman",
      "content": "Il était une fois dans un royaume lointain...",
      "wordCount": 8,
      "style": {
        "id": "style_1",
        "name": "Roman"
      },
      "version": 1,
      "createdAt": "2024-01-10T00:00:00.000Z",
      "updatedAt": "2024-01-10T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `400` : Validation error
- `404` : Style not found

---

### GET /documents/:id

Récupérer un document spécifique.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "doc_123",
      "title": "Mon Premier Roman",
      "content": "Il était une fois...",
      "wordCount": 150,
      "style": {
        "id": "style_1",
        "name": "Roman",
        "description": "Récit long avec développement approfondi"
      },
      "version": 5,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-05T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `404` : Document not found
- `403` : Unauthorized access

---

### PUT /documents/:id

Mettre à jour un document.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "title": "Mon Premier Roman (révisé)",
  "content": "Il était une fois dans un lointain royaume..."
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "document": {
      "id": "doc_123",
      "title": "Mon Premier Roman (révisé)",
      "content": "Il était une fois dans un lointain royaume...",
      "wordCount": 160,
      "version": 6,
      "updatedAt": "2024-01-06T00:00:00.000Z"
    }
  }
}
```

**Errors:**
- `404` : Document not found
- `403` : Unauthorized access

---

### DELETE /documents/:id

Supprimer un document.

**Headers:**
```
Authorization: Bearer <token>
```

**Response 200:**
```json
{
  "success": true,
  "message": "Document supprimé avec succès"
}
```

**Errors:**
- `404` : Document not found
- `403` : Unauthorized access

---

## AI Endpoints

### POST /ai/analyze

Analyser un document avec l'IA.

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "documentId": "doc_123",
  "analysisType": "syntax"
}
```

**Analysis Types:**
- `syntax` : Analyse syntaxe/grammaire
- `style` : Analyse du style d'écriture
- `progression` : Suggestions progression narrative

**Response 200:**
```json
{
  "success": true,
  "data": {
    "analysis": {
      "id": "analysis_789",
      "type": "syntax",
      "suggestions": [
        "Corriger la ponctuation ligne 5",
        "Ajouter une virgule après 'Cependant'"
      ],
      "confidence": 0.95,
      "createdAt": "2024-01-10T10:30:00.000Z"
    }
  },
  "meta": {
    "timestamp": "2024-01-10T10:30:00.000Z",
    "processingTime": "1234ms"
  }
}
```

**Errors:**
- `404` : Document not found
- `403` : Unauthorized access
- `400` : Invalid analysis type

---

## Styles Endpoints

### GET /styles

Récupérer tous les styles d'écriture disponibles.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "styles": [
      {
        "id": "style_1",
        "name": "Roman",
        "description": "Récit long avec développement approfondi des personnages"
      },
      {
        "id": "style_2",
        "name": "Nouvelle",
        "description": "Récit court, concis avec un impact immédiat"
      },
      {
        "id": "style_3",
        "name": "Poésie",
        "description": "Texte en vers ou prose poétique"
      }
    ]
  }
}
```

---

## Error Responses

Toutes les erreurs suivent ce format :

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Description de l'erreur",
    "details": [] // Optionnel, pour erreurs validation
  }
}
```

### Error Codes

- `VALIDATION_ERROR` : Erreur de validation des données
- `UNAUTHORIZED` : Token manquant ou invalide
- `FORBIDDEN` : Accès non autorisé
- `NOT_FOUND` : Ressource non trouvée
- `INTERNAL_SERVER_ERROR` : Erreur serveur

---

## Rate Limiting

- **Global** : 100 requêtes / 15 minutes par IP
- **AI Endpoints** : 10 requêtes / minute par utilisateur

Headers de rate limiting :
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## Examples avec curl

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"SecurePass123"}'
```

### Create Document
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title":"Mon Roman",
    "content":"Il était une fois...",
    "styleId":"style_1"
  }'
```

### Analyze with AI
```bash
curl -X POST http://localhost:3000/api/ai/analyze \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentId":"doc_123",
    "analysisType":"syntax"
  }'
```


import { NextResponse } from 'next/server';

/**
 * GET /api/docs
 * Documentation de l'API Alfred
 */
export async function GET(): Promise<NextResponse> {
  const docs = {
    title: 'Alfred API Documentation',
    version: '1.0.0',
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    description: 'API REST pour l\'application d\'écriture Alfred avec assistant IA',
    endpoints: {
      auth: {
        register: {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Créer un nouvel utilisateur',
          body: {
            email: 'string (email valide)',
            password: 'string (min 8 caractères)',
          },
          response: {
            success: true,
            data: {
              user: { id: 'string', email: 'string', createdAt: 'ISO date' },
              token: 'JWT token',
            },
          },
        },
        login: {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Authentifier un utilisateur',
          body: {
            email: 'string',
            password: 'string',
          },
          response: {
            success: true,
            data: {
              user: { id: 'string', email: 'string' },
              token: 'JWT token',
            },
          },
        },
      },
      documents: {
        list: {
          method: 'GET',
          path: '/api/documents',
          description: 'Récupérer tous les documents de l\'utilisateur',
          auth: 'Bearer token requis',
          response: {
            success: true,
            data: {
              documents: [
                {
                  id: 'string',
                  title: 'string',
                  content: 'string',
                  wordCount: 'number',
                  style: { id: 'string', name: 'string' },
                  version: 'number',
                  sortOrder: 'number',
                  createdAt: 'ISO date',
                  updatedAt: 'ISO date',
                },
              ],
            },
          },
        },
        create: {
          method: 'POST',
          path: '/api/documents',
          description: 'Créer un nouveau document',
          auth: 'Bearer token requis',
          body: {
            title: 'string (requis)',
            content: 'string (requis)',
            styleId: 'string (ID du style depuis /api/styles)',
          },
          response: {
            success: true,
            data: {
              document: {
                id: 'string',
                title: 'string',
                content: 'string',
                wordCount: 'number',
                style: { id: 'string', name: 'string' },
                version: 1,
                sortOrder: 'number',
                createdAt: 'ISO date',
                updatedAt: 'ISO date',
              },
            },
          },
        },
        get: {
          method: 'GET',
          path: '/api/documents/:id',
          description: 'Récupérer un document spécifique',
          auth: 'Bearer token requis',
          response: {
            success: true,
            data: {
              document: {
                id: 'string',
                title: 'string',
                content: 'string',
                wordCount: 'number',
                style: { id: 'string', name: 'string', description: 'string' },
                version: 'number',
                sortOrder: 'number',
                createdAt: 'ISO date',
                updatedAt: 'ISO date',
              },
            },
          },
        },
        update: {
          method: 'PUT',
          path: '/api/documents/:id',
          description: 'Mettre à jour un document',
          auth: 'Bearer token requis',
          body: {
            title: 'string (optionnel)',
            content: 'string (optionnel)',
          },
          response: {
            success: true,
            data: {
              document: {
                id: 'string',
                title: 'string',
                content: 'string',
                wordCount: 'number',
                version: 'number (incrémenté)',
                sortOrder: 'number',
                updatedAt: 'ISO date',
              },
            },
          },
        },
        reorder: {
          method: 'POST',
          path: '/api/documents/reorder',
          description: 'Réordonner les documents de l’utilisateur',
          auth: 'Bearer token requis',
          body: {
            documentIds: 'string[] (liste complète des IDs dans l’ordre souhaité)',
          },
          response: {
            success: true,
            data: {
              reordered: 'number (documents concernés)',
            },
          },
        },
        delete: {
          method: 'DELETE',
          path: '/api/documents/:id',
          description: 'Supprimer un document',
          auth: 'Bearer token requis',
          response: {
            success: true,
            message: 'Document supprimé avec succès',
          },
        },
      },
      ai: {
        analyze: {
          method: 'POST',
          path: '/api/ai/analyze',
          description: 'Analyser un document avec l\'IA (ChatGPT)',
          auth: 'Bearer token requis',
          body: {
            documentId: 'string (ID du document)',
            analysisType: "'syntax' | 'style' | 'progression'",
          },
          analysisTypes: {
            syntax: 'Analyse syntaxe, grammaire et orthographe',
            style: 'Analyse du style d\'écriture par rapport au style cible',
            progression: 'Suggestions pour faire progresser le récit',
          },
          response: {
            success: true,
            data: {
              analysis: {
                id: 'string',
                type: 'string',
                suggestions: ['string'],
                confidence: 'number (0-1)',
                createdAt: 'ISO date',
              },
            },
            meta: {
              timestamp: 'ISO date',
              processingTime: 'string (ex: "1234ms")',
            },
          },
        },
      },
      styles: {
        list: {
          method: 'GET',
          path: '/api/styles',
          description: 'Récupérer tous les styles d\'écriture disponibles',
          auth: 'Aucune',
          response: {
            success: true,
            data: {
              styles: [
                {
                  id: 'string',
                  name: 'string (ex: "Roman", "Nouvelle", "Poésie")',
                  description: 'string',
                },
              ],
            },
          },
        },
      },
    },
    authentication: {
      type: 'JWT Bearer Token',
      header: 'Authorization: Bearer <token>',
      tokenLifetime: '7 days',
      howToGet: 'S\'inscrire via POST /api/auth/register ou se connecter via POST /api/auth/login',
    },
    examples: {
      register: {
        curl: `curl -X POST ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/auth/register \\
  -H "Content-Type: application/json" \\
  -d '{"email":"test@example.com","password":"SecurePass123"}'`,
      },
      createDocument: {
        curl: `curl -X POST ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/documents \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"title":"Mon Roman","content":"Il était une fois...","styleId":"STYLE_ID"}'`,
      },
      analyze: {
        curl: `curl -X POST ${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/ai/analyze \\
  -H "Authorization: Bearer YOUR_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"documentId":"DOCUMENT_ID","analysisType":"syntax"}'`,
      },
    },
    errorFormat: {
      success: false,
      error: {
        code: 'ERROR_CODE',
        message: 'Description de l\'erreur',
        details: '[] (optionnel, pour erreurs de validation)',
      },
    },
    errorCodes: {
      VALIDATION_ERROR: 'Erreur de validation des données (400)',
      UNAUTHORIZED: 'Token manquant ou invalide (401)',
      FORBIDDEN: 'Accès non autorisé (403)',
      NOT_FOUND: 'Ressource non trouvée (404)',
      INTERNAL_SERVER_ERROR: 'Erreur serveur (500)',
    },
    rateLimiting: {
      global: '100 requêtes / 15 minutes par IP',
      ai: '10 requêtes / minute par utilisateur',
    },
    links: {
      fullDocumentation: '/docs/api-documentation.md',
      gettingStarted: '/GETTING_STARTED.md',
      architecture: '/docs/architecture.md',
    },
  };

  return NextResponse.json(docs, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


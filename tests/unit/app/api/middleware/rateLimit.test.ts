import { NextRequest } from 'next/server';
import {
  rateLimitMiddleware,
  RATE_LIMIT_CONFIGS,
  resetRateLimit,
} from '@/app/api/middleware/rateLimit';

/**
 * Tests unitaires pour le middleware de rate limiting
 */

describe('Rate Limiting Middleware', () => {
  beforeEach(() => {
    // Réinitialiser le rate limit avant chaque test
    resetRateLimit();
  });

  describe('Configuration standard', () => {
    it('devrait autoriser les requêtes sous la limite', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.1',
        },
      });

      // Première requête
      const response1 = rateLimitMiddleware(
        request,
        RATE_LIMIT_CONFIGS.standard
      );
      expect(response1).toBeNull();

      // Deuxième requête
      const response2 = rateLimitMiddleware(
        request,
        RATE_LIMIT_CONFIGS.standard
      );
      expect(response2).toBeNull();
    });

    it('devrait bloquer les requêtes au-delà de la limite', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.2',
        },
      });

      const config = { windowMs: 60000, maxRequests: 3 };

      // 3 premières requêtes OK
      for (let i = 0; i < 3; i++) {
        const response = rateLimitMiddleware(request, config);
        expect(response).toBeNull();
      }

      // 4ème requête bloquée
      const response = rateLimitMiddleware(request, config);
      expect(response).not.toBeNull();
      expect(response?.status).toBe(429);
    });

    it('devrait inclure les headers de rate limit dans la réponse 429', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.3',
        },
      });

      const config = { windowMs: 60000, maxRequests: 2 };

      // Atteindre la limite
      rateLimitMiddleware(request, config);
      rateLimitMiddleware(request, config);

      // Dépasser la limite
      const response = rateLimitMiddleware(request, config);
      expect(response).not.toBeNull();

      const json = (await response!.json()) as {
        error: { code: string; retryAfter: number };
      };
      expect(json.error.code).toBe('RATE_LIMIT_EXCEEDED');
      expect(json.error.retryAfter).toBeGreaterThan(0);

      expect(response!.headers.get('X-RateLimit-Limit')).toBe('2');
      expect(response!.headers.get('X-RateLimit-Remaining')).toBe('0');
      expect(response!.headers.get('Retry-After')).toBeTruthy();
    });
  });

  describe('Configuration AI (stricte)', () => {
    it('devrait avoir une limite plus stricte pour les endpoints IA', () => {
      const request = new NextRequest('http://localhost:3000/api/ai/analyze', {
        headers: {
          'x-forwarded-for': '192.168.1.4',
        },
      });

      // 10 requêtes OK
      for (let i = 0; i < 10; i++) {
        const response = rateLimitMiddleware(request, RATE_LIMIT_CONFIGS.ai);
        expect(response).toBeNull();
      }

      // 11ème requête bloquée
      const response = rateLimitMiddleware(request, RATE_LIMIT_CONFIGS.ai);
      expect(response).not.toBeNull();
      expect(response?.status).toBe(429);
    });
  });

  describe('Configuration Auth (protection brute force)', () => {
    it('devrait limiter les tentatives de connexion', () => {
      const request = new NextRequest('http://localhost:3000/api/auth/login', {
        headers: {
          'x-forwarded-for': '192.168.1.5',
        },
      });

      // 5 tentatives OK
      for (let i = 0; i < 5; i++) {
        const response = rateLimitMiddleware(request, RATE_LIMIT_CONFIGS.auth);
        expect(response).toBeNull();
      }

      // 6ème tentative bloquée
      const response = rateLimitMiddleware(request, RATE_LIMIT_CONFIGS.auth);
      expect(response).not.toBeNull();
      expect(response?.status).toBe(429);
    });
  });

  describe('Identification du client', () => {
    it('devrait utiliser le token JWT comme identifiant si présent', () => {
      const request1 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          authorization: 'Bearer user-token-123',
          'x-forwarded-for': '192.168.1.6',
        },
      });

      const request2 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.6', // Même IP
        },
      });

      const config = { windowMs: 60000, maxRequests: 2 };

      // Requêtes avec token
      rateLimitMiddleware(request1, config);
      rateLimitMiddleware(request1, config);
      const response1 = rateLimitMiddleware(request1, config);
      expect(response1).not.toBeNull(); // Limite atteinte pour ce token

      // Requête sans token (même IP) devrait être OK
      const response2 = rateLimitMiddleware(request2, config);
      expect(response2).toBeNull(); // Compteur séparé
    });

    it("devrait utiliser l'IP si pas de token", () => {
      const request1 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.7',
        },
      });

      const request2 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.8', // IP différente
        },
      });

      const config = { windowMs: 60000, maxRequests: 1 };

      // Première IP atteint la limite
      rateLimitMiddleware(request1, config);
      const response1 = rateLimitMiddleware(request1, config);
      expect(response1).not.toBeNull();

      // Deuxième IP devrait être OK
      const response2 = rateLimitMiddleware(request2, config);
      expect(response2).toBeNull();
    });

    it('devrait gérer x-real-ip comme fallback', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-real-ip': '192.168.1.9',
        },
      });

      const config = { windowMs: 60000, maxRequests: 1 };

      rateLimitMiddleware(request, config);
      const response = rateLimitMiddleware(request, config);
      expect(response).not.toBeNull();
    });
  });

  describe('Fenêtre de temps', () => {
    it('devrait réinitialiser le compteur après expiration de la fenêtre', async () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.10',
        },
      });

      const config = { windowMs: 100, maxRequests: 1 }; // 100ms

      // Première requête OK
      const response1 = rateLimitMiddleware(request, config);
      expect(response1).toBeNull();

      // Deuxième requête immédiate bloquée
      const response2 = rateLimitMiddleware(request, config);
      expect(response2).not.toBeNull();

      // Attendre l'expiration de la fenêtre
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Nouvelle requête devrait être OK
      const response3 = rateLimitMiddleware(request, config);
      expect(response3).toBeNull();
    });
  });

  describe('resetRateLimit', () => {
    it('devrait réinitialiser le rate limit pour un identifiant spécifique', () => {
      const request = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.11',
        },
      });

      const config = { windowMs: 60000, maxRequests: 1 };

      // Atteindre la limite
      rateLimitMiddleware(request, config);
      const response1 = rateLimitMiddleware(request, config);
      expect(response1).not.toBeNull();

      // Réinitialiser pour cette IP
      resetRateLimit('ip:192.168.1.11');

      // Devrait être OK maintenant
      const response2 = rateLimitMiddleware(request, config);
      expect(response2).toBeNull();
    });

    it("devrait réinitialiser tous les rate limits si pas d'identifiant", () => {
      const request1 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.12',
        },
      });

      const request2 = new NextRequest('http://localhost:3000/api/test', {
        headers: {
          'x-forwarded-for': '192.168.1.13',
        },
      });

      const config = { windowMs: 60000, maxRequests: 1 };

      // Atteindre la limite pour les deux IPs
      rateLimitMiddleware(request1, config);
      rateLimitMiddleware(request1, config);
      rateLimitMiddleware(request2, config);
      rateLimitMiddleware(request2, config);

      // Réinitialiser tout
      resetRateLimit();

      // Les deux devraient être OK
      expect(rateLimitMiddleware(request1, config)).toBeNull();
      expect(rateLimitMiddleware(request2, config)).toBeNull();
    });
  });
});

import { NextRequest } from 'next/server';
import { verifyToken } from '@shared/infrastructure/auth/jwt';
import { UnauthorizedError } from '@shared/errors';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
  userEmail: string;
}

/**
 * Middleware d'authentification JWT
 * Vérifie le token dans le header Authorization
 * Attache userId et userEmail à la request
 */
export function authenticateRequest(request: NextRequest): {
  userId: string;
  userEmail: string;
} {
  const authHeader = request.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError("Token d'authentification manquant");
  }

  const token = authHeader.substring(7); // Remove 'Bearer '

  try {
    const payload = verifyToken(token);
    return {
      userId: payload.userId,
      userEmail: payload.email,
    };
  } catch {
    throw new UnauthorizedError('Token invalide ou expiré');
  }
}

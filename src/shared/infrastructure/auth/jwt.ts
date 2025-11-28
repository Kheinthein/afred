import jwt from 'jsonwebtoken';
import { JWTPayload } from '@shared/types';
import { UnauthorizedError } from '@shared/errors';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * Génère un token JWT pour un utilisateur
 */
export function generateToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Vérifie et décode un token JWT
 * @throws {UnauthorizedError} Si le token est invalide ou expiré
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError('Token expiré');
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError('Token invalide');
    }
    throw new UnauthorizedError('Erreur d\'authentification');
  }
}


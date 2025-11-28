import { AppError } from './AppError';

/**
 * Erreur d'authentification ou d'autorisation
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = 'Non autorisé') {
    super(message, 401);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}


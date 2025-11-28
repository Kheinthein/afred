import { AppError } from './AppError';

/**
 * Erreur ressource non trouvée
 */
export class NotFoundError extends AppError {
  constructor(message: string = 'Ressource non trouvée') {
    super(message, 404);
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}


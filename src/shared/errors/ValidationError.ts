import { AppError } from './AppError';

/**
 * Erreur de validation des données
 */
export class ValidationError extends AppError {
  constructor(message: string = 'Erreur de validation') {
    super(message, 400);
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}


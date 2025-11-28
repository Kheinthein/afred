import { ValidationError } from '@shared/errors';

/**
 * Value Object représentant un email valide
 */
export class Email {
  public readonly value: string;

  constructor(email: string) {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed || trimmed.length === 0) {
      throw new ValidationError('L\'email ne peut pas être vide');
    }

    if (!this.isValid(trimmed)) {
      throw new ValidationError('Format d\'email invalide');
    }

    this.value = trimmed;
  }

  /**
   * Valide le format de l'email avec une regex
   */
  private isValid(email: string): boolean {
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return emailRegex.test(email);
  }

  /**
   * Vérifie l'égalité avec un autre email
   */
  equals(other: Email): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}


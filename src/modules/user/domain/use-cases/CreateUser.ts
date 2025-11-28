import bcrypt from 'bcryptjs';
import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { IUserRepository } from '../repositories/IUserRepository';
import { ValidationError } from '@shared/errors';
import { PASSWORD_MIN_LENGTH } from '@shared/constants';

export interface CreateUserInput {
  email: string;
  password: string;
}

export interface CreateUserOutput {
  user: User;
}

/**
 * Use Case : Créer un nouvel utilisateur
 *
 * Responsabilités:
 * - Valider l'email et le mot de passe
 * - Vérifier que l'email n'existe pas déjà
 * - Hasher le mot de passe
 * - Créer l'entité User
 * - Sauvegarder via le repository
 */
export class CreateUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(input: CreateUserInput): Promise<CreateUserOutput> {
    // 1. Valider l'email
    const email = new Email(input.email);

    // 2. Valider le mot de passe
    if (!input.password || input.password.length < PASSWORD_MIN_LENGTH) {
      throw new ValidationError(
        `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`
      );
    }

    // 3. Vérifier que l'email n'existe pas
    const emailExists = await this.userRepository.emailExists(email.value);
    if (emailExists) {
      throw new ValidationError('Cet email est déjà utilisé');
    }

    // 4. Hasher le mot de passe
    const passwordHash = await bcrypt.hash(input.password, 10);

    // 5. Créer l'entité User
    const now = new Date();
    const user = new User(
      this.generateId(),
      email.value,
      passwordHash,
      now,
      now
    );

    // 6. Valider l'entité
    user.validate();

    // 7. Sauvegarder
    await this.userRepository.save(user);

    return { user };
  }

  private generateId(): string {
    // Simple ID generation - in production, use cuid or uuid
    return `user_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}


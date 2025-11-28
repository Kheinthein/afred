import { User } from '../entities/User';
import { Email } from '../value-objects/Email';
import { IUserRepository } from '../repositories/IUserRepository';
import { UnauthorizedError } from '@shared/errors';

export interface AuthenticateUserInput {
  email: string;
  password: string;
}

export interface AuthenticateUserOutput {
  user: User;
}

/**
 * Use Case : Authentifier un utilisateur
 *
 * Responsabilités:
 * - Valider l'email
 * - Trouver l'utilisateur
 * - Vérifier le mot de passe
 * - Retourner l'utilisateur authentifié
 */
export class AuthenticateUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    input: AuthenticateUserInput
  ): Promise<AuthenticateUserOutput> {
    // 1. Valider l'email
    const email = new Email(input.email);

    // 2. Valider que le mot de passe n'est pas vide
    if (!input.password || input.password.trim().length === 0) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    // 3. Trouver l'utilisateur
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    // 4. Vérifier le mot de passe
    const isPasswordValid = await user.comparePassword(input.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Email ou mot de passe incorrect');
    }

    return { user };
  }
}


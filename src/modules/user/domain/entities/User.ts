import bcrypt from 'bcryptjs';

/**
 * Entité User représentant un utilisateur de l'application
 */
export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public passwordHash: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Valide les propriétés de l'utilisateur
   * @throws {Error} Si la validation échoue
   */
  validate(): void {
    if (!this.email || this.email.trim().length === 0) {
      throw new Error('L\'email est requis');
    }

    if (!this.passwordHash || this.passwordHash.trim().length === 0) {
      throw new Error('Le mot de passe hashé est requis');
    }
  }

  /**
   * Compare un mot de passe en clair avec le hash stocké
   * @param password - Mot de passe en clair
   * @returns true si le mot de passe correspond
   */
  async comparePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.passwordHash);
  }
}


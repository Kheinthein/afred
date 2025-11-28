import { User } from '../entities/User';

/**
 * Interface (Port) pour le repository User
 * Définit les opérations de persistance sans se soucier de l'implémentation
 */
export interface IUserRepository {
  /**
   * Trouve un utilisateur par son ID
   */
  findById(id: string): Promise<User | null>;

  /**
   * Trouve un utilisateur par son email
   */
  findByEmail(email: string): Promise<User | null>;

  /**
   * Sauvegarde un utilisateur (création ou mise à jour)
   */
  save(user: User): Promise<void>;

  /**
   * Supprime un utilisateur
   */
  delete(id: string): Promise<void>;

  /**
   * Vérifie si un email existe déjà
   */
  emailExists(email: string): Promise<boolean>;
}

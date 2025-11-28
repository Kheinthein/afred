import { Document } from '../entities/Document';

/**
 * Interface (Port) pour le repository Document
 */
export interface IDocumentRepository {
  /**
   * Trouve un document par son ID
   */
  findById(id: string): Promise<Document | null>;

  /**
   * Trouve tous les documents d'un utilisateur
   */
  findByUserId(userId: string): Promise<Document[]>;

  /**
   * Sauvegarde un document (création ou mise à jour)
   */
  save(document: Document): Promise<void>;

  /**
   * Supprime un document
   */
  delete(id: string): Promise<void>;

  /**
   * Compte le nombre de documents d'un utilisateur
   */
  countByUserId(userId: string): Promise<number>;

  /**
   * Met à jour l'ordre d'affichage des documents d'un utilisateur
   */
  updateSortOrders(
    userId: string,
    orders: Array<{ id: string; sortOrder: number }>
  ): Promise<void>;
}

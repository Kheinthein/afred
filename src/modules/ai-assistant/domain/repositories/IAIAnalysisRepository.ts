import { AIAnalysis } from '../entities/AIAnalysis';

/**
 * Interface (Port) pour le repository AIAnalysis
 */
export interface IAIAnalysisRepository {
  /**
   * Sauvegarde une analyse IA
   */
  save(analysis: AIAnalysis): Promise<void>;

  /**
   * Récupère toutes les analyses d'un document
   */
  findByDocumentId(documentId: string): Promise<AIAnalysis[]>;

  /**
   * Récupère la dernière analyse d'un document par type
   */
  findLatestByDocumentAndType(
    documentId: string,
    type: string
  ): Promise<AIAnalysis | null>;

  /**
   * Supprime toutes les analyses d'un document
   */
  deleteByDocumentId(documentId: string): Promise<void>;
}

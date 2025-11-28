import { AnalysisType } from '@shared/types';

/**
 * Entité AIAnalysis représentant une analyse IA d'un document
 */
export class AIAnalysis {
  constructor(
    public readonly id: string,
    public readonly documentId: string,
    public readonly type: AnalysisType,
    public readonly suggestions: string[],
    public readonly confidence: number,
    public readonly createdAt: Date,
    public readonly metadata?: Record<string, unknown>
  ) {}

  /**
   * Valide les propriétés de l'analyse
   * @throws {Error} Si la validation échoue
   */
  validate(): void {
    if (this.confidence < 0 || this.confidence > 1) {
      throw new Error('La confiance doit être entre 0 et 1');
    }

    if (this.suggestions.length === 0) {
      throw new Error('L\'analyse doit contenir au moins une suggestion');
    }
  }

  /**
   * Détermine si l'analyse a une confiance élevée (>= 0.8)
   */
  isHighConfidence(): boolean {
    return this.confidence >= 0.8;
  }
}


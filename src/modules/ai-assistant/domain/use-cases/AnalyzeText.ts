import { IAIServicePort } from '../repositories/IAIServicePort';
import { IAIAnalysisRepository } from '../repositories/IAIAnalysisRepository';
import { IDocumentRepository } from '@modules/document/domain/repositories/IDocumentRepository';
import { AIAnalysis } from '../entities/AIAnalysis';
import {
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from '@shared/errors';
import { AnalysisType } from '@shared/types';

export interface AnalyzeTextInput {
  documentId: string;
  userId: string;
  analysisType: AnalysisType;
}

export interface AnalyzeTextOutput {
  analysis: AIAnalysis;
  suggestions: string[];
  confidence: number;
}

/**
 * Use Case : Analyser un document avec l'IA
 *
 * Responsabilités:
 * - Récupérer le document
 * - Vérifier les permissions
 * - Appeler le service IA approprié
 * - Sauvegarder l'analyse
 * - Retourner les résultats structurés
 */
export class AnalyzeText {
  constructor(
    private readonly documentRepository: IDocumentRepository,
    private readonly aiService: IAIServicePort,
    private readonly aiAnalysisRepository: IAIAnalysisRepository
  ) {}

  async execute(input: AnalyzeTextInput): Promise<AnalyzeTextOutput> {
    // 1. Récupérer le document
    const document = await this.documentRepository.findById(input.documentId);
    if (!document) {
      throw new NotFoundError('Document non trouvé');
    }

    // 2. Vérifier les permissions
    if (document.userId !== input.userId) {
      throw new UnauthorizedError(
        "Vous n'avez pas la permission d'analyser ce document"
      );
    }

    // 3. Analyser selon le type demandé
    let suggestions: string[];
    let confidence: number;

    switch (input.analysisType) {
      case 'syntax': {
        const result = await this.aiService.analyzeSyntax(
          document.content.text
        );
        suggestions = result.suggestions;
        confidence = result.confidence;
        break;
      }

      case 'style': {
        const result = await this.aiService.analyzeStyle(
          document.content.text,
          document.style
        );
        suggestions = result.suggestions;
        confidence = result.alignmentScore;
        break;
      }

      case 'progression': {
        const result = await this.aiService.suggestProgression(
          document.content.text,
          document.style
        );
        suggestions = result.suggestions;
        confidence = 0.85; // Score par défaut pour suggestions narratives
        break;
      }

      default: {
        const exhaustiveCheck: never = input.analysisType;
        throw new ValidationError(
          `Type d'analyse non supporté: ${String(exhaustiveCheck)}`
        );
      }
    }

    // 4. Créer l'entité AIAnalysis
    const analysis = new AIAnalysis(
      this.generateId(),
      document.id,
      input.analysisType,
      suggestions,
      confidence,
      new Date()
    );

    // 5. Valider l'analyse
    analysis.validate();

    // 6. Sauvegarder l'analyse pour historique
    await this.aiAnalysisRepository.save(analysis);

    return {
      analysis,
      suggestions,
      confidence,
    };
  }

  private generateId(): string {
    return `analysis_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

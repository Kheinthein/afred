import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/container';
import { AnalyzeText } from '@modules/ai-assistant/domain/use-cases/AnalyzeText';
import { AnalyzeTextDTOSchema } from '@modules/ai-assistant/application/dtos/AnalyzeTextDTO';
import { authenticateRequest } from '@/app/api/middleware/auth';
import { handleError } from '@/app/api/middleware/errorHandler';
import { logger } from '@shared/infrastructure/logger/WinstonLogger';

/**
 * POST /api/ai/analyze
 * Analyse un document avec l'IA
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = performance.now();

  try {
    // 1. Authentifier
    const { userId } = await authenticateRequest(request);

    // 2. Parser et valider le body
    const body = await request.json();
    const data = AnalyzeTextDTOSchema.parse(body);

    // 3. Analyser le document
    const analyzeText = container.get<AnalyzeText>(AnalyzeText);
    const result = await analyzeText.execute({
      documentId: data.documentId,
      userId,
      analysisType: data.analysisType,
    });

    // 4. Logger l'analyse
    const duration = performance.now() - startTime;
    logger.info({
      action: 'ai.analyze',
      userId,
      documentId: data.documentId,
      analysisType: data.analysisType,
      confidence: result.confidence,
      duration,
    });

    // 5. Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        analysis: {
          id: result.analysis.id,
          type: result.analysis.type,
          suggestions: result.analysis.suggestions,
          confidence: result.analysis.confidence,
          createdAt: result.analysis.createdAt,
        },
      },
      meta: {
        timestamp: new Date().toISOString(),
        processingTime: `${Math.round(duration)}ms`,
      },
    });
  } catch (error) {
    const duration = performance.now() - startTime;
    logger.error({
      action: 'ai.analyze.error',
      error: error instanceof Error ? error.message : 'Unknown error',
      duration,
    });

    return handleError(error);
  }
}


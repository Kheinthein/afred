import { NextResponse } from 'next/server';
import { AppError } from '@shared/errors';
import { logger } from '@shared/infrastructure/logger/WinstonLogger';
import { ZodError } from 'zod';

/**
 * Handler global des erreurs pour les API routes
 * Transforme les erreurs en réponses JSON structurées
 */
export function handleError(error: unknown): NextResponse {
  // Log l'erreur
  logger.error({
    error: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
  });

  // Erreur de validation Zod
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Erreur de validation',
          details: error.errors.map((e) => ({
            path: e.path.join('.'),
            message: e.message,
          })),
        },
      },
      { status: 400 }
    );
  }

  // Erreur applicative (AppError)
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.constructor.name,
          message: error.message,
        },
      },
      { status: error.statusCode }
    );
  }

  // Erreur générique
  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Une erreur interne est survenue',
      },
    },
    { status: 500 }
  );
}

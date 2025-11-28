import { z } from 'zod';

/**
 * DTO pour l'analyse IA avec validation Zod
 */
export const AnalyzeTextDTOSchema = z.object({
  documentId: z.string().min(1, 'L\'ID du document est requis'),
  analysisType: z.enum(['syntax', 'style', 'progression'], {
    errorMap: () => ({ message: 'Type d\'analyse invalide. Valeurs possibles: syntax, style, progression' }),
  }),
});

export type AnalyzeTextDTO = z.infer<typeof AnalyzeTextDTOSchema>;


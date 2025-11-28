import { z } from 'zod';
import { DOCUMENT_TITLE_MAX_LENGTH } from '@shared/constants';

/**
 * DTO pour la mise à jour de document avec validation Zod
 */
export const UpdateDocumentDTOSchema = z.object({
  title: z
    .string()
    .max(
      DOCUMENT_TITLE_MAX_LENGTH,
      `Le titre ne doit pas dépasser ${DOCUMENT_TITLE_MAX_LENGTH} caractères`
    )
    .optional(),
  content: z.string().optional(),
});

export type UpdateDocumentDTO = z.infer<typeof UpdateDocumentDTOSchema>;

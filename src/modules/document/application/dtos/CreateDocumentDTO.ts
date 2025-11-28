import { z } from 'zod';
import { DOCUMENT_TITLE_MAX_LENGTH } from '@shared/constants';

/**
 * DTO pour la création de document avec validation Zod
 */
export const CreateDocumentDTOSchema = z.object({
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(DOCUMENT_TITLE_MAX_LENGTH, `Le titre ne doit pas dépasser ${DOCUMENT_TITLE_MAX_LENGTH} caractères`),
  content: z.string().min(1, 'Le contenu est requis'),
  styleId: z.string().min(1, 'Le style d\'écriture est requis'),
});

export type CreateDocumentDTO = z.infer<typeof CreateDocumentDTOSchema>;


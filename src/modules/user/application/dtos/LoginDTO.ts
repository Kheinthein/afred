import { z } from 'zod';

/**
 * DTO pour le login avec validation Zod
 */
export const LoginDTOSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

export type LoginDTO = z.infer<typeof LoginDTOSchema>;


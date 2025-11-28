import { z } from 'zod';
import { PASSWORD_MIN_LENGTH } from '@shared/constants';

/**
 * DTO pour la création d'utilisateur avec validation Zod
 */
export const CreateUserDTOSchema = z.object({
  email: z.string().email('Format d\'email invalide'),
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `Le mot de passe doit contenir au moins ${PASSWORD_MIN_LENGTH} caractères`),
});

export type CreateUserDTO = z.infer<typeof CreateUserDTOSchema>;


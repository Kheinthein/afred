import { IDocumentRepository } from '../repositories/IDocumentRepository';
import { NotFoundError, UnauthorizedError } from '@shared/errors';

export interface DeleteDocumentInput {
  documentId: string;
  userId: string;
}

/**
 * Use Case : Supprimer un document
 *
 * Responsabilités:
 * - Récupérer le document
 * - Vérifier les permissions
 * - Supprimer le document
 */
export class DeleteDocument {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: DeleteDocumentInput): Promise<void> {
    // 1. Récupérer le document
    const document = await this.documentRepository.findById(input.documentId);
    if (!document) {
      throw new NotFoundError('Document non trouvé');
    }

    // 2. Vérifier les permissions
    if (document.userId !== input.userId) {
      throw new UnauthorizedError(
        "Vous n'avez pas la permission de supprimer ce document"
      );
    }

    // 3. Supprimer
    await this.documentRepository.delete(input.documentId);
  }
}

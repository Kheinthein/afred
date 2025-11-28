import { Document } from '../entities/Document';
import { DocumentContent } from '../value-objects/DocumentContent';
import { IDocumentRepository } from '../repositories/IDocumentRepository';
import { NotFoundError, UnauthorizedError, ValidationError } from '@shared/errors';

export interface UpdateDocumentInput {
  documentId: string;
  userId: string;
  title?: string;
  content?: string;
}

export interface UpdateDocumentOutput {
  document: Document;
}

/**
 * Use Case : Mettre à jour un document
 *
 * Responsabilités:
 * - Récupérer le document
 * - Vérifier les permissions
 * - Mettre à jour les champs modifiés
 * - Sauvegarder
 */
export class UpdateDocument {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: UpdateDocumentInput): Promise<UpdateDocumentOutput> {
    // 1. Récupérer le document
    const document = await this.documentRepository.findById(input.documentId);
    if (!document) {
      throw new NotFoundError('Document non trouvé');
    }

    // 2. Vérifier les permissions
    if (document.userId !== input.userId) {
      throw new UnauthorizedError(
        'Vous n\'avez pas la permission de modifier ce document'
      );
    }

    // 3. Vérifier qu'il y a au moins une mise à jour
    if (!input.title && !input.content) {
      throw new ValidationError('Aucune mise à jour fournie');
    }

    // 4. Mettre à jour le titre si fourni
    if (input.title !== undefined) {
      document.title = input.title;
      document.updatedAt = new Date();
    }

    // 5. Mettre à jour le contenu si fourni (incrémente version)
    if (input.content !== undefined) {
      const newContent = new DocumentContent(input.content);
      document.updateContent(newContent);
    }

    // 6. Valider le document
    document.validate();

    // 7. Sauvegarder
    await this.documentRepository.save(document);

    return { document };
  }
}


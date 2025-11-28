import { Document } from '../entities/Document';
import { IDocumentRepository } from '../repositories/IDocumentRepository';

export interface GetUserDocumentsInput {
  userId: string;
}

export interface GetUserDocumentsOutput {
  documents: Document[];
}

/**
 * Use Case : Récupérer tous les documents d'un utilisateur
 *
 * Responsabilités:
 * - Récupérer les documents via le repository
 * - Les retourner triés par date de mise à jour (le plus récent en premier)
 */
export class GetUserDocuments {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: GetUserDocumentsInput): Promise<GetUserDocumentsOutput> {
    const documents = await this.documentRepository.findByUserId(input.userId);

    documents.sort((a, b) => {
      if (a.sortOrder !== b.sortOrder) {
        return a.sortOrder - b.sortOrder;
      }
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    return { documents };
  }
}

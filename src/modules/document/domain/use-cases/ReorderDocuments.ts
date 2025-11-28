import { ValidationError } from '@shared/errors';
import { IDocumentRepository } from '../repositories/IDocumentRepository';

export interface ReorderDocumentsInput {
  userId: string;
  documentIds: string[];
}

export class ReorderDocuments {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute({ userId, documentIds }: ReorderDocumentsInput): Promise<void> {
    if (!documentIds || documentIds.length === 0) {
      throw new ValidationError('La liste des documents est vide');
    }

    const uniqueIds = Array.from(new Set(documentIds));
    if (uniqueIds.length !== documentIds.length) {
      throw new ValidationError('La liste contient des doublons');
    }

    const documents = await this.documentRepository.findByUserId(userId);
    if (documents.length !== uniqueIds.length) {
      throw new ValidationError('Tous les documents doivent être inclus');
    }

    const documentIdSet = new Set(documents.map((doc) => doc.id));
    const unknownId = uniqueIds.find((id) => !documentIdSet.has(id));
    if (unknownId) {
      throw new ValidationError(`Document inconnu: ${unknownId}`);
    }

    await this.documentRepository.updateSortOrders(
      userId,
      uniqueIds.map((id, index) => ({ id, sortOrder: index }))
    );
  }
}

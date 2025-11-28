import { ValidationError } from '@shared/errors';
import { Document } from '../entities/Document';
import { WritingStyle } from '../entities/WritingStyle';
import { IDocumentRepository } from '../repositories/IDocumentRepository';
import { DocumentContent } from '../value-objects/DocumentContent';

export interface CreateDocumentInput {
  userId: string;
  title: string;
  content: string;
  style: WritingStyle;
}

export interface CreateDocumentOutput {
  document: Document;
}

/**
 * Use Case : Créer un nouveau document
 *
 * Responsabilités:
 * - Valider les données d'entrée
 * - Créer le DocumentContent
 * - Créer l'entité Document
 * - Sauvegarder via le repository
 */
export class CreateDocument {
  constructor(private readonly documentRepository: IDocumentRepository) {}

  async execute(input: CreateDocumentInput): Promise<CreateDocumentOutput> {
    // 1. Valider les entrées
    if (!input.userId || input.userId.trim().length === 0) {
      throw new ValidationError("L'ID utilisateur est requis");
    }

    if (!input.title || input.title.trim().length === 0) {
      throw new ValidationError('Le titre est requis');
    }

    if (!input.style) {
      throw new ValidationError("Le style d'écriture est requis");
    }

    // 2. Créer le contenu
    const content = new DocumentContent(input.content);

    // 3. Créer le document
    const now = new Date();
    const sortOrder = Date.now();
    const document = new Document(
      this.generateId(),
      input.userId,
      input.title,
      content,
      input.style,
      1, // Version initiale
      now,
      now,
      sortOrder
    );

    // 4. Valider le document
    document.validate();

    // 5. Sauvegarder
    await this.documentRepository.save(document);

    return { document };
  }

  private generateId(): string {
    return `doc_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }
}

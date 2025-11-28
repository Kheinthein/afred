import { Document } from '@modules/document/domain/entities/Document';
import { WritingStyle } from '@modules/document/domain/entities/WritingStyle';
import { IDocumentRepository } from '@modules/document/domain/repositories/IDocumentRepository';
/* eslint-disable @typescript-eslint/unbound-method */

import { UpdateDocument } from '@modules/document/domain/use-cases/UpdateDocument';
import { DocumentContent } from '@modules/document/domain/value-objects/DocumentContent';
import { NotFoundError, UnauthorizedError } from '@shared/errors';

describe('UpdateDocument Use Case', () => {
  let updateDocument: UpdateDocument;
  let mockDocumentRepository: jest.Mocked<IDocumentRepository>;
  let mockStyle: WritingStyle;
  let existingDocument: Document;

  beforeEach(() => {
    mockDocumentRepository = {
      findById: jest.fn(),
      findByUserId: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      countByUserId: jest.fn(),
      updateSortOrders: jest.fn(),
    };

    mockStyle = new WritingStyle('style-1', 'Roman', 'Style roman');
    existingDocument = new Document(
      'doc-123',
      'user-456',
      'Titre Original',
      new DocumentContent('Contenu original'),
      mockStyle,
      1,
      new Date('2024-01-01'),
      new Date('2024-01-01')
    );

    updateDocument = new UpdateDocument(mockDocumentRepository);
  });

  describe('Cas nominaux', () => {
    it('devrait mettre à jour le contenu et incrémenter la version', async () => {
      mockDocumentRepository.findById.mockResolvedValue(existingDocument);
      mockDocumentRepository.save.mockResolvedValue();

      const result = await updateDocument.execute({
        documentId: 'doc-123',
        userId: 'user-456',
        content: 'Nouveau contenu',
      });

      expect(result.document.content.text).toBe('Nouveau contenu');
      expect(result.document.version).toBe(2);
      expect(mockDocumentRepository.save).toHaveBeenCalledWith(
        existingDocument
      );
    });

    it('devrait mettre à jour uniquement le titre', async () => {
      mockDocumentRepository.findById.mockResolvedValue(existingDocument);
      mockDocumentRepository.save.mockResolvedValue();

      const result = await updateDocument.execute({
        documentId: 'doc-123',
        userId: 'user-456',
        title: 'Nouveau Titre',
      });

      expect(result.document.title).toBe('Nouveau Titre');
      expect(result.document.content.text).toBe('Contenu original');
      expect(result.document.version).toBe(1); // Version ne change pas si seulement titre
    });

    it('devrait mettre à jour titre et contenu', async () => {
      mockDocumentRepository.findById.mockResolvedValue(existingDocument);
      mockDocumentRepository.save.mockResolvedValue();

      const result = await updateDocument.execute({
        documentId: 'doc-123',
        userId: 'user-456',
        title: 'Nouveau Titre',
        content: 'Nouveau contenu',
      });

      expect(result.document.title).toBe('Nouveau Titre');
      expect(result.document.content.text).toBe('Nouveau contenu');
      expect(result.document.version).toBe(2);
    });

    it('devrait mettre à jour updatedAt', async () => {
      mockDocumentRepository.findById.mockResolvedValue(existingDocument);
      mockDocumentRepository.save.mockResolvedValue();
      const before = new Date();

      const result = await updateDocument.execute({
        documentId: 'doc-123',
        userId: 'user-456',
        content: 'Nouveau contenu',
      });

      expect(result.document.updatedAt.getTime()).toBeGreaterThanOrEqual(
        before.getTime()
      );
    });
  });

  describe('Erreurs', () => {
    it("devrait rejeter si le document n'existe pas", async () => {
      mockDocumentRepository.findById.mockResolvedValue(null);

      await expect(
        updateDocument.execute({
          documentId: 'doc-999',
          userId: 'user-456',
          content: 'Contenu',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it("devrait rejeter si l'utilisateur n'est pas le propriétaire", async () => {
      mockDocumentRepository.findById.mockResolvedValue(existingDocument);

      await expect(
        updateDocument.execute({
          documentId: 'doc-123',
          userId: 'user-999', // Différent user
          content: 'Contenu',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('devrait rejeter si aucune mise à jour fournie', async () => {
      mockDocumentRepository.findById.mockResolvedValue(existingDocument);

      await expect(
        updateDocument.execute({
          documentId: 'doc-123',
          userId: 'user-456',
        })
      ).rejects.toThrow('Aucune mise à jour fournie');
    });
  });
});

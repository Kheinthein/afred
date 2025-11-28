import { Document } from '@modules/document/domain/entities/Document';
import { WritingStyle } from '@modules/document/domain/entities/WritingStyle';
import { DocumentContent } from '@modules/document/domain/value-objects/DocumentContent';

describe('Document Entity', () => {
  let style: WritingStyle;

  beforeEach(() => {
    style = new WritingStyle('style-1', 'Roman', 'Style roman');
  });

  describe('Construction', () => {
    it('devrait créer un document valide', () => {
      const content = new DocumentContent('Il était une fois...');
      const doc = new Document(
        'doc-123',
        'user-456',
        'Mon Premier Roman',
        content,
        style,
        1,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(doc.id).toBe('doc-123');
      expect(doc.userId).toBe('user-456');
      expect(doc.title).toBe('Mon Premier Roman');
      expect(doc.content).toBe(content);
      expect(doc.style).toBe(style);
      expect(doc.version).toBe(1);
    });
  });

  describe('updateContent', () => {
    it('devrait mettre à jour le contenu et incrémenter la version', () => {
      const initialContent = new DocumentContent('Texte initial');
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        initialContent,
        style,
        1,
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      const newContent = new DocumentContent('Nouveau texte');
      const beforeUpdate = doc.updatedAt;

      // Attendre 1ms pour s'assurer que updatedAt change
      setTimeout(() => {
        doc.updateContent(newContent);

        expect(doc.content).toBe(newContent);
        expect(doc.version).toBe(2);
        expect(doc.updatedAt.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
      }, 1);
    });

    it('devrait incrémenter la version à chaque mise à jour', () => {
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        new DocumentContent('Texte'),
        style,
        1,
        new Date(),
        new Date()
      );

      doc.updateContent(new DocumentContent('Texte 2'));
      expect(doc.version).toBe(2);

      doc.updateContent(new DocumentContent('Texte 3'));
      expect(doc.version).toBe(3);

      doc.updateContent(new DocumentContent('Texte 4'));
      expect(doc.version).toBe(4);
    });
  });

  describe('needsAIAnalysis', () => {
    it('devrait retourner true pour un document avec >100 mots et version multiple de 5', () => {
      const content = new DocumentContent('mot '.repeat(150)); // 150 mots
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        content,
        style,
        5,
        new Date(),
        new Date()
      );

      expect(doc.needsAIAnalysis()).toBe(true);
    });

    it('devrait retourner false pour un document avec <100 mots', () => {
      const content = new DocumentContent('Court texte'); // 2 mots
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        content,
        style,
        5,
        new Date(),
        new Date()
      );

      expect(doc.needsAIAnalysis()).toBe(false);
    });

    it('devrait retourner false pour une version non multiple de 5', () => {
      const content = new DocumentContent('mot '.repeat(150)); // 150 mots
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        content,
        style,
        7,
        new Date(),
        new Date()
      );

      expect(doc.needsAIAnalysis()).toBe(false);
    });

    it('devrait retourner true pour version 10', () => {
      const content = new DocumentContent('mot '.repeat(150));
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        content,
        style,
        10,
        new Date(),
        new Date()
      );

      expect(doc.needsAIAnalysis()).toBe(true);
    });
  });

  describe('Validation', () => {
    it('devrait valider un document correct', () => {
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        new DocumentContent('Contenu'),
        style,
        1,
        new Date(),
        new Date(),
        0
      );

      expect(() => doc.validate()).not.toThrow();
    });

    it('devrait rejeter un document sans titre', () => {
      const doc = new Document(
        'doc-123',
        'user-456',
        '',
        new DocumentContent('Contenu'),
        style,
        1,
        new Date(),
        new Date(),
        0
      );

      expect(() => doc.validate()).toThrow('Le titre ne peut pas être vide');
    });

    it('devrait rejeter un document avec contenu vide', () => {
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        new DocumentContent(''),
        style,
        1,
        new Date(),
        new Date(),
        0
      );

      expect(() => doc.validate()).toThrow('Le document ne peut pas être vide');
    });
  });

  describe('updateSortOrder', () => {
    it('devrait mettre à jour le sortOrder', () => {
      const doc = new Document(
        'doc-123',
        'user-456',
        'Titre',
        new DocumentContent('Contenu'),
        style,
        1,
        new Date(),
        new Date(),
        0
      );

      doc.updateSortOrder(5);
      expect(doc.sortOrder).toBe(5);
    });
  });
});


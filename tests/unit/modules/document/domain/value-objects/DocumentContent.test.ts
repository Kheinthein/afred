import { DocumentContent } from '@modules/document/domain/value-objects/DocumentContent';
import { ValidationError } from '@shared/errors';

describe('DocumentContent Value Object', () => {
  describe('Construction', () => {
    it('devrait créer un contenu avec le texte et compter les mots', () => {
      const content = new DocumentContent('Bonjour le monde');
      
      expect(content.text).toBe('Bonjour le monde');
      expect(content.wordCount).toBe(3);
    });

    it('devrait compter correctement les mots avec ponctuation', () => {
      const content = new DocumentContent('Bonjour, comment allez-vous aujourd\'hui?');
      
      expect(content.wordCount).toBe(4);
    });

    it('devrait accepter un contenu vide', () => {
      const content = new DocumentContent('');
      
      expect(content.text).toBe('');
      expect(content.wordCount).toBe(0);
    });

    it('devrait ignorer les espaces multiples', () => {
      const content = new DocumentContent('Bonjour    le    monde');
      
      expect(content.wordCount).toBe(3);
    });

    it('devrait compter les mots sur plusieurs lignes', () => {
      const content = new DocumentContent('Ligne 1\nLigne 2\nLigne 3');
      
      expect(content.wordCount).toBe(6);
    });
  });

  describe('Validation', () => {
    it('devrait rejeter un contenu null', () => {
      expect(() => new DocumentContent(null as unknown as string)).toThrow(
        ValidationError
      );
    });

    it('devrait rejeter un contenu undefined', () => {
      expect(() => new DocumentContent(undefined as unknown as string)).toThrow(
        ValidationError
      );
    });

    it('devrait accepter un texte très long', () => {
      const longText = 'mot '.repeat(100000);
      const content = new DocumentContent(longText);
      
      expect(content.wordCount).toBe(100000);
    });
  });

  describe('Méthodes utilitaires', () => {
    it('devrait retourner le texte avec toString', () => {
      const content = new DocumentContent('Test');
      
      expect(content.toString()).toBe('Test');
    });

    it('devrait calculer le nombre de caractères', () => {
      const content = new DocumentContent('Bonjour');
      
      expect(content.characterCount).toBe(7);
    });

    it('devrait détecter si le contenu est vide', () => {
      const emptyContent = new DocumentContent('');
      const nonEmptyContent = new DocumentContent('Texte');
      
      expect(emptyContent.isEmpty()).toBe(true);
      expect(nonEmptyContent.isEmpty()).toBe(false);
    });
  });
});


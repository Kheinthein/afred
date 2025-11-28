import { WritingStyle } from '@modules/document/domain/entities/WritingStyle';

describe('WritingStyle Entity', () => {
  describe('Construction', () => {
    it("devrait créer un style d'écriture valide", () => {
      const style = new WritingStyle(
        'style-123',
        'Roman',
        'Récit long avec développement approfondi'
      );

      expect(style.id).toBe('style-123');
      expect(style.name).toBe('Roman');
      expect(style.description).toBe(
        'Récit long avec développement approfondi'
      );
    });
  });

  describe('Validation', () => {
    it('devrait valider un style correct', () => {
      const style = new WritingStyle('style-123', 'Roman', 'Description');

      expect(() => style.validate()).not.toThrow();
    });

    it('devrait rejeter un style sans nom', () => {
      const style = new WritingStyle('style-123', '', 'Description');

      expect(() => style.validate()).toThrow('Le nom du style est requis');
    });

    it('devrait rejeter un style sans description', () => {
      const style = new WritingStyle('style-123', 'Roman', '');

      expect(() => style.validate()).toThrow(
        'La description du style est requise'
      );
    });
  });
});

import { AIAnalysis } from '@modules/ai-assistant/domain/entities/AIAnalysis';

describe('AIAnalysis Entity', () => {
  describe('Construction', () => {
    it('devrait créer une analyse IA valide', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Corriger la ponctuation', 'Ajouter des virgules'],
        0.95,
        new Date('2024-01-01'),
        { model: 'claude-3-5-sonnet' }
      );

      expect(analysis.id).toBe('analysis-123');
      expect(analysis.documentId).toBe('doc-456');
      expect(analysis.type).toBe('syntax');
      expect(analysis.suggestions).toHaveLength(2);
      expect(analysis.confidence).toBe(0.95);
      expect(analysis.metadata).toEqual({ model: 'claude-3-5-sonnet' });
    });

    it('devrait accepter metadata optionnel', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        0.9,
        new Date()
      );

      expect(analysis.metadata).toBeUndefined();
    });
  });

  describe('Validation', () => {
    it('devrait valider une analyse correcte', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        0.9,
        new Date()
      );

      expect(() => analysis.validate()).not.toThrow();
    });

    it('devrait rejeter une confiance < 0', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        -0.1,
        new Date()
      );

      expect(() => analysis.validate()).toThrow(
        'La confiance doit être entre 0 et 1'
      );
    });

    it('devrait rejeter une confiance > 1', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        1.5,
        new Date()
      );

      expect(() => analysis.validate()).toThrow(
        'La confiance doit être entre 0 et 1'
      );
    });

    it('devrait accepter confiance 0', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        0,
        new Date()
      );

      expect(() => analysis.validate()).not.toThrow();
    });

    it('devrait accepter confiance 1', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        1,
        new Date()
      );

      expect(() => analysis.validate()).not.toThrow();
    });

    it('devrait rejeter des suggestions vides', () => {
      const analysis = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        [],
        0.9,
        new Date()
      );

      expect(() => analysis.validate()).toThrow(
        "L'analyse doit contenir au moins une suggestion"
      );
    });
  });

  describe('Méthodes utilitaires', () => {
    it('devrait détecter une confiance élevée', () => {
      const highConfidence = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        0.9,
        new Date()
      );

      expect(highConfidence.isHighConfidence()).toBe(true);
    });

    it('devrait détecter une confiance basse', () => {
      const lowConfidence = new AIAnalysis(
        'analysis-123',
        'doc-456',
        'syntax',
        ['Suggestion'],
        0.6,
        new Date()
      );

      expect(lowConfidence.isHighConfidence()).toBe(false);
    });
  });
});

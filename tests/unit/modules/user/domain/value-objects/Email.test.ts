import { Email } from '@modules/user/domain/value-objects/Email';
import { ValidationError } from '@shared/errors';

describe('Email Value Object', () => {
  describe('Construction', () => {
    it('devrait créer un email valide', () => {
      const email = new Email('test@example.com');
      expect(email.value).toBe('test@example.com');
    });

    it('devrait normaliser l\'email en minuscules', () => {
      const email = new Email('TEST@EXAMPLE.COM');
      expect(email.value).toBe('test@example.com');
    });

    it('devrait retirer les espaces', () => {
      const email = new Email('  test@example.com  ');
      expect(email.value).toBe('test@example.com');
    });
  });

  describe('Validation', () => {
    it('devrait accepter des emails valides', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.co.uk',
        'user+tag@example.com',
        'user_123@example-domain.com',
      ];

      validEmails.forEach((emailStr) => {
        expect(() => new Email(emailStr)).not.toThrow();
      });
    });

    it('devrait rejeter un email vide', () => {
      expect(() => new Email('')).toThrow(ValidationError);
      expect(() => new Email('')).toThrow('L\'email ne peut pas être vide');
    });

    it('devrait rejeter un email sans @', () => {
      expect(() => new Email('testexample.com')).toThrow(ValidationError);
      expect(() => new Email('testexample.com')).toThrow(
        'Format d\'email invalide'
      );
    });

    it('devrait rejeter un email sans domaine', () => {
      expect(() => new Email('test@')).toThrow(ValidationError);
    });

    it('devrait rejeter un email sans nom d\'utilisateur', () => {
      expect(() => new Email('@example.com')).toThrow(ValidationError);
    });

    it('devrait rejeter un email avec espaces à l\'intérieur', () => {
      expect(() => new Email('test name@example.com')).toThrow(ValidationError);
    });
  });

  describe('Égalité', () => {
    it('devrait considérer deux emails identiques comme égaux', () => {
      const email1 = new Email('test@example.com');
      const email2 = new Email('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('devrait ignorer la casse pour l\'égalité', () => {
      const email1 = new Email('TEST@EXAMPLE.COM');
      const email2 = new Email('test@example.com');

      expect(email1.equals(email2)).toBe(true);
    });

    it('devrait considérer des emails différents comme non égaux', () => {
      const email1 = new Email('test1@example.com');
      const email2 = new Email('test2@example.com');

      expect(email1.equals(email2)).toBe(false);
    });
  });
});


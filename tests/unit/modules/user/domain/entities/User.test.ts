import { User } from '@modules/user/domain/entities/User';
import bcrypt from 'bcryptjs';

describe('User Entity', () => {
  describe('Construction', () => {
    it('devrait créer un utilisateur valide', () => {
      const user = new User(
        'user-123',
        'test@example.com',
        'hashedpassword123',
        new Date('2024-01-01'),
        new Date('2024-01-01')
      );

      expect(user.id).toBe('user-123');
      expect(user.email).toBe('test@example.com');
      expect(user.passwordHash).toBe('hashedpassword123');
      expect(user.createdAt).toEqual(new Date('2024-01-01'));
      expect(user.updatedAt).toEqual(new Date('2024-01-01'));
    });
  });

  describe('Validation', () => {
    it('devrait valider un utilisateur correct', () => {
      const user = new User(
        'user-123',
        'test@example.com',
        'hashedpassword123',
        new Date(),
        new Date()
      );

      expect(() => user.validate()).not.toThrow();
    });

    it('devrait rejeter un utilisateur sans email', () => {
      const user = new User(
        'user-123',
        '',
        'hashedpassword123',
        new Date(),
        new Date()
      );

      expect(() => user.validate()).toThrow('L\'email est requis');
    });

    it('devrait rejeter un utilisateur sans password hash', () => {
      const user = new User(
        'user-123',
        'test@example.com',
        '',
        new Date(),
        new Date()
      );

      expect(() => user.validate()).toThrow(
        'Le mot de passe hashé est requis'
      );
    });
  });

  describe('comparePassword', () => {
    it('devrait retourner true pour un mot de passe correct', async () => {
      const hash = await bcrypt.hash('secret', 10);
      const user = new User('user-123', 'test@example.com', hash, new Date(), new Date());

      const isValid = await user.comparePassword('secret');
      expect(isValid).toBe(true);
    });

    it('devrait retourner false pour un mot de passe incorrect', async () => {
      const hash = await bcrypt.hash('secret', 10);
      const user = new User('user-123', 'test@example.com', hash, new Date(), new Date());

      const isValid = await user.comparePassword('wrong');
      expect(isValid).toBe(false);
    });
  });
});


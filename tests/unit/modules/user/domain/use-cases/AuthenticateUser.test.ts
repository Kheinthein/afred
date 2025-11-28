/* eslint-disable @typescript-eslint/unbound-method */

import { AuthenticateUser } from '@modules/user/domain/use-cases/AuthenticateUser';
import { IUserRepository } from '@modules/user/domain/repositories/IUserRepository';
import { User } from '@modules/user/domain/entities/User';
import { UnauthorizedError } from '@shared/errors';
import bcrypt from 'bcryptjs';

describe('AuthenticateUser Use Case', () => {
  let authenticateUser: AuthenticateUser;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      emailExists: jest.fn(),
    };

    authenticateUser = new AuthenticateUser(mockUserRepository);
  });

  describe('Cas nominaux', () => {
    it('devrait authentifier un utilisateur avec les bons credentials', async () => {
      const passwordHash = await bcrypt.hash('SecurePassword123', 10);
      const user = new User(
        'user-123',
        'test@example.com',
        passwordHash,
        new Date(),
        new Date()
      );

      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await authenticateUser.execute({
        email: 'test@example.com',
        password: 'SecurePassword123',
      });

      expect(result.user).toBe(user);
      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe('test@example.com');
    });

    it("devrait accepter l'email en majuscules", async () => {
      const passwordHash = await bcrypt.hash('SecurePassword123', 10);
      const user = new User(
        'user-123',
        'test@example.com',
        passwordHash,
        new Date(),
        new Date()
      );

      mockUserRepository.findByEmail.mockResolvedValue(user);

      const result = await authenticateUser.execute({
        email: 'TEST@EXAMPLE.COM',
        password: 'SecurePassword123',
      });

      expect(result.user).toBe(user);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
        'test@example.com'
      );
    });
  });

  describe("Erreurs d'authentification", () => {
    it("devrait rejeter si l'utilisateur n'existe pas", async () => {
      mockUserRepository.findByEmail.mockResolvedValue(null);

      await expect(
        authenticateUser.execute({
          email: 'nonexistent@example.com',
          password: 'Password123',
        })
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        authenticateUser.execute({
          email: 'nonexistent@example.com',
          password: 'Password123',
        })
      ).rejects.toThrow('Email ou mot de passe incorrect');
    });

    it('devrait rejeter si le mot de passe est incorrect', async () => {
      const passwordHash = await bcrypt.hash('CorrectPassword', 10);
      const user = new User(
        'user-123',
        'test@example.com',
        passwordHash,
        new Date(),
        new Date()
      );

      mockUserRepository.findByEmail.mockResolvedValue(user);

      await expect(
        authenticateUser.execute({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
      ).rejects.toThrow(UnauthorizedError);
      await expect(
        authenticateUser.execute({
          email: 'test@example.com',
          password: 'WrongPassword',
        })
      ).rejects.toThrow('Email ou mot de passe incorrect');
    });

    it('devrait rejeter un email vide', async () => {
      await expect(
        authenticateUser.execute({
          email: '',
          password: 'Password123',
        })
      ).rejects.toThrow();
    });

    it('devrait rejeter un mot de passe vide', async () => {
      await expect(
        authenticateUser.execute({
          email: 'test@example.com',
          password: '',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('Edge cases', () => {
    it.each([null, undefined])('devrait rejeter email: %p', async (email) => {
      await expect(
        authenticateUser.execute({
          email: (email as unknown) as string,
          password: 'Password123',
        })
      ).rejects.toThrow();
    });

    it.each([null, undefined, ''])(
      'devrait rejeter password: %p',
      async (pwd) => {
        await expect(
          authenticateUser.execute({
            email: 'test@example.com',
            password: pwd as string,
          })
        ).rejects.toThrow();
      }
    );
  });
});

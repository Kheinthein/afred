/* eslint-disable @typescript-eslint/unbound-method */

import { CreateUser } from '@modules/user/domain/use-cases/CreateUser';
import { IUserRepository } from '@modules/user/domain/repositories/IUserRepository';
import { User } from '@modules/user/domain/entities/User';
import { ValidationError } from '@shared/errors';

describe('CreateUser Use Case', () => {
  let createUser: CreateUser;
  let mockUserRepository: jest.Mocked<IUserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      emailExists: jest.fn(),
    };

    createUser = new CreateUser(mockUserRepository);
  });

  describe('Cas nominaux', () => {
    it('devrait créer un utilisateur avec succès', async () => {
      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.save.mockResolvedValue();

      const result = await createUser.execute({
        email: 'test@example.com',
        password: 'SecurePassword123',
      });

      expect(result.user.email).toBe('test@example.com');
      expect(result.user.passwordHash).toBeDefined();
      expect(result.user.passwordHash).not.toBe('SecurePassword123'); // Devrait être hashé
      expect(mockUserRepository.save).toHaveBeenCalledWith(expect.any(User));
    });

    it('devrait hasher le mot de passe', async () => {
      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.save.mockResolvedValue();

      const result = await createUser.execute({
        email: 'test@example.com',
        password: 'SecurePassword123',
      });

      // Le hash bcrypt commence toujours par $2a$ ou $2b$
      expect(result.user.passwordHash).toMatch(/^\$2[ab]\$/);
    });

    it("devrait normaliser l'email en minuscules", async () => {
      mockUserRepository.emailExists.mockResolvedValue(false);
      mockUserRepository.save.mockResolvedValue();

      const result = await createUser.execute({
        email: 'TEST@EXAMPLE.COM',
        password: 'SecurePassword123',
      });

      expect(result.user.email).toBe('test@example.com');
    });
  });

  describe('Validation', () => {
    it('devrait rejeter un email invalide', async () => {
      await expect(
        createUser.execute({
          email: 'invalid-email',
          password: 'SecurePassword123',
        })
      ).rejects.toThrow(ValidationError);
    });

    it('devrait rejeter un mot de passe trop court', async () => {
      await expect(
        createUser.execute({
          email: 'test@example.com',
          password: 'short',
        })
      ).rejects.toThrow(ValidationError);
      await expect(
        createUser.execute({
          email: 'test@example.com',
          password: 'short',
        })
      ).rejects.toThrow('au moins 8 caractères');
    });

    it("devrait rejeter si l'email existe déjà", async () => {
      mockUserRepository.emailExists.mockResolvedValue(true);

      await expect(
        createUser.execute({
          email: 'test@example.com',
          password: 'SecurePassword123',
        })
      ).rejects.toThrow(ValidationError);
      await expect(
        createUser.execute({
          email: 'test@example.com',
          password: 'SecurePassword123',
        })
      ).rejects.toThrow('déjà utilisé');
    });
  });

  describe('Edge cases', () => {
    it.each([null, undefined, ''])(
      'devrait rejeter email: %p',
      async (email) => {
        await expect(
          createUser.execute({
            email: email as string,
            password: 'SecurePassword123',
          })
        ).rejects.toThrow();
      }
    );

    it.each([null, undefined, ''])(
      'devrait rejeter password: %p',
      async (pwd) => {
        await expect(
          createUser.execute({
            email: 'test@example.com',
            password: pwd as string,
          })
        ).rejects.toThrow();
      }
    );
  });
});

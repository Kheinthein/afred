import { CreateUser } from '@modules/user/domain/use-cases/CreateUser';
import { AuthenticateUser } from '@modules/user/domain/use-cases/AuthenticateUser';
import { User } from '@modules/user/domain/entities/User';
import { generateToken } from '@shared/infrastructure/auth/jwt';

export interface RegisterResult {
  user: User;
  token: string;
}

export interface LoginResult {
  user: User;
  token: string;
}

/**
 * Service applicatif User
 * Orchestre les use cases et ajoute la génération de JWT
 */
export class UserService {
  constructor(
    private readonly createUser: CreateUser,
    private readonly authenticateUser: AuthenticateUser
  ) {}

  async register(email: string, password: string): Promise<RegisterResult> {
    const { user } = await this.createUser.execute({ email, password });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }

  async login(email: string, password: string): Promise<LoginResult> {
    const { user } = await this.authenticateUser.execute({ email, password });

    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    return { user, token };
  }
}


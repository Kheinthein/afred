import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/container';
import { UserService } from '@modules/user/application/services/UserService';
import { CreateUserDTOSchema } from '@modules/user/application/dtos/CreateUserDTO';
import { handleError } from '@/app/api/middleware/errorHandler';
import {
  rateLimitMiddleware,
  RATE_LIMIT_CONFIGS,
} from '@/app/api/middleware/rateLimit';

/**
 * POST /api/auth/register
 * Crée un nouvel utilisateur
 * Rate limit: 5 inscriptions par 15 minutes (protection spam)
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Vérifier le rate limit (strict pour auth)
    const rateLimitResponse = rateLimitMiddleware(
      request,
      RATE_LIMIT_CONFIGS.auth
    );
    if (rateLimitResponse) return rateLimitResponse;

    // 2. Parser et valider le body
    const body: unknown = await request.json();
    const data = CreateUserDTOSchema.parse(body);

    // 3. Exécuter le service
    const userService = container.get<UserService>(UserService);
    const result = await userService.register(data.email, data.password);

    // 4. Retourner la réponse
    return NextResponse.json(
      {
        success: true,
        data: {
          user: {
            id: result.user.id,
            email: result.user.email,
            createdAt: result.user.createdAt,
          },
          token: result.token,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return handleError(error);
  }
}

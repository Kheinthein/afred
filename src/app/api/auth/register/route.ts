import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/container';
import { UserService } from '@modules/user/application/services/UserService';
import { CreateUserDTOSchema } from '@modules/user/application/dtos/CreateUserDTO';
import { handleError } from '@/app/api/middleware/errorHandler';

/**
 * POST /api/auth/register
 * Crée un nouvel utilisateur
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parser et valider le body
    const body = await request.json();
    const data = CreateUserDTOSchema.parse(body);

    // 2. Exécuter le service
    const userService = container.get<UserService>(UserService);
    const result = await userService.register(data.email, data.password);

    // 3. Retourner la réponse
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


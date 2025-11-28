import { NextRequest, NextResponse } from 'next/server';
import { container } from '@/container';
import { UserService } from '@modules/user/application/services/UserService';
import { LoginDTOSchema } from '@modules/user/application/dtos/LoginDTO';
import { handleError } from '@/app/api/middleware/errorHandler';

/**
 * POST /api/auth/login
 * Authentifie un utilisateur
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // 1. Parser et valider le body
    const body = await request.json();
    const data = LoginDTOSchema.parse(body);

    // 2. Exécuter le service
    const userService = container.get<UserService>(UserService);
    const result = await userService.login(data.email, data.password);

    // 3. Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: result.user.id,
          email: result.user.email,
        },
        token: result.token,
      },
    });
  } catch (error) {
    return handleError(error);
  }
}


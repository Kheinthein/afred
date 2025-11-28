/** @jest-environment node */

import { POST as LoginRoute } from '@/app/api/auth/login/route';
import { POST as RegisterRoute } from '@/app/api/auth/register/route';
import './setupDb';
import { createJsonRequest, parseJson, uniqueEmail } from './utils';

describe('Auth API Routes', () => {
  it('enregistre un utilisateur avec succès', async () => {
    const payload = {
      email: uniqueEmail('register'),
      password: 'SecurePass123',
    };

    const response = await RegisterRoute(
      createJsonRequest('/api/auth/register', 'POST', payload)
    );

    expect(response.status).toBe(201);

    const body = await parseJson<{
      success: boolean;
      data: { user: { id: string; email: string }; token: string };
    }>(response);

    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe(payload.email.toLowerCase());
    expect(body.data.token).toBeDefined();
  });

  it('permet de se connecter avec un compte existant', async () => {
    const credentials = {
      email: uniqueEmail('login'),
      password: 'SecurePass123',
    };

    await RegisterRoute(
      createJsonRequest('/api/auth/register', 'POST', credentials)
    );

    const response = await LoginRoute(
      createJsonRequest('/api/auth/login', 'POST', credentials)
    );

    expect(response.status).toBe(200);

    const body = await parseJson<{
      success: boolean;
      data: { user: { id: string; email: string }; token: string };
    }>(response);

    expect(body.success).toBe(true);
    expect(body.data.user.email).toBe(credentials.email.toLowerCase());
    expect(body.data.token).toBeDefined();
  });
});

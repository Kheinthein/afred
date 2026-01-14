'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@shared/providers/AuthProvider';
import { LoginPayload, RegisterPayload } from '@shared/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe trop court'),
});

type AuthFormValues = z.infer<typeof authSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps): JSX.Element {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
  });

  const { login, register: signup } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const submitHandler = handleSubmit(
    async (values: AuthFormValues): Promise<void> => {
      setError(null);
      try {
        const payload: LoginPayload = {
          email: values.email,
          password: values.password,
        };
        if (mode === 'login') {
          await login(payload);
        } else {
          const registerPayload: RegisterPayload = payload;
          await signup(registerPayload);
        }
        router.push('/documents');
      } catch (err) {
        setError(
          err instanceof Error ? err.message : 'Une erreur est survenue'
        );
      }
    }
  );

  return (
    <form
      onSubmit={(event) => {
        void submitHandler(event);
      }}
      className="space-y-4"
    >
      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={`${mode}-email`}
        >
          Email
        </label>
        <input
          id={`${mode}-email`}
          type="email"
          {...register('email')}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:text-base"
          placeholder="votre@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor={`${mode}-password`}
        >
          Mot de passe
        </label>
        <input
          id={`${mode}-password`}
          type="password"
          {...register('password')}
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:text-base"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:py-2 sm:text-base"
      >
        {isSubmitting
          ? 'Chargement...'
          : mode === 'login'
            ? 'Se connecter'
            : 'Créer un compte'}
      </button>
    </form>
  );
}

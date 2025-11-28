import { AuthForm } from '@components/AuthForm';
import Link from 'next/link';

export default function LoginPage(): JSX.Element {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900">Se connecter</h1>
      <p className="mt-2 text-sm text-gray-500">
        Reprenez vos écrits là où vous les aviez laissés.
      </p>

      <div className="mt-6">
        <AuthForm mode="login" />
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

import { AuthForm } from '@components/AuthForm';
import Link from 'next/link';

export default function LoginPage(): JSX.Element {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:rounded-2xl sm:p-8">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Se connecter
      </h1>
      <p className="mt-2 text-xs text-gray-500 sm:text-sm">
        Reprenez vos écrits là où vous les aviez laissés.
      </p>

      <div className="mt-6">
        <AuthForm mode="login" />
      </div>

      <p className="mt-6 text-center text-xs text-gray-600 sm:text-sm">
        Pas encore de compte ?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}

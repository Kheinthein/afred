import { AuthForm } from '@components/AuthForm';
import Link from 'next/link';

export default function RegisterPage(): JSX.Element {
  return (
    <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg sm:rounded-2xl sm:p-8">
      <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
        Créer un compte
      </h1>
      <p className="mt-2 text-xs text-gray-500 sm:text-sm">
        Un espace sécurisé pour écrire et analyser vos textes.
      </p>

      <div className="mt-6">
        <AuthForm mode="register" />
      </div>

      <p className="mt-6 text-center text-xs text-gray-600 sm:text-sm">
        Déjà inscrit ?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

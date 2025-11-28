import { AuthForm } from '@components/AuthForm';
import Link from 'next/link';

export default function RegisterPage(): JSX.Element {
  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
      <p className="mt-2 text-sm text-gray-500">
        Un espace sécurisé pour écrire et analyser vos textes.
      </p>

      <div className="mt-6">
        <AuthForm mode="register" />
      </div>

      <p className="mt-6 text-center text-sm text-gray-600">
        Déjà inscrit ?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </div>
  );
}

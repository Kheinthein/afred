export default function Home(): JSX.Element {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Alfred - Assistant d'Écriture IA
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Écrivez avec l'aide de l'intelligence artificielle
        </p>
        <div className="space-x-4">
          <a
            href="/login"
            className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Se connecter
          </a>
          <a
            href="/register"
            className="inline-block rounded-lg border border-blue-600 px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Créer un compte
          </a>
          <a
            href="/api/docs"
            className="inline-block rounded-lg px-6 py-3 font-semibold text-gray-600 transition hover:text-gray-900"
          >
            Documentation API
          </a>
        </div>
        </div>
    </div>
  );
}


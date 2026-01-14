import { Spinner } from '@components/Spinner';
import { AIAnalysisDTO, AnalysisType } from '@shared/types';

interface AIAnalysisPanelProps {
  loading: boolean;
  analysis: AIAnalysisDTO | null;
  onAnalyze: (type: AnalysisType) => void;
}

const labels: Record<AnalysisType, string> = {
  syntax: 'Analyse syntaxe',
  style: 'Analyse style',
  progression: 'Suggestions progression',
};

export function AIAnalysisPanel({
  loading,
  analysis,
  onAnalyze,
}: AIAnalysisPanelProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
      <h3 className="text-base font-semibold text-gray-900 sm:text-lg">
        Assistant IA
      </h3>
      <p className="mt-1 text-xs text-gray-500 sm:text-sm">
        Sélectionnez une analyse pour obtenir des suggestions.
      </p>

      <div className="mt-4 grid gap-2 sm:gap-3">
        {(Object.keys(labels) as AnalysisType[]).map((type) => (
          <button
            key={type}
            disabled={loading}
            onClick={() => onAnalyze(type)}
            className="w-full rounded-md border border-gray-200 px-3 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:py-2"
          >
            {labels[type]}
          </button>
        ))}
      </div>

      {loading && (
        <div className="mt-4 flex items-center gap-2 text-sm text-blue-600">
          <Spinner size="sm" />
          <span>Analyse en cours...</span>
        </div>
      )}

      {analysis ? (
        <div className="mt-4">
          <div className="flex flex-col gap-1 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <span>Confiance : {(analysis.confidence * 100).toFixed(0)}%</span>
            <span>
              {new Date(analysis.createdAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {analysis.suggestions.map((suggestion, index) => (
              <li
                key={index}
                className="rounded-md bg-gray-50 p-2.5 text-xs sm:p-3 sm:text-sm"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && (
          <p className="mt-4 text-xs text-gray-400 sm:text-sm">
            Aucune suggestion pour le moment.
          </p>
        )
      )}
    </div>
  );
}

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
}: AIAnalysisPanelProps): JSX.Element {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">
        Assistant IA (ChatGPT)
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Sélectionnez une analyse pour obtenir des suggestions.
      </p>

      <div className="mt-4 grid gap-2">
        {(Object.keys(labels) as AnalysisType[]).map((type) => (
          <button
            key={type}
            disabled={loading}
            onClick={() => onAnalyze(type)}
            className="rounded-md border border-gray-200 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-wait disabled:opacity-70"
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
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>Confiance : {(analysis.confidence * 100).toFixed(0)}%</span>
            <span>
              {new Date(analysis.createdAt).toLocaleTimeString('fr-FR')}
            </span>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-gray-700">
            {analysis.suggestions.map((suggestion, index) => (
              <li key={index} className="rounded-md bg-gray-50 p-2">
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !loading && (
          <p className="mt-4 text-sm text-gray-400">
            Aucune suggestion pour le moment.
          </p>
        )
      )}
    </div>
  );
}

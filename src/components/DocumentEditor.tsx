'use client';

import { Spinner } from '@components/Spinner';
import { aiService } from '@shared/services/aiService';
import { documentService } from '@shared/services/documentService';
import { AIAnalysisDTO, AnalysisType, DocumentDTO } from '@shared/types';
import { useMutation } from '@tanstack/react-query';
import { ChangeEvent, useEffect, useState } from 'react';
import { AIAnalysisPanel } from './AIAnalysisPanel';

interface DocumentEditorProps {
  document: DocumentDTO;
}

export function DocumentEditor({ document }: DocumentEditorProps): JSX.Element {
  const [content, setContent] = useState(document.content);
  const [analysis, setAnalysis] = useState<AIAnalysisDTO | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    setContent(document.content);
  }, [document.content]);

  const updateMutation = useMutation({
    mutationFn: (payload: { content: string }) =>
      documentService.update(document.id, payload),
  });

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (content !== document.content) {
        updateMutation.mutate({ content });
      }
    }, 1500);

    return () => clearTimeout(timeout);
  }, [content, document.content, document.id, updateMutation]);

  const handleContentChange = (
    event: ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setContent(event.target.value);
  };

  const performAnalyze = async (type: AnalysisType): Promise<void> => {
    try {
      setIsAnalyzing(true);
      const response = await aiService.analyze(document.id, type);
      setAnalysis(response.analysis);
    } finally {
      setIsAnalyzing(false);
    }
  };
  const handleAnalyze = (type: AnalysisType): void => {
    void performAnalyze(type);
  };

  return (
    <div className="grid gap-4 sm:gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="relative rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl break-words">
            {document.title}
          </h1>
          <p className="mt-1 text-xs text-gray-500 sm:text-sm">
            <span className="inline-block">Style : {document.style.name}</span>
            <span className="mx-1.5">•</span>
            <span className="inline-block">Version {document.version}</span>
            <span className="mx-1.5 hidden sm:inline">•</span>
            <span className="block mt-0.5 sm:inline sm:mt-0">
              {content.split(/\s+/).filter(Boolean).length} mots
            </span>
          </p>
        </div>

        <textarea
          value={content}
          onChange={handleContentChange}
          rows={15}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 sm:px-4 sm:py-3 sm:text-base sm:rows-20"
        />

        <p className="mt-2 text-xs text-gray-400">
          {updateMutation.isPending
            ? 'Sauvegarde...'
            : updateMutation.isSuccess
              ? 'Sauvegardé'
              : 'Dernière sauvegarde auto'}
        </p>

        {isAnalyzing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-white/90 backdrop-blur-sm">
            <Spinner />
            <p className="text-sm font-medium text-blue-700">
              Analyse IA en cours...
            </p>
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-6 lg:self-start">
        <AIAnalysisPanel
          loading={isAnalyzing}
          analysis={analysis}
          onAnalyze={handleAnalyze}
        />
      </div>
    </div>
  );
}

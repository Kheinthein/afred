import { AnalysisType, AnalyzeResponse } from '@shared/types';
import { apiClient } from './apiClient';

export const aiService = {
  async analyze(
    documentId: string,
    analysisType: AnalysisType
  ): Promise<AnalyzeResponse> {
    const { data } = await apiClient.post<{
      success: boolean;
      data: AnalyzeResponse;
      meta: AnalyzeResponse['meta'];
    }>('/ai/analyze', {
      documentId,
      analysisType,
    });

    return {
      analysis: data.data.analysis,
      meta: data.meta,
    };
  },
};

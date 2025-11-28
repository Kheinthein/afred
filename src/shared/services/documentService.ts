import { DocumentDTO } from '@shared/types';
import { apiClient } from './apiClient';

interface CreateDocumentPayload {
  title: string;
  content: string;
  styleId: string;
}

interface UpdateDocumentPayload {
  title?: string;
  content?: string;
}

export const documentService = {
  async list(): Promise<DocumentDTO[]> {
    const { data } = await apiClient.get<{ success: boolean; data: { documents: DocumentDTO[] } }>('/documents');
    return data.data.documents;
  },

  async getById(id: string): Promise<DocumentDTO> {
    const { data } = await apiClient.get<{ success: boolean; data: { document: DocumentDTO } }>(`/documents/${id}`);
    return data.data.document;
  },

  async create(payload: CreateDocumentPayload): Promise<DocumentDTO> {
    const { data } = await apiClient.post<{ success: boolean; data: { document: DocumentDTO } }>('/documents', payload);
    return data.data.document;
  },

  async update(id: string, payload: UpdateDocumentPayload): Promise<DocumentDTO> {
    const { data } = await apiClient.put<{ success: boolean; data: { document: DocumentDTO } }>(`/documents/${id}`, payload);
    return data.data.document;
  },

  async remove(id: string): Promise<void> {
    await apiClient.delete(`/documents/${id}`);
  },

  async reorder(documentIds: string[]): Promise<void> {
    await apiClient.post('/documents/reorder', { documentIds });
  },
};


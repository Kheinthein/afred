'use client';

import { DocumentEditor } from '@components/DocumentEditor';
import { documentService } from '@shared/services/documentService';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function DocumentDetailPage(): JSX.Element {
  const params = useParams<{ id: string }>();
  const documentId = params.id;

  const { data: document, isLoading } = useQuery({
    queryKey: ['document', documentId],
    queryFn: () => documentService.getById(documentId),
    enabled: Boolean(documentId),
  });

  if (isLoading || !document) {
    return <p className="text-gray-500">Chargement du document...</p>;
  }

  return (
    <div className="space-y-6">
      <Link href="/app/documents" className="text-sm font-medium text-blue-600 hover:underline">
        ← Retour aux documents
      </Link>

      <DocumentEditor document={document} />
    </div>
  );
}


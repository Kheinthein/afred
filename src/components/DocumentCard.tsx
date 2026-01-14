import { ConfirmDialog } from '@components/ConfirmDialog';
import { DocumentDTO } from '@shared/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { GripVertical } from 'lucide-react';
import Link from 'next/link';
import { HTMLAttributes, useState } from 'react';

interface DocumentCardProps {
  document: DocumentDTO;
  onDelete?: (id: string) => void;
  dragHandleProps?: HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  isDeleting?: boolean;
}

export function DocumentCard({
  document,
  onDelete,
  dragHandleProps,
  isDragging,
  isDeleting,
}: DocumentCardProps): JSX.Element {
  const [confirming, setConfirming] = useState(false);

  return (
    <div
      data-testid="document-card"
      data-document-id={document.id}
      data-document-title={document.title}
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition sm:p-6 ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2">
            {dragHandleProps && (
              <button
                type="button"
                aria-label="Déplacer le document"
                {...dragHandleProps}
                className="mt-1 flex-shrink-0 cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
              >
                <GripVertical size={18} />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-lg font-semibold text-gray-900 sm:text-xl break-words">
                {document.title}
              </h3>
              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                <span className="inline-block">{document.style.name}</span>
                <span className="mx-1.5">•</span>
                <span className="inline-block">{document.wordCount} mots</span>
                <span className="mx-1.5 hidden sm:inline">•</span>
                <span className="block mt-0.5 sm:inline sm:mt-0">
                  version {document.version}
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex-shrink-0 text-left text-xs text-gray-400 sm:text-right">
          <p>
            Modifié le{' '}
            {format(new Date(document.updatedAt), 'dd MMM yyyy', {
              locale: fr,
            })}
          </p>
        </div>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-gray-600 sm:line-clamp-3">
        {document.content}
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <Link
          href={`/documents/${document.id}`}
          data-testid="open-document-button"
          className="w-full rounded-md bg-blue-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto sm:px-3 sm:py-2"
        >
          Ouvrir
        </Link>
        {onDelete && (
          <button
            data-testid="delete-document-button"
            onClick={() => setConfirming(true)}
            disabled={isDeleting}
            className="w-full rounded-md border border-red-200 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto sm:px-3 sm:py-2"
          >
            Supprimer
          </button>
        )}
      </div>

      {confirming && onDelete && (
        <ConfirmDialog
          title="Supprimer ce document ?"
          message={
            <p>
              Le document <strong>{document.title}</strong> sera définitivement
              supprimé.
            </p>
          }
          confirmLabel="Oui, supprimer"
          cancelLabel="Annuler"
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            setConfirming(false);
            onDelete(document.id);
          }}
        />
      )}
    </div>
  );
}

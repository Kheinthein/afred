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
      className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition ${
        isDragging ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            {dragHandleProps && (
              <button
                type="button"
                aria-label="Déplacer le document"
                {...dragHandleProps}
                className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
              >
                <GripVertical size={18} />
              </button>
            )}
            <h3 className="text-xl font-semibold text-gray-900">{document.title}</h3>
          </div>
          <p className="text-sm text-gray-500">
            {document.style.name} • {document.wordCount} mots • version {document.version}
          </p>
        </div>
        <div className="text-right text-xs text-gray-400">
          <p>Modifié le {format(new Date(document.updatedAt), 'dd MMM yyyy', { locale: fr })}</p>
        </div>
      </div>
      <p className="mt-3 line-clamp-3 text-sm text-gray-600">{document.content}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Link
          href={`/documents/${document.id}`}
          className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Ouvrir
        </Link>
        {onDelete && (
          <button
            onClick={() => setConfirming(true)}
            disabled={isDeleting}
            className="rounded-md border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
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
              Le document <strong>{document.title}</strong> sera définitivement supprimé.
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


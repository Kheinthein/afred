import { DocumentCard } from '@components/DocumentCard';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { DocumentDTO } from '@shared/types';

interface SortableDocumentCardProps {
  document: DocumentDTO;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
}

export function SortableDocumentCard({
  document,
  onDelete,
  isDeleting,
}: SortableDocumentCardProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: document.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <DocumentCard
        document={document}
        onDelete={onDelete}
        isDeleting={isDeleting}
        dragHandleProps={{ ...attributes, ...listeners }}
        isDragging={isDragging}
      />
    </div>
  );
}


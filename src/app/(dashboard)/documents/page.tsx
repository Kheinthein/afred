'use client';

import { SortableDocumentCard } from '@components/SortableDocumentCard';
import { DndContext, type DragEndEvent, closestCenter } from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { documentService } from '@shared/services/documentService';
import { styleService } from '@shared/services/styleService';
import type { DocumentDTO } from '@shared/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

export default function DocumentsPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ title: '', styleId: '' });

  const { data: documentsData, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: () => documentService.list(),
  });

  const { data: styles = [] } = useQuery({
    queryKey: ['styles'],
    queryFn: () => styleService.list(),
  });

  const documents = useMemo<DocumentDTO[]>(
    () => documentsData ?? [],
    [documentsData]
  );

  const [orderedDocuments, setOrderedDocuments] =
    useState<DocumentDTO[]>(documents);
  useEffect(() => {
    if (!documentsData) return;
    setOrderedDocuments(documentsData);
  }, [documentsData]);

  const [creationError, setCreationError] = useState<string | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      documentService.create({
        title: form.title,
        styleId: form.styleId,
        content:
          'Commencez votre histoire ici. Décrivez le contexte, vos personnages ou l’idée générale pour que l’IA puisse vous aider 🍀',
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
      setForm({ title: '', styleId: '' });
      setCreationError(null);
    },
    onError: (error: unknown) => {
      setCreationError(
        error instanceof Error
          ? error.message
          : 'Impossible de créer le document'
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => documentService.remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: (documentIds: string[]) => documentService.reorder(documentIds),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = orderedDocuments.findIndex((doc) => doc.id === active.id);
    const newIndex = orderedDocuments.findIndex((doc) => doc.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(orderedDocuments, oldIndex, newIndex);
    const previousOrder = orderedDocuments;
    setOrderedDocuments(newOrder);
    reorderMutation.mutate(
      newOrder.map((doc) => doc.id),
      {
        onError: () => {
          setOrderedDocuments(previousOrder);
        },
      }
    );
  };

  return (
    <div className="space-y-8">
      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Nouveau document
        </h2>
        <p className="text-sm text-gray-500">
          Choisissez un titre et un style pour commencer.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Style
            </label>
            <select
              value={form.styleId}
              onChange={(e) => setForm({ ...form, styleId: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Choisir un style</option>
              {styles.map((style) => (
                <option key={style.id} value={style.id}>
                  {style.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <button
            onClick={() => createMutation.mutate()}
            disabled={!form.title || !form.styleId || createMutation.isPending}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
          >
            {createMutation.isPending ? 'Création...' : 'Créer'}
          </button>
          {creationError && (
            <p className="text-sm text-red-600">{creationError}</p>
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Mes documents
            </h2>
            <p className="text-sm text-gray-500">
              {documents.length} document{documents.length > 1 ? 's' : ''}
            </p>
            {reorderMutation.isPending && (
              <p className="text-xs text-blue-600">
                Enregistrement de l&apos;ordre...
              </p>
            )}
          </div>
        </div>

        {isLoading ? (
          <p className="text-gray-500">Chargement des documents...</p>
        ) : orderedDocuments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white p-10 text-center text-gray-500">
            Aucun document pour l&apos;instant. Créez-en un nouveau !
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={orderedDocuments.map((doc) => doc.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="grid gap-4">
                {orderedDocuments.map((doc) => (
                  <SortableDocumentCard
                    key={doc.id}
                    document={doc}
                    onDelete={(id) => deleteMutation.mutate(id)}
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === doc.id
                    }
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </section>
    </div>
  );
}

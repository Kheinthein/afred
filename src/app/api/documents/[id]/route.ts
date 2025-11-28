import { authenticateRequest } from '@/app/api/middleware/auth';
import { handleError } from '@/app/api/middleware/errorHandler';
import { container } from '@/container';
import { UpdateDocumentDTOSchema } from '@modules/document/application/dtos/UpdateDocumentDTO';
import { IDocumentRepository } from '@modules/document/domain/repositories/IDocumentRepository';
import { DeleteDocument } from '@modules/document/domain/use-cases/DeleteDocument';
import { UpdateDocument } from '@modules/document/domain/use-cases/UpdateDocument';
import { NextRequest, NextResponse } from 'next/server';

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * GET /api/documents/[id]
 * Récupère un document par ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // 1. Authentifier
    const { userId } = await authenticateRequest(request);

    // 2. Récupérer le document
    const documentRepo = container.get<IDocumentRepository>('IDocumentRepository');
    const document = await documentRepo.findById(params.id);

    if (!document) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: 'Document non trouvé',
          },
        },
        { status: 404 }
      );
    }

    // 3. Vérifier les permissions
    if (document.userId !== userId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNAUTHORIZED',
            message: 'Accès non autorisé à ce document',
          },
        },
        { status: 403 }
      );
    }

    // 4. Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: document.id,
          title: document.title,
          content: document.content.text,
          wordCount: document.content.wordCount,
          style: {
            id: document.style.id,
            name: document.style.name,
            description: document.style.description,
          },
          version: document.version,
          sortOrder: document.sortOrder,
          createdAt: document.createdAt,
          updatedAt: document.updatedAt,
        },
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * PUT /api/documents/[id]
 * Met à jour un document
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // 1. Authentifier
    const { userId } = await authenticateRequest(request);

    // 2. Parser et valider le body
    const body = await request.json();
    const data = UpdateDocumentDTOSchema.parse(body);

    // 3. Mettre à jour le document
    const updateDocument = container.get<UpdateDocument>(UpdateDocument);
    const result = await updateDocument.execute({
      documentId: params.id,
      userId,
      title: data.title,
      content: data.content,
    });

    // 4. Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        document: {
          id: result.document.id,
          title: result.document.title,
          content: result.document.content.text,
          wordCount: result.document.content.wordCount,
          version: result.document.version,
          sortOrder: result.document.sortOrder,
          updatedAt: result.document.updatedAt,
        },
      },
    });
  } catch (error) {
    return handleError(error);
  }
}

/**
 * DELETE /api/documents/[id]
 * Supprime un document
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse> {
  try {
    // 1. Authentifier
    const { userId } = await authenticateRequest(request);

    // 2. Supprimer le document
    const deleteDocument = container.get<DeleteDocument>(DeleteDocument);
    await deleteDocument.execute({
      documentId: params.id,
      userId,
    });

    // 3. Retourner la réponse
    return NextResponse.json({
      success: true,
      message: 'Document supprimé avec succès',
    });
  } catch (error) {
    return handleError(error);
  }
}


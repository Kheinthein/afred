import { authenticateRequest } from '@/app/api/middleware/auth';
import { handleError } from '@/app/api/middleware/errorHandler';
import { container } from '@/container';
import { ReorderDocuments } from '@modules/document/domain/use-cases/ReorderDocuments';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ReorderDocumentsSchema = z.object({
  documentIds: z
    .array(z.string().min(1))
    .min(1, 'La liste ne peut pas être vide'),
});

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const { userId } = authenticateRequest(request);
    const body: unknown = await request.json();
    const data = ReorderDocumentsSchema.parse(body);

    const reorderDocuments = container.get<ReorderDocuments>(ReorderDocuments);
    await reorderDocuments.execute({
      userId,
      documentIds: data.documentIds,
    });

    return NextResponse.json({
      success: true,
      data: { reordered: data.documentIds.length },
    });
  } catch (error) {
    return handleError(error);
  }
}

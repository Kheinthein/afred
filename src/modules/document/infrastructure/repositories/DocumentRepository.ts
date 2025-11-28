import { Document } from '@modules/document/domain/entities/Document';
import { WritingStyle } from '@modules/document/domain/entities/WritingStyle';
import { IDocumentRepository } from '@modules/document/domain/repositories/IDocumentRepository';
import { DocumentContent } from '@modules/document/domain/value-objects/DocumentContent';
import { PrismaClient } from '@prisma/client';

/**
 * Implémentation du repository Document avec Prisma
 */
export class DocumentRepository implements IDocumentRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<Document | null> {
    const doc = await this.prisma.document.findUnique({
      where: { id },
      include: { style: true },
    });

    if (!doc) return null;

    return this.toDomain(doc);
  }

  async findByUserId(userId: string): Promise<Document[]> {
    const docs = await this.prisma.document.findMany({
      where: { userId },
      include: { style: true },
      orderBy: [{ sortOrder: 'asc' }, { updatedAt: 'desc' }],
    });

    return docs.map((doc) => this.toDomain(doc));
  }

  async save(document: Document): Promise<void> {
    await this.prisma.document.upsert({
      where: { id: document.id },
      update: {
        title: document.title,
        content: document.content.text,
        wordCount: document.content.wordCount,
        version: document.version,
        sortOrder: BigInt(document.sortOrder),
        updatedAt: document.updatedAt,
      },
      create: {
        id: document.id,
        userId: document.userId,
        title: document.title,
        content: document.content.text,
        wordCount: document.content.wordCount,
        styleId: document.style.id,
        version: document.version,
        sortOrder: BigInt(document.sortOrder),
        createdAt: document.createdAt,
        updatedAt: document.updatedAt,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.document.delete({
      where: { id },
    });
  }

  async countByUserId(userId: string): Promise<number> {
    return this.prisma.document.count({
      where: { userId },
    });
  }

  async updateSortOrders(
    userId: string,
    orders: Array<{ id: string; sortOrder: number }>
  ): Promise<void> {
    await this.prisma.$transaction(
      orders.map(({ id, sortOrder }) =>
        this.prisma.document.updateMany({
          where: { id, userId },
          data: { sortOrder: BigInt(sortOrder) },
        })
      )
    );
  }

  /**
   * Convertit un model Prisma en entité Domain
   */
  private toDomain(data: {
    id: string;
    userId: string;
    title: string;
    content: string;
    wordCount: number;
    version: number;
    sortOrder: bigint;
    createdAt: Date;
    updatedAt: Date;
    style: {
      id: string;
      name: string;
      description: string;
    };
  }): Document {
    const content = new DocumentContent(data.content);
    const style = new WritingStyle(
      data.style.id,
      data.style.name,
      data.style.description
    );

    return new Document(
      data.id,
      data.userId,
      data.title,
      content,
      style,
      data.version,
      data.createdAt,
      data.updatedAt,
      Number(data.sortOrder)
    );
  }
}

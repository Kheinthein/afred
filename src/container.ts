import { Container } from 'inversify';
import 'reflect-metadata';

// Repositories
import { IAIAnalysisRepository } from '@modules/ai-assistant/domain/repositories/IAIAnalysisRepository';
import { AIAnalysisRepository } from '@modules/ai-assistant/infrastructure/repositories/AIAnalysisRepository';
import { IDocumentRepository } from '@modules/document/domain/repositories/IDocumentRepository';
import { DocumentRepository } from '@modules/document/infrastructure/repositories/DocumentRepository';
import { IUserRepository } from '@modules/user/domain/repositories/IUserRepository';
import { UserRepository } from '@modules/user/infrastructure/repositories/UserRepository';

// AI Service
import { IAIServicePort } from '@modules/ai-assistant/domain/repositories/IAIServicePort';
import { AIAdapterFactory } from '@modules/ai-assistant/infrastructure/ai/AIAdapterFactory';

// Use Cases - User
import { AuthenticateUser } from '@modules/user/domain/use-cases/AuthenticateUser';
import { CreateUser } from '@modules/user/domain/use-cases/CreateUser';

// Use Cases - Document
import { CreateDocument } from '@modules/document/domain/use-cases/CreateDocument';
import { DeleteDocument } from '@modules/document/domain/use-cases/DeleteDocument';
import { GetUserDocuments } from '@modules/document/domain/use-cases/GetUserDocuments';
import { ReorderDocuments } from '@modules/document/domain/use-cases/ReorderDocuments';
import { UpdateDocument } from '@modules/document/domain/use-cases/UpdateDocument';

// Use Cases - AI
import { AnalyzeText } from '@modules/ai-assistant/domain/use-cases/AnalyzeText';

// Services
import { UserService } from '@modules/user/application/services/UserService';

// Database
import { prisma } from '@shared/infrastructure/database/prisma';

/**
 * Conteneur d'injection de dépendances avec InversifyJS
 */
const container = new Container();

// Bind Prisma Client
container.bind('PrismaClient').toConstantValue(prisma);

// Bind Repositories
container
  .bind<IUserRepository>('IUserRepository')
  .toDynamicValue(() => new UserRepository(prisma))
  .inSingletonScope();

container
  .bind<IDocumentRepository>('IDocumentRepository')
  .toDynamicValue(() => new DocumentRepository(prisma))
  .inSingletonScope();

container
  .bind<IAIAnalysisRepository>('IAIAnalysisRepository')
  .toDynamicValue(() => new AIAnalysisRepository(prisma))
  .inSingletonScope();

// Bind AI Service (créé depuis la factory selon env)
container
  .bind<IAIServicePort>('IAIServicePort')
  .toDynamicValue(() => AIAdapterFactory.createFromEnv())
  .inSingletonScope();

// Bind Use Cases - User
container
  .bind<CreateUser>(CreateUser)
  .toDynamicValue((context) => {
    const userRepo = context.container.get<IUserRepository>('IUserRepository');
    return new CreateUser(userRepo);
  })
  .inTransientScope();

container
  .bind<AuthenticateUser>(AuthenticateUser)
  .toDynamicValue((context) => {
    const userRepo = context.container.get<IUserRepository>('IUserRepository');
    return new AuthenticateUser(userRepo);
  })
  .inTransientScope();

// Bind Use Cases - Document
container
  .bind<CreateDocument>(CreateDocument)
  .toDynamicValue((context) => {
    const docRepo = context.container.get<IDocumentRepository>('IDocumentRepository');
    return new CreateDocument(docRepo);
  })
  .inTransientScope();

container
  .bind<UpdateDocument>(UpdateDocument)
  .toDynamicValue((context) => {
    const docRepo = context.container.get<IDocumentRepository>('IDocumentRepository');
    return new UpdateDocument(docRepo);
  })
  .inTransientScope();

container
  .bind<DeleteDocument>(DeleteDocument)
  .toDynamicValue((context) => {
    const docRepo = context.container.get<IDocumentRepository>('IDocumentRepository');
    return new DeleteDocument(docRepo);
  })
  .inTransientScope();

container
  .bind<GetUserDocuments>(GetUserDocuments)
  .toDynamicValue((context) => {
    const docRepo = context.container.get<IDocumentRepository>('IDocumentRepository');
    return new GetUserDocuments(docRepo);
  })
  .inTransientScope();

container
  .bind<ReorderDocuments>(ReorderDocuments)
  .toDynamicValue((context) => {
    const docRepo = context.container.get<IDocumentRepository>('IDocumentRepository');
    return new ReorderDocuments(docRepo);
  })
  .inTransientScope();

// Bind Use Cases - AI
container
  .bind<AnalyzeText>(AnalyzeText)
  .toDynamicValue((context) => {
    const docRepo = context.container.get<IDocumentRepository>('IDocumentRepository');
    const aiService = context.container.get<IAIServicePort>('IAIServicePort');
    const aiAnalysisRepo = context.container.get<IAIAnalysisRepository>('IAIAnalysisRepository');
    return new AnalyzeText(docRepo, aiService, aiAnalysisRepo);
  })
  .inTransientScope();

// Bind Services
container
  .bind<UserService>(UserService)
  .toDynamicValue((context) => {
    const createUser = context.container.get<CreateUser>(CreateUser);
    const authenticateUser = context.container.get<AuthenticateUser>(AuthenticateUser);
    return new UserService(createUser, authenticateUser);
  })
  .inSingletonScope();

export { container };


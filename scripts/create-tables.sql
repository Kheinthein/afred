-- Script SQL pour créer les nouvelles tables
-- À exécuter sur la base de données SQLite

-- CreateTable: chat_conversations
CREATE TABLE IF NOT EXISTS "chat_conversations" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_conversations_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "chat_conversations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: chat_messages
CREATE TABLE IF NOT EXISTS "chat_messages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "conversationId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "chat_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "chat_conversations" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: document_versions
CREATE TABLE IF NOT EXISTS "document_versions" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "version" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: tags
CREATE TABLE IF NOT EXISTS "tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "tags_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: document_tags
CREATE TABLE IF NOT EXISTS "document_tags" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "documentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    CONSTRAINT "document_tags_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "document_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable: document_templates
CREATE TABLE IF NOT EXISTS "document_templates" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "styleId" TEXT NOT NULL,
    "isPublic" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "document_templates_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "writing_styles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "document_templates_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "chat_conversations_documentId_idx" ON "chat_conversations"("documentId");
CREATE INDEX IF NOT EXISTS "chat_conversations_userId_idx" ON "chat_conversations"("userId");
CREATE INDEX IF NOT EXISTS "chat_messages_conversationId_idx" ON "chat_messages"("conversationId");
CREATE INDEX IF NOT EXISTS "chat_messages_conversationId_createdAt_idx" ON "chat_messages"("conversationId", "createdAt");
CREATE UNIQUE INDEX IF NOT EXISTS "document_versions_documentId_version_key" ON "document_versions"("documentId", "version");
CREATE INDEX IF NOT EXISTS "document_versions_documentId_idx" ON "document_versions"("documentId");
CREATE INDEX IF NOT EXISTS "document_versions_documentId_version_idx" ON "document_versions"("documentId", "version");
CREATE UNIQUE INDEX IF NOT EXISTS "tags_userId_name_key" ON "tags"("userId", "name");
CREATE INDEX IF NOT EXISTS "tags_userId_idx" ON "tags"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "document_tags_documentId_tagId_key" ON "document_tags"("documentId", "tagId");
CREATE INDEX IF NOT EXISTS "document_tags_documentId_idx" ON "document_tags"("documentId");
CREATE INDEX IF NOT EXISTS "document_tags_tagId_idx" ON "document_tags"("tagId");
CREATE INDEX IF NOT EXISTS "document_templates_styleId_idx" ON "document_templates"("styleId");
CREATE INDEX IF NOT EXISTS "document_templates_userId_idx" ON "document_templates"("userId");
CREATE INDEX IF NOT EXISTS "document_templates_isPublic_idx" ON "document_templates"("isPublic");

#!/bin/bash

# Script de setup automatique pour Alfred
# Usage: bash scripts/setup.sh

set -e  # Arrêter en cas d'erreur

echo "🚀 Setup Alfred - Assistant d'Écriture IA"
echo "=========================================="
echo ""

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé. Installez Node.js >= 18.0.0"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version $NODE_VERSION détectée. Version >= 18.0.0 requise"
    exit 1
fi

echo "✅ Node.js $(node -v) détecté"

# Vérifier npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ npm $(npm -v) détecté"
echo ""

# Vérifier .env
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env non trouvé"
    echo "📝 Création depuis .env.example..."
    cp .env.example .env
    echo "✅ .env créé. Pensez à configurer vos clés API !"
    echo ""
fi

# Vérifier variables critiques
if grep -q "sk-votre-clé" .env || grep -q "sk-xxxxx" .env; then
    echo "⚠️  ATTENTION : Clé API OpenAI non configurée dans .env"
    echo "   Éditez .env et remplacez OPENAI_API_KEY par votre vraie clé"
    echo ""
fi

# Installer les dépendances
echo "📦 Installation des dépendances..."
if [ ! -d "node_modules" ]; then
    npm install
    echo "✅ Dépendances installées"
else
    echo "✅ Dépendances déjà installées"
fi
echo ""

# Générer le client Prisma
echo "🔧 Génération du client Prisma..."
npm run db:generate
echo "✅ Client Prisma généré"
echo ""

# Créer la base de données et migrations
echo "🗃️  Création de la base de données..."
if [ ! -f "prisma/dev.db" ]; then
    npm run db:migrate
    echo "✅ Base de données créée"
else
    echo "✅ Base de données existe déjà"
    # Appliquer les migrations si nécessaire
    npm run db:migrate || echo "⚠️  Migrations déjà appliquées"
fi
echo ""

# Seed les données initiales
echo "🌱 Seed des données initiales (styles d'écriture)..."
npm run db:seed
echo "✅ Données seedées"
echo ""

# Vérifier la configuration
echo "🔍 Vérification de la configuration..."
if grep -q "AI_PROVIDER=openai" .env; then
    echo "✅ Provider IA : OpenAI"
elif grep -q "AI_PROVIDER=claude" .env; then
    echo "✅ Provider IA : Claude"
else
    echo "⚠️  Provider IA non configuré"
fi

if grep -q "JWT_SECRET=change" .env || grep -q "JWT_SECRET=your-secret" .env; then
    echo "⚠️  ATTENTION : JWT_SECRET doit être changé en production !"
fi
echo ""

echo "✨ Setup terminé avec succès !"
echo ""
echo "📝 Prochaines étapes :"
echo "   1. Vérifiez votre fichier .env (clés API, JWT_SECRET)"
echo "   2. Lancez l'application : npm run dev"
echo "   3. Testez l'API : http://localhost:3000/api/styles"
echo ""
echo "📚 Documentation :"
echo "   - GETTING_STARTED.md : Guide de démarrage"
echo "   - docs/api-documentation.md : Documentation API"
echo ""


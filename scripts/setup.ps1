# Script de setup automatique pour Alfred (PowerShell)
# Usage: .\scripts\setup.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Setup Alfred - Assistant d'Écriture IA" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js n'est pas installé. Installez Node.js >= 18.0.0" -ForegroundColor Red
    exit 1
}

# Vérifier npm
try {
    $npmVersion = npm -v
    Write-Host "✅ npm v$npmVersion détecté" -ForegroundColor Green
} catch {
    Write-Host "❌ npm n'est pas installé" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Vérifier .env
if (-not (Test-Path .env)) {
    Write-Host "⚠️  Fichier .env non trouvé" -ForegroundColor Yellow
    Write-Host "📝 Création depuis .env.example..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "✅ .env créé. Pensez à configurer vos clés API !" -ForegroundColor Green
    Write-Host ""
}

# Installer les dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Cyan
if (-not (Test-Path node_modules)) {
    npm install
    Write-Host "✅ Dépendances installées" -ForegroundColor Green
} else {
    Write-Host "✅ Dépendances déjà installées" -ForegroundColor Green
}
Write-Host ""

# Générer le client Prisma
Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Cyan
npm run db:generate
Write-Host "✅ Client Prisma généré" -ForegroundColor Green
Write-Host ""

# Créer la base de données et migrations
Write-Host "🗃️  Création de la base de données..." -ForegroundColor Cyan
if (-not (Test-Path "prisma/dev.db")) {
    npm run db:migrate
    Write-Host "✅ Base de données créée" -ForegroundColor Green
} else {
    Write-Host "✅ Base de données existe déjà" -ForegroundColor Green
    # Appliquer les migrations si nécessaire
    try {
        npm run db:migrate
    } catch {
        Write-Host "⚠️  Migrations déjà appliquées" -ForegroundColor Yellow
    }
}
Write-Host ""

# Seed les données initiales
Write-Host "🌱 Seed des données initiales (styles d'écriture)..." -ForegroundColor Cyan
npm run db:seed
Write-Host "✅ Données seedées" -ForegroundColor Green
Write-Host ""

# Vérifier la configuration
Write-Host "🔍 Vérification de la configuration..." -ForegroundColor Cyan
$envContent = Get-Content .env -Raw
if ($envContent -match "AI_PROVIDER=openai") {
    Write-Host "✅ Provider IA : OpenAI" -ForegroundColor Green
} elseif ($envContent -match "AI_PROVIDER=claude") {
    Write-Host "✅ Provider IA : Claude" -ForegroundColor Green
} else {
    Write-Host "⚠️  Provider IA non configuré" -ForegroundColor Yellow
}

if ($envContent -match "JWT_SECRET=change" -or $envContent -match "JWT_SECRET=your-secret") {
    Write-Host "⚠️  ATTENTION : JWT_SECRET doit être changé en production !" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "✨ Setup terminé avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Vérifiez votre fichier .env (clés API, JWT_SECRET)"
Write-Host "   2. Lancez l'application : npm run dev"
Write-Host "   3. Testez l'API : http://localhost:3000/api/styles"
Write-Host ""
Write-Host "📚 Documentation :" -ForegroundColor Cyan
Write-Host "   - GETTING_STARTED.md : Guide de démarrage"
Write-Host "   - docs/api-documentation.md : Documentation API"
Write-Host ""


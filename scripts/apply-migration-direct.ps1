# Script pour appliquer la migration directement sur SQLite
# Usage: .\scripts\apply-migration-direct.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Application de la migration Prisma..." -ForegroundColor Cyan

# Trouver le fichier de base de données
$dbPath = Get-ChildItem -Path . -Filter "dev.db" -Recurse -Depth 2 | Select-Object -First 1

if (-not $dbPath) {
    Write-Host "❌ Erreur: dev.db non trouvé. Exécutez ce script depuis la racine du projet." -ForegroundColor Red
    exit 1
}

$projectRoot = $dbPath.Directory.Parent
Set-Location $projectRoot

Write-Host "📁 Projet trouvé: $(Get-Location)" -ForegroundColor Green
Write-Host "🗄️  Base de données: $($dbPath.FullName)" -ForegroundColor Green

# Vérifier que sqlite3 est disponible
$sqlite3 = Get-Command sqlite3 -ErrorAction SilentlyContinue
if (-not $sqlite3) {
    Write-Host "⚠️  sqlite3 non trouvé. Tentative avec Prisma db push..." -ForegroundColor Yellow
    
    # Utiliser Prisma db push
    if (Test-Path "prisma\schema.prisma") {
        Write-Host "📦 Application avec Prisma db push..." -ForegroundColor Yellow
        npx prisma db push --accept-data-loss --skip-generate
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Migration appliquée!" -ForegroundColor Green
            Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
            npx prisma generate
            
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Client Prisma généré!" -ForegroundColor Green
                Write-Host ""
                Write-Host "✨ Migration terminée avec succès!" -ForegroundColor Cyan
            } else {
                Write-Host "❌ Erreur lors de la génération du client" -ForegroundColor Red
                exit 1
            }
        } else {
            Write-Host "❌ Erreur lors de l'application de la migration" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "❌ prisma\schema.prisma non trouvé" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "📝 Application du script SQL..." -ForegroundColor Yellow
    $sqlScript = Join-Path $projectRoot "scripts\create-tables.sql"
    
    if (Test-Path $sqlScript) {
        Get-Content $sqlScript | sqlite3 $dbPath.FullName
        Write-Host "✅ Tables créées!" -ForegroundColor Green
        
        Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
        npx prisma generate
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Client Prisma généré!" -ForegroundColor Green
        }
    } else {
        Write-Host "❌ Script SQL non trouvé: $sqlScript" -ForegroundColor Red
        exit 1
    }
}

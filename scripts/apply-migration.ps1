# Script pour appliquer la migration Prisma
# Usage: .\scripts\apply-migration.ps1

Write-Host "🚀 Application de la migration Prisma..." -ForegroundColor Cyan

# Vérifier que nous sommes dans le bon répertoire
if (-not (Test-Path "prisma\schema.prisma")) {
    Write-Host "❌ Erreur: prisma\schema.prisma non trouvé. Exécutez ce script depuis la racine du projet." -ForegroundColor Red
    exit 1
}

# Appliquer la migration
Write-Host "📦 Application de la migration..." -ForegroundColor Yellow
npx prisma migrate deploy

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Migration appliquée avec succès!" -ForegroundColor Green
    
    # Générer le client Prisma
    Write-Host "🔧 Génération du client Prisma..." -ForegroundColor Yellow
    npx prisma generate
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Client Prisma généré avec succès!" -ForegroundColor Green
        Write-Host ""
        Write-Host "✨ Migration terminée! Les nouvelles tables sont disponibles:" -ForegroundColor Cyan
        Write-Host "   - chat_conversations" -ForegroundColor White
        Write-Host "   - chat_messages" -ForegroundColor White
        Write-Host "   - document_versions" -ForegroundColor White
        Write-Host "   - tags" -ForegroundColor White
        Write-Host "   - document_tags" -ForegroundColor White
        Write-Host "   - document_templates" -ForegroundColor White
    } else {
        Write-Host "❌ Erreur lors de la génération du client Prisma" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "❌ Erreur lors de l'application de la migration" -ForegroundColor Red
    Write-Host "💡 Essayez: npx prisma db push (pour développement uniquement)" -ForegroundColor Yellow
    exit 1
}

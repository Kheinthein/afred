# Script pour commit et push les changements CI/CD
# Usage: .\scripts\push-ci.ps1

Write-Host "🚀 Préparation du push CI/CD..." -ForegroundColor Cyan
Write-Host ""

# Vérifier qu'on est dans un dépôt Git
if (-not (Test-Path .git)) {
    Write-Host "❌ Erreur: Ce n'est pas un dépôt Git!" -ForegroundColor Red
    Write-Host "Initialisation du dépôt Git..." -ForegroundColor Yellow
    git init
}

# Vérifier les changements
Write-Host "📋 Vérification des changements..." -ForegroundColor Yellow
git status --short

Write-Host ""
Write-Host "📦 Ajout des fichiers modifiés..." -ForegroundColor Yellow
git add playwright.config.ts
git add .github/workflows/ci.yml
git add package.json
git add docs/CI-CD-GUIDE.md

Write-Host ""
Write-Host "💾 Création du commit..." -ForegroundColor Yellow
git commit -m "ci: amélioration configuration CI/CD pour tests E2E

- Ajout timeouts dans playwright.config.ts
- Amélioration gestion erreurs dans workflow CI
- Ajout reporter JUnit pour GitHub Actions
- Documentation CI/CD complète"

Write-Host ""
Write-Host "🔍 Vérification du remote..." -ForegroundColor Yellow
$remote = git remote -v
if (-not $remote) {
    Write-Host "⚠️  Aucun remote configuré!" -ForegroundColor Yellow
    Write-Host "Pour configurer le remote, exécutez:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/VOTRE-USER/alfred.git" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Ensuite, vous pourrez push avec:" -ForegroundColor Cyan
    Write-Host "  git push -u origin main" -ForegroundColor Gray
    exit 0
}

Write-Host ""
Write-Host "📤 Push vers le dépôt distant..." -ForegroundColor Yellow
$branch = git branch --show-current
if (-not $branch) {
    Write-Host "Création de la branche main..." -ForegroundColor Yellow
    git branch -M main
    $branch = "main"
}

Write-Host "Branche actuelle: $branch" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pour push, exécutez manuellement:" -ForegroundColor Cyan
Write-Host "  git push origin $branch" -ForegroundColor Gray
Write-Host ""
Write-Host "Ou si c'est la première fois:" -ForegroundColor Cyan
Write-Host "  git push -u origin $branch" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Commit créé avec succès!" -ForegroundColor Green

@echo off
echo ========================================
echo   Push vers GitHub - Alfred Project
echo ========================================
echo.

REM Vérifier si on est dans un dépôt Git
if not exist .git (
    echo [ERREUR] Ce n'est pas un depot Git!
    echo Initialisation du depot...
    git init
)

echo [1/5] Verification de l'etat Git...
git status

echo.
echo [2/5] Ajout des fichiers modifies...
git add playwright.config.ts
git add .github\workflows\ci.yml
git add package.json
git add docs\CI-CD-GUIDE.md
git add scripts\push-ci.ps1
git add PUSH-CI.md

echo.
echo [3/5] Creation du commit...
git commit -m "ci: amélioration configuration CI/CD pour tests E2E

- Ajout timeouts dans playwright.config.ts
- Amélioration gestion erreurs dans workflow CI  
- Ajout reporter JUnit pour GitHub Actions
- Documentation CI/CD complète"

echo.
echo [4/5] Configuration du remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Kheinthein/afred.git

echo.
echo [5/5] Push vers GitHub...
git branch -M main
git push -u origin main

echo.
echo ========================================
echo   Push termine!
echo ========================================
echo.
echo Verifiez le CI/CD sur: https://github.com/Kheinthein/afred/actions
pause

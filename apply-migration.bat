@echo off
echo Application de la migration Prisma...
cd /d "%~dp0"
npx prisma db push --accept-data-loss
if %ERRORLEVEL% EQU 0 (
    echo Generation du client Prisma...
    npx prisma generate
    echo Migration terminee avec succes!
) else (
    echo Erreur lors de l'application de la migration
    exit /b 1
)

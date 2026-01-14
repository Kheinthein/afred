# 🚀 Commandes Git pour push vers GitHub

## Dépôt GitHub
**URL**: https://github.com/Kheinthein/afred

## Commandes à exécuter (copier-coller)

### Option 1 : Script automatique (Windows)
```batch
push-to-github.bat
```

### Option 2 : Commandes manuelles

```bash
# 1. Vérifier l'état
git status

# 2. Ajouter les fichiers modifiés
git add playwright.config.ts
git add .github/workflows/ci.yml
git add package.json
git add docs/CI-CD-GUIDE.md
git add scripts/push-ci.ps1
git add PUSH-CI.md

# 3. Créer le commit
git commit -m "ci: amélioration configuration CI/CD pour tests E2E

- Ajout timeouts dans playwright.config.ts
- Amélioration gestion erreurs dans workflow CI
- Ajout reporter JUnit pour GitHub Actions
- Documentation CI/CD complète"

# 4. Configurer le remote (si pas déjà fait)
git remote remove origin
git remote add origin https://github.com/Kheinthein/afred.git

# 5. Créer la branche main et push
git branch -M main
git push -u origin main
```

## Vérifier le CI/CD

Une fois le push effectué, allez sur :
👉 **https://github.com/Kheinthein/afred/actions**

Vous devriez voir le workflow **"CI - Tests & Quality"** se déclencher automatiquement !

## Fichiers modifiés

- ✅ `playwright.config.ts` - Configuration améliorée
- ✅ `.github/workflows/ci.yml` - Workflow CI amélioré
- ✅ `package.json` - Script test:e2e:ci
- ✅ `docs/CI-CD-GUIDE.md` - Documentation complète
- ✅ `scripts/push-ci.ps1` - Script PowerShell
- ✅ `PUSH-CI.md` - Guide de push

---

💡 **Note** : Si vous avez des problèmes d'authentification, GitHub peut demander un token d'accès personnel.

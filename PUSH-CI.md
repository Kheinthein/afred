# 🚀 Instructions pour push et déclencher le CI/CD

## Méthode rapide (recommandée)

Exécutez ce script PowerShell depuis la racine du projet :

```powershell
.\scripts\push-ci.ps1
```

Puis suivez les instructions affichées.

## Méthode manuelle

### 1. Vérifier que vous êtes dans le bon répertoire
```powershell
# Vous devriez être ici :
# C:\Users\quent\Desktop\projet de fin d'année\Alfred
```

### 2. Vérifier l'état Git
```powershell
git status
```

### 3. Ajouter les fichiers modifiés
```powershell
git add playwright.config.ts
git add .github/workflows/ci.yml
git add package.json
git add docs/CI-CD-GUIDE.md
```

### 4. Créer le commit
```powershell
git commit -m "ci: amélioration configuration CI/CD pour tests E2E"
```

### 5. Vérifier le remote (si déjà configuré)
```powershell
git remote -v
```

### 6. Push vers GitHub
```powershell
# Si c'est la première fois :
git push -u origin main

# Sinon :
git push origin main
```

## Si le dépôt n'est pas encore sur GitHub

### 1. Créer le dépôt sur GitHub
- Aller sur https://github.com/new
- Créer un nouveau dépôt (ex: `alfred`)

### 2. Configurer le remote
```powershell
git remote add origin https://github.com/VOTRE-USERNAME/alfred.git
```

### 3. Créer la branche main et push
```powershell
git branch -M main
git push -u origin main
```

## Vérifier que le CI se déclenche

1. Aller sur votre dépôt GitHub
2. Onglet **"Actions"**
3. Vous devriez voir le workflow **"CI - Tests & Quality"** en cours d'exécution

## 📝 Fichiers modifiés pour le CI/CD

- ✅ `playwright.config.ts` - Configuration améliorée avec timeouts
- ✅ `.github/workflows/ci.yml` - Workflow CI amélioré pour E2E
- ✅ `package.json` - Script test:e2e:ci ajouté
- ✅ `docs/CI-CD-GUIDE.md` - Documentation complète du CI/CD

---

💡 **Astuce** : Si vous avez des problèmes avec PowerShell, utilisez Git Bash ou l'interface GitHub Desktop.

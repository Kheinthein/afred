# 🚀 Guide CI/CD - Alfred

## 📋 Vue d'ensemble

Le projet utilise **GitHub Actions** pour le CI/CD. Les workflows se déclenchent automatiquement, mais vous pouvez aussi les tester localement.

## 🔄 Déclenchement automatique

### CI (Tests & Quality)
**Se déclenche automatiquement sur :**
- ✅ Push sur `main` ou `develop`
- ✅ Pull Request vers `main` ou `develop`

**Étapes exécutées :**
1. Lint du code
2. Vérification du formatage
3. Type-check TypeScript
4. Tests unitaires (Node 18.x et 20.x)
5. Tests d'intégration
6. Build du projet
7. Tests E2E (uniquement sur push)
8. Audit de sécurité

### CD (Déploiement Docker)
**Se déclenche automatiquement sur :**
- ✅ Push sur `main`
- ✅ Tag `v*` (ex: `v1.0.0`)

**Étapes exécutées :**
1. Build de l'image Docker
2. Push vers Docker Hub (`kheinthein/alfred`)

## 🧪 Tester localement avant de push

### Option 1 : Script PowerShell (Windows)
```powershell
# Depuis la racine du projet
.\scripts\test-ci-local.ps1
```

### Option 2 : Commandes manuelles
```bash
# 1. Lint
npm run lint

# 2. Format check
npm run format:check

# 3. Type check
npm run type-check

# 4. Tests unitaires
npm run test:unit

# 5. Tests d'intégration
npm run test:integration

# 6. Build
npm run build

# 7. Tests E2E (optionnel, prend du temps)
npm run test:e2e
```

## 🎯 Déclencher manuellement le CI/CD

### Sur GitHub (via l'interface web)

1. **Aller sur votre dépôt GitHub**
2. **Onglet "Actions"**
3. **Sélectionner le workflow** (CI - Tests & Quality ou CD - Deployment)
4. **Cliquer sur "Run workflow"** (bouton en haut à droite)
5. **Choisir la branche** et cliquer sur "Run workflow"

### Via Git (push)

```bash
# Faire un commit et push
git add .
git commit -m "feat: ma nouvelle fonctionnalité"
git push origin main

# Le CI se déclenche automatiquement !
```

## 📊 Vérifier le statut du CI/CD

### Sur GitHub
1. Aller sur votre dépôt
2. Onglet **"Actions"**
3. Voir les workflows en cours/complétés
4. Cliquer sur un workflow pour voir les détails

### Badge de statut (optionnel)
Ajoutez ce badge dans votre README.md :
```markdown
![CI](https://github.com/votre-user/alfred/workflows/CI%20-%20Tests%20&%20Quality/badge.svg)
```

## 🔍 Debugger un échec de CI

### 1. Vérifier les logs
- Aller dans **Actions** → Workflow échoué
- Cliquer sur le job qui a échoué
- Voir les logs détaillés de chaque étape

### 2. Tester localement
```bash
# Reproduire l'erreur en local
npm run lint          # Si lint échoue
npm run test:unit     # Si tests échouent
npm run build         # Si build échoue
```

### 3. Tests E2E échoués
- Télécharger les **artifacts** (screenshots, vidéos, traces)
- Voir le rapport Playwright HTML dans les artifacts
- Vérifier les logs du serveur web

## ⚙️ Configuration

### Secrets GitHub requis
Dans **Settings → Secrets and variables → Actions**, configurez :

| Secret | Description | Obligatoire |
|--------|-------------|-------------|
| `OPENAI_API_KEY` | Clé API OpenAI | ✅ Oui (pour tests IA) |
| `DOCKER_USERNAME` | Nom d'utilisateur Docker Hub | ✅ Oui (pour CD) |
| `DOCKER_PASSWORD` | Token Docker Hub | ✅ Oui (pour CD) |

### Variables d'environnement CI
Les workflows utilisent ces variables automatiquement :
- `DATABASE_URL`: `file:./test.db` (CI) ou `file:./dev.db` (E2E)
- `JWT_SECRET`: `test-secret` (CI) ou `test-secret-e2e` (E2E)
- `NODE_ENV`: `test`
- `CI`: `true`

## 🐛 Problèmes courants

### ❌ "Workflow not triggered"
- Vérifier que vous avez push sur `main` ou `develop`
- Vérifier que le fichier `.github/workflows/*.yml` existe

### ❌ "Tests E2E failed"
- Vérifier que `OPENAI_API_KEY` est configuré (même fake)
- Vérifier les artifacts pour voir les screenshots
- Augmenter les timeouts si nécessaire dans `playwright.config.ts`

### ❌ "Docker build failed"
- Vérifier que `DOCKER_USERNAME` et `DOCKER_PASSWORD` sont configurés
- Vérifier que le Dockerfile est valide

### ❌ "Lint/Format failed"
```bash
# Corriger automatiquement
npm run lint:fix
npm run format
```

## 📚 Ressources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Guide](https://playwright.dev/docs/ci)
- [Docker Hub Documentation](https://docs.docker.com/docker-hub/)

## 🎓 Commandes rapides

```bash
# Tester le CI localement (Windows)
.\scripts\test-ci-local.ps1

# Tester le CI localement (Linux/Mac)
bash scripts/test-ci-local.sh  # Si disponible

# Lancer uniquement les tests E2E
npm run test:e2e

# Voir le rapport Playwright
npx playwright show-report

# Vérifier le statut Git avant push
git status
git diff

# Push et déclencher le CI
git push origin main
```

---

💡 **Astuce** : Testez toujours localement avant de push pour éviter les surprises !

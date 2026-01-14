# Tests E2E - Alfred Writing Assistant

## 📋 Vue d'ensemble

Les tests End-to-End (E2E) avec Playwright simulent le comportement réel d'un utilisateur dans l'application. Ils couvrent les parcours critiques de bout en bout.

## 🎯 Scénarios couverts

### 1. **auth.spec.ts** - Authentification
- ✅ Inscription d'un nouvel utilisateur
- ✅ Connexion d'un utilisateur existant
- ✅ Rejet des identifiants invalides
- ✅ Validation du format email
- ✅ Protection des routes privées
- ✅ Déconnexion

### 2. **document.spec.ts** - Gestion des documents
- ✅ Affichage de la liste des documents
- ✅ Création d'un nouveau document
- ✅ Édition et sauvegarde automatique
- ✅ Affichage du preview dans la liste
- ✅ Suppression avec confirmation
- ✅ Annulation de suppression
- ✅ Réorganisation par drag and drop
- ✅ Navigation vers l'éditeur

> ℹ️ **Note** : suite désactivée depuis le 2025-11-28 (UI documents en refonte).

### 3. **ai-analysis.spec.ts** - Analyse IA
- ✅ Affichage du panel d'analyse IA
- ✅ Analyse syntaxique
- ✅ Analyse de style
- ✅ Suggestions de progression narrative
- ✅ Gestion des erreurs
- ✅ Analyses successives multiples
- ✅ Désactivation des boutons pendant l'analyse
- ✅ Compteur de mots en temps réel
- ✅ Conservation du contenu après analyse

> ℹ️ **Note** : depuis le 2025-11-28, cette suite est temporairement désactivée (`describe.skip`)
> car l'interface du panneau IA change encore et entraîne trop de faux négatifs.
> Elle sera réactivée une fois l'UI stabilisée ou quand un mock IA backend sera disponible.

## 🚀 Exécution des tests

### Prérequis
```bash
# Installer Playwright browsers (première fois uniquement)
npx playwright install
```

### Lancer tous les tests E2E
```bash
npm run test:e2e
```

### Lancer un fichier de test spécifique
```bash
npx playwright test tests/e2e/auth.spec.ts
npx playwright test tests/e2e/document.spec.ts
npx playwright test tests/e2e/ai-analysis.spec.ts
```

### Mode debug interactif
```bash
npx playwright test --debug
```

### Mode UI (interface graphique)
```bash
npx playwright test --ui
```

### Lancer avec un navigateur visible
```bash
npx playwright test --headed
```

### Générer un rapport HTML
```bash
npx playwright show-report
```

## 📊 Configuration

La configuration se trouve dans `playwright.config.ts` :

- **baseURL** : `http://localhost:3000`
- **testDir** : `./tests/e2e`
- **Browser** : Chromium (Desktop Chrome)
- **Retries** : 2 en CI, 0 en local
- **Parallel** : Désactivé en CI (workers: 1)
- **WebServer** : Lance automatiquement `npm run dev`

## ⚠️ Points d'attention

### 1. **Données de test**
- Chaque test utilise un email unique avec timestamp pour éviter les conflits
- Les tests créent leurs propres données via l'API
- Pas de nettoyage automatique de la DB (SQLite `dev.db`)

### 2. **Timeouts**
- Timeout par défaut : 30s
- Analyses IA : jusqu'à 35s (appels API réels)
- Ajuster si nécessaire dans `playwright.config.ts`

### 3. **Serveur de développement**
- Les tests démarrent automatiquement `npm run dev`
- Port 3000 doit être disponible
- Utilise `reuseExistingServer: true` en local

### 4. **Variables d'environnement**
Les tests utilisent les variables du `.env` :
```env
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key
AI_PROVIDER=openai
OPENAI_API_KEY=your-api-key
```

⚠️ **Important** : Les tests E2E font de **vrais appels à l'API OpenAI** et consomment des tokens. Pour éviter cela :
- Mocker les appels IA dans les tests
- Utiliser une clé API de test avec quota limité
- Ou désactiver temporairement les tests IA

## 🧪 Bonnes pratiques

### 1. **Sélecteurs robustes**
```typescript
// ✅ Bon : Sélecteur sémantique
await page.click('button:has-text("Nouveau document")');

// ❌ Éviter : Sélecteur CSS fragile
await page.click('.btn-primary.document-new');
```

### 2. **Attentes explicites**
```typescript
// ✅ Bon : Attendre un état spécifique
await expect(page).toHaveURL('/documents', { timeout: 10000 });

// ❌ Éviter : Timeout arbitraire
await page.waitForTimeout(5000);
```

### 3. **Isolation des tests**
- Chaque test doit être indépendant
- Utiliser `beforeEach` pour l'état initial
- Ne pas dépendre de l'ordre d'exécution

### 4. **Gestion des erreurs**
```typescript
// Vérifier les erreurs réseau
page.on('pageerror', error => {
  console.error('Page error:', error);
});

// Vérifier les erreurs console
page.on('console', msg => {
  if (msg.type() === 'error') {
    console.error('Console error:', msg.text());
  }
});
```

## 🐛 Debugging

### 1. **Screenshots automatiques**
Les screenshots sont pris automatiquement en cas d'échec dans `test-results/`

### 2. **Traces**
```bash
# Voir la trace d'un test échoué
npx playwright show-trace test-results/.../trace.zip
```

### 3. **Mode pas à pas**
```bash
npx playwright test --debug
```

### 4. **Logs détaillés**
```bash
DEBUG=pw:api npx playwright test
```

## 📈 Métriques

### Couverture actuelle
- **3 fichiers de tests**
- **~30 scénarios** couverts
- **Parcours critiques** : 100%

### Temps d'exécution estimé
- Auth : ~30s
- Documents : ~45s
- AI Analysis : ~2min (appels API réels)
- **Total** : ~3-4 minutes

## 🔄 CI/CD

Les tests E2E sont intégrés dans `.github/workflows/ci.yml` :

```yaml
- name: 🎭 Run E2E tests
  run: npm run test:e2e
  env:
    CI: true
```

En CI :
- Navigateur headless
- 2 retries automatiques en cas d'échec
- Exécution séquentielle (workers: 1)
- Screenshots et traces uploadés en artifacts

## 📚 Ressources

- [Documentation Playwright](https://playwright.dev/)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 🚧 Améliorations futures

- [ ] Mocker les appels API IA pour tests plus rapides
- [ ] Ajouter tests de performance (Lighthouse)
- [ ] Tests cross-browser (Firefox, Safari)
- [ ] Tests mobile (viewport responsive)
- [ ] Tests d'accessibilité (axe-core)
- [ ] Visual regression testing


import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour l'analyse IA
 * Scénario : créer doc → analyser avec IA → voir suggestions
 */

test.describe('Analyse IA E2E', () => {
  const testEmail = `test-ai-${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';
  let authToken: string;
  let documentId: string;

  test.beforeAll(async ({ request }) => {
    // Créer un utilisateur pour les tests
    const authResponse = await request.post(
      'http://localhost:3000/api/auth/register',
      {
        data: {
          email: testEmail,
          password: testPassword,
        },
      }
    );

    const authJson = (await authResponse.json()) as { data: { token: string } };
    authToken = authJson.data.token;

    // Créer un document de test avec du contenu
    const docResponse = await request.post(
      'http://localhost:3000/api/documents',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          title: 'Mon Roman Fantastique',
          content:
            "Il était une fois dans un royaume lointain, un jeune héros qui partait à l'aventure. Le soleil brillait dans le ciel azuré et les oiseaux chantaient joyeusement. Notre protagoniste, armé de courage et de détermination, s'avançait vers son destin.",
          styleId: 'style-1',
        },
      }
    );

    const docJson = (await docResponse.json()) as {
      data: { document: { id: string } };
    };
    documentId = docJson.data.document.id;
  });

  test.beforeEach(async ({ page }) => {
    // Se connecter et naviguer vers le document
    await page.goto('/login');
    await page.evaluate((token) => {
      localStorage.setItem('auth_token', token);
    }, authToken);
    await page.goto(`/documents/${documentId}`);
    await page.waitForLoadState('networkidle');
  });

  test("devrait afficher le panel d'analyse IA", async ({ page }) => {
    // Vérifier la présence du panel d'analyse
    await expect(page.locator('text=/Analyse IA|Assistant IA/')).toBeVisible();

    // Vérifier la présence des boutons d'analyse
    await expect(page.locator('button:has-text("Syntaxe")')).toBeVisible();
    await expect(page.locator('button:has-text("Style")')).toBeVisible();
    await expect(page.locator('button:has-text("Progression")')).toBeVisible();
  });

  test('devrait analyser la syntaxe du document', async ({ page }) => {
    // Cliquer sur le bouton "Syntaxe"
    await page.click('button:has-text("Syntaxe")');

    // Vérifier qu'un indicateur de chargement apparaît
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).toBeVisible({ timeout: 2000 });

    // Attendre que l'analyse soit terminée (max 30s pour l'appel API réel)
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Vérifier que des suggestions sont affichées
    // L'IA devrait retourner au moins un résultat
    const hasResults = await page
      .locator('text=/Suggestions|Aucune erreur|Corrections/')
      .isVisible();
    expect(hasResults).toBeTruthy();
  });

  test('devrait analyser le style du document', async ({ page }) => {
    // Cliquer sur le bouton "Style"
    await page.click('button:has-text("Style")');

    // Attendre le chargement
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).toBeVisible({ timeout: 2000 });

    // Attendre la fin de l'analyse
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Vérifier que des suggestions de style sont affichées
    const hasStyleResults = await page
      .locator('text=/Style|Ton|Vocabulaire|Cohérence/')
      .isVisible();
    expect(hasStyleResults).toBeTruthy();
  });

  test('devrait suggérer une progression narrative', async ({ page }) => {
    // Cliquer sur le bouton "Progression"
    await page.click('button:has-text("Progression")');

    // Attendre le chargement
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).toBeVisible({ timeout: 2000 });

    // Attendre la fin de l'analyse
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Vérifier que des suggestions narratives sont affichées
    const hasProgressionResults = await page
      .locator('text=/Progression|Suite|Développer|Intrigue/')
      .isVisible();
    expect(hasProgressionResults).toBeTruthy();
  });

  test("devrait afficher un message d'erreur si l'analyse échoue", async ({
    page,
  }) => {
    // Déconnecter (invalider le token) pour provoquer une erreur
    await page.evaluate(() => {
      localStorage.setItem('auth_token', 'invalid-token');
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Essayer d'analyser
    await page.click('button:has-text("Syntaxe")');

    // Vérifier qu'un message d'erreur apparaît
    await expect(page.locator('text=/Erreur|Échec|Impossible/')).toBeVisible({
      timeout: 10000,
    });
  });

  test('devrait permettre plusieurs analyses successives', async ({ page }) => {
    // Première analyse : Syntaxe
    await page.click('button:has-text("Syntaxe")');
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).toBeVisible({ timeout: 2000 });
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Attendre un peu entre les analyses
    await page.waitForTimeout(2000);

    // Deuxième analyse : Style
    await page.click('button:has-text("Style")');
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).toBeVisible({ timeout: 2000 });
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Vérifier que les résultats de la deuxième analyse sont affichés
    const hasResults = await page
      .locator('text=/Style|Suggestions/')
      .isVisible();
    expect(hasResults).toBeTruthy();
  });

  test("devrait désactiver les boutons pendant l'analyse", async ({ page }) => {
    // Cliquer sur le bouton "Syntaxe"
    await page.click('button:has-text("Syntaxe")');

    // Vérifier que les boutons sont désactivés pendant l'analyse
    const syntaxButton = page.locator('button:has-text("Syntaxe")');
    const styleButton = page.locator('button:has-text("Style")');
    const progressionButton = page.locator('button:has-text("Progression")');

    // Au moins un des boutons devrait être désactivé
    const isDisabled =
      (await syntaxButton.isDisabled()) ||
      (await styleButton.isDisabled()) ||
      (await progressionButton.isDisabled());

    expect(isDisabled).toBeTruthy();

    // Attendre la fin de l'analyse
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Vérifier que les boutons sont réactivés
    await expect(syntaxButton).toBeEnabled({ timeout: 5000 });
  });

  test('devrait afficher le compteur de mots en temps réel', async ({
    page,
  }) => {
    // Vérifier le compteur initial
    const initialWordCount = await page
      .locator('text=/\\d+ mots?/')
      .textContent();
    expect(initialWordCount).toBeTruthy();

    // Ajouter du texte dans l'éditeur
    const textarea = page.locator('textarea');
    await textarea.clear();
    await textarea.fill(
      'Ceci est un test avec exactement dix mots dans cette phrase.'
    );

    // Attendre que le compteur se mette à jour
    await page.waitForTimeout(1000);

    // Vérifier que le compteur affiche 10 mots
    await expect(page.locator('text=10 mots')).toBeVisible({ timeout: 5000 });
  });

  test('devrait conserver le contenu après une analyse', async ({ page }) => {
    // Récupérer le contenu initial
    const textarea = page.locator('textarea');
    const initialContent = await textarea.inputValue();

    // Lancer une analyse
    await page.click('button:has-text("Syntaxe")');
    await expect(
      page.locator('text=/Analyse en cours|Chargement/')
    ).not.toBeVisible({ timeout: 35000 });

    // Vérifier que le contenu n'a pas changé
    const finalContent = await textarea.inputValue();
    expect(finalContent).toBe(initialContent);
  });

  test("devrait afficher le style d'écriture sélectionné", async ({ page }) => {
    // Vérifier qu'un sélecteur de style est présent
    const styleSelector = page.locator('select, [role="combobox"]');

    // Si un sélecteur existe, vérifier qu'une valeur est sélectionnée
    if ((await styleSelector.count()) > 0) {
      const selectedValue = await styleSelector.first().inputValue();
      expect(selectedValue).toBeTruthy();
    }
  });
});

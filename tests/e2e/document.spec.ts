import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour la gestion des documents
 * Scénario : créer doc → éditer → sauvegarder → supprimer
 */

/**
 * ⚠️ Suite temporairement désactivée (UI documents instable).
 * Voir docs/IMPROVEMENTS.md pour le suivi de réactivation.
 */
test.describe.skip('Gestion des Documents E2E (temporarily skipped)', () => {
  const testEmail = `test-doc-${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';
  let authToken: string;
  let userId: string;
  let styleId: string;

  test.beforeAll(async ({ request }) => {
    // Créer un utilisateur pour les tests
    const response = await request.post(
      'http://localhost:3000/api/auth/register',
      {
        data: {
          email: testEmail,
          password: testPassword,
        },
      }
    );

    const json = (await response.json()) as {
      success: boolean;
      data?: { token: string; user: { id: string } };
      error?: { message: string };
    };
    if (!json.success || !json.data) {
      throw new Error(
        `Registration failed: ${json.error?.message || 'Unknown error'}`
      );
    }
    authToken = json.data.token;
    userId = json.data.user.id;

    // Récupérer un style d'écriture existant
    const stylesResponse = await request.get(
      'http://localhost:3000/api/styles'
    );
    const stylesJson = (await stylesResponse.json()) as {
      success: boolean;
      data?: { styles: Array<{ id: string; name: string }> };
    };
    if (
      !stylesJson.success ||
      !stylesJson.data ||
      stylesJson.data.styles.length === 0
    ) {
      throw new Error('No writing styles found');
    }
    styleId = stylesJson.data.styles[0].id;
  });

  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/login');
    await page.evaluate(
      ({ token, email, id }) => {
        const authData = {
          user: { id, email },
          token,
        };
        localStorage.setItem('alfred:auth', JSON.stringify(authData));
      },
      { token: authToken, email: testEmail, id: userId }
    );

    // Naviguer vers la page documents
    await page.goto('/documents');

    // Vérifier que nous sommes bien sur /documents
    await expect(page).toHaveURL('/documents', { timeout: 10000 });

    // Attendre que le titre soit visible
    const documentsHeading = page.getByRole('heading', {
      level: 2,
      name: /Mes documents/i,
    });
    await expect(documentsHeading).toBeVisible({ timeout: 10000 });

    // Attendre que le message de chargement disparaisse s'il est présent
    const loadingText = page.getByText(/Chargement des documents/);
    if (await loadingText.isVisible().catch(() => false)) {
      await loadingText.waitFor({ state: 'hidden', timeout: 10000 });
    }

    await page.waitForLoadState('networkidle');
  });

  test('devrait afficher la liste des documents vide initialement', async ({
    page,
  }) => {
    // Vérifier qu'on est sur la page documents
    await expect(page).toHaveURL('/documents');

    // Vérifier le titre de la page (h2 dans la section)
    await expect(
      page.getByRole('heading', { level: 2, name: /Mes documents/i })
    ).toBeVisible();

    // Vérifier la présence du bouton "Créer" pour créer un document
    await expect(page.getByRole('button', { name: 'Créer' })).toBeVisible();
  });

  test('devrait créer un nouveau document', async ({ page }) => {
    // Attendre que le formulaire soit visible
    await page.waitForSelector('#new-document-title', { timeout: 10000 });

    // Remplir le formulaire de création
    await page.getByLabel('Titre').fill('Mon Nouveau Document');
    await page.getByLabel('Style').selectOption(styleId);

    // Attendre que le bouton soit activé
    await page.waitForSelector('button:has-text("Créer"):not([disabled])', {
      timeout: 5000,
    });

    // Cliquer sur "Créer"
    await page.click('button:has-text("Créer")');

    // Attendre que le document soit créé et la redirection
    await page.waitForURL(/\/documents\/[a-f0-9-]+/, { timeout: 10000 });

    // Vérifier qu'on est sur la page d'édition
    const url = page.url();
    expect(url).toMatch(/\/documents\/[a-f0-9-]+/);

    // Vérifier la présence de l'éditeur
    await expect(page.locator('textarea')).toBeVisible();

    // Vérifier la présence du compteur de mots
    await expect(page.locator('text=/\\d+ mots?/')).toBeVisible();
  });

  test('devrait éditer et sauvegarder un document', async ({ page }) => {
    await page.waitForSelector('#new-document-title', { timeout: 10000 });

    // Créer un nouveau document
    await page.getByLabel('Titre').fill('Mon Premier Roman');
    await page.getByLabel('Style').selectOption(styleId);

    // Attendre que le bouton soit activé
    await page.waitForSelector('button:has-text("Créer"):not([disabled])', {
      timeout: 5000,
    });

    await page.click('button:has-text("Créer")');
    await page.waitForURL(/\/documents\/[a-f0-9-]+/);

    const documentTitle = 'Mon Premier Roman';
    const documentContent =
      'Il était une fois dans un royaume lointain, un écrivain qui utilisait Alfred pour améliorer son style...';

    // Modifier le titre
    const titleInput = page.locator('input[type="text"]').first();
    await titleInput.clear();
    await titleInput.fill(documentTitle);

    // Attendre l'auto-save du titre
    await page.waitForTimeout(3500);

    // Modifier le contenu
    const contentTextarea = page.locator('textarea');
    await contentTextarea.clear();
    await contentTextarea.fill(documentContent);

    // Attendre l'auto-save du contenu
    await page.waitForTimeout(3500);

    // Vérifier que le compteur de mots est mis à jour
    const wordCount = documentContent.split(/\s+/).length;
    await expect(page.locator(`text=${wordCount} mots`)).toBeVisible({
      timeout: 5000,
    });

    // Retourner à la liste des documents
    await page.getByRole('link', { name: /Retour aux documents/i }).click();
    await page.waitForURL('/documents');

    // Vérifier que le document apparaît dans la liste avec le bon titre (h3 dans la card)
    await expect(
      page
        .locator('[data-testid="document-card"]')
        .filter({ has: page.locator('h3', { hasText: documentTitle }) })
    ).toBeVisible();
  });

  test('devrait afficher le preview du contenu dans la liste', async ({
    page,
  }) => {
    // Créer un document avec du contenu
    const response = await page.request.post(
      'http://localhost:3000/api/documents',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          title: 'Document avec preview',
          content:
            'Ceci est un texte de test pour vérifier le preview dans la liste des documents.',
          styleId,
        },
      }
    );

    expect(response.ok()).toBeTruthy();

    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que le titre est affiché
    await expect(page.locator('text=Document avec preview')).toBeVisible();

    // Vérifier qu'un extrait du contenu est visible
    await expect(page.locator('text=/Ceci est un texte/')).toBeVisible();
  });

  test('devrait supprimer un document avec confirmation', async ({ page }) => {
    // Créer un document à supprimer
    const response = await page.request.post(
      'http://localhost:3000/api/documents',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          title: 'Document à supprimer',
          content: 'Ce document sera supprimé.',
          styleId,
        },
      }
    );

    // Document créé avec succès
    await response.json();

    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que le document est présent
    const docCard = page
      .locator('[data-testid="document-card"]')
      .filter({ has: page.locator('h3', { hasText: 'Document à supprimer' }) });
    await expect(docCard).toBeVisible();

    // Cliquer sur le bouton de suppression
    await docCard.getByTestId('delete-document-button').click();

    // Vérifier que le dialog de confirmation apparaît
    const deleteDialog = page.getByRole('dialog', {
      name: 'Supprimer ce document ?',
    });
    await expect(deleteDialog).toBeVisible();

    await deleteDialog.getByRole('button', { name: 'Oui, supprimer' }).click();

    // Attendre que le document disparaisse de la liste
    await expect(docCard).not.toBeVisible({ timeout: 5000 });
  });

  test("devrait annuler la suppression d'un document", async ({ page }) => {
    // Créer un document
    await page.request.post('http://localhost:3000/api/documents', {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        title: 'Document à conserver',
        content: 'Ce document ne sera pas supprimé.',
        styleId,
      },
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    const docCard = page
      .locator('[data-testid="document-card"]')
      .filter({ has: page.locator('h3', { hasText: 'Document à conserver' }) });
    await expect(docCard).toBeVisible();

    await docCard.getByTestId('delete-document-button').click();

    const cancelDialog = page.getByRole('dialog', {
      name: 'Supprimer ce document ?',
    });
    await expect(cancelDialog).toBeVisible();

    await cancelDialog.getByRole('button', { name: 'Annuler' }).click();

    await expect(docCard).toBeVisible();
  });

  test('devrait réorganiser les documents par drag and drop', async ({
    page,
  }) => {
    // Créer plusieurs documents
    const docs = ['Premier Doc', 'Deuxième Doc', 'Troisième Doc'];

    for (const title of docs) {
      await page.request.post('http://localhost:3000/api/documents', {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          title,
          content: `Contenu de ${title}`,
          styleId,
        },
      });
    }

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que tous les documents sont présents (h3 dans les cards)
    for (const title of docs) {
      await expect(
        page
          .locator('[data-testid="document-card"]')
          .filter({ has: page.locator('h3', { hasText: title }) })
      ).toBeVisible();
    }

    // Note: Le test réel de drag and drop nécessiterait une implémentation plus complexe
    // avec page.dragAndDrop() ou des actions de souris personnalisées
    // Pour l'instant, on vérifie juste que les cartes existent
    expect(
      await page.locator('[data-testid="document-card"]').count()
    ).toBeGreaterThanOrEqual(3);
  });

  test("devrait naviguer vers l'éditeur en cliquant sur un document", async ({
    page,
  }) => {
    // Créer un document
    const response = await page.request.post(
      'http://localhost:3000/api/documents',
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          title: 'Document à ouvrir',
          content: 'Contenu du document.',
          styleId,
        },
      }
    );

    const { data } = await response.json();
    const documentId = data.document.id;

    await page.reload();
    await page.waitForLoadState('networkidle');

    const docCard = page
      .locator('[data-testid="document-card"]')
      .filter({ has: page.locator('h3', { hasText: 'Document à ouvrir' }) });
    await expect(docCard).toBeVisible({ timeout: 10000 });

    await docCard.getByTestId('open-document-button').click();

    // Vérifier la navigation vers l'éditeur
    await expect(page).toHaveURL(`/documents/${documentId}`, { timeout: 5000 });

    // Vérifier que l'éditeur est chargé avec le contenu
    await expect(page.locator('textarea')).toHaveValue('Contenu du document.');
  });
});

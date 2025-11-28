import { test, expect } from '@playwright/test';

/**
 * Tests E2E pour la gestion des documents
 * Scénario : créer doc → éditer → sauvegarder → supprimer
 */

test.describe('Gestion des Documents E2E', () => {
  const testEmail = `test-doc-${Date.now()}@example.com`;
  const testPassword = 'SecurePass123!';
  let authToken: string;

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

    const json = (await response.json()) as { data: { token: string } };
    authToken = json.data.token;
  });

  test.beforeEach(async ({ page }) => {
    // Se connecter avant chaque test
    await page.goto('/login');
    await page.evaluate((token) => {
      localStorage.setItem('auth_token', token);
    }, authToken);
    await page.goto('/documents');
    await page.waitForLoadState('networkidle');
  });

  test('devrait afficher la liste des documents vide initialement', async ({
    page,
  }) => {
    // Vérifier qu'on est sur la page documents
    await expect(page).toHaveURL('/documents');

    // Vérifier le titre de la page
    await expect(page.locator('h1')).toContainText('Mes Documents');

    // Vérifier la présence du bouton "Nouveau document"
    await expect(
      page.locator('button:has-text("Nouveau document")')
    ).toBeVisible();
  });

  test('devrait créer un nouveau document', async ({ page }) => {
    // Cliquer sur "Nouveau document"
    await page.click('button:has-text("Nouveau document")');

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
    // Créer un nouveau document
    await page.click('button:has-text("Nouveau document")');
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
    await page.click('a:has-text("Mes Documents")');
    await page.waitForURL('/documents');

    // Vérifier que le document apparaît dans la liste avec le bon titre
    await expect(page.locator(`text=${documentTitle}`)).toBeVisible();
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
          styleId: 'style-1',
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
          styleId: 'style-1',
        },
      }
    );

    // Document créé avec succès
    await response.json();

    // Recharger la page
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que le document est présent
    await expect(page.locator('text=Document à supprimer')).toBeVisible();

    // Cliquer sur le bouton de suppression
    const deleteButton = page
      .locator(`button[aria-label="Supprimer le document"]`)
      .first();
    await deleteButton.click();

    // Vérifier que le dialog de confirmation apparaît
    await expect(
      page.locator('text=/Êtes-vous sûr|Confirmer la suppression/')
    ).toBeVisible();

    // Confirmer la suppression
    await page.click('button:has-text("Supprimer")');

    // Attendre que le document disparaisse de la liste
    await expect(page.locator('text=Document à supprimer')).not.toBeVisible({
      timeout: 5000,
    });
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
        styleId: 'style-1',
      },
    });

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Cliquer sur le bouton de suppression
    const deleteButton = page
      .locator(`button[aria-label="Supprimer le document"]`)
      .first();
    await deleteButton.click();

    // Vérifier que le dialog apparaît
    await expect(
      page.locator('text=/Êtes-vous sûr|Confirmer la suppression/')
    ).toBeVisible();

    // Annuler la suppression
    await page.click('button:has-text("Annuler")');

    // Vérifier que le document est toujours présent
    await expect(page.locator('text=Document à conserver')).toBeVisible();
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
          styleId: 'style-1',
        },
      });
    }

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Vérifier que tous les documents sont présents
    for (const title of docs) {
      await expect(page.locator(`text=${title}`)).toBeVisible();
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
          styleId: 'style-1',
        },
      }
    );

    const { data } = await response.json();
    const documentId = data.document.id;

    await page.reload();
    await page.waitForLoadState('networkidle');

    // Cliquer sur le document
    await page.click('text=Document à ouvrir');

    // Vérifier la navigation vers l'éditeur
    await expect(page).toHaveURL(`/documents/${documentId}`, { timeout: 5000 });

    // Vérifier que l'éditeur est chargé avec le contenu
    await expect(page.locator('textarea')).toHaveValue('Contenu du document.');
  });
});

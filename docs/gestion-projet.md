# GESTION DE PROJET
## Alfred - Assistant d'Écriture avec Intelligence Artificielle

**Date :** Janvier 2025

---

## 4. GESTION DE PROJET

### 4.1. Intervenants sur le Projet

J'ai assumé le rôle de chef de projet et développeur principal. En tant que chef de projet, j'ai planifié les phases de développement, défini les priorités, et suivi l'avancement. En tant que développeur principal, j'ai implémenté les fonctionnalités, défini l'architecture technique, et intégré les différents composants.

La maîtrise d'ouvrage (MOA) est assurée par le chef d'entreprise et la direction métier. Ils valident les choix techniques et fonctionnels, s'assurent que le projet répond aux objectifs stratégiques, et interviennent comme recetteurs lors des validations.

L'équipe de développement travaille sur les différents modules de l'application. Chaque développeur est responsable d'un module spécifique (authentification, gestion des documents, intelligence artificielle) tout en collaborant avec l'équipe.

Le responsable d'exploitation est en charge de la mise en production et de la maintenance de l'infrastructure. Il collabore avec l'équipe pour définir les procédures de déploiement.

Le responsable du support participe à la définition des mécanismes de logging et de monitoring nécessaires pour assurer un support efficace en production.

Un webdesigner a été sollicité pour définir la charte graphique et l'interface utilisateur. L'identité visuelle, avec son thème "papier ancien" pour la zone d'écriture et moderne pour la partie intelligence artificielle, a été conçue en collaboration.

### 4.2. Méthodologie

**Présentation de la méthodologie AGILE :**

La méthodologie AGILE privilégie la collaboration, la flexibilité, et l'adaptation aux changements. Elle se base sur la livraison fréquente de logiciels fonctionnels, l'adaptation aux changements de besoins, la collaboration étroite entre les parties prenantes, et l'amélioration continue.

Les principes AGILE mettent l'accent sur les individus et leurs interactions, sur un logiciel qui fonctionne, sur la collaboration avec le client, et sur la réactivité au changement plutôt que sur le suivi d'un plan rigide.

**Méthodologie projet utilisée :**

J'ai adapté les principes AGILE à notre contexte d'entreprise. Le développement est organisé en sprints de deux semaines, chaque sprint ayant un objectif fonctionnel précis. Le premier sprint était consacré à l'architecture et l'authentification, le second à la gestion des documents, et ainsi de suite.

À la fin de chaque sprint, l'équipe se réunit pour une revue de sprint où les fonctionnalités sont présentées et validées par la MOA. Une rétrospective permet d'identifier les difficultés et d'ajuster le planning. Cette approche itérative permet de livrer régulièrement des fonctionnalités opérationnelles.

J'ai appliqué le principe de développement itératif et incrémental. Chaque fonctionnalité est développée de manière minimale mais fonctionnelle, puis améliorée au fil des itérations. Par exemple, l'éditeur de texte a d'abord été implémenté avec les fonctionnalités de base, puis enrichi avec la sauvegarde automatique et le versioning.

La communication avec la MOA se fait de manière régulière, avec des points d'avancement hebdomadaires permettant de valider les orientations et d'ajuster si nécessaire.

### 4.3. Outils, Planning et Suivi

**Phases de gestion de projet :**

Le projet a été structuré en plusieurs phases principales :

- **Conception et architecture** : Définition de l'architecture technique, choix des technologies, et mise en place de la structure du projet (environ deux semaines).

- **Développement des fonctionnalités** : Phase la plus longue, divisée en sous-phases correspondant aux différents modules (authentification, gestion des documents, intelligence artificielle, interface utilisateur).

- **Tests et qualité** : Menés en parallèle du développement, avec l'écriture de tests unitaires, d'intégration, et end-to-end au fur et à mesure. Cette approche TDD garantit la qualité du code dès le départ.

- **Documentation et préparation à la production** : Documentation de l'architecture, de l'API, des procédures de déploiement, et préparation des éléments nécessaires (Docker, migrations de base de données).

**Outils utilisés :**

- **Git et GitHub** : Versioning et gestion du code source, création de branches pour les nouvelles fonctionnalités, suivi de l'historique des modifications.

- **GitHub Issues** : Suivi des tâches et planification, liste des fonctionnalités à développer, bugs à corriger, et améliorations à apporter.

- **GitHub Actions** : Intégration continue avec exécution automatique des tests, du linting, et de la vérification de types à chaque push.

- **Prisma** : ORM pour la gestion de la base de données, migrations structurées, et maintenance du schéma à jour.

**Planning et suivi :**

Le planning initial a été établi en fonction des fonctionnalités à développer et des contraintes temporelles. J'ai défini des jalons (milestones) correspondant aux principales fonctionnalités : authentification, gestion des documents, analyses IA, et interface utilisateur. Ces jalons sont validés avec la MOA et servent de points de contrôle.

Le suivi de l'avancement se fait de manière hebdomadaire, avec une revue des tâches accomplies et restantes. Cette revue permet d'ajuster le planning et d'identifier les risques potentiels. Les risques identifiés sont documentés et des plans d'action sont mis en place.

Les ajustements de planning sont fréquents, notamment lorsque l'équipe découvre des difficultés techniques ou lorsque la direction demande des ajustements fonctionnels. Cette flexibilité, permise par la méthodologie AGILE, permet de s'adapter aux réalités du développement sans compromettre la qualité finale.

### 4.4. Objectifs de Qualité

Les objectifs de qualité pour cette application ont été définis dès le début du projet et ont guidé toutes les décisions techniques et fonctionnelles.

**Qualité du code :**

L'objectif est de produire un code maintenable, lisible, et bien structuré. J'ai adopté une architecture Clean Architecture qui sépare les responsabilités entre les couches (Domain, Application, Infrastructure, Presentation). Cette séparation facilite la maintenance et les tests.

J'ai mis en place des outils de qualité automatiques : ESLint pour détecter les erreurs, Prettier pour le formatage, et TypeScript pour la sécurité des types. Ces outils sont exécutés automatiquement avant chaque commit grâce à Husky et lint-staged.

**Qualité fonctionnelle :**

J'ai mis en place une stratégie de tests complète. Les tests unitaires couvrent la logique métier dans la couche Domain, avec un objectif de couverture d'au moins 80%. Les tests d'intégration vérifient le fonctionnement des API routes et de l'interaction avec la base de données. Les tests end-to-end avec Playwright valident les scénarios utilisateur complets.

Cette approche permet de détecter rapidement les régressions et de s'assurer que chaque nouvelle fonctionnalité fonctionne correctement. Les recetteurs de la MOA participent aux tests d'acceptation pour valider que les fonctionnalités répondent aux besoins métier.

**Qualité de performance :**

Les objectifs de performance sont définis en termes de temps de réponse : authentification moins de 200ms, opérations sur les documents moins de 100ms, analyses IA moins de 3 secondes (dépendant d'une API externe). Pour l'interface utilisateur, l'objectif est un chargement inférieur à 1.5 secondes et un temps jusqu'à l'interactivité inférieur à 3.5 secondes.

**Qualité de sécurité :**

La sécurité a été prise en compte dès la conception : mots de passe hashés avec bcrypt, authentification JWT avec expiration, validation et nettoyage de toutes les entrées utilisateur, et système de rate limiting pour protéger l'API contre les abus.

**Qualité de la documentation :**

La documentation comprend une description de l'architecture, une documentation de l'API, des guides de configuration et de déploiement, et des décisions d'architecture documentées (ADR). Cette documentation facilite la maintenance future.

**Suivi de la qualité :**

Le suivi se fait de manière continue grâce à l'intégration continue. À chaque push, les tests sont exécutés, le code est analysé, et un rapport de couverture est généré. Des revues de code sont également effectuées pour garantir la qualité et partager les bonnes pratiques.

---

**Document rédigé le :** Janvier 2025

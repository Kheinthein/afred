# SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES
## Alfred - Assistant d'Écriture avec Intelligence Artificielle

**Date :** Janvier 2025

---

## 5. SPÉCIFICATIONS FONCTIONNELLES DÉTAILLÉES

### 5.1. Contraintes du Projet et Livrables Attendus

#### 5.1.1. Criticité de l'Application

**Criticité de la population qui utilise l'application :**

L’application Alfred s’adresse principalement à des particuliers passionnés d’écriture, qu’ils soient professionnels ou amateurs. La criticité de la population est considérée comme moyenne.
En effet, l’application ne concerne pas la sécurité ou la santé des utilisateurs, et son indisponibilité ne met pas en danger les personnes. Cependant, elle peut constituer un outil professionnel important pour certains écrivains, qui peuvent en dépendre dans le cadre de leur activité.

**Nombre d'utilisateurs :**

Pour la Phase 1 (lancement), l'application vise environ 1000 utilisateurs actifs par mois, avec environ 100 nouveaux utilisateurs par mois. Le nombre d'utilisateurs inscrits est estimé à environ 1500, incluant les utilisateurs actifs et ceux qui ont testé l'application sans l'utiliser régulièrement. Aucun archivage d'utilisateurs n'est prévu dans cette phase.

Pour la Phase 2 (croissance), l'objectif est d'atteindre environ 10000 utilisateurs actifs par mois, avec environ 1000 nouveaux utilisateurs par mois.

**Disponibilité (Key Performance Indicator) :**

L'objectif de disponibilité est fixé à 99.5%, ce qui représente un maximum de 4.4 heures d'indisponibilité par mois. Le temps de récupération après un incident (RTO - Recovery Time Objective) doit être inférieur à 1 heure. Les sauvegardes sont effectuées toutes les 15 minutes maximum pour garantir une perte de données minimale (RPO - Recovery Point Objective).

**Support et maintenance :**

Le support est assuré du lundi au vendredi, de 9h à 18h (5 jours sur 7). Pour les utilisateurs premium, un support prioritaire est disponible avec un temps de réponse garanti inférieur à 4 heures. Les utilisateurs gratuits bénéficient d'un support standard avec un temps de réponse inférieur à 48 heures.

La maintenance préventive est planifiée en dehors des heures de pointe, généralement le dimanche matin entre 2h et 6h. Les utilisateurs sont informés à l'avance des opérations de maintenance prévues.

**Impacts indisponibilité de service :**

En cas d'indisponibilité de l'application, les utilisateurs ne peuvent pas accéder à leurs documents ni utiliser les fonctionnalités d'analyse par intelligence artificielle. Cependant, les données sont sauvegardées régulièrement, ce qui limite le risque de perte de données. L'impact principal concerne la perte de productivité pour les écrivains qui utilisent l'application quotidiennement.

Pour minimiser l'impact, un système de notification est mis en place pour informer les utilisateurs des incidents en cours et des mesures prises pour résoudre le problème.

#### 5.1.2. Applications Connexes

L'application Alfred est une application autonome qui ne dépend pas directement d'autres applications métier de l'entreprise. Cependant, certaines intégrations sont prévues ou envisagées :

**Intégrations prévues :**

Aucune intégration avec d'autres applications métier n'est prévue dans la Phase 1. L'application fonctionne de manière indépendante.

**Intégrations envisagées :**

Pour les phases futures, des intégrations avec d'autres outils d'écriture sont envisagées, notamment avec des logiciels d'édition ou des plateformes de publication. Ces intégrations permettraient d'exporter directement les documents vers ces outils ou d'importer des documents existants.

**Dépendances techniques :**

L'application dépend techniquement de services externes pour l'intelligence artificielle (OpenAI, Claude, ou autres fournisseurs). Ces dépendances sont gérées via des adaptateurs qui permettent de changer de fournisseur sans impact sur le reste de l'application.

#### 5.1.3. Services Tiers

**Services d'intelligence artificielle :**

L'application utilise des services tiers pour les analyses par intelligence artificielle. Les fournisseurs supportés sont OpenAI (GPT-4 Turbo), Claude (Anthropic), et potentiellement d'autres fournisseurs via des adaptateurs. Le choix du fournisseur est configurable via une variable d'environnement.

**Services d'hébergement :**

L'application est hébergée sur une infrastructure cloud. Les services utilisés incluent le stockage de fichiers, la base de données, et le déploiement de l'application. Ces services sont gérés par le responsable d'exploitation.

**Services de monitoring et logging :**

Des services de monitoring sont utilisés pour suivre les performances de l'application et détecter les erreurs. Les logs sont centralisés pour faciliter le débogage et l'analyse des incidents.

**Services non utilisés :**

L'application n'utilise pas actuellement de services d'analytics externes (comme Google Analytics), d'intégration avec les réseaux sociaux, de services d'emailing, ou de CRM. Ces services pourront être intégrés dans les phases futures selon les besoins identifiés.

#### 5.1.4. Livrables Attendus

**Cahier des charges :**

Le cahier des charges détaillé a été fourni et validé par la maîtrise d'ouvrage. Il décrit les besoins fonctionnels, les contraintes techniques, et les objectifs du projet.

**Spécifications fonctionnelles et techniques :**

Le présent document constitue les spécifications fonctionnelles détaillées. Les spécifications techniques décrivent l'architecture technique, les technologies utilisées, et les choix d'implémentation. Ces documents sont validés par la maîtrise d'ouvrage avant le début du développement.

**Maquettage et design :**

Les maquettes de l'interface utilisateur ont été réalisées et validées. La charte graphique, avec son thème "papier ancien" pour la zone d'écriture et moderne pour la partie intelligence artificielle, a été définie et approuvée.

**Développement :**

Le développement de l'application comprend l'implémentation de toutes les fonctionnalités décrites dans le cahier des charges : authentification, gestion des documents, analyses par intelligence artificielle, interface utilisateur, et toutes les fonctionnalités complémentaires.

**Intégration :**

L'intégration comprend la configuration des services externes (intelligence artificielle, base de données), la mise en place de l'environnement de production, et les tests d'intégration pour valider le bon fonctionnement de l'ensemble.

**Migration de base de données :**

Aucune migration de base de données existante n'est nécessaire. La base de données est créée lors du déploiement initial avec les migrations Prisma.

**Achat du nom de domaine et gestion de l'hébergement :**

L'achat du nom de domaine et la gestion de l'hébergement sont assurés par l'entreprise. Le nom de domaine est configuré et pointé vers l'infrastructure d'hébergement.

**Maintenance et mises à jour :**

La maintenance comprend la correction des bugs, l'application des mises à jour de sécurité, et l'amélioration continue de l'application. Les mises à jour sont déployées selon un planning défini, avec notification des utilisateurs pour les mises à jour majeures.

**Formation à la gestion du site :**

Une formation est fournie aux administrateurs pour la gestion de l'application, notamment pour la gestion des utilisateurs, des styles d'écriture, et le monitoring du système.

**Accompagnement marketing :**

L'accompagnement marketing comprend la définition d'un plan marketing, l'optimisation pour les moteurs de recherche (SEO), et l'analyse de l'utilisation de l'application (webanalyse). Le référencement payant (SEA) et l'optimisation des médias sociaux (SMO) pourront être ajoutés dans les phases futures selon les besoins.

### 5.2. Architecture Logicielle du Projet

**Architecture générale :**

L'application Alfred utilise une architecture Clean Architecture organisée en monolithe modulaire. Cette architecture sépare clairement les responsabilités en quatre couches principales : Presentation, Application, Domain, et Infrastructure.

**Couche Presentation :**

La couche Presentation est implémentée avec Next.js 14 utilisant l'App Router. Elle comprend les routes API (`/api/auth`, `/api/documents`, `/api/ai`) qui exposent les fonctionnalités de l'application, et les pages de l'interface utilisateur. Les middlewares gèrent l'authentification, la validation des données, et la gestion des erreurs.

**Couche Application :**

La couche Application orchestre les cas d'usage métier. Elle comprend les DTOs (Data Transfer Objects) avec validation Zod pour valider les données d'entrée, et les services d'orchestration qui coordonnent les interactions entre les différentes couches. L'injection de dépendances est gérée via InversifyJS.

**Couche Domain :**

La couche Domain contient la logique métier pure, indépendante de l'infrastructure. Elle comprend les entités (User, Document, AIAnalysis), les value objects (Email, DocumentContent), les cas d'usage (CreateUser, AnalyzeText, etc.), et les interfaces de repositories (Ports) qui définissent les contrats d'accès aux données.

**Couche Infrastructure :**

La couche Infrastructure implémente les adaptateurs pour les services externes. Elle comprend les implémentations des repositories utilisant Prisma pour l'accès à la base de données, les adaptateurs pour les services d'intelligence artificielle (OpenAI, Claude), le logger Winston, et l'authentification JWT.

**Modules métier :**

L'application est organisée en trois modules métier principaux :

- **User Module** : Gère l'authentification et la gestion des utilisateurs. Il comprend la création de compte, la connexion, la gestion du profil, et l'authentification JWT.

- **Document Module** : Gère la création, la modification, la suppression, et la consultation des documents. Il comprend également le système de versioning qui conserve un historique automatique des modifications.

- **AI Assistant Module** : Gère les analyses par intelligence artificielle (correction syntaxique, analyse de style, suggestions narratives) et le chat avec l'assistant IA. Il utilise des adaptateurs pour communiquer avec les différents fournisseurs d'IA.

**Base de données :**

La base de données utilise SQLite en développement et peut être migrée vers PostgreSQL en production. Le schéma est géré via Prisma ORM, qui permet de définir le modèle de données et de générer les migrations automatiquement.

**Sécurité :**

La sécurité est assurée à plusieurs niveaux : hashage des mots de passe avec bcrypt, authentification JWT avec expiration, validation et nettoyage de toutes les entrées utilisateur, et système de rate limiting pour protéger l'API contre les abus.

**Tests :**

Les tests sont organisés en trois niveaux : tests unitaires pour la logique métier dans la couche Domain, tests d'intégration pour les API routes et l'interaction avec la base de données, et tests end-to-end avec Playwright pour valider les scénarios utilisateur complets.

**Déploiement :**

L'application est conteneurisée avec Docker pour faciliter le déploiement. La configuration Docker inclut l'application Next.js, la base de données, et toutes les dépendances nécessaires. Le déploiement est automatisé via GitHub Actions.

---

**Document rédigé le :** Janvier 2025

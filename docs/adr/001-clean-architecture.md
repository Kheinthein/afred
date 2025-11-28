# ADR 001: Choix Clean Architecture (Monolithe Modulaire)

**Date:** 2024-11-28  
**Status:** Accepté  
**Décideurs:** Équipe Alfred

## Contexte

Nous devons choisir l'architecture pour Alfred, une application d'écriture avec assistant IA. Les options considérées :

1. **Monolithe traditionnel** : Code non structuré, tout dans un seul fichier
2. **Clean Architecture (Monolithe Modulaire)** : Modules découplés, architecture en couches
3. **Microservices** : Services indépendants avec leur propre DB

### Contraintes

- Projet de fin d'année (délai limité)
- Équipe réduite (1-3 développeurs)
- Budget infrastructure limité
- Besoin de livrer rapidement
- Maintenabilité importante

## Décision

**Nous adoptons la Clean Architecture en monolithe modulaire.**

### Architecture Choisie

```
Monolithe avec 3 modules découplés :
- User Module
- Document Module  
- AI Assistant Module

Chaque module suit Clean Architecture :
Domain → Application → Infrastructure → Presentation
```

## Justification

### ✅ Avantages Clean Architecture

1. **KISS (Keep It Simple, Stupid)**
   - Un seul déploiement
   - Pas de complexité réseau
   - Debugging simple (une seule app)

2. **Maintenabilité**
   - Modules découplés avec interfaces claires
   - Testabilité élevée (80% coverage possible)
   - Code organisé, facile à naviguer

3. **Évolutivité**
   - Migration microservices possible si besoin futur
   - Ajout de features sans casser l'existant
   - Changement de DB/IA facile grâce aux adapters

4. **Performance**
   - Appels de fonctions directs (pas de HTTP interne)
   - Transactions atomiques simples
   - Latence minimale

5. **DevOps Simplifié**
   - Un seul Dockerfile
   - Un seul docker-compose
   - CI/CD simple avec GitHub Actions

### ❌ Rejet Monolithe Traditionnel

- Code spaghetti impossible à maintenir
- Tests difficiles (couplage fort)
- Scaling impossible
- Ajout features = régression garantie

### ❌ Rejet Microservices

**Over-engineering pour notre contexte :**

1. **Complexité Opérationnelle**
   - Docker Compose multi-services
   - Orchestration (Kubernetes) nécessaire
   - Monitoring distribué complexe
   - Service Discovery, API Gateway

2. **Complexité Développement**
   - Transactions distribuées (Saga pattern)
   - Debugging multi-services
   - Data consistency challenges
   - Latence réseau entre services

3. **Coût**
   - Infrastructure plus chère (6+ services)
   - DevOps expertise nécessaire
   - Temps de développement x2-3

4. **YAGNI (You Aren't Gonna Need It)**
   - Pas de contraintes de scaling prouvées
   - Pas besoin de tech hétérogènes
   - Équipe trop petite pour gérer la complexité

## Conséquences

### ✅ Positives

1. **Time to Market**
   - MVP en 2-3 semaines vs 6-8 pour microservices
   - Focus sur features, pas sur infra

2. **Coûts Réduits**
   - 1 serveur vs 6+ pour microservices
   - Pas besoin K8s, service mesh, etc.

3. **Qualité Code**
   - Architecture forcée par les couches
   - Tests unitaires simples
   - Moins de bugs (moins de moving parts)

4. **Onboarding Facile**
   - Nouveaux devs comprennent vite
   - Structure claire et documentée

### ⚠️ Négatives & Mitigations

1. **Scaling Limité**
   - ❌ Problème : Pas de scaling horizontal facile
   - ✅ Mitigation : Vertical scaling suffit pour début
   - ✅ Mitigation : Migration microservices possible si > 50k users

2. **Single Point of Failure**
   - ❌ Problème : App down = tout down
   - ✅ Mitigation : Load balancer + plusieurs instances
   - ✅ Mitigation : Health checks + auto-restart

3. **Modules Non Indépendants**
   - ❌ Problème : Déploiement de tout le monolithe
   - ✅ Mitigation : Tests automatisés complets
   - ✅ Mitigation : Feature flags pour rollout progressif

## Métriques de Succès

### Court Terme (3 mois)

- ✅ MVP livré
- ✅ 80% test coverage
- ✅ API response time p95 < 500ms
- ✅ 0 downtime déploiements

### Long Terme (1 an)

- ✅ Support 10k utilisateurs
- ✅ 99.9% uptime
- ✅ < 5% bugs en production

## Révision

Cette décision sera réévaluée si :

1. **Utilisateurs > 50k actifs** : Envisager microservices
2. **Équipe > 10 devs** : Split en services par équipe
3. **Scaling différencié nécessaire** : AI service séparé
4. **Technologies hétérogènes** : Ex: IA en Python

---

**Décision validée. Clean Architecture = Sweet Spot pour Alfred.**


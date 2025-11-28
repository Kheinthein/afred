# ADR 002: Pattern Adapter pour Providers IA

**Date:** 2024-11-28  
**Status:** Accepté  
**Décideurs:** Équipe Alfred

## Contexte

Alfred nécessite un service IA pour :
- Analyser la syntaxe française
- Analyser le style d'écriture
- Suggérer des progressions narratives

### Contraintes

1. **Multiple Providers** : OpenAI, Claude, Mistral, Ollama
2. **Coûts Variables** : GPT-4 ($$$) vs Ollama (gratuit)
3. **Qualité Différente** : Claude excellent FR, GPT-4 polyvalent
4. **Évolution Rapide** : Nouveaux modèles chaque mois
5. **Testabilité** : Besoin de mocks pour tests

## Décision

**Nous utilisons le pattern Ports & Adapters (Hexagonal Architecture) pour abstraire les providers IA.**

### Architecture

```typescript
// PORT (Domain Layer) - Contrat
interface IAIServicePort {
  analyzeSyntax(text: string): Promise<SyntaxAnalysisResult>;
  analyzeStyle(text: string, style: WritingStyle): Promise<StyleAnalysisResult>;
  suggestProgression(text: string, style: WritingStyle): Promise<ProgressionSuggestionResult>;
}

// ADAPTERS (Infrastructure Layer) - Implémentations
class ClaudeAdapter implements IAIServicePort { }
class OpenAIAdapter implements IAIServicePort { }
class MistralAdapter implements IAIServicePort { }
class OllamaAdapter implements IAIServicePort { }

// FACTORY (Infrastructure Layer) - Création dynamique
class AIAdapterFactory {
  static createFromEnv(): IAIServicePort {
    const provider = process.env.AI_PROVIDER; // 'claude', 'openai', etc.
    // Retourne le bon adapter
  }
}
```

## Justification

### ✅ Avantages

1. **Flexibility Maximale**
   - Changement de provider = modifier 1 variable d'env
   - Aucun code métier à changer
   - Tests passent avec n'importe quel provider

2. **Indépendance du Domain**
   ```typescript
   // Use Case ne connaît PAS le provider
   class AnalyzeText {
     constructor(private aiService: IAIServicePort) {} // Interface !
     
     async execute(input) {
       // Appelle l'interface, peu importe l'implémentation
       const result = await this.aiService.analyzeSyntax(text);
     }
   }
   ```

3. **Testabilité**
   ```typescript
   // Mock facile pour tests unitaires
   const mockAI: IAIServicePort = {
     analyzeSyntax: jest.fn().mockResolvedValue({...}),
     // ...
   };
   const useCase = new AnalyzeText(mockAI);
   ```

4. **Évolutivité**
   - Nouveau provider = créer adapter, register dans factory
   - Pas de modification du domain
   - Migration progressive possible

### ✅ Stratégies Avancées Possibles

#### 1. Multi-Provider avec Fallback

```typescript
class MultiProviderAdapter implements IAIServicePort {
  constructor(
    private primary: IAIServicePort,
    private fallbacks: IAIServicePort[]
  ) {}
  
  async analyzeSyntax(text: string) {
    try {
      return await this.primary.analyzeSyntax(text);
    } catch {
      // Essaie fallback si primary fail
      return await this.fallbacks[0].analyzeSyntax(text);
    }
  }
}
```

#### 2. Routing Intelligent

```typescript
class SmartRoutingAdapter implements IAIServicePort {
  analyzeSyntax(text: string) {
    return this.fastProvider.analyzeSyntax(text); // Mistral
  }
  
  suggestProgression(text: string, style: WritingStyle) {
    return this.qualityProvider.suggestProgression(text, style); // GPT-4
  }
}
```

#### 3. Cache Layer

```typescript
class CachedAIAdapter implements IAIServicePort {
  async analyzeSyntax(text: string) {
    const cached = await this.cache.get(hash(text));
    if (cached) return cached;
    
    const result = await this.wrapped.analyzeSyntax(text);
    await this.cache.set(hash(text), result, 3600);
    return result;
  }
}
```

## Provider Choisi par Défaut : Claude

### Raison du Choix

1. **Qualité Français** : Meilleur que GPT-4
2. **Context Window** : 200k tokens (long documents)
3. **Coût/Performance** : Bon équilibre
4. **API Stable** : Peu de breaking changes

### Configuration

```env
# .env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-xxxxx
CLAUDE_MODEL=claude-3-5-sonnet-20241022
```

### Alternatives Configurées

```env
# OpenAI (GPT-4)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-xxxxx
OPENAI_MODEL=gpt-4-turbo

# Mistral (français, moins cher)
AI_PROVIDER=mistral
MISTRAL_API_KEY=xxxxx

# Ollama (gratuit, local)
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.1
```

## Conséquences

### ✅ Positives

1. **Vendor Lock-in Évité**
   - Pas dépendant d'un seul provider
   - Migration facile si problème (prix, qualité, downtime)

2. **Optimisation Coûts**
   - Dev : Ollama gratuit
   - Staging : Mistral (cheap)
   - Production : Claude (qualité)

3. **Résilience**
   - Fallback automatique si provider down
   - Diversification des risques

4. **Innovation**
   - Nouveaux modèles testables sans refactoring
   - Benchmarking facile entre providers

### ⚠️ Négatives & Mitigations

1. **Abstraction Layer**
   - ❌ Problème : Peut masquer features spécifiques d'un provider
   - ✅ Mitigation : metadata optionnel dans réponses

2. **Maintenance Multiple Adapters**
   - ❌ Problème : 4 adapters à maintenir si API change
   - ✅ Mitigation : Tests d'intégration automatisés
   - ✅ Mitigation : Provider principal (Claude) prioritaire

## Métriques de Succès

- ✅ Changement provider en < 5 minutes
- ✅ Tests passent avec tous providers
- ✅ Coût IA < 0.01€/analyse en moyenne
- ✅ Qualité analyse > 80% satisfaction utilisateurs

## Révision

Révision si :
1. **Provider Dominant** : Si 1 provider devient 10x meilleur
2. **Standardisation** : Si API standard émergente (ex: OpenAI-like)
3. **Complexité** : Si maintenance 4 adapters devient coûteuse

---

**Décision validée. Pattern Adapter = Flexibilité maximale pour Alfred.**


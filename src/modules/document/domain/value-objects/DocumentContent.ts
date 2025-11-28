import { ValidationError } from '@shared/errors';

/**
 * Value Object représentant le contenu d'un document
 * Gère le texte et calcule automatiquement le nombre de mots
 */
export class DocumentContent {
  public readonly text: string;
  public readonly wordCount: number;

  constructor(text: string) {
    if (text === null || text === undefined) {
      throw new ValidationError('Le contenu ne peut pas être null ou undefined');
    }

    this.text = text;
    this.wordCount = this.calculateWordCount(text);
  }

  /**
   * Calcule le nombre de mots dans le texte
   */
  private calculateWordCount(text: string): number {
    if (!text || text.trim().length === 0) {
      return 0;
    }

    // Divise par espaces/retours à la ligne et filtre les chaînes vides
    const words = text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    return words.length;
  }

  /**
   * Retourne le nombre de caractères
   */
  get characterCount(): number {
    return this.text.length;
  }

  /**
   * Vérifie si le contenu est vide
   */
  isEmpty(): boolean {
    return this.text.trim().length === 0;
  }

  toString(): string {
    return this.text;
  }
}


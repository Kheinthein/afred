/**
 * Entité WritingStyle représentant un style d'écriture
 */
export class WritingStyle {
  constructor(
    public readonly id: string,
    public name: string,
    public description: string
  ) {}

  /**
   * Valide les propriétés du style
   * @throws {Error} Si la validation échoue
   */
  validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('Le nom du style est requis');
    }

    if (!this.description || this.description.trim().length === 0) {
      throw new Error('La description du style est requise');
    }
  }
}


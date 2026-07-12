import { FinancialEntity } from './financial-entity.entity.js';

export class Simulation {
  constructor(
    public readonly id: string,
    public readonly userId: string | null,
    public readonly amount: number,
    public readonly termDays: number,
    public readonly appliedRate: number,
    public readonly earnedInterest: number,
    public readonly selectedEntityId: string,
    public readonly createdAt: Date,
    public readonly selectedEntity?: FinancialEntity
  ) {}

  public static calculateInterest(amount: number, termDays: number, rateValue: number): number {
    // Interés simple: Monto * Tasa * (Plazo / 360)
    // También se puede usar capitalización compuesta, pero interés simple o compuesto anualizado
    // es estándar para demostraciones. Vamos a usar interés compuesto anualizado:
    // Ganancia = Monto * ((1 + Tasa)^(Plazo/360) - 1)
    // O interés simple para fines educativos sencillos. Usemos la fórmula compuesta estándar de la SBS para depósitos a plazo:
    // Ganancia = Monto * (Math.pow(1 + rateValue, termDays / 360) - 1)
    const rawInterest = amount * (Math.pow(1 + rateValue, termDays / 360) - 1);
    return Math.round(rawInterest * 100) / 100; // Redondear a dos decimales
  }
}

import { FinancialEntity } from './financial-entity.entity.js';

export class FinancialRate {
  constructor(
    public readonly id: string,
    public readonly entityId: string,
    public readonly rateValue: number, // ej: 0.0525
    public readonly productType: 'AHORRO' | 'PLAZO_FIJO',
    public readonly currency: 'PEN' | 'USD',
    public readonly minTerm: number, // plazo mínimo en días
    public readonly region: string, // departamento
    public readonly entity?: FinancialEntity
  ) {}
}

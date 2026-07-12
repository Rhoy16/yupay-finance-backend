export class FinancialEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly logoUrl: string,
    public readonly type: 'BANCO' | 'CAJA_MUNICIPAL' | 'FINANCIERA'
  ) {}
}

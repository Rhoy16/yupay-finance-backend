import { FinanceRepository } from '../domain/finance.repository.js';
import { FinancialRate } from '../domain/financial-rate.entity.js';

interface GetRatesFilters {
  monto?: number;
  plazo?: number;
  departamento?: string;
  tipoProducto?: string;
  moneda?: string;
}

export class GetRatesUseCase {
  constructor(private readonly financeRepository: FinanceRepository) {}

  async execute(filters: GetRatesFilters): Promise<FinancialRate[]> {
    return await this.financeRepository.findRates({
      amount: filters.monto,
      term: filters.plazo,
      region: filters.departamento,
      productType: filters.tipoProducto,
      currency: filters.moneda,
    });
  }
}

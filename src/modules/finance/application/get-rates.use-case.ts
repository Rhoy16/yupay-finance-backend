import { FinanceRepository } from '../domain/finance.repository.js';
import { FinancialRate } from '../domain/financial-rate.entity.js';

interface GetRatesFilters {
  amount?: number;
  termDays?: number;
  region?: string;
  productType?: string;
  currency?: string;
}

export class GetRatesUseCase {
  constructor(private readonly financeRepository: FinanceRepository) {}

  async execute(filters: GetRatesFilters): Promise<FinancialRate[]> {
    return await this.financeRepository.findRates({
      amount: filters.amount,
      term: filters.termDays,
      region: filters.region,
      productType: filters.productType,
      currency: filters.currency,
    });
  }
}

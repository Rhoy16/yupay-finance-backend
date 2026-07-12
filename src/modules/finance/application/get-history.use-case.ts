import { FinanceRepository } from '../domain/finance.repository.js';
import { Simulation } from '../domain/simulation.entity.js';

export class GetHistoryUseCase {
  constructor(private readonly financeRepository: FinanceRepository) {}

  async execute(userId: string): Promise<Simulation[]> {
    return await this.financeRepository.findSimulationsByUserId(userId);
  }
}

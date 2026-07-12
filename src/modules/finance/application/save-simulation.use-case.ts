import { FinanceRepository } from '../domain/finance.repository.js';
import { Simulation } from '../domain/simulation.entity.js';
import { NotFoundError } from '../../../shared/errors/app-error.js';
import crypto from 'crypto';

interface SaveSimulationDTO {
  userId: string | null;
  amount: number;
  termDays: number;
  rate: number;
  earnedInterest?: number;
  entityId: string;
}

export class SaveSimulationUseCase {
  constructor(private readonly financeRepository: FinanceRepository) {}

  async execute(dto: SaveSimulationDTO): Promise<Simulation> {
    // Validar si la entidad existe
    const entity = await this.financeRepository.findEntityById(dto.entityId);
    if (!entity) {
      throw new NotFoundError('La entidad financiera seleccionada no existe.');
    }

    // Calcular o usar el interés provisto
    const interest = dto.earnedInterest !== undefined
      ? dto.earnedInterest
      : Simulation.calculateInterest(dto.amount, dto.termDays, dto.rate);

    const simulationId = crypto.randomUUID();

    const simulation = new Simulation(
      simulationId,
      dto.userId,
      dto.amount,
      dto.termDays,
      dto.rate,
      interest,
      dto.entityId,
      new Date()
    );

    return await this.financeRepository.saveSimulation(simulation);
  }
}

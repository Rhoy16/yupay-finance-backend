import { FinanceRepository } from '../domain/finance.repository.js';
import { Simulation } from '../domain/simulation.entity.js';
import { NotFoundError } from '../../../shared/errors/app-error.js';
import crypto from 'crypto';

interface SaveSimulationDTO {
  userId: string | null;
  monto: number;
  plazo: number;
  tasa: number;
  interesGanado?: number;
  entidadId: string;
}

export class SaveSimulationUseCase {
  constructor(private readonly financeRepository: FinanceRepository) {}

  async execute(dto: SaveSimulationDTO): Promise<Simulation> {
    // Validar si la entidad existe
    const entity = await this.financeRepository.findEntityById(dto.entidadId);
    if (!entity) {
      throw new NotFoundError('La entidad financiera seleccionada no existe.');
    }

    // Calcular o usar el interés provisto
    const interest = dto.interesGanado !== undefined
      ? dto.interesGanado
      : Simulation.calculateInterest(dto.monto, dto.plazo, dto.tasa);

    const simulationId = crypto.randomUUID();

    const simulation = new Simulation(
      simulationId,
      dto.userId,
      dto.monto,
      dto.plazo,
      dto.tasa,
      interest,
      dto.entidadId,
      new Date()
    );

    return await this.financeRepository.saveSimulation(simulation);
  }
}

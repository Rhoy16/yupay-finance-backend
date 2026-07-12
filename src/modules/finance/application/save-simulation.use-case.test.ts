import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SaveSimulationUseCase } from './save-simulation.use-case.js';
import { FinanceRepository } from '../domain/finance.repository.js';
import { FinancialEntity } from '../domain/financial-entity.entity.js';
import { Simulation } from '../domain/simulation.entity.js';
import { NotFoundError } from '../../../shared/errors/app-error.js';

describe('SaveSimulationUseCase Unit Tests', () => {
  let financeRepositoryMock: FinanceRepository;
  let useCase: SaveSimulationUseCase;

  beforeEach(() => {
    financeRepositoryMock = {
      findRates: vi.fn(),
      findEntityById: vi.fn(),
      saveSimulation: vi.fn(),
      findSimulationsByUserId: vi.fn(),
      findGlossaryTerms: vi.fn(),
    };
    useCase = new SaveSimulationUseCase(financeRepositoryMock);
  });

  it('should successfully calculate interest and save simulation', async () => {
    const mockEntity = new FinancialEntity('entity-123', 'Caja Arequipa', 'logo.png', 'CAJA_MUNICIPAL');
    financeRepositoryMock.findEntityById = vi.fn().mockResolvedValue(mockEntity);
    financeRepositoryMock.saveSimulation = vi.fn().mockImplementation(async (sim: Simulation) => sim);

    const result = await useCase.execute({
      userId: 'user-123',
      amount: 10000,
      termDays: 360,
      rate: 0.06, // 6%
      entityId: 'entity-123',
    });

    expect(result.amount).toBe(10000);
    expect(result.termDays).toBe(360);
    expect(result.appliedRate).toBe(0.06);
    expect(result.earnedInterest).toBe(600); // 10000 * ((1 + 0.06)^1 - 1) = 600
    expect(result.selectedEntityId).toBe('entity-123');
    expect(financeRepositoryMock.saveSimulation).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundError if entity does not exist', async () => {
    financeRepositoryMock.findEntityById = vi.fn().mockResolvedValue(null);

    await expect(
      useCase.execute({
        userId: 'user-123',
        amount: 10000,
        termDays: 360,
        rate: 0.06,
        entityId: 'entity-invalid',
      })
    ).rejects.toThrow(NotFoundError);

    expect(financeRepositoryMock.saveSimulation).not.toHaveBeenCalled();
  });
});

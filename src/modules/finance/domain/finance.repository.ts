import { FinancialRate } from './financial-rate.entity.js';
import { Simulation } from './simulation.entity.js';
import { GlossaryTerm } from './glossary-term.entity.js';
import { FinancialEntity } from './financial-entity.entity.js';

export interface FinanceRepository {
  findRates(filters: {
    amount?: number;
    term?: number;
    region?: string;
  }): Promise<FinancialRate[]>;

  findEntityById(entityId: string): Promise<FinancialEntity | null>;

  saveSimulation(simulation: Simulation): Promise<Simulation>;

  findSimulationsByUserId(userId: string): Promise<Simulation[]>;

  findGlossaryTerms(): Promise<GlossaryTerm[]>;
}

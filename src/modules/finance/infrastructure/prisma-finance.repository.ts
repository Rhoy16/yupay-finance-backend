import { FinanceRepository } from '../domain/finance.repository.js';
import { FinancialRate } from '../domain/financial-rate.entity.js';
import { FinancialEntity } from '../domain/financial-entity.entity.js';
import { Simulation } from '../domain/simulation.entity.js';
import { GlossaryTerm } from '../domain/glossary-term.entity.js';
import { prisma } from '../../../config/database.js';
import { Prisma } from '@prisma/client';

export class PrismaFinanceRepository implements FinanceRepository {
  private toRateDomain(prismaRate: any): FinancialRate {
    return new FinancialRate(
      prismaRate.id,
      prismaRate.entityId,
      prismaRate.rateValue,
      prismaRate.productType as any,
      prismaRate.currency as any,
      prismaRate.minTerm,
      prismaRate.region,
      prismaRate.entity
        ? new FinancialEntity(
            prismaRate.entity.id,
            prismaRate.entity.name,
            prismaRate.entity.logoUrl,
            prismaRate.entity.type as any
          )
        : undefined
    );
  }

  private toSimulationDomain(prismaSim: any): Simulation {
    return new Simulation(
      prismaSim.id,
      prismaSim.userId,
      prismaSim.amount,
      prismaSim.termDays,
      prismaSim.appliedRate,
      prismaSim.earnedInterest,
      prismaSim.selectedEntityId,
      prismaSim.createdAt,
      prismaSim.selectedEntity
        ? new FinancialEntity(
            prismaSim.selectedEntity.id,
            prismaSim.selectedEntity.name,
            prismaSim.selectedEntity.logoUrl,
            prismaSim.selectedEntity.type as any
          )
        : undefined
    );
  }

  async findRates(filters: {
    amount?: number;
    term?: number;
    region?: string;
  }): Promise<FinancialRate[]> {
    const where: Prisma.FinancialRateWhereInput = {};

    if (filters.term !== undefined) {
      where.minTerm = {
        lte: filters.term,
      };
    }

    if (filters.region) {
      where.OR = [
        { region: { equals: filters.region, mode: 'insensitive' } },
        { region: { equals: 'Todo el Perú', mode: 'insensitive' } }
      ];
    }

    const prismaRates = await prisma.financialRate.findMany({
      where,
      include: {
        entity: true,
      },
    });

    return prismaRates.map(this.toRateDomain);
  }

  async findEntityById(entityId: string): Promise<FinancialEntity | null> {
    const prismaEntity = await prisma.financialEntity.findUnique({
      where: { id: entityId },
    });

    if (!prismaEntity) return null;
    return new FinancialEntity(
      prismaEntity.id,
      prismaEntity.name,
      prismaEntity.logoUrl,
      prismaEntity.type as any
    );
  }

  async saveSimulation(simulation: Simulation): Promise<Simulation> {
    const prismaSim = await prisma.simulation.create({
      data: {
        id: simulation.id,
        userId: simulation.userId,
        amount: simulation.amount,
        termDays: simulation.termDays,
        appliedRate: simulation.appliedRate,
        earnedInterest: simulation.earnedInterest,
        selectedEntityId: simulation.selectedEntityId,
        createdAt: simulation.createdAt,
      },
      include: {
        selectedEntity: true,
      },
    });

    return this.toSimulationDomain(prismaSim);
  }

  async findSimulationsByUserId(userId: string): Promise<Simulation[]> {
    const prismaSims = await prisma.simulation.findMany({
      where: { userId },
      include: {
        selectedEntity: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaSims.map(this.toSimulationDomain);
  }

  async findGlossaryTerms(): Promise<GlossaryTerm[]> {
    const prismaTerms = await prisma.glossaryTerm.findMany({
      orderBy: {
        term: 'asc',
      },
    });

    return prismaTerms.map(
      (t) => new GlossaryTerm(t.id, t.term, t.simpleDefinition, t.category)
    );
  }
}

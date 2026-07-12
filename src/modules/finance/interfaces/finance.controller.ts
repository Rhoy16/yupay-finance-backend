import { Request, Response, NextFunction } from 'express';
import { GetRatesUseCase } from '../application/get-rates.use-case.js';
import { SaveSimulationUseCase } from '../application/save-simulation.use-case.js';
import { GetHistoryUseCase } from '../application/get-history.use-case.js';
import { getRatesQuerySchema, saveSimulationSchema } from './finance.validator.js';
import { AuthenticatedRequest } from '../../../shared/middlewares/auth-middleware.js';
import { ForbiddenError } from '../../../shared/errors/app-error.js';

export class FinanceController {
  constructor(
    private readonly getRatesUseCase: GetRatesUseCase,
    private readonly saveSimulationUseCase: SaveSimulationUseCase,
    private readonly getHistoryUseCase: GetHistoryUseCase
  ) {}

  getRates = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const filters = getRatesQuerySchema.parse(req.query);
      const rates = await this.getRatesUseCase.execute(filters);

      res.status(200).json(
        rates.map((r) => ({
          id: r.id,
          entityId: r.entityId,
          rateValue: r.rateValue,
          productType: r.productType,
          currency: r.currency,
          minTerm: r.minTerm,
          region: r.region,
          entity: r.entity
            ? {
                id: r.entity.id,
                name: r.entity.name,
                logoUrl: r.entity.logoUrl,
                type: r.entity.type,
                riskTrafficLight: r.entity.riskTrafficLight,
              }
            : null,
        }))
      );
    } catch (error) {
      next(error);
    }
  };

  saveSimulation = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const parsedBody = saveSimulationSchema.parse(req.body);

      const userId = authReq.user?.id;
      if (!userId) {
        throw new ForbiddenError('Se requiere un usuario autenticado para guardar una simulación.');
      }

      const simulation = await this.saveSimulationUseCase.execute({
        ...parsedBody,
        userId,
      });

      res.status(201).json({
        id: simulation.id,
        userId: simulation.userId,
        amount: simulation.amount,
        termDays: simulation.termDays,
        appliedRate: simulation.appliedRate,
        earnedInterest: simulation.earnedInterest,
        selectedEntityId: simulation.selectedEntityId,
        createdAt: simulation.createdAt,
        selectedEntity: simulation.selectedEntity
          ? {
              id: simulation.selectedEntity.id,
              name: simulation.selectedEntity.name,
              logoUrl: simulation.selectedEntity.logoUrl,
              type: simulation.selectedEntity.type,
              riskTrafficLight: simulation.selectedEntity.riskTrafficLight,
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authReq = req as AuthenticatedRequest;
      const userId = authReq.user!.id;
      const history = await this.getHistoryUseCase.execute(userId);

      res.status(200).json(
        history.map((s) => ({
          id: s.id,
          userId: s.userId,
          amount: s.amount,
          termDays: s.termDays,
          appliedRate: s.appliedRate,
          earnedInterest: s.earnedInterest,
          selectedEntityId: s.selectedEntityId,
          createdAt: s.createdAt,
          selectedEntity: s.selectedEntity
            ? {
                id: s.selectedEntity.id,
                name: s.selectedEntity.name,
                logoUrl: s.selectedEntity.logoUrl,
                type: s.selectedEntity.type,
                riskTrafficLight: s.selectedEntity.riskTrafficLight,
              }
            : null,
        }))
      );
    } catch (error) {
      next(error);
    }
  };
}

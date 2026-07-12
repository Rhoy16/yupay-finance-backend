import { Request, Response, NextFunction } from 'express';
import { GetRatesUseCase } from '../application/get-rates.use-case.js';
import { SaveSimulationUseCase } from '../application/save-simulation.use-case.js';
import { GetHistoryUseCase } from '../application/get-history.use-case.js';
import { getRatesQuerySchema, saveSimulationSchema } from './finance.validator.js';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';

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
      const body = saveSimulationSchema.parse(req.body);

      // Extraer opcionalmente el usuario si viene el token
      let userId: string | null = null;
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        try {
          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string };
          userId = decoded.id;
        } catch (e) {
          // Token inválido: responder con 401
          res.status(401).json({ message: 'Token de sesión inválido o expirado' });
          return;
        }
      }

      const simulation = await this.saveSimulationUseCase.execute({
        userId,
        monto: body.monto,
        plazo: body.plazo,
        tasa: body.tasa,
        interesGanado: body.interesGanado,
        entidadId: body.entidadId,
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
            }
          : null,
      });
    } catch (error) {
      next(error);
    }
  };

  getHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Esta es una ruta protegida obligatoria, req.user está presente
      const userId = (req as any).user.id;
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
              }
            : null,
        }))
      );
    } catch (error) {
      next(error);
    }
  };
}

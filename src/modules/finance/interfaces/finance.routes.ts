import { Router } from 'express';
import { FinanceController } from './finance.controller.js';
import { GetRatesUseCase } from '../application/get-rates.use-case.js';
import { SaveSimulationUseCase } from '../application/save-simulation.use-case.js';
import { GetHistoryUseCase } from '../application/get-history.use-case.js';
import { PrismaFinanceRepository } from '../infrastructure/prisma-finance.repository.js';
import { authMiddleware } from '../../../shared/middlewares/auth-middleware.js';
import { requirePlan } from '../../../shared/middlewares/require-plan.js';

export function createFinanceRouter(): Router {
  const router = Router();
  const financeRepository = new PrismaFinanceRepository();

  const getRatesUseCase = new GetRatesUseCase(financeRepository);
  const saveSimulationUseCase = new SaveSimulationUseCase(financeRepository);
  const getHistoryUseCase = new GetHistoryUseCase(financeRepository);

  const controller = new FinanceController(
    getRatesUseCase,
    saveSimulationUseCase,
    getHistoryUseCase
  );

  router.get('/rates', controller.getRates);
  router.post('/simulations', authMiddleware, requirePlan('PROFESIONAL'), controller.saveSimulation);
  router.get('/simulations/history', authMiddleware, controller.getHistory);

  return router;
}

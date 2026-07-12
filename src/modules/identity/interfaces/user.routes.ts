import { Router } from 'express';
import { UserController } from './user.controller.js';
import { RegisterUserUseCase } from '../application/register-user.use-case.js';
import { LoginUserUseCase } from '../application/login-user.use-case.js';
import { GetProfileUseCase } from '../application/get-profile.use-case.js';
import { PrismaUserRepository } from '../infrastructure/prisma-user.repository.js';
import { authMiddleware } from '../../../shared/middlewares/auth-middleware.js';

export function createUserRouter(): Router {
  const router = Router();
  const userRepository = new PrismaUserRepository();
  
  const registerUseCase = new RegisterUserUseCase(userRepository);
  const loginUseCase = new LoginUserUseCase(userRepository);
  const getProfileUseCase = new GetProfileUseCase(userRepository);

  const controller = new UserController(registerUseCase, loginUseCase, getProfileUseCase);

  router.post('/register', controller.register);
  router.post('/login', controller.login);
  router.get('/profile', authMiddleware, controller.getProfile);

  return router;
}

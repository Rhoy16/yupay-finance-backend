import { Request, Response, NextFunction } from 'express';
import { RegisterUserUseCase } from '../application/register-user.use-case.js';
import { LoginUserUseCase } from '../application/login-user.use-case.js';
import { GetProfileUseCase } from '../application/get-profile.use-case.js';
import { registerSchema, loginSchema } from './user.validator.js';

export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly loginUserUseCase: LoginUserUseCase,
    private readonly getProfileUseCase: GetProfileUseCase
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = registerSchema.parse(req.body);
      const user = await this.registerUserUseCase.execute({
        nombre: body.nombre,
        email: body.email,
        passwordRaw: body.password,
      });

      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = loginSchema.parse(req.body);
      const result = await this.loginUserUseCase.execute({
        email: body.email,
        passwordRaw: body.password,
      });

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // req.user es inyectado por el middleware de auth
      const userId = (req as any).user.id;
      const user = await this.getProfileUseCase.execute(userId);

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        plan: user.plan,
        createdAt: user.createdAt,
      });
    } catch (error) {
      next(error);
    }
  };
}

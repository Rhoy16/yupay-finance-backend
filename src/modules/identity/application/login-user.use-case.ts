import { UserRepository } from '../domain/user.repository.js';
import { User } from '../domain/user.entity.js';
import { InvalidCredentialsError } from '../domain/user.errors.js';
import { env } from '../../../config/env.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginUserDTO {
  email: string;
  passwordRaw: string;
}

interface LoginResult {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
    plan: 'ESTUDIANTE' | 'PROFESIONAL';
  };
}

export class LoginUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: LoginUserDTO): Promise<LoginResult> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isMatch = await bcrypt.compare(dto.passwordRaw, user.passwordHash);
    if (!isMatch) {
      throw new InvalidCredentialsError();
    }

    // Firmar Token de Acceso con validez de 2 horas (por ejemplo)
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        plan: user.plan,
      },
      env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    return {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        plan: user.plan,
      },
    };
  }
}

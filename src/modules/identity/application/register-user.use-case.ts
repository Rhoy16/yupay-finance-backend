import { UserRepository } from '../domain/user.repository.js';
import { User } from '../domain/user.entity.js';
import { EmailAlreadyExistsError } from '../domain/user.errors.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

interface RegisterUserDTO {
  nombre: string;
  email: string;
  passwordRaw: string;
}

export class RegisterUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: RegisterUserDTO): Promise<User> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw new EmailAlreadyExistsError(dto.email);
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(dto.passwordRaw, saltRounds);
    const userId = crypto.randomUUID();

    const user = User.create(
      userId,
      dto.nombre,
      dto.email,
      passwordHash,
      'ESTUDIANTE'
    );

    return await this.userRepository.save(user);
  }
}

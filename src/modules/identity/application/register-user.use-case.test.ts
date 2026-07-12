import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RegisterUserUseCase } from './register-user.use-case.js';
import { UserRepository } from '../domain/user.repository.js';
import { User } from '../domain/user.entity.js';
import { EmailAlreadyExistsError } from '../domain/user.errors.js';

describe('RegisterUserUseCase Unit Tests', () => {
  let userRepositoryMock: UserRepository;
  let useCase: RegisterUserUseCase;

  beforeEach(() => {
    userRepositoryMock = {
      save: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
    };
    useCase = new RegisterUserUseCase(userRepositoryMock);
  });

  it('should successfully register a user and assign plan ESTUDIANTE', async () => {
    userRepositoryMock.findByEmail = vi.fn().mockResolvedValue(null);
    userRepositoryMock.save = vi.fn().mockImplementation(async (user: User) => user);

    const result = await useCase.execute({
      username: 'Juan Pérez',
      email: 'juan@yupay.pe',
      passwordRaw: 'segura123',
    });

    expect(result.username).toBe('Juan Pérez');
    expect(result.email).toBe('juan@yupay.pe');
    expect(result.plan).toBe('ESTUDIANTE');
    expect(result.passwordHash).not.toBe('segura123'); // Debe ser encriptada
    expect(userRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should throw EmailAlreadyExistsError if the email already exists', async () => {
    const existingUser = User.create('uuid-123', 'Juan Pérez', 'juan@yupay.pe', 'hash123');
    userRepositoryMock.findByEmail = vi.fn().mockResolvedValue(existingUser);

    await expect(
      useCase.execute({
        username: 'Otro Juan',
        email: 'juan@yupay.pe',
        passwordRaw: 'otraPass123',
      })
    ).rejects.toThrow(EmailAlreadyExistsError);

    expect(userRepositoryMock.save).not.toHaveBeenCalled();
  });
});

import { ConflictError, UnauthorizedError, NotFoundError } from '../../../shared/errors/app-error.js';

export class EmailAlreadyExistsError extends ConflictError {
  constructor(email: string) {
    super(`El correo electrónico '${email}' ya se encuentra registrado.`);
  }
}

export class InvalidCredentialsError extends UnauthorizedError {
  constructor() {
    super('El correo o contraseña ingresados son incorrectos.');
  }
}

export class UserNotFoundError extends NotFoundError {
  constructor(id: string) {
    super(`No se encontró ningún usuario con el identificador ${id}.`);
  }
}

export type UserPlan = 'ESTUDIANTE' | 'PROFESIONAL';

export class User {
  constructor(
    public readonly id: string,
    public readonly username: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly plan: UserPlan,
    public readonly createdAt: Date
  ) {}

  public static create(
    id: string,
    username: string,
    email: string,
    passwordHash: string,
    plan: UserPlan = 'ESTUDIANTE',
    createdAt: Date = new Date()
  ): User {
    // Validaciones de dominio
    if (!email.includes('@')) {
      throw new Error('Email inválido en el dominio del usuario');
    }
    if (username.trim().length === 0) {
      throw new Error('El nombre de usuario no puede estar vacío');
    }
    return new User(id, username, email, passwordHash, plan, createdAt);
  }

  public toJSON() {
    return {
      id: this.id,
      username: this.username,
      email: this.email,
      plan: this.plan,
      createdAt: this.createdAt,
    };
  }
}

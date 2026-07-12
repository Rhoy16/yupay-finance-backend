import { UserRepository } from '../domain/user.repository.js';
import { User, UserPlan } from '../domain/user.entity.js';
import { prisma } from '../../../config/database.js';
import { User as PrismaUser, Plan as PrismaPlan } from '@prisma/client';

export class PrismaUserRepository implements UserRepository {
  private toDomain(prismaUser: PrismaUser): User {
    return User.create(
      prismaUser.id,
      prismaUser.username,
      prismaUser.email,
      prismaUser.password,
      prismaUser.plan as UserPlan,
      prismaUser.createdAt
    );
  }

  async save(user: User): Promise<User> {
    const prismaUser = await prisma.user.upsert({
      where: { id: user.id },
      update: {
        username: user.username,
        email: user.email,
        password: user.passwordHash,
        plan: user.plan as PrismaPlan,
      },
      create: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.passwordHash,
        plan: user.plan as PrismaPlan,
        createdAt: user.createdAt,
      },
    });

    return this.toDomain(prismaUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }

  async findById(id: string): Promise<User | null> {
    const prismaUser = await prisma.user.findUnique({
      where: { id },
    });

    if (!prismaUser) return null;
    return this.toDomain(prismaUser);
  }
}

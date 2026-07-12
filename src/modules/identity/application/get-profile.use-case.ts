import { UserRepository } from '../domain/user.repository.js';
import { User } from '../domain/user.entity.js';
import { UserNotFoundError } from '../domain/user.errors.js';

export class GetProfileUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(userId: string): Promise<User> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError(userId);
    }
    return user;
  }
}

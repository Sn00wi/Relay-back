import type { UserRepository } from "../repositories/user.repository";
import type { PasswordHasher } from "../security/password-hasher";

export class AuthService {
  // Получает готовый репозиторий и сохраняет ссылку на него.
  // TypeScript проверяет его соответствие интерфейсу UserRepository.
  constructor(private readonly userRepository: UserRepository, private readonly passwordHasher: PasswordHasher) { }

  async login(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);
    if (!user) { throw new Error(`Incorrect email or password`) }

    const checkPassword = await this.passwordHasher.verifyPassword(user.passwordHash, password)
    if (!checkPassword) {throw new Error(`Incorrect email or password`)}

    return { id: user.id , email: user.email, name: user.name}
  }
}
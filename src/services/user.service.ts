import { AppError } from "../errors/AppError";
import { User } from "../generated/prisma/client";
import type { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email?.trim().toLowerCase()

    return await this.userRepository.findByEmail(normalizedEmail)
  }
  
  async getUserByUserName(userName: string): Promise<User | null>  {
    return await this.userRepository.findByUserName(userName)
  }
  
  async getUserById(id: string): Promise<User | null>  {
    return await this.userRepository.findById(id)
  }
  
  async createUser(createData: { email: string, passwordHash: string, nickName: string, userName: string, avatarKey?: string | null }) {
      const normalizedEmail = createData.email?.trim().toLowerCase()
      if (!normalizedEmail) {
        throw new AppError(422, 'Email cannot be empty');
    }
    
    createData.email = normalizedEmail
    await this.userRepository.create(createData)
  }
  
  async deleteUser(id: string) {
    await this.userRepository.delete(id)
  }
  
  async updateUser(id: string, data: Partial<Pick<User, 'nickName' | 'email' | 'avatarKey'>>) {
    if (data.email !== undefined) {
      const normalizedEmail = data.email?.trim().toLowerCase()
      if (!normalizedEmail) {
        throw new AppError(422, 'Email cannot be empty');
      }
      const existing = await this.userRepository.findByEmail(normalizedEmail);
        if (existing && existing.id !== id) {
          throw new AppError(409, 'This email is already registered');
      }
      data.email = normalizedEmail
    }
    
    return this.userRepository.update(id, data);
  }
  
}
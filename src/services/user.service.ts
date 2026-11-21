import { User } from "../generated/prisma/client";
import type { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email?.trim()

    return await this.userRepository.findByEmail(normalizedEmail)
  }
  
  async getUserByUserName(userName: string): Promise<User | null>  {
    return await this.userRepository.findByUserName(userName)
  }
  
  async getUserById(id: string): Promise<User | null>  {
    return await this.userRepository.findById(id)
  }
  
  async createUser(createData: { email: string, passwordHash: string, nickName: string, userName: string, avatarKey?: string | null }) {
    const normalizedEmail = createData.email?.trim()

    createData.email = normalizedEmail
    await this.userRepository.create(createData)
  }
  
  async deleteUser(id: string) {
    await this.userRepository.delete(id)
  }
  
  async updateUser(id: string, data: Partial<Pick<User, 'nickName' | 'email' | 'avatarKey'>>) {
    if (data.email !== undefined) {
      const normalizedEmail = data.email?.trim()
      if (!normalizedEmail) {
        throw new Error('Email cannot be empty');
      }
      const existing = await this.userRepository.findByEmail(normalizedEmail);
        if (existing && existing.id !== id) {
          throw new Error('This email is already registered');
      }
      data.email = normalizedEmail
    }
    
    return this.userRepository.update(id, data);
  }
  
}
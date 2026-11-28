import { AppError } from "../errors/AppError";
import { User } from "../generated/prisma/client";
import type { CreateUserData, UpdateUserData, UserRepository } from "../repositories/user.repository";

export function normalizeAndValidateEmail(email: string) {
  if (typeof email !== "string") {
    return null;
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || /\s/.test(normalizedEmail)) {
    return null;
  }

  const atIndex = normalizedEmail.indexOf("@");
  if (atIndex <= 0 || atIndex === normalizedEmail.length - 1 || atIndex !== normalizedEmail.lastIndexOf("@") ) {
    return null;
  }

  return normalizedEmail;
}

export function normalizePhoneNumber(value: unknown): string {
  if (typeof value !== 'string') {
    throw new AppError(422, 'Phone number must be a string in international format');
  }

  const phoneNumber = value.trim();
  if (!/^\+[1-9][0-9]{1,14}$/.test(phoneNumber)) {
    throw new AppError(422, 'Phone number must be in international format');
  }

  return phoneNumber;
}

export class UserService {
  constructor(private readonly userRepository: UserRepository) { }

  async getUserByEmail(email: string): Promise<User | null> {
    const normalizedEmail = normalizeAndValidateEmail(email)
    if (!normalizedEmail) {
      throw new AppError(422, 'Invalid email format')
    }
    return await this.userRepository.findByEmail(normalizedEmail)
  }
  
  async getUserByUserName(userName: string): Promise<User | null>  {
    return await this.userRepository.findByUserName(userName)
  }
  
  async getUserById(id: string): Promise<User>  {
    const user = await this.userRepository.findById(id)
    if (!user) {
      throw new AppError(404, 'User not found')
    }
    return user
  }

  async getUsers(nickName: string): Promise<User[]> {
    return await this.userRepository.findByUserNickName(nickName)
  }
  
  async createUser(createData: CreateUserData) {
    if (createData.email !== undefined) {
      const normalizedEmail = normalizeAndValidateEmail(createData.email)
      if (!normalizedEmail) {
        throw new AppError(422, 'Invalid email format')
      }
    createData.email = normalizedEmail
    }
    
    if (createData.phoneNumber !== undefined) {
      createData.phoneNumber = normalizePhoneNumber(createData.phoneNumber);
    }

    await this.userRepository.create(createData)
  }
  
  async deleteUser(id: string) {
    await this.userRepository.delete(id)
  }
  
  async updateUser(id: string, data: UpdateUserData) {
    if (data.email !== undefined && data.email !== null) {
      const normalizedEmail = normalizeAndValidateEmail(data.email)
      if (!normalizedEmail) {
        throw new AppError(422, 'Invalid email format')
      }
      
      const existing = await this.userRepository.findByEmail(normalizedEmail);
        if (existing && existing.id !== id) {
          throw new AppError(409, 'This email is already registered');
      }
      data.email = normalizedEmail
    }
    
    if (data.phoneNumber !== undefined && data.phoneNumber !== null) {
      data.phoneNumber = normalizePhoneNumber(data.phoneNumber);
    }

    return this.userRepository.update(id, data);
  }
  
}
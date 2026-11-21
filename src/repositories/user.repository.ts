import { Prisma, PrismaClient, User } from '../generated/prisma/client';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  findByUserName(userName: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  // Частичное обновление разрешенных данных профиля пользователя
  update(id: string, data: Partial<Pick<User, 'nickName' | 'email' | 'avatarKey'>>): Promise<User>
  create(data: { email: string; passwordHash: string; nickName: string, userName: string, avatarKey?: string | null }): Promise<User>
  delete(id: string): Promise<User>
}

//PrismaUserRepository реализует UserRepository, проверка наличия методов и совместимость их типов
export class PrismaUserRepository implements UserRepository{
  //позволяет использовать методы prisma 
  constructor(private readonly prisma: PrismaClient) {}

  // поиск в бд по email, возвращает пользователя если он есть в базе или null если нет
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUserName(userName: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userName } });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }
  
  async create(data: { email: string; passwordHash: string; nickName: string, userName: string, avatarKey?: string | null }): Promise<User> {
    try {
       return await this.prisma.user.create({ data });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new Error("Email or username is already taken.", {cause: error})
        }
      }
    throw error;
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return await this.prisma.user.delete({where: {id}})
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("user not found")
        }
      }
      throw error
    }
  }
  
  async update(id: string, data: Partial<Pick<User, 'nickName' | 'email' | 'avatarKey'>>): Promise<User> {
    try {
      return await this.prisma.user.update({ where: { id }, data })  
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2025") {
          throw new Error("user not found")
        } else if (error.code === "P2002") {
          throw new Error("Email or username is already taken.", {cause: error})
        }
      }
    
      throw error
    }
  }
}


import { Prisma, PrismaClient, User } from '../generated/prisma/client';

export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: { email: string; passwordHash: string; nickName: string, userName: string, }): Promise<User>
  findByUserName(userName: string): Promise<User | null>;
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
  
  async create(data: { email: string; passwordHash: string; nickName: string, userName: string, }): Promise<User> {
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
}


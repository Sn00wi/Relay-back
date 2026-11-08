import { PrismaClient, User } from '../generated/prisma/client';

//контракт UserRepository с сигнатурами findByEmail и create,
export interface UserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: { email: string; passwordHash: string; nickName: string, userName: string, }): Promise<User>
  findByUserName(userName: string): Promise<User | null>;
}

//PrismaUserRepository реализует контракт UserRepository, проверка наличия методов и совместимость их типов
export class PrismaUserRepository implements UserRepository{
  constructor(private readonly prisma: PrismaClient) {}

  // поиск в бд по email, возвращает пользователя если он есть в базе или null если нет
  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findByUserName(userName: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { userName } });
  }
  
  async create(data: { email: string; passwordHash: string; nickName: string, userName: string,  }): Promise<User> {
    return this.prisma.user.create({ data });
  }
}


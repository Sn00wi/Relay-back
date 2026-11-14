import { PrismaClient, Session } from "../generated/prisma/client";

export interface SessionRepository {
  create(data: { userId: string, tokenHash: string, expiresAt: Date }): Promise<Session>;
  findByTokenHash(tokenHash: string): Promise<Session | null>;
  deleteByTokenHash(tokenHash: string): Promise<void>;
}

export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async create(data: { userId: string, tokenHash: string, expiresAt: Date}): Promise<Session> {
    return this.prisma.session.create({data})
  }

  async findByTokenHash(tokenHash: string): Promise<Session | null>{
    return this.prisma.session.findUnique({where:{tokenHash}})
  }

  async deleteByTokenHash(tokenHash: string): Promise<void> {
    await this.prisma.session.deleteMany({where: {tokenHash}})
  }
}

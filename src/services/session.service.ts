import type { SessionRepository } from "../repositories/session.repository";
import { hashSessionToken, generateSessionToken } from "../security/session-token";

export class SessionService {
  constructor(private readonly sessionRepository: SessionRepository) { }

  async createSession(userId: string) {
    const token = generateSessionToken();
    const tokenHash = hashSessionToken(token);
    const data = {userId, tokenHash}
    
    await this.sessionRepository.create(data)

    return {token}
  }

  async validateSession(token: string) {
    const tokenHash = hashSessionToken(token)

    const session = await this.sessionRepository.findByTokenHash(tokenHash)

    if (!session) {
      throw new Error('Invalid session')
    } 

    return {userId: session.userId}
    
  }

  async logout(token: string): Promise<void> {
    const tokenHash = hashSessionToken(token)

    await this.sessionRepository.deleteByTokenHash(tokenHash)
  }
}
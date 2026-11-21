import { Request, Response, NextFunction } from 'express';
import { User } from "../generated/prisma/client";
import { UserService } from '../services/user.service';

export type PublicUser = Pick<User, 'id' | 'userName' | 'nickName' | 'avatarKey'>;

export class UserController{
  constructor(private readonly userService: UserService) {}

  private toPublicUser(user: User): PublicUser {
      const { id, userName, nickName, avatarKey } = user;
      return { id, userName, nickName, avatarKey };
    }
  
  async getUserByEmail(req: Request, res: Response, next: NextFunction): Promise<void> {
    
  }
}
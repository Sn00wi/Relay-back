import { Request, Response, NextFunction } from 'express';
import { User } from "../generated/prisma/client";
import { UserService } from '../services'; 
import { AppError } from '../errors/AppError';

export type PublicUser = Pick<User, 'id' | 'userName' | 'nickName' | 'avatarKey'>;
export type PrivateUser = Pick<User, 'id' | 'userName' | 'nickName' | 'avatarKey' | 'email'>

export class UserController{
  constructor(private readonly userService: UserService) {}

  private toPublicUser(user: User): PublicUser {
      const { id, userName, nickName, avatarKey } = user;
      return { id, userName, nickName, avatarKey };
  }

  private toPrivateUser(user: User): PrivateUser {
    const { id, userName, nickName, avatarKey, email } = user;
    return { id, userName, nickName, avatarKey, email };
  }

  
  getUserByEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try { 
       const email = req.params.email;
       if (typeof email !== 'string') {
         throw new AppError(400, 'Invalid email parameter');
       }
       const user = await this.userService.getUserByEmail(email);
       if (!user) {
         throw new AppError(404, 'User not found');
       }
       res.status(200).json(this.toPublicUser(user));
     } catch (err) {
       next(err);
     }
  }

  searchUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userName, nickName } = req.query;
  
      if (typeof userName === 'string') {
        const user = await this.userService.getUserByUserName(userName);
        if (!user) {
          throw new AppError(404, 'User not found');
        }
        res.status(200).json(this.toPublicUser(user));
        return;
      }
  
      if (typeof nickName === 'string') {
        const users = await this.userService.getByUserNickName(nickName);
        res.status(200).json(users.map((user) => this.toPublicUser(user)));
        return;
      }
  
      throw new AppError(400, 'Provide userName or nickName query parameter');
    } catch (err) {
      next(err);
    }
  };
  
  getUserById = async(req: Request, res: Response, next: NextFunction): Promise<void>  => {
    try { 
      const userId = res.locals.userId
      const user = await this.userService.getUserById(userId)
      res.status(200).json(this.toPrivateUser(user))
    } catch (err) {
      next(err)
    }
  }

  deleteUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.userId
      await this.userService.deleteUser(userId)

      res.status(200).json({ message: 'User deleted' })
    } catch (err) {
      next(err)
    }
  }

  updateUser = async(req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
         throw new AppError(400, 'Request body must be a JSON object');
       }
   
       const userId = res.locals.userId;
       const { nickName, email, avatarKey } = req.body;
   
       if (nickName !== undefined && typeof nickName !== 'string') {
         throw new AppError(400, 'nickName must be a string');
       }
   
       if (email !== undefined && typeof email !== 'string') {
         throw new AppError(400, 'email must be a string');
       }
   
       if (avatarKey !== undefined && avatarKey !== null && typeof avatarKey !== 'string') {
         throw new AppError(400, 'avatarKey must be a string or null');
       }
   
       if (nickName === undefined && email === undefined && avatarKey === undefined) {
         throw new AppError(400, 'At least one field (nickName, email, avatarKey) must be provided');
       }
   
       const updatedUser = await this.userService.updateUser(userId, { nickName, email, avatarKey });
   
       res.status(200).json(this.toPrivateUser(updatedUser));
     } catch (err) {
       next(err);
     }
  }
}
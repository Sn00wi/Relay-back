import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services';

export class AuthController{
  constructor(private readonly authService: AuthService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    
  }
}
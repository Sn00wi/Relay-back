import { Request, Response, NextFunction } from 'express';
import type { SessionService } from '../services';
import { AppError } from '../errors/AppError';


export const createAuthMiddleware = (sessionService: SessionService) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.get('Authorization');
      if (!authHeader) {
        throw new AppError(401, 'Authorization header is missing');
      }

      const bearerMatch = /^Bearer +([A-Za-z0-9._~+/-]+=*)$/i.exec(authHeader);
      if (!bearerMatch) {
        throw new AppError(401, 'Invalid authorization format. Expected: Bearer <token>');
      }
      const token = bearerMatch[1];

      // Валидация сессии 
      const session = await sessionService.validateSession(token);      

      res.locals.userId = session.userId;
      res.locals.sessionToken = token; 

      next();
    } catch (error) {
      // ошибки уходят в errorMiddleware
      next(error);
    }
  };
};

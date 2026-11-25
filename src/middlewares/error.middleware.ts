import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (res.headersSent) {
     return next(err);
  }
  
  // обработка ошибок бизнеслогики 400, 401, 404, 409
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }

  // Если упала бд или произошла непредвиденная ошибка в коде
  console.error('Unexpected error:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

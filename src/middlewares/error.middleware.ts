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
  
  // обработка ошибок бизнеслогики 400, 401, 404, 409 и тд
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
    return;
  }
  // обработка синтаксической ошибки json 
  if (err instanceof SyntaxError && 'type' in err && err.type === 'entity.parse.failed') {
    res.status(400).json({ status: 'error', message: 'Invalid JSON' });
    return;
  }

  // Если упала бд или произошла непредвиденная ошибка в коде
  console.error('Unexpected error:', err);
  
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
};

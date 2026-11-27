import { Request, Response, NextFunction } from 'express';
import { SessionService } from '../services';

export class SessionController{
  constructor(private readonly sessionService: SessionService) {}

  
}
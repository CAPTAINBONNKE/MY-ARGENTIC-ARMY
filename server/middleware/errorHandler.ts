import { Request, Response, NextFunction } from 'express';
import { SecurityAuditRepository } from '../db/repositories.ts';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  details?: unknown;
}

export function errorHandlerMiddleware(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'BAD_REQUEST');
  const message = err.message || 'An unexpected error occurred processing your request.';

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.ip || '127.0.0.1';
  SecurityAuditRepository.log(ip, req.method, req.originalUrl || req.url, statusCode, 0);

  // In production, avoid leaking raw internal stack traces
  const isDev = process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      details: isDev ? err.details || err.stack : undefined,
      timestamp: new Date().toISOString(),
    },
  });
}

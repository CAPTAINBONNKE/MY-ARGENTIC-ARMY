import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const issues = (result.error as ZodError).issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Request payload validation failed',
          issues,
          timestamp: new Date().toISOString(),
        },
      });
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      const issues = (result.error as ZodError).issues.map(i => ({
        field: i.path.join('.'),
        message: i.message,
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'QUERY_VALIDATION_ERROR',
          message: 'Query parameters validation failed',
          issues,
          timestamp: new Date().toISOString(),
        },
      });
    }

    req.query = result.data as any;
    next();
  };
}

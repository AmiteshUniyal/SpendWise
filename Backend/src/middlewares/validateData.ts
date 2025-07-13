import { ZodType } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate = (schema: ZodType<any, any, any>) => (req: Request, res: Response, next: NextFunction): void => {
    
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
          message: "Data Validation failed",
          errors: result.error.issues,
        });
    }

    req.body = result.data;
    next();
  };

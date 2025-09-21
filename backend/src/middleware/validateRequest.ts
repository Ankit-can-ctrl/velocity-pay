import { Request, Response, NextFunction } from "express";
import { ZodObject } from "zod";

export const validateRequest = <T extends ZodObject>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // we'll provide a schema and then validate the req.body with that schema
    // result = {
    // success,error,data
    // }
    // safeParse is a method that is use to validate data against zod schema without throwing an exception
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.format() }); //return readable error
    }

    req.body = result.data;
    next();
  };
};

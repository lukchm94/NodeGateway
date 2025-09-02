import { NextFunction, Request, Response } from "express";

export default interface ApiController {
  create(req: Request, res: Response, next: NextFunction): Promise<void>;
  getById(req: Request, res: Response, next: NextFunction): Promise<void>;
  expire(req: Request, res: Response, next: NextFunction): Promise<void>;
}

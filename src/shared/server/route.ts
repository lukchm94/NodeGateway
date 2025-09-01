import { type Request, type Response } from "express";
import { HttpMethodType } from "../types/http-methods";

export interface Route {
  method: HttpMethodType;
  path: string;
  handler: (req: Request, res: Response) => void;
}

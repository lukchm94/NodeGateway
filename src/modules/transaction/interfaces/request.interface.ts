import { Request as ExpressRequest } from "express";

export interface SafeFields {
  id: number;
  amount: number;
  currency: string;
  status: string;
  originCreatedAt: Date;
}

export interface RequestWithSafeFields extends ExpressRequest {
  safeFields?: SafeFields;
  webhookUrl?: string;
}

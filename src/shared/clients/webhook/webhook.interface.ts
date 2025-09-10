import { CurrencyEnum } from "../../../modules/transaction/domain/validation/currency";
import { TransactionStatusEnum } from "../../../modules/transaction/domain/validation/status";

export interface WebhookPayload {
  id: number;
  status: TransactionStatusEnum;
  amount: number;
  currency: CurrencyEnum;
  originCreatedAt: Date;
}

export interface WebhookMetaData {
  webhookUrl: string;
  payload: WebhookPayload;
}

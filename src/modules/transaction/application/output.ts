import { TransactionStatusEnum } from "../domain/validation/status";

export interface TransactionGatewayOutput {
  transactionId: number;
  transactionStatus: TransactionStatusEnum;
}

export interface GatewayOutput {
  status: number;
  statusText: string;
  data: TransactionGatewayOutput;
}

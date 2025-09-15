import { Transaction } from "../../../modules/transaction/domain/transaction.entity";

export interface TransactionResponsePayload {
  pattern: string;
  data: Transaction;
}

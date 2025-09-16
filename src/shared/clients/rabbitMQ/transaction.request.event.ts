import { TransactionInput } from "../../../modules/transaction/application/input";

export interface TransactionRequestEvent {
  pattern: string;
  data: { eventInput: TransactionInput };
}

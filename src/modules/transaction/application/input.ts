export interface TransactionInput {
  id: number;
  amount: number;
  currency: string;
  status: string;
  originCreatedAt: Date;
}

import {
  CURRENCY_TYPE,
  CurrencyType,
  validCurrencies,
} from "./validation/currency";
import {
  TRANSACTION_STATUS_TYPE,
  TransactionStatusType,
  validTransactionStatuses,
} from "./validation/status";

export class Transaction {
  constructor(
    public readonly id: number,
    public readonly amount: number,
    public readonly currency: CurrencyType,
    public readonly status: TransactionStatusType,
    public readonly originCreatedAt: Date
  ) {}

  public static create(params: {
    id: number;
    amount: number;
    status: string;
    currency: string;
    originCreatedAt: Date;
  }): Transaction {
    const status = this.validateTransactionStatus(params.status);
    const currency = this.validateCurrency(params.currency);

    return new Transaction(
      params.id,
      params.amount,
      currency,
      status,
      params.originCreatedAt
    );
  }

  private static validateTransactionStatus(
    status: string
  ): TransactionStatusType {
    if (!TRANSACTION_STATUS_TYPE.includes(status as TransactionStatusType)) {
      throw new Error(
        `Invalid transaction status: ${status}. Allowed transaction types: ${JSON.stringify(
          validTransactionStatuses
        )}`
      );
    }
    return status as TransactionStatusType;
  }

  private static validateCurrency(currency: string): CurrencyType {
    if (!CURRENCY_TYPE.includes(currency as CurrencyType)) {
      throw new Error(
        `Invalid currency type: ${currency}. Allowed currencies: ${JSON.stringify(
          validCurrencies
        )}`
      );
    }
    return currency as CurrencyType;
  }
}

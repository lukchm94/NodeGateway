import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../../../shared/DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../../../shared/utils/log-prefix.class";
import { Logger } from "../../../../shared/utils/logger";
import { TransactionInput } from "../../application/input";
import { Transaction } from "../transaction.entity";
import { TransactionStatusEnum } from "../validation/status";

@injectable()
export class TransactionService extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger
  ) {
    super(appLogger);
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.TRANSACTION_SERVICE} initialized`
    );
  }

  public processTransaction(transactionData: TransactionInput): Transaction {
    this.appLogger.info(
      `${this.logPrefix} Processing transaction with data: ${JSON.stringify(
        transactionData
      )}`
    );
    const status = this.validate(transactionData.status);
    const transaction = Transaction.create({
      ...transactionData,
      status,
    });
    this.appLogger.info(
      `${this.logPrefix} Transaction processed successfully: ${JSON.stringify(
        transaction
      )}`
    );
    return transaction;
  }

  private validate(status: string): TransactionStatusEnum {
    this.appLogger.info(
      `${this.logPrefix} Validating transaction status: ${status}`
    );
    const isSuccessful = Math.random() > 0.5;
    const finalStatus = isSuccessful
      ? TransactionStatusEnum.COMPLETED
      : TransactionStatusEnum.FAILED;
    return finalStatus;
  }
}

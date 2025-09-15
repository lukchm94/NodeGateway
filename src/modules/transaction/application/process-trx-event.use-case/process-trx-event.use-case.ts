import { inject, injectable } from "tsyringe";
import { RabbitClient } from "../../../../shared/clients/rabbitMQ/rabbit.client";
import { RegisteredServicesEnum } from "../../../../shared/DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../../../shared/utils/log-prefix.class";
import { Logger } from "../../../../shared/utils/logger";
import { TransactionService } from "../../domain/services/transaction.service";
import { Transaction } from "../../domain/transaction.entity";
import { TransactionInput } from "../input";

@injectable()
export class ProcessTrxEventUseCase extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.RABBIT_CLIENT)
    private readonly rabbitClient: RabbitClient,
    @inject(RegisteredServicesEnum.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService
  ) {
    super(appLogger);
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.PROCESS_TRX_EVENT_USE_CASE} initialized`
    );
  }
  public async run(event: TransactionInput): Promise<Transaction> {
    this.appLogger.info(`${this.logPrefix} RabbitMQ client connected.`);
    this.appLogger.info(
      `${this.logPrefix} Processing transaction event: ${JSON.stringify(event)}`
    );
    const transaction = this.transactionService.processTransaction(event);
    this.rabbitClient.sendToQueue(transaction);
    return transaction;
  }
}

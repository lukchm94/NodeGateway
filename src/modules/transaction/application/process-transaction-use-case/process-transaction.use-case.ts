import { AxiosResponse } from "axios";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../../../shared/DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../../../shared/utils/log-prefix.class";
import { Logger } from "../../../../shared/utils/logger";
import { TransactionService } from "../../domain/services/transaction.service";
import { WebhookService } from "../../domain/services/webhook.service";
import { TransactionInput } from "../input";

@injectable()
export class ProcessTransactionUseCase extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.WEBHOOK_SERVICE)
    private readonly webhookService: WebhookService,
    @inject(RegisteredServicesEnum.TRANSACTION_SERVICE)
    private readonly transactionService: TransactionService
  ) {
    super(appLogger);
  }

  public async run(input: TransactionInput): Promise<AxiosResponse> {
    this.appLogger.info(
      `${this.logPrefix} processing ${JSON.stringify(input)}`
    );
    const transaction = this.transactionService.processTransaction(input);
    const resp = await this.webhookService.sendTransactionWebhook(transaction);
    this.appLogger.info(
      `${this.logPrefix} received the ${resp.status}: ${resp.statusText}`
    );
    return resp;
  }
}

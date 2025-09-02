import { AxiosResponse } from "axios";
import { inject, injectable } from "tsyringe";
import { WebhookClient } from "../../../../shared/clients/webhook/webhook.client";
import {
  WebhookMetaData,
  WebhookPayload,
} from "../../../../shared/clients/webhook/webhook.interface";
import { RegisteredServicesEnum } from "../../../../shared/DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../../../shared/utils/log-prefix.class";
import { Logger } from "../../../../shared/utils/logger";
import { Transaction } from "../transaction.entity";

@injectable()
export class WebhookService extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.WEBHOOK_CLIENT)
    private readonly webhookClient: WebhookClient
  ) {
    super(appLogger);
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.WEBHOOK_SERVICE} initialized`
    );
  }

  public async sendTransactionWebhook(
    transaction: Transaction,
    webhookUrl: string
  ): Promise<AxiosResponse> {
    this.appLogger.info(
      `${
        this.logPrefix
      } Preparing to send transaction webhook with payload: ${JSON.stringify(
        transaction
      )}`
    );

    const payload: WebhookPayload = this.buildPayload(transaction);

    const webhookMeta: WebhookMetaData = {
      webhookUrl,
      payload,
    };

    try {
      const resp = await this.webhookClient.sendRequest(webhookMeta);
      this.appLogger.info(
        `${this.logPrefix} Transaction webhook sent successfully`
      );
      return resp;
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Error sending transaction webhook: ${error}`
      );
      throw error;
    }
  }

  private buildPayload(transaction: Transaction): WebhookPayload {
    return {
      transactionId: transaction.id,
      amount: transaction.amount,
      currency: transaction.currency,
      status: transaction.status,
      originCreatedAt: transaction.originCreatedAt,
    };
  }
}

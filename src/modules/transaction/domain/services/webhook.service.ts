import { AxiosResponse } from "axios";
import { inject, injectable } from "tsyringe";
import { TokenWalletServiceClient } from "../../../../shared/clients/tokenWalletService/token-wallet-service.client";
import {
  WebhookMetaData,
  WebhookPayload,
} from "../../../../shared/clients/tokenWalletService/webhook.interface";
import { RegisteredServicesEnum } from "../../../../shared/DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../../../shared/utils/log-prefix.class";
import { Logger } from "../../../../shared/utils/logger";
import { Transaction } from "../transaction.entity";

@injectable()
export class WebhookService extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.TOKEN_WALLET_SERVICE_CLIENT)
    private readonly tokenWalletServiceClient: TokenWalletServiceClient
  ) {
    super(appLogger);
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.WEBHOOK_SERVICE} initialized`
    );
  }

  public async sendTransactionWebhook(
    transaction: Transaction
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
      baseUrl: process.env.TOKEN_WALLET_SERVICE_URL || "http://localhost:3000",
      endpoint: process.env.WEBHOOK_URL || "/api/transaction/webhook",
      payload,
    };

    try {
      const resp = await this.tokenWalletServiceClient.sendRequest(webhookMeta);
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

import axios, { AxiosResponse } from "axios";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../utils/log-prefix.class";
import { Logger } from "../../utils/logger";
import { WebhookMetaData } from "./webhook.interface";

@injectable()
export class WebhookClient extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger
  ) {
    super(appLogger);
  }

  public async sendRequest(meta: WebhookMetaData): Promise<AxiosResponse> {
    this.appLogger.info(
      `${this.logPrefix} Sending request to Token Wallet Service at ${meta.webhookUrl}`
    );

    try {
      const resp = await axios.post(meta.webhookUrl, meta.payload);

      this.appLogger.info(
        `${this.logPrefix} Received response with status: ${resp.status}`
      );

      // Log the response body for debugging
      this.appLogger.info(
        `${this.logPrefix} Response body: ${JSON.stringify(resp.data)}`
      );

      return resp;
    } catch (error: any) {
      this.appLogger.error(
        `${this.logPrefix} Error sending webhook request: ${error.message}`
      );

      // If it's an axios error with response, return the response
      if (error.response) {
        this.appLogger.info(
          `${this.logPrefix} Received error response with status: ${error.response.status}`
        );
        this.appLogger.info(
          `${this.logPrefix} Error response body: ${JSON.stringify(
            error.response.data
          )}`
        );
        return error.response;
      }

      // If it's a network error or other issue, re-throw
      throw error;
    }
  }
}

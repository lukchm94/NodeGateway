import axios, { AxiosResponse, HttpStatusCode } from "axios";
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

    const resp = await axios.post(meta.webhookUrl, meta.payload);

    this.appLogger.info(
      `${this.logPrefix} Received response with status: ${resp.status}`
    );

    if (resp.status !== HttpStatusCode.Ok) {
      throw new Error(
        `${this.logPrefix} Failed to send webhook: ${resp.statusText}`
      );
    }
    return resp;
  }
}

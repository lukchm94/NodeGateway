import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../utils/log-prefix.class";
import { Logger } from "../../utils/logger";
import { RabbitClient } from "./rabbit.client";

@injectable()
export class RabbitService extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.RABBIT_CLIENT)
    private readonly rabbitClient: RabbitClient
  ) {
    super(appLogger);
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.RABBIT_CLIENT} initialized.`
    );
  }

  /**
   * The `start` function in TypeScript asynchronously connects to a RabbitMQ client, logs a message
   * upon successful connection, and then consumes messages from a queue using a specified handler
   * function.
   */
  public async start(): Promise<void> {
    try {
      await this.rabbitClient.connect();
      this.appLogger.info(`${this.logPrefix} RabbitMQ client connected.`);
      await this.rabbitClient.consumeFromQueue(this.handleTrxEvent);
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Error starting RabbitMQ service: ${error}`
      );
    }
  }

  private handleTrxEvent = (payload: any): void => {
    // TODO provide the handler with the actual Use Case to process the event
    this.appLogger.info(
      `${this.logPrefix} Received transaction event. Printing payload: ${payload}.`
    );
  };
}

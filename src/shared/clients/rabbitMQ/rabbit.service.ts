import { inject, injectable } from "tsyringe";
import { ProcessTrxEventUseCase } from "../../../modules/transaction/application/process-trx-event.use-case/process-trx-event.use-case";
import { RegisteredServicesEnum } from "../../DIcontainer/registeredServicesEnum";
import { ValidationError } from "../../utils/error";
import { BaseClass } from "../../utils/log-prefix.class";
import { Logger } from "../../utils/logger";
import { RabbitClient } from "./rabbit.client";
import { TransactionRequestEvent } from "./transaction.request.event";

@injectable()
export class RabbitService extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.RABBIT_CLIENT)
    private readonly rabbitClient: RabbitClient,
    @inject(RegisteredServicesEnum.PROCESS_TRX_EVENT_USE_CASE)
    private readonly processTransactionEventUseCase: ProcessTrxEventUseCase
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
      const connected = await this.rabbitClient.connect();
      if (connected) {
        this.rabbitClient.consumeFromQueue(this.handleTrxEvent);
      }
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Error starting RabbitMQ service: ${error}`
      );
    }
  }

  private handleTrxEvent = async (
    event: TransactionRequestEvent
  ): Promise<void> => {
    this.appLogger.info(
      `${
        this.logPrefix
      } Received transaction event. Printing event: ${JSON.stringify(event)}.`
    );
    if (event.pattern !== this.rabbitClient.requestQueueName) {
      const msg = `${this.logPrefix} Pattern in event: "${event.pattern}" is different than in the Rabbit Client: "${this.rabbitClient.requestQueueName}"`;
      this.appLogger.error(msg);
      const error = new Error(msg);
      throw new ValidationError(error);
    }

    const transaction = await this.processTransactionEventUseCase.run(event);
    this.appLogger.info(
      `${this.logPrefix} Successfully processed ${JSON.stringify(transaction)}`
    );
  };
}

import * as amqp from "amqplib";
import { Channel, ChannelModel } from "amqplib";
import { inject, injectable } from "tsyringe";
import { Transaction } from "../../../modules/transaction/domain/transaction.entity";
import { RegisteredServicesEnum } from "../../DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../utils/log-prefix.class";
import { Logger } from "../../utils/logger";
import { TransactionResponsePayload } from "./output";

@injectable()
export class RabbitClient extends BaseClass {
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly rabbitUrl: string | null = null;
  private readonly queueName: string | null = null;
  private readonly requestQueueName: string | null = null;

  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger
  ) {
    super(appLogger);
    this.rabbitUrl = this.setRabbitUrl();
    this.queueName = this.setQueueName();
    this.requestQueueName = this.setRequestQueueName();
    this.appLogger.info(
      `${this.logPrefix} RabbitClient initialized with URL: ${this.rabbitUrl} and Queue: ${this.queueName}`
    );
  }

  public async connect(): Promise<void> {
    try {
      if (
        this.rabbitUrl === null ||
        this.queueName === null ||
        this.requestQueueName === null
      ) {
        throw new Error("RabbitMQ URL or Queue Name is not set");
      }
      this.connection = await amqp.connect(this.rabbitUrl);
      if (!this.connection) {
        throw new Error("Failed to create RabbitMQ connection");
      }

      this.channel = await this.connection.createChannel();

      if (!this.channel) {
        throw new Error("Failed to create RabbitMQ channel");
      }

      await this.channel.assertQueue(this.queueName, { durable: true });
      await this.channel.assertQueue(this.requestQueueName, { durable: true });

      this.setupErrorListeners();
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Failed to connect to RabbitMQ: ${error}`
      );
      setTimeout(() => this.connect(), 5000);
    }
  }

  public sendToQueue(transaction: Transaction): void {
    if (!this.channel || !this.queueName) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    this.appLogger.info(
      `${this.logPrefix} Sending message to queue: ${this.queueName}`
    );
    const payload = this.buildPayload(transaction);
    const message = JSON.stringify(payload);
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true,
    });
    this.appLogger.info(
      `${this.logPrefix} Message: ${message} sent to queue: ${this.queueName}`
    );
  }

  public async consumeFromQueue(handler: (msg: any) => void): Promise<void> {
    try {
      if (!this.channel || !this.requestQueueName) {
        throw new Error("RabbitMQ channel is not initialized");
      }
      this.appLogger.info(
        `${this.logPrefix} Consuming messages from queue: ${this.requestQueueName}`
      );
      this.channel.assertQueue(this.requestQueueName, { durable: true });

      this.channel.consume(
        this.requestQueueName,
        (msg) => {
          if (msg !== null) {
            const content = msg.content.toString();
            this.appLogger.info(
              `${this.logPrefix} Message received from queue: ${this.requestQueueName} - ${content}`
            );
            const payload: TransactionResponsePayload = JSON.parse(content);
            this.channel!.ack(msg);
            handler(payload);
          }
        },
        { noAck: false }
      );
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Failed to consume from RabbitMQ: ${error}`
      );
      setTimeout(() => this.consumeFromQueue(handler), 5000);
    }
  }

  private buildPayload(transaction: Transaction): TransactionResponsePayload {
    const payload: TransactionResponsePayload = {
      pattern: this.queueName!,
      data: transaction,
    };
    return payload;
  }
  private async closeConnection(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        this.appLogger.info(`${this.logPrefix} RabbitMQ channel closed.`);
      }
      if (this.connection) {
        await this.connection.close();
        this.appLogger.info(`${this.logPrefix} RabbitMQ connection closed.`);
      }
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Error closing RabbitMQ connection: ${error}`
      );
    }
  }

  private setRabbitUrl(): string {
    const url = process.env.RABBIT_URL;
    if (!url) {
      const errorMsg = `${this.logPrefix} RABBIT_URL is not set in environment variables`;
      this.appLogger.error(errorMsg);
      throw new Error(errorMsg);
    }
    return url;
  }

  private setQueueName(): string {
    const queueName = process.env.RABBIT_QUEUE_NAME;
    if (!queueName) {
      const errorMsg = `${this.logPrefix} RABBIT_QUEUE_NAME is not set in environment variables`;
      this.appLogger.error(errorMsg);
      throw new Error(errorMsg);
    }
    return queueName;
  }
  private setRequestQueueName(): string {
    const queueName = process.env.RABBIT_REQ_QUEUE_NAME;
    if (!queueName) {
      const errorMsg = `${this.logPrefix} RABBIT_REQ_QUEUE_NAME is not set in environment variables`;
      this.appLogger.error(errorMsg);
      throw new Error(errorMsg);
    }
    return queueName;
  }
  private setupErrorListeners(): void {
    this.connection!.on("error", (err: Error) => {
      this.appLogger.error(
        `${this.logPrefix} RabbitMQ connection error: ${err}`
      );
      this.closeConnection();
    });

    this.channel!.on("error", (err: Error) => {
      this.appLogger.error(`${this.logPrefix} RabbitMQ channel error: ${err}`);
      this.closeConnection();
    });
  }
}

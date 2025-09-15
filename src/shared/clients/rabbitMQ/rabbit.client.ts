import * as amqp from "amqplib";
import { Channel, ChannelModel } from "amqplib";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../DIcontainer/registeredServicesEnum";
import { BaseClass } from "../../utils/log-prefix.class";
import { Logger } from "../../utils/logger";

@injectable()
export class RabbitClient extends BaseClass {
  // CORRECTED: The connection property should be of type Connection
  private connection: ChannelModel | null = null;
  private channel: Channel | null = null;
  private readonly rabbitUrl: string | null = null;
  private readonly queueName: string | null = null;

  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger
  ) {
    super(appLogger);
    this.rabbitUrl = this.setRabbitUrl();
    this.queueName = this.setQueueName();
    this.appLogger.info(
      `${this.logPrefix} RabbitClient initialized with URL: ${this.rabbitUrl} and Queue: ${this.queueName}`
    );
  }

  public async connect(): Promise<void> {
    try {
      if (this.rabbitUrl === null || this.queueName === null) {
        throw new Error("RabbitMQ URL or Queue Name is not set");
      }
      this.connection = await amqp.connect(this.rabbitUrl);
      if (!this.connection) {
        throw new Error("Failed to create RabbitMQ connection");
      }
      this.appLogger.info(
        `${this.logPrefix} RabbitMQ connection established: ${this.connection}`
      );
      this.channel = await this.connection.createChannel();
      this.appLogger.info(
        `${this.logPrefix} RabbitMQ connected with the channel: ${this.channel}.`
      );

      if (!this.channel) {
        throw new Error("Failed to create RabbitMQ channel");
      }

      await this.channel.assertQueue(this.queueName, { durable: true });

      this.connection.on("error", (err: Error) => {
        this.appLogger.error(
          `${this.logPrefix} RabbitMQ connection error: ${err}`
        );
      });

      this.channel.on("error", (err: Error) => {
        this.appLogger.error(
          `${this.logPrefix} RabbitMQ channel error: ${err}`
        );
      });
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Failed to connect to RabbitMQ: ${error}`
      );

      setTimeout(() => this.connect(), 5000);
    }
  }

  // The method signature and body here are correct.
  public sendToQueue(message: string): void {
    if (!this.channel || !this.queueName) {
      throw new Error("RabbitMQ channel is not initialized");
    }
    this.appLogger.info(
      `${this.logPrefix} Sending message to queue: ${
        this.channel.bindQueue.name
      }, ${this.queueName}, ${JSON.stringify(
        this.channel.connection.serverProperties
      )}`
    );
    this.channel.sendToQueue(this.queueName, Buffer.from(message), {
      persistent: true,
    });
    this.appLogger.info(
      `${this.logPrefix} Message: ${message} sent to queue: ${this.queueName}`
    );
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
}

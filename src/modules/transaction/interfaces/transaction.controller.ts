import { HttpStatusCode } from "axios";
import { NextFunction, Response } from "express";
import Joi from "joi";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../../shared/DIcontainer/registeredServicesEnum";
import { HttpMethodEnum } from "../../../shared/types/http-methods";
import { ValidationError } from "../../../shared/utils/error";
import { BaseClass } from "../../../shared/utils/log-prefix.class";
import { Logger } from "../../../shared/utils/logger";
import { GatewayOutput } from "../application/output";
import { ProcessTransactionUseCase } from "../application/process-transaction-use-case/process-transaction.use-case";
import { CURRENCY_TYPE } from "../domain/validation/currency";
import { TRANSACTION_STATUS_TYPE } from "../domain/validation/status";
import { RequestWithSafeFields } from "./request.interface";

@injectable()
export class TransactionController extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.PROCESS_TRANSACTION_USE_CASE)
    private readonly processTransactionUseCase: ProcessTransactionUseCase
  ) {
    super(appLogger);
  }
  public processTransaction = async (
    req: RequestWithSafeFields,
    resp: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.appLogger.info(
        `${this.logPrefix} - ${
          req.webhookUrl
        } - Processing transaction: ${JSON.stringify(req.safeFields, null, 2)}`
      );
      const input = req.safeFields!;
      const webhookUrl = req.webhookUrl!;
      this.appLogger.info(
        `${this.logPrefix} - ${req.url} - Using webhook URL: ${webhookUrl}`
      );
      const result: GatewayOutput = await this.processTransactionUseCase.run(
        input,
        webhookUrl
      );
      this.appLogger.info(
        `${this.logPrefix} - ${req.url} - Sending result: ${JSON.stringify(
          result
        )}`
      );
      resp.status(HttpStatusCode.Ok).send({
        result,
      });
    } catch (error) {
      this.appLogger.error(
        `[${this.logPrefix}] Error processing health check request: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
      if (error instanceof Error && error.stack) {
        this.appLogger.error(error.stack);
      }
      next(error);
    }
  };

  public validateTransaction = async (
    req: RequestWithSafeFields,
    resp: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const transaction = Joi.object({
        id: Joi.number().required(),
        amount: Joi.number().required(),
        currency: Joi.string()
          .valid(...Object.values(CURRENCY_TYPE))
          .required(),
        status: Joi.string()
          .valid(...Object.values(TRANSACTION_STATUS_TYPE))
          .required(),
        originCreatedAt: Joi.date().required(),
      });
      const headerSchema = Joi.object({
        webhook: Joi.string()
          .uri({ scheme: ["http", "https"] })
          .required(),
      }).unknown(true);
      const validBody = await transaction.validateAsync(req.body);
      this.appLogger.info(
        `${this.logPrefix} Validation successful for body: ${JSON.stringify(
          validBody
        )}`
      );
      const validHeader = await headerSchema.validateAsync(req.headers);
      this.appLogger.info(
        `${this.logPrefix} Validation successful for body: ${JSON.stringify(
          validBody
        )} and headers: ${JSON.stringify(validHeader)}`
      );
      req.safeFields = {
        ...req.safeFields,
        id: validBody.id,
        amount: validBody.amount,
        currency: validBody.currency,
        status: validBody.status,
        originCreatedAt: validBody.originCreatedAt,
      };
      req.webhookUrl = validHeader.webhook;
      next();
    } catch (err) {
      if (err instanceof Error) {
        next(new ValidationError(err));
      } else {
        next(err);
      }
    }
  };

  public get = async (
    req: RequestWithSafeFields,
    resp: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const msg = `${this.logPrefix} Testing transaction - ${HttpMethodEnum.GET} - ${req.baseUrl}`;
      this.appLogger.info(msg);
      resp.status(HttpStatusCode.Ok).send({ status: msg });
    } catch (error) {
      this.appLogger.error(
        `${this.logPrefix} Error processing health check request: ${error}`
      );
      next(error);
    }
  };
}

import { HttpStatusCode } from "axios";
import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../../shared/DIcontainer/registeredServicesEnum";
import { Logger } from "../../../shared/utils/logger";

@injectable()
export class HealthController {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    private readonly appLogger: Logger
  ) {}

  public healthCheck = async (
    req: Request,
    resp: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      this.appLogger.info(
        `[${this.constructor.name}] Processing health check request: ${req.url}`
      );
      resp.status(HttpStatusCode.Ok).send({ status: "OK" });
    } catch (error) {
      this.appLogger.error(
        `[${this.constructor.name}] Error processing health check request: ${error}`
      );
      next(error);
    }
  };
}

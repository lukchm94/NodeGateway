import { Router } from "express";
import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../../../shared/DIcontainer/registeredServicesEnum";
import { BaseRouter } from "../../../shared/routers/baseRouter";
import { RoutesEnum } from "../../../shared/routers/routes.enum";
import { Logger } from "../../../shared/utils/logger";
import { TransactionController } from "./transaction.controller";

@injectable()
export class TransactionRouter extends BaseRouter {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.TRANSACTION_CONTROLLER)
    private readonly transactionController: TransactionController
  ) {
    super(appLogger);
  }
  public createRouter(): Router {
    const router = Router();
    this.logger.info(`${this.logPrefix} Router instance created`);

    router.route(RoutesEnum.HOME).get(this.transactionController.get);
    router
      .route(RoutesEnum.HOME)
      .post(
        this.transactionController.validateTransaction,
        this.transactionController.processTransaction
      );
    return router;
  }
}

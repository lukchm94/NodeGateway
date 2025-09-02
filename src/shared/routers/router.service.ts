import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../DIcontainer/registeredServicesEnum";
import { Logger } from "../utils/logger";
// import { HealthRouter } from "./health";
import { Router } from "express";
import { HealthRouter } from "../../modules/health/interfaces/health.router";
import { TransactionRouter } from "../../modules/transaction/interfaces/transaction.router";
import { BaseClass } from "../utils/log-prefix.class";
import { RoutesEnum } from "./routes.enum";

@injectable()
export class RouterService extends BaseClass {
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    protected readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.HEALTH_ROUTER)
    private readonly healthRouter: HealthRouter,
    @inject(RegisteredServicesEnum.TRANSACTION_ROUTER)
    private readonly transactionRouter: TransactionRouter
  ) {
    super(appLogger);
    this.healthRouter = healthRouter;
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.ROUTER_SERVICE} initialized`
    );
  }

  public setupRouters(): Array<{ prefix: RoutesEnum; router: Router }> {
    this.appLogger.info(`${this.logPrefix} Setting up routers`);
    const healthRouter = this.healthRouter.createRouter();
    const transactionRouter = this.transactionRouter.createRouter();
    this.appLogger.info(`${this.logPrefix} Routers setup complete`);
    return [
      { prefix: RoutesEnum.HEALTH_CHECK, router: healthRouter },
      { prefix: RoutesEnum.TRANSACTION, router: transactionRouter },
    ];
  }
}

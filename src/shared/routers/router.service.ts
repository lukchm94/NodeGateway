import { inject, injectable } from "tsyringe";
import { RegisteredServicesEnum } from "../DIcontainer/registeredServicesEnum";
import { Logger } from "../utils/logger";
// import { HealthRouter } from "./health";
import { Router } from "express";
import { HealthRouter } from "../../modules/health/interfaces/health.router";
import { RoutesEnum } from "./routes.enum";

@injectable()
export class RouterService {
  private get logPrefix(): string {
    return `[${this.constructor.name}]`;
  }
  constructor(
    @inject(RegisteredServicesEnum.APP_LOGGER)
    private readonly appLogger: Logger,
    @inject(RegisteredServicesEnum.HEALTH_ROUTER)
    private readonly healthRouter: HealthRouter
  ) {
    this.appLogger = appLogger;
    this.healthRouter = healthRouter;
    this.appLogger.info(
      `${this.logPrefix} ${RegisteredServicesEnum.ROUTER_SERVICE} initialized`
    );
  }

  public setupRouters(): Array<{ prefix: RoutesEnum; router: Router }> {
    this.appLogger.info(`${this.logPrefix} Setting up routers`);
    const healthRouter = this.healthRouter.createRouter();
    this.appLogger.info(`${this.logPrefix} Routers setup complete`);
    return [{ prefix: RoutesEnum.HEALTH_CHECK, router: healthRouter }];
  }
}
